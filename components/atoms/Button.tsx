import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>{
    children: React.ReactNode;
    variant?: "Primary" | "Outline" | "Action";
}

export const Button = ({
    children,
    variant = "Primary",
    className = "",
    ...props
}:ButtonProps) => {
    const baseStyle = "font-medium transition-all focus:outline-none flex items-center justify-center cursor-pointer";

    const variants = {
        //Main black Button (e.g., "Sign In")
        Primary: "bg-black text-white px-6 py-2 rounded-full hover:bg-neutral-800",
        //Outlined pill button (e.g., "create new leter" , "see history")
        Outline: "bg-white text-black border border-black px-6 py-2 rounded-full hover:bg-neutral-100",
        //Small action button in table rows(e.g., "See" "Edit" "Cancel")
        Action: "bg-white text-black border border-black text-sm px-3 py-1 hover:bg-neutral-100 ",
    };


    return(
        <button
        className={`${baseStyle} ${variants[variant]} ${className}`}
        {...props}
        >
            {children}
        </button>
    );
};