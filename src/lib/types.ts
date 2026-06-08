export interface Race {
  slug: string;
  nom: string;
  organisateur: string;
  federation: string;
  date: string;
  dateFin: string;
  deadlineInscription: string;
  ville: string;
  departement: string;
  region: string;
  planEau: string;
  typeEau: string;
  distances: string[];
  niveau: string;
  lienSite: string;
  lienInscription: string;
  statut: string;
  notes: string;
  lat: number;
  lng: number;
}
