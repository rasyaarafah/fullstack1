import React from "react";

interface AvatarProps {
  src?: string;
  alt?: string;
  size?: number | "sm" | "md" | "lg";
}

const SIZE_MAP: Record<"sm" | "md" | "lg", number> = {
  sm: 32,
  md: 40,
  lg: 56,
};

export const Avatar = ({ src, alt = "User avatar", size = "md" }: AvatarProps) => {
  // Resolve string presets to pixel values
  const pixelSize = typeof size === "number" ? size : SIZE_MAP[size] || 40;

  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        className="rounded-full object-cover border border-neutral-300 shrink-0 aspect-square"
        style={{ width: pixelSize, height: pixelSize }}
      />
    );
  }

  // Fallback default user icon if no image provided
  return (
    <div
      className="rounded-full bg-neutral-300 flex items-center justify-center text-neutral-600 border border-neutral-400 shrink-0 aspect-square"
      style={{ width: pixelSize, height: pixelSize }}
    >
      <svg className="w-3/5 h-3/5 fill-current" viewBox="0 0 24 24">
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
      </svg>
    </div>
  );
};