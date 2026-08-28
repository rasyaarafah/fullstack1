"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Sidebar, NavItem } from "@/components/organisms/Sidebar";
import { MobileHeader } from "@/components/organisms/MobileHeader";
import { EditProfileModal } from "@/components/organisms/EditProfileModal";

export interface UserProfile {
  name: string;
  username: string;
  image?: string;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  navItems?: NavItem[];
  adminTools?: NavItem[];
  currentUser?: UserProfile;
  title?: string;
  description?: string;
}

export const DashboardLayout = ({
  children,
  navItems = [],
  adminTools = [],
  currentUser: initialUser,
  title,
  description,
}: DashboardLayoutProps) => {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | undefined>(initialUser);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Fetch active session from API on mount if not passed via props
  useEffect(() => {
    if (!initialUser) {
      fetch("/api/me")
        .then((res) => res.json())
        .then((data) => {
          if (!data.error) {
            setUser({
              name: data.name,
              username: data.email || data.username,
              image: data.image || data.avatarUrl,
            });
          }
        })
        .catch((err) => console.error("Failed to load user:", err));
    } else {
      setUser(initialUser);
    }
  }, [initialUser]);

  const handleProfileSuccess = (updatedUser: {
    name: string;
    email: string;
    image?: string;
  }) => {
    setUser({
      name: updatedUser.name,
      username: updatedUser.email,
      image: updatedUser.image || user?.image,
    });
    router.refresh();
  };

  const displayName = user?.name || user?.username || "Admin";

  return (
    <div className="flex flex-col md:flex-row h-screen w-screen overflow-hidden bg-[#FDF8F5] relative print:h-auto print:w-auto print:overflow-visible print:bg-white print:block">
      {/* Mobile Top Navigation */}
      <div className="md:hidden z-30 relative shrink-0 print:hidden">
        <MobileHeader navItems={navItems} adminTools={adminTools} />
      </div>

      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden print:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Desktop Sidebar Wrapper */}
      <div className="hidden md:block h-full w-64 shrink-0 border-r border-stone-200 bg-white print:hidden">
        <Sidebar
          navItems={navItems}
          adminTools={adminTools}
          currentUser={user}
          onProfileClick={() => setIsProfileOpen(true)}
        />
      </div>

      {/* Mobile Floating Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-y-0 left-0 z-50 md:hidden print:hidden">
          <Sidebar
            navItems={navItems}
            adminTools={adminTools}
            currentUser={user}
            onProfileClick={() => setIsProfileOpen(true)}
            onItemClick={() => setIsMobileOpen(false)}
          />
        </div>
      )}

      {/* Main Content Area */}
      {/* Main Content Area */}
      <main className="flex-1 h-full overflow-y-auto p-4 sm:p-8 relative z-0 print:p-0 print:m-0 print:overflow-visible print:h-auto print:w-full print:block">
        {/* Only show this layout header block if title or description are explicitly passed */}
        {(title || description) && (
          <div className="flex items-center justify-between mb-8 print:hidden">
            <div>
              {title && (
                <h1 className="text-2xl sm:text-3xl font-serif text-stone-900">
                  {title}
                </h1>
              )}
              {description && (
                <p className="text-stone-600 text-sm sm:text-base mt-1">
                  {description}
                </p>
              )}
            </div>

            <button
              onClick={() => setIsProfileOpen(true)}
              className="w-10 h-10 rounded-full bg-stone-200 border border-stone-300 overflow-hidden flex items-center justify-center hover:opacity-90 transition-opacity shrink-0 cursor-pointer ml-auto"
              title="Edit Profile"
            >
              {user?.image ? (
                <img
                  src={user.image}
                  alt={displayName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <svg className="w-6 h-6 text-stone-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              )}
            </button>
          </div>
        )}

        {children}
      </main>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        onSuccess={handleProfileSuccess}
        currentUser={
          user
            ? {
                name: user.name,
                email: user.username,
                image: user.image,
              }
            : undefined
        }
      />
    </div>
  );
};