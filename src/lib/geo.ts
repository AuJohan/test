const CITY_COORDS: Record<string, [number, number]> = {
  "Marseille": [43.2965, 5.3698],
  "Annecy": [45.8992, 6.1294],
  "Balaruc-les-Bains": [43.4407, 3.6756],
  "Aix-les-Bains": [45.6884, 5.9153],
  "Lépin-le-Lac": [45.5417, 5.7694],
  "Miribel-Jonage": [45.8167, 4.9500],
  "Chantilly": [49.1944, 2.4711],
  "Bordeaux": [44.8378, -0.5792],
  "Calais": [50.9513, 1.8587],
  "Nice": [43.7102, 7.2620],
};

const FRANCE_CENTER: [number, number] = [46.6034, 2.3488];

export function getCityCoords(ville: string): [number, number] {
  return CITY_COORDS[ville] || FRANCE_CENTER;
}
