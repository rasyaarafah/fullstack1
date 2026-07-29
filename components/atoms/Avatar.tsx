import React from "react";

interface  AvatarProps{
    src?: string;
    alt?: string;
    size?: number | "sm" | "md" | "lg";
}

export const Avatar = ({ src, alt = "User avatar", size = 40}: AvatarProps) => {
    if (src) {
        return (
            <img
            src={src}
            alt={alt}
            className="rounded-full object-cover border border-neutral-300"
            style={{ width: size, height: size}}
            />
        );
    }

    //Fallback default user icon if no image provided
    return (
    <div
      className="rounded-full bg-neutral-300 flex items-center justify-center text-neutral-600 border border-neutral-400"
      style={{ width: size, height: size }}
    >
      <svg
        className="w-3/5 h-3/5 fill-current"
        viewBox="0 0 24 24"
      >
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
      </svg>
    </div>
  );
};
