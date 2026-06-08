import { statutColor } from "@/lib/format";

export default function StatusBadge({ statut }: { statut: string }) {
  return (
    <span
      className={`inline-block rounded-full px-3 py-0.5 text-xs font-semibold ${statutColor(statut)}`}
    >
      {statut}
    </span>
  );
}
