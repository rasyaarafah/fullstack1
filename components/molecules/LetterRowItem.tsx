import React from "react";
import { StatusDot } from "../atoms/StatusDot";
import { Button } from "../atoms/Button";

interface LetterRowItemProps {
    title: string;
    username: string;
    date: string;
    statusText?: string;
    status: "approved" | "pending" | "rejected";
    onSee?: () => void;
    onEdit?: () => void;
    onCancel?: () => void;
}

export const LetterRowItem = ({
    title,
    username,
    date,
    statusText,
    status,
    onSee,
    onEdit,
    onCancel,
}: LetterRowItemProps) => {
    return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border border-black/20 rounded-xl bg-white gap-3">
      {/* Letter Details */}
      <div className="flex flex-col text-sm text-black">
        <span className="font-semibold">
          {title} <span className="font-normal">{date}</span>
        </span>
        <span className="text-gray-600 font-mono">
          @{username}{statusText ? `, ${statusText}` : ""}
        </span>
      </div>

      {/* Right Side: Status Dot + Actions */}
      <div className="flex items-center gap-3 self-end sm:self-center">
        <StatusDot status={status} />
        
        <div className="flex items-center gap-1">
          {onSee && (
            <Button variant="Action" onClick={onSee}>
              See
            </Button>
          )}
          {onEdit && (
            <Button variant="Action" onClick={onEdit}>
              Edit
            </Button>
          )}
          {onCancel && (
            <Button variant="Action" onClick={onCancel}>
              Cancel
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
