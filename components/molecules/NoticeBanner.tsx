import React from "react";

interface NoticeBannerProps {
  message?: string;
}

export const NoticeBanner: React.FC<NoticeBannerProps> = ({
  message = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
}) => {
  return (
    <div className="relative mt-4 flex items-start sm:items-center gap-3 p-4 bg-white border border-stone-300 rounded-2xl shadow-sm">
      {/* Red Warning Badge Icon */}
      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-red-500 flex items-center justify-center text-white font-bold text-sm shrink-0 border-2 border-white shadow">
        !
      </div>

      {/* Notice Content */}
      <div className="text-xs sm:text-sm text-stone-800 leading-relaxed font-sans">
        <span className="font-bold text-stone-900 mr-1">Admin:</span>
        {message}
      </div>
    </div>
  );
};