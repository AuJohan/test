export function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatDateRange(start: string, end: string): string {
  if (!end || start === end) return formatDate(start);
  const s = new Date(start + "T00:00:00");
  const e = new Date(end + "T00:00:00");
  if (s.getMonth() === e.getMonth() && s.getFullYear() === e.getFullYear()) {
    return `${s.getDate()}-${e.getDate()} ${e.toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}`;
  }
  return `${formatDate(start)} - ${formatDate(end)}`;
}

export function computeStatut(statut: string, date: string, dateFin: string): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = date ? new Date(date + "T00:00:00") : null;
  const end = dateFin ? new Date(dateFin + "T00:00:00") : start;

  if (statut === "Annulé" || statut === "Complet") return statut;

  if (end && end < today) return "Terminé";
  if (start && start <= today && end && end >= today) return "En cours";

  return statut;
}

export function statutColor(statut: string): string {
  switch (statut) {
    case "Inscriptions ouvertes":
      return "bg-[#16A34A] text-white";
    case "En cours":
      return "bg-[#0077B6] text-white";
    case "À venir":
      return "bg-[#6B7280] text-white";
    case "Complet":
      return "bg-[#EA580C] text-white";
    case "Terminé":
      return "bg-[#1F2937] text-white opacity-80";
    case "Annulé":
      return "bg-[#DC2626] text-white";
    default:
      return "bg-[#6B7280] text-white";
  }
}

export function typeEauEmoji(type: string): string {
  switch (type) {
    case "mer":
      return "\u{1F30A}";
    case "lac":
      return "\u{1F3DE}️";
    case "rivière":
      return "\u{1F3DE}️";
    default:
      return "\u{1F4A7}";
  }
}

export type DistanceRange = "≤1km" | "1-3km" | "3-5km" | "5-10km" | "+10km";

export const DISTANCE_RANGES: DistanceRange[] = ["≤1km", "1-3km", "3-5km", "5-10km", "+10km"];

export function getDistanceRange(distance: string): DistanceRange[] {
  const num = parseFloat(distance);
  if (isNaN(num)) return [];
  const ranges: DistanceRange[] = [];
  if (num <= 1) ranges.push("≤1km");
  if (num >= 1 && num <= 3) ranges.push("1-3km");
  if (num >= 3 && num <= 5) ranges.push("3-5km");
  if (num >= 5 && num <= 10) ranges.push("5-10km");
  if (num > 10) ranges.push("+10km");
  return ranges;
}

export function raceMatchesDistanceRange(distances: string[], range: DistanceRange): boolean {
  return distances.some((d) => getDistanceRange(d).includes(range));
}
