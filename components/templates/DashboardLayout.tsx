import React from "react";
import { Sidebar } from "../organisms/Sidebar";

interface NavItem {
    label: string;
    href: string;
    icon: React.ReactNode;
    IsActive?: boolean;
}

interface DashBoardLAyoutProps {
    children: React.ReactNode;
    navItems: NavItem[];
    currentUser?: {
        name: string;
        username: string;
        avatarUrl: string;
    };
    title?: string;
    description?: string;
    onNavigate?: (href: string) => void;
}

export const DashBoardLAyout = ({
    children,
    navItems,
    currentUser,
    title,
    description,
    onNavigate,
}: DashBoardLAyoutProps) => {
    return (    
        <div className="flex min-h-screen bg-gray-50 text-gray-900">
            {/* Sidebar Navigation */}
            <Sidebar
            navItems={navItems}
            currentUser={currentUser}
            onNavigate={onNavigate}
            />

            {/* Main Content Area */}
            <main className="flex-1 p-8 overflow-y-auto">
            {(title || description) && (
                <div className="mb-6">
                    {title && (
                        <h1 className="text-2xl font-bold text-black tracking-light">
                            {title}
                        </h1>
                    )}
                </div>
            )}

            {children}
            </main>
        </div>
    )
}
