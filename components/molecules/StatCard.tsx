import React from "react";
import { Button } from "../atoms/Button";

interface StatCardProps {
  count: string | number;
  label: string;
  buttonText?: string;
  onButtonClick?: () => void;
  icon?: React.ReactNode;
}

export const StatCard = ({
  count,
  label,
  buttonText,
  onButtonClick,
}: StatCardProps) => {
  return (
    <div className="min-w-55 sm:min-w-0 flex-1 bg-white border border-black/10 rounded-3xl p-6 flex flex-col items-center justify-between text-center gap-4 shadow-sm snap-center shrink-0">
      <div className="space-y-1">
        <span className="text-4xl sm:text-5xl font-serif font-bold text-black">
          {count}
        </span>
        <p className="text-gray-700 font-serif text-sm sm:text-lg">
          {label}
        </p>
      </div>
      {buttonText && (
        <Button variant="Outline" onClick={onButtonClick} className="w-full">
          {buttonText}
        </Button>
      )}
    </div>
  );
};