import React from "react";

interface  TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
}

export const TextArea = ({ label, className = "", ...props }: TextAreaProps) => {
    return (
        <div className="flex flex-col gap-1 w-full">
        {label && <label className="text-sm font-semibold text-black">{label}</label>}
        <textarea
        className={`w-full px-4 py-2.5 border border-black/30 rounded-xl bg-white text-black text-sm outline-none focus:border-black transition-colors resize-y min-h-25 ${className}`}
        {...props}
        />
        </div>
    )
} 
