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

export function statutColor(statut: string): string {
  switch (statut) {
    case "Inscriptions ouvertes":
      return "bg-green-100 text-green-800 border-green-300";
    case "À venir":
      return "bg-orange-100 text-orange-800 border-orange-300";
    case "Complet":
      return "bg-red-100 text-red-800 border-red-300";
    case "Annulé":
      return "bg-gray-100 text-gray-600 border-gray-300";
    default:
      return "bg-gray-100 text-gray-600 border-gray-300";
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
