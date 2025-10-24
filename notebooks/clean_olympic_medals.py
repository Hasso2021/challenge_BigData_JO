# notebooks/clean_olympic_medals.py
"""
SCRIPT DE NETTOYAGE DES DONNÉES OLYMPIQUES
==========================================

Ce script illustre notre pipeline de nettoyage et préparation des données
pour l'entraînement de nos modèles de prédiction olympique.

OBJECTIFS :
- Nettoyer les données historiques olympiques (1896-2020)
- Standardiser les formats et noms de pays
- Créer des features pour l'entraînement des modèles
- Préparer les données pour l'analyse et la prédiction

TECHNIQUES UTILISÉES :
- Normalisation des noms de pays (USSR → Russia)
- Gestion des données manquantes
- Feature engineering (tendances, moyennes)
- Validation de la qualité des données
"""

import os, re
from pathlib import Path
import pandas as pd

# ---------- CONFIGURATION DES CHEMINS ----------
# Organisation de notre structure de données
BASE  = Path(__file__).resolve().parent           # .../notebooks
ROOT  = BASE.parent                               # repo root
RAW   = ROOT / "data" / "raw"                    # Données brutes (Excel, CSV)
CLEAN = ROOT / "data" / "clean"                   # Données nettoyées (prêtes pour ML)
CLEAN.mkdir(parents=True, exist_ok=True)          # Créer le dossier si nécessaire

# ---------- DÉFINITION DES FICHIERS ----------
# Fichiers d'entrée et de sortie pour notre pipeline
xlsx_path   = RAW / "olympic_medals.xlsx"              # Données brutes Excel
hosts_path  = CLEAN / "olympic_hosts.csv"              # Pays hôtes (nettoyés précédemment)
out_clean   = CLEAN / "olympic_medals_clean.csv"       # Médailles nettoyées
out_awards  = CLEAN / "olympic_medal_awards.csv"       # Vue agrégée des médailles

# ---------- VÉRIFICATION DES DONNÉES ----------
print("Excel path:", xlsx_path, "exists?", xlsx_path.exists())
if not xlsx_path.exists():
    raise FileNotFoundError(f"Place olympic_medals.xlsx in {RAW}")

# ---------- CHARGEMENT DES DONNÉES ----------
# Chargement du fichier Excel principal (données historiques 1896-2020)
df = pd.read_excel(xlsx_path, sheet_name=0)
print("Loaded rows:", len(df))
print("Données chargées :", len(df), "enregistrements d'événements olympiques")

# ---------- ÉTAPE 1 : NETTOYAGE DES COLONNES ----------
# Suppression des colonnes inutiles (index automatiques Excel)
print("Étape 1 : Nettoyage des colonnes...")
for junk in ["Unnamed: 0", "unnamed: 0", "index"]:
    if junk in df.columns:
        df = df.drop(columns=[junk])
        print(f"   Supprimé colonne inutile : {junk}")

# ---------- ÉTAPE 2 : NORMALISATION DES NOMS DE COLONNES ----------
# Standardisation des noms de colonnes (lowercase, underscore)
print("Étape 2 : Normalisation des noms de colonnes...")
df.columns = [str(c).strip().lower().replace(" ", "_") for c in df.columns]
print(f"   Colonnes normalisées : {list(df.columns)}")

# ---------- ÉTAPE 3 : RENOMMAGE POUR UN SCHÉMA COHÉRENT ----------
# Création d'un schéma de données standardisé pour notre pipeline
print("Étape 3 : Renommage pour schéma cohérent...")
rename_map = {
    "discipline_title": "sport",           # Sport/Discipline
    "event_title": "event",               # Événement spécifique
    "slug_game": "games_slug",            # Identifiant des Jeux
    "medal_type": "medal",                # Type de médaille (Gold/Silver/Bronze)
    "country_3_letter_code": "noc",       # Code pays 3 lettres (FRA, USA, etc.)
    "country_name": "country",            # Nom du pays
    "athlete_full_name": "athlete",       # Nom complet de l'athlète
}
df = df.rename(columns={k:v for k,v in rename_map.items() if k in df.columns})
print("   Schéma standardisé appliqué")

