import React from "react";

interface ScrollContainerProps{
    children: React.ReactNode;
    maxHeight?: string;
    className?: string;
}

export const ScrollContainer = ({
    children,
    maxHeight = "max-h-[calc(100vh-200px)]",
    className = "",
}: ScrollContainerProps) => {
    return(
    <div
        className={`w-full overflow-y-auto pr-2 custom-scrollbar ${maxHeight} ${className}`}
        >
        {children}
    </div>
    );
};


