import React from "react";

interface TemplateCardProps {
  title: string;
  category?: string;
  previewUrl?: string;
  isSelected?: boolean;
  onClick?: () => void;
}

export const TemplateCard = ({
  title,
  category = "Surat Resmi",
  previewUrl,
  isSelected = false,
  onClick,
}: TemplateCardProps) => {
  return (
    <div
      onClick={onClick}
      className={`group relative flex flex-col gap-2 p-3 rounded-2xl border-2 transition-all cursor-pointer bg-white hover:shadow-md ${
        isSelected
          ? "border-black bg-black/5"
          : "border-black/10 hover:border-black/30"
      }`}
    >
      {/* Thumbnail Area */}
      <div className="w-full h-40 rounded-xl bg-gray-100 overflow-hidden relative border border-black/5 flex items-center justify-center">
        {previewUrl ? (
          <img
            src={previewUrl}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="flex flex-col items-center gap-1 text-gray-400">
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <span className="text-xs font-medium">Pratinjau Templates</span>
          </div>
        )}
      </div>

      {/* Info Area */}
      <div className="flex flex-col gap-0.5 px-1">
        <span className="text-[10px] font-bold tracking-wider uppercase text-gray-400">
          {category}
        </span>
        <h4 className="text-sm font-bold text-black truncate">{title}</h4>
      </div>
    </div>
  );
};