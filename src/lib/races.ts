import Papa from "papaparse";
import { Race } from "./types";
import { getCityCoords } from "./geo";

const CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ_ZK9W1hNFw8KZvp-L2yK5terdTwjWEYDyOQos9wGRB5qAVJA9FmfNZZ7k8afHZxehkySeIjakwqES/pub?gid=741293906&single=true&output=csv";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

interface CSVRow {
  Nom: string;
  Organisateur: string;
  Fédération: string;
  Date: string;
  Date_fin: string;
  Deadline_inscription: string;
  Ville: string;
  Département: string;
  Région: string;
  Plan_eau: string;
  Type_eau: string;
  Distances: string;
  Niveau: string;
  Lien_site: string;
  Lien_inscription: string;
  Statut: string;
  Notes: string;
}

function parseRow(row: CSVRow): Race {
  const coords = getCityCoords(row.Ville?.trim() || "");
  return {
    slug: slugify(row.Nom || ""),
    nom: row.Nom?.trim() || "",
    organisateur: row.Organisateur?.trim() || "",
    federation: row.Fédération?.trim() || "",
    date: row.Date?.trim() || "",
    dateFin: row.Date_fin?.trim() || "",
    deadlineInscription: row.Deadline_inscription?.trim() || "",
    ville: row.Ville?.trim() || "",
    departement: row.Département?.trim() || "",
    region: row.Région?.trim() || "",
    planEau: row.Plan_eau?.trim() || "",
    typeEau: row.Type_eau?.trim() || "",
    distances: (row.Distances || "")
      .split(",")
      .map((d) => d.trim())
      .filter(Boolean),
    niveau: row.Niveau?.trim() || "",
    lienSite: row.Lien_site?.trim() || "",
    lienInscription: row.Lien_inscription?.trim() || "",
    statut: row.Statut?.trim() || "",
    notes: row.Notes?.trim() || "",
    lat: coords[0],
    lng: coords[1],
  };
}

let cachedRaces: Race[] | null = null;

