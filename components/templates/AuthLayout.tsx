"use client";

import React from "react";

interface AuthLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen w-full bg-linear-to-r from-white via-[#E2A0D8] to-[#CD3BB9] flex flex-col items-center justify-center p-6 sm:p-12">
      <div className="w-full max-w-md flex flex-col items-center">
        {children}
      </div>
    </div>
  );
};