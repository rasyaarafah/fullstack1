import React from "react";
import { LetterRowItem } from "../molecules/LetterRowItem";
import { MobileLetterItem } from "../molecules/MobileLetterItem";
import { ScrollContainer } from "../atoms/ScrollContainer";

export interface LetterItemData {
  id: string;
  title: string;
  authorUsername: string;
  date: string;
  status: "approved" | "pending" | "rejected";
}

interface RecentLetterListProps {
  letters: LetterItemData[];
  onViewLetter?: (id: string) => void;
  onEditLetter?: (id: string) => void;
  onCancelLetter?: (id: string) => void;
  onDownloadLetter?: (id: string) => void;
}

export const RecentLetterList = ({
  letters,
  onViewLetter,
  onEditLetter,
  onCancelLetter,
  onDownloadLetter,
}: RecentLetterListProps) => {
  // Maps status types to match MobileLetterItem standard
  const mapMobileStatus = (status: LetterItemData["status"]) => {
    switch (status) {
      case "approved":
        return "approved";
      case "rejected":
        return "pending_revision";
      default:
        return "pending_approval";
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Letter List */}
      <ScrollContainer maxHeight="max-h-[calc(100vh-250px)]">
        {letters.length > 0 ? (
          <>
            {/* Mobile View */}
            <div className="flex flex-col gap-2 md:hidden">
              {letters.map((letter) => (
                <MobileLetterItem
                  key={letter.id}
                  author={letter.authorUsername}
                  title={letter.title}
                  date={letter.date}
                  status={mapMobileStatus(letter.status)}
                  onSee={() => onViewLetter?.(letter.id)}
                  onEdit={() => onEditLetter?.(letter.id)}
                  onCancel={() => onCancelLetter?.(letter.id)}
                  onDownload={() => onDownloadLetter?.(letter.id)}
                />
              ))}
            </div>

            {/* Desktop View */}
            <div className="hidden md:flex md:flex-col md:gap-2.5 pr-1">
              {letters.map((letter) => (
                <LetterRowItem
                  key={letter.id}
                  title={letter.title}
                  username={letter.authorUsername}
                  date={letter.date}
                  status={letter.status}
                  onSee={() => onViewLetter?.(letter.id)}
                  onEdit={() => onEditLetter?.(letter.id)}
                  onCancel={() => onCancelLetter?.(letter.id)}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="p-8 text-center text-sm text-stone-500 border border-dashed border-stone-300 rounded-xl">
            Tidak ada surat yang ditemukan.
          </div>
        )}
      </ScrollContainer>
    </div>
  );
};