export async function fetchRaces(): Promise<Race[]> {
  if (cachedRaces) return cachedRaces;

  try {
    const res = await fetch(CSV_URL, { cache: "force-cache" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const csv = await res.text();
    const { data } = Papa.parse<CSVRow>(csv, { header: true, skipEmptyLines: true });
    if (!data.length) throw new Error("Empty CSV");
    cachedRaces = data.map(parseRow).sort((a, b) => a.date.localeCompare(b.date));
    return cachedRaces;
  } catch {
    return getFallbackRaces();
  }
}

export function getFallbackRaces(): Race[] {
  const rows: CSVRow[] = [
    { Nom: "Défi Monte-Cristo", Organisateur: "Association Défi Monte-Cristo", Fédération: "Indépendant", Date: "2026-06-06", Date_fin: "2026-06-07", Deadline_inscription: "2026-05-01", Ville: "Marseille", Département: "13", Région: "PACA", Plan_eau: "Mer Méditerranée", Type_eau: "mer", Distances: "1km,5km", Niveau: "Confirmé/Élite", Lien_site: "https://www.defimontecristomarseille.com", Lien_inscription: "", Statut: "Inscriptions ouvertes", Notes: "Course iconique Marseille-Château d'If" },
    { Nom: "EDF Aqua Challenge Annecy", Organisateur: "EDF", Fédération: "FFN", Date: "2026-07-11", Date_fin: "2026-07-12", Deadline_inscription: "2026-06-15", Ville: "Annecy", Département: "74", Région: "Auvergne-Rhône-Alpes", Plan_eau: "Lac d'Annecy", Type_eau: "lac", Distances: "1km,3km,10km", Niveau: "Tous niveaux", Lien_site: "https://www.edfaquachallenge.com", Lien_inscription: "", Statut: "Inscriptions ouvertes", Notes: "Étape nationale EDF Aqua Challenge" },
    { Nom: "EDF Aqua Challenge Balaruc", Organisateur: "EDF", Fédération: "FFN", Date: "2026-08-01", Date_fin: "2026-08-02", Deadline_inscription: "2026-07-01", Ville: "Balaruc-les-Bains", Département: "34", Région: "Occitanie", Plan_eau: "Étang de Thau", Type_eau: "lac", Distances: "1km,3km,10km", Niveau: "Tous niveaux", Lien_site: "https://www.edfaquachallenge.com", Lien_inscription: "", Statut: "À venir", Notes: "Étape nationale EDF Aqua Challenge" },
    { Nom: "Traversée du Lac du Bourget", Organisateur: "Club Natation Aix-les-Bains", Fédération: "FFN", Date: "2026-07-18", Date_fin: "", Deadline_inscription: "2026-06-30", Ville: "Aix-les-Bains", Département: "73", Région: "Auvergne-Rhône-Alpes", Plan_eau: "Lac du Bourget", Type_eau: "lac", Distances: "3km,8km", Niveau: "Confirmé", Lien_site: "", Lien_inscription: "", Statut: "À venir", Notes: "Plus grand lac naturel de France" },
    { Nom: "Défi Aiguebelette", Organisateur: "CN Aiguebelette", Fédération: "FFN", Date: "2026-08-15", Date_fin: "", Deadline_inscription: "2026-07-20", Ville: "Lépin-le-Lac", Département: "73", Région: "Auvergne-Rhône-Alpes", Plan_eau: "Lac d'Aiguebelette", Type_eau: "lac", Distances: "1km,3km,5km", Niveau: "Tous niveaux", Lien_site: "", Lien_inscription: "", Statut: "À venir", Notes: "Lac aux eaux turquoise" },
    { Nom: "Open Water Miribel", Organisateur: "Club Natation Lyon", Fédération: "Indépendant", Date: "2026-06-20", Date_fin: "", Deadline_inscription: "2026-06-10", Ville: "Miribel-Jonage", Département: "1", Région: "Auvergne-Rhône-Alpes", Plan_eau: "Lac de Miribel-Jonage", Type_eau: "lac", Distances: "1km,2.5km,5km", Niveau: "Tous niveaux", Lien_site: "", Lien_inscription: "", Statut: "À venir", Notes: "À 20 min de Lyon" },
    { Nom: "Castle Race Series Chantilly", Organisateur: "Castle Race", Fédération: "Indépendant", Date: "2026-06-27", Date_fin: "", Deadline_inscription: "2026-06-15", Ville: "Chantilly", Département: "60", Région: "Hauts-de-France", Plan_eau: "Lac de Chantilly", Type_eau: "lac", Distances: "1km,3km", Niveau: "Confirmé", Lien_site: "https://www.castlerace.fr", Lien_inscription: "", Statut: "Inscriptions ouvertes", Notes: "Nage autour du château" },
    { Nom: "Open Water Bordeaux", Organisateur: "CNO Bordeaux", Fédération: "FFN", Date: "2026-09-05", Date_fin: "", Deadline_inscription: "2026-08-15", Ville: "Bordeaux", Département: "33", Région: "Nouvelle-Aquitaine", Plan_eau: "Lac de Bordeaux", Type_eau: "lac", Distances: "1km,3km,5km", Niveau: "Tous niveaux", Lien_site: "", Lien_inscription: "", Statut: "À venir", Notes: "" },
    { Nom: "Traversée de la Manche (relais)", Organisateur: "CS Manche", Fédération: "FFN", Date: "2026-07-25", Date_fin: "", Deadline_inscription: "2026-05-01", Ville: "Calais", Département: "62", Région: "Hauts-de-France", Plan_eau: "Manche", Type_eau: "mer", Distances: "35km", Niveau: "Élite", Lien_site: "", Lien_inscription: "", Statut: "Inscriptions ouvertes", Notes: "Relais uniquement" },
    { Nom: "Nice Swim", Organisateur: "Swim Côte d'Azur", Fédération: "Indépendant", Date: "2026-08-22", Date_fin: "", Deadline_inscription: "2026-07-30", Ville: "Nice", Département: "6", Région: "PACA", Plan_eau: "Mer Méditerranée", Type_eau: "mer", Distances: "1km,2km,5km", Niveau: "Tous niveaux", Lien_site: "", Lien_inscription: "", Statut: "À venir", Notes: "Baie des Anges" },
  ];
  return rows.map(parseRow).sort((a, b) => a.date.localeCompare(b.date));
}

export function getAllRegions(races: Race[]): string[] {
  return Array.from(new Set(races.map((r) => r.region).filter(Boolean))).sort();
}

export function getAllTypeEau(races: Race[]): string[] {
  return Array.from(new Set(races.map((r) => r.typeEau).filter(Boolean))).sort();
}

export function getAllNiveaux(races: Race[]): string[] {
  return Array.from(new Set(races.map((r) => r.niveau).filter(Boolean))).sort();
}

export function getAllStatuts(races: Race[]): string[] {
  return Array.from(new Set(races.map((r) => r.statut).filter(Boolean))).sort();
}

export function getAllDistances(races: Race[]): string[] {
  const set = new Set<string>();
  races.forEach((r) => r.distances.forEach((d) => set.add(d)));
  return Array.from(set).sort((a, b) => parseFloat(a) - parseFloat(b));
}
