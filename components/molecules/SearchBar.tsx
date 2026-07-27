import React from "react";
import { Input } from "../atoms/Input";

interface SearchBarProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const SearchBar = (props: SearchBarProps) => {
    return (
        <div className="relative w-full">
            <Input
            placeholder="Search..."
            className="pr-10"
            {...props}
            />
            <div className="absolute right-4 top-1/2  translate-y-1/2 text-gray-500 pointer-events-none">
            🔍
            </div>
        </div>
    );
};