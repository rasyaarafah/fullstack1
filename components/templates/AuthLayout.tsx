import React from "react";

interface AuthLayoutProps {
    children: React.ReactNode;
    title: string;
    subtitle?: string;
}

export const AuthLayout = ({
    children,
    title,
    subtitle,
}: AuthLayoutProps) => {
    return (
        <div className="min-h-screen w-full bg-gray-50 flex items-center justify-center p-4">
            
        </div>
    )
}