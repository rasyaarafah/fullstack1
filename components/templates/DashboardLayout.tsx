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
    // FIXED: Changed `min-h-screen` to `h-screen overflow-hidden`
    <div className="flex flex-col md:flex-row h-screen w-screen overflow-hidden bg-[#FDF8F5] relative">
      {/* Mobile Top Navigation */}
      <MobileHeader navItems={navItems} adminTools={adminTools} />

      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Desktop Sidebar Wrapper */}
      {/* FIXED: Changed `min-h-screen` to `h-full` */}
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

      {/* Main Content Area */}
      {/* FIXED: Added `h-full overflow-y-auto` */}
      <main className="flex-1 h-full overflow-y-auto p-4 sm:p-8 relative z-10">
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