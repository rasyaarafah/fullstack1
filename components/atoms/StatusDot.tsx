import React from "react";

interface StatusDotProps {
  status: "approved" | "pending" | "rejected" | "revise" | "draft";
}

export const StatusDot = ({ status }: StatusDotProps) => {
  const getStatusColor = () => {
    switch (status) {
      case "approved":
        return "bg-emerald-500";
      case "pending":
        return "bg-amber-500";
      case "rejected":
        return "bg-rose-500";
      case "revise":
        return "bg-orange-400";
      case "draft":
        return "bg-stone-400";
      default:
        return "bg-stone-300";
    }
  };

  return (
    <span
      className={`inline-block w-2.5 h-2.5 rounded-full ${getStatusColor()}`}
    />
  );
};