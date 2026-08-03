import React from "react";
import { TemplateCard } from "../molecules/TemplateCard";
import { ScrollContainer } from "../atoms/ScrollContainer";

export interface TemplateItem {
  id: string;
  title: string;
  category?: string;
  previewUrl?: string;
}

interface TemplateGalleryProps {
  templates: TemplateItem[];
  selectedId?: string;
  onSelectTemplate: (template: TemplateItem) => void;
}

export const TemplateGallery = ({
  templates,
  selectedId,
  onSelectTemplate,
}: TemplateGalleryProps) => {
  return (
    <ScrollContainer maxHeight="max-h-[calc(100vh-200px)]">
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 p-1">
        {templates.map((tpl) => (
          <TemplateCard
            key={tpl.id}
            title={tpl.title}
            category={tpl.category}
            previewUrl={tpl.previewUrl}
            isSelected={selectedId === tpl.id}
            onClick={() => onSelectTemplate(tpl)}
          />
        ))}
      </div>
    </ScrollContainer>
  );
};