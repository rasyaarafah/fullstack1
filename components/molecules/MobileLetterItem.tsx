"use client";

import React from "react";

interface MobileLetterItemProps {
  author: string;
  title: string;
  date: string;
  status: "pending_revision" | "pending_approval" | "approved";
  onSee?: () => void;
  onEdit?: () => void;
  onCancel?: () => void;
  onDownload?: () => void;
}

export function MobileLetterItem({
  author,
  title,
  date,
  status,
  onSee,
  onEdit,
  onCancel,
  onDownload,
}: MobileLetterItemProps) {
  // Border color based on status
  const getBorderColor = () => {
    switch (status) {
      case "pending_revision":
        return "border-red-500";
      case "pending_approval":
        return "border-amber-500";
      case "approved":
        return "border-green-500";
      default:
        return "border-stone-300";
    }
  };

  return (
    <div className="w-full flex gap-3 items-stretch my-2 relative z-10">
      {/* Left Info Box */}
      <div className={`flex-1 border-2 ${getBorderColor()} rounded-lg p-3 bg-white flex flex-col justify-between gap-2`}>
        <span className="text-xs text-stone-600 font-sans">@{author}</span>
        <h4 className="font-serif font-bold text-stone-900 text-sm leading-snug">
          {title}
        </h4>
        <span className="text-xs font-serif text-stone-800">{date}</span>

        {status === "pending_revision" && (
          <span className="text-xs text-stone-500">(Need revision)</span>
        )}
        {status === "pending_approval" && (
          <span className="text-xs text-stone-500">(Waiting Approval)</span>
        )}
        {status === "approved" && (
          <span className="text-xs text-stone-500 font-bold">(Approved)</span>
        )}
      </div>

      {/* Right Action Buttons Stack */}
      <div className="flex flex-col gap-2 justify-center shrink-0 w-24">
        {onSee && (
          <button
            type="button"
            onClick={onSee}
            className="w-full py-1.5 border border-stone-800 rounded bg-white text-xs font-sans text-stone-900 hover:bg-stone-100 active:bg-stone-200 cursor-pointer touch-manipulation"
          >
            See
          </button>
        )}
        {onEdit && (
          <button
            type="button"
            onClick={onEdit}
            className="w-full py-1.5 border border-stone-800 rounded bg-white text-xs font-sans text-stone-900 hover:bg-stone-100 active:bg-stone-200 cursor-pointer touch-manipulation"
          >
            Edit
          </button>
        )}
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="w-full py-1.5 border border-stone-800 rounded bg-white text-xs font-sans text-stone-900 hover:bg-stone-100 active:bg-stone-200 cursor-pointer touch-manipulation"
          >
            Cancel
          </button>
        )}
        {status === "approved" && (
          <button
            type="button"
            onClick={onDownload}
            className="w-full py-1.5 border border-stone-800 rounded bg-white text-[10px] font-bold font-sans text-stone-900 hover:bg-stone-100 active:bg-stone-200 cursor-pointer leading-tight touch-manipulation"
          >
            Download PDF/DOCX
          </button>
        )}
      </div>
    </div>
  );
}