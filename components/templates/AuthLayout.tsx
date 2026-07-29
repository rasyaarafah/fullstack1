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
            <div className="w-full max-w-md bg-white- border border-black/10 rounded-2xl p-6 shadow-sm flex-col gap-6">
                {/* Header / Brand */}
                <div className="flex flex-col items-center text-center gap-1">
                  <div className="w-12 h-12 rounded-2xl bg-black flex items-center justify-center text-white font-bold text-xl mb-2">
                    2K
                  </div>
                  <h1 className="text-xl font-bold text-black"> {title} </h1>
                    {subtitle && <p className="text-sm text-gray=500"> {subtitle} </p>}                
                </div>

                {/* Auth Content / Form  */}
                {children}
            </div>
        </div>
    );
};
