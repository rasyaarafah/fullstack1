// components/atoms/StatusDot.tsx

export interface StatusDotProps {
  status: "approved" | "pending" | "rejected" | "revise";
}

export const StatusDot = ({ status }: StatusDotProps) => {
  const statusColors = {
    approved: "bg-emerald-500",
    pending: "bg-amber-500",
    rejected: "bg-rose-500",
    revise: "bg-blue-500",
  };

  return (
    <span
      className={`w-2.5 h-2.5 rounded-full shrink-0 ${
        statusColors[status] || "bg-stone-400"
      }`}
    />
  );
};