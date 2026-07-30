import React from "react";
import { Sidebar, NavItem } from "@/components/organisms/Sidebar"; // Import NavItem here!

interface DashboardLayoutProps {
  children: React.ReactNode;
  navItems?: NavItem[];
  currentUser?: {
    name: string;
    username: string;
    avatarUrl?: string;
  };
  title?: string;
  description?: string;
}

export const DashboardLayout = ({
  children,
  navItems = [],
  currentUser,
  title,
  description,
}: DashboardLayoutProps) => {
  return (
    <div className="flex h-screen bg-[#FDF8F5]">
      <Sidebar navItems={navItems} />
      <main className="flex-1 p-8 overflow-y-auto">
        {(title || description) && (
          <div className="mb-6">
            {title && <h1 className="text-2xl font-serif font-semibold">{title}</h1>}
            {description && <p className="text-stone-600">{description}</p>}
          </div>
        )}
        {children}
      </main>
    </div>
  );
};