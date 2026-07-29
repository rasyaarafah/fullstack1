import React, { useState } from "react";
import { LetterRowItem } from "../molecules/LetterRowItem";
import { SearchBar } from "../molecules/SearchBar";
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
}

export const RecentLetterList = ({
  letters,
  onViewLetter,
  onEditLetter,
  onCancelLetter,
}: RecentLetterListProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredLetters = letters.filter(
    (l) =>
      l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.authorUsername.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Search Header */}
      <div className="max-w-md">
        <SearchBar
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari surat berdasarkan judul atau pembuat..."
        />
      </div>

      {/* Letter List */}
      <ScrollContainer maxHeight="max-h-[calc(100vh-250px)]">
        <div className="flex flex-col gap-2.5 pr-1">
          {filteredLetters.length > 0 ? (
            filteredLetters.map((letter) => (
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
            ))
          ) : (
            <div className="p-8 text-center text-sm text-gray-500 border border-dashed border-gray-300 rounded-xl">
              Tidak ada surat yang ditemukan.
            </div>
          )}
        </div>
      </ScrollContainer>
    </div>
  );
};