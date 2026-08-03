import React from "react";

interface ScrollContainerProps {
  children: React.ReactNode;
  maxHeight?: string;
  className?: string;
  direction?: "vertical" | "horizontal";
}

export const ScrollContainer = ({
  children,
  maxHeight = "max-h-[calc(100vh-200px)]",
  className = "",
  direction = "vertical",
}: ScrollContainerProps) => {
  if (direction === "horizontal") {
    return (
      <div className={`w-full overflow-x-auto pb-2 scrollbar-none snap-x snap-mandatory ${className}`}>
        {children}
      </div>
    );
  }

  return (
    <div
      className={`w-full overflow-y-auto pr-2 custom-scrollbar ${maxHeight} ${className}`}
    >
      {children}
    </div>
  );
};