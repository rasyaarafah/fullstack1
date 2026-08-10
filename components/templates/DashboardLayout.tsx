"use client";

import React, { useState } from "react";
import { Sidebar, NavItem } from "@/components/organisms/Sidebar";
import { MobileHeader } from "@/components/organisms/MobileHeader";

interface DashboardLayoutProps {
  children: React.ReactNode;
  navItems?: NavItem[];
  adminTools?: NavItem[];
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
  adminTools = [],
  currentUser,
  title,
  description,
}: DashboardLayoutProps) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="flex flex-col md:flex-row h-screen w-screen overflow-hidden bg-[#FDF8F5] relative">
      {/* Mobile Top Navigation - Needs z-30 and relative position to sit ON TOP of <main> */}
      <div className="md:hidden z-30 relative shrink-0">
        <MobileHeader navItems={navItems} adminTools={adminTools} />
      </div>

      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Desktop Sidebar Wrapper */}
      <div className="hidden md:block h-full w-64 shrink-0 border-r border-stone-200 bg-white">
        <Sidebar navItems={navItems} adminTools={adminTools} />
      </div>

      {/* Mobile Floating Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-y-0 left-0 z-50 md:hidden">
          <Sidebar
            navItems={navItems}
            adminTools={adminTools}
            onItemClick={() => setIsMobileOpen(false)}
          />
        </div>
      )}

      {/* Main Content Area - Changed z-10 to z-0 so it never blocks the header */}
      <main className="flex-1 h-full overflow-y-auto p-4 sm:p-8 relative z-0">
        {(title || description) && (
          <div className="mb-6">
            {title && (
              <h1 className="text-2xl sm:text-3xl font-serif font-semibold text-stone-900">
                {title}
              </h1>
            )}
            {description && (
              <p className="text-stone-600 text-sm sm:text-base">{description}</p>
            )}
          </div>
        )}
        {children}
      </main>
    </div>
  );
};