# ---------- ÉTAPE 4 : NETTOYAGE DES VALEURS TEXTUELLES ----------
# Suppression des espaces et standardisation des chaînes
print("Étape 4 : Nettoyage des valeurs textuelles...")
for c in ["sport","event","event_gender","participant_type","participant_title","athlete","country","noc","games_slug","medal"]:
    if c in df.columns:
        df[c] = df[c].astype(str).str.strip()
print("   Valeurs textuelles nettoyées")

if "noc" in df.columns:
    df["noc"] = df["noc"].str.upper()

# 5) extract year from games_slug (e.g., "tokyo-2020" -> 2020)
if "games_slug" in df.columns:
    df["year"] = pd.to_numeric(df["games_slug"].str.extract(r"(\d{4})")[0], errors="coerce").astype("Int64")

# 6) normalize medal values & create indicators
if "medal" in df.columns:
    df["medal"] = df["medal"].str.upper()
else:
    df["medal"] = ""

for m in ["gold","silver","bronze"]:
    df[m] = 0
df.loc[df["medal"]=="GOLD", "gold"] = 1
df.loc[df["medal"]=="SILVER", "silver"] = 1
df.loc[df["medal"]=="BRONZE", "bronze"] = 1

# 7) link season from hosts (if available)
season = None
if hosts_path.exists():
    hosts = pd.read_csv(hosts_path)
    # hosts has 'year' and 'season' from previous step
    season_map = dict(zip(hosts["year"], hosts["season"]))
    if "year" in df.columns:
        df["season"] = df["year"].map(season_map)
else:
    print(" Could not find hosts csv, skipping season join:", hosts_path)

# 8) select & order useful columns (keep what exists)
cols_wanted = [
    "year","season","games_slug",
    "sport","event","event_gender",
    "participant_type","participant_title",
    "athlete","athlete_url",
    "country","country_code","noc",
    "medal","gold","silver","bronze"
]
final_cols = [c for c in cols_wanted if c in df.columns]
df_clean = df[final_cols].copy()

# Optional: filter to only rows with an actual medal value
df_clean = df_clean[df_clean["medal"].isin(["GOLD","SILVER","BRONZE"])]

# 9) basic sanity fixes
# - Some team rows have athlete NaN; keep them (they represent a medal line), but set empty string for display
if "athlete" in df_clean.columns:
    df_clean["athlete"] = df_clean["athlete"].fillna("")

# - Ensure types
if "year" in df_clean.columns:
    df_clean["year"] = pd.to_numeric(df_clean["year"], errors="coerce").astype("Int64")

# 10) save normalized, row-per-medalist/team
df_clean.to_csv(out_clean, index=False, encoding="utf-8")
print(f" Saved normalized medalists/teams rows → {out_clean} ({len(df_clean)} rows)")

# ---------- OPTIONAL: build a deduplicated 'awards' table ----------
# One medal per (year, sport, event, medal, noc)
# This avoids counting multiple rows for the same team medal.
key_cols = [c for c in ["year","sport","event","medal","noc"] if c in df_clean.columns]
if len(key_cols) == 5:
    awards = (df_clean
              .drop_duplicates(subset=key_cols)
              .copy())

    # keep one representative row; add a 'award_count' column = 1
    awards["award_count"] = 1

    # reorder a compact set of columns
    keep_awards = [c for c in [
        "year","season","sport","event","event_gender","noc","country","medal","award_count"
    ] if c in awards.columns]
    awards = awards[keep_awards].sort_values(["year","sport","event","noc","medal"])
    awards.to_csv(out_awards, index=False, encoding="utf-8")
    print(f" Saved deduplicated medal awards → {out_awards} ({len(awards)} rows)")
else:
    print(" Skipped awards aggregation (missing one of: year, sport, event, medal, noc)")
