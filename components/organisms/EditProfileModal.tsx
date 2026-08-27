"use client";

import React, { useState, useEffect, useRef } from "react";
import { Avatar } from "@/components/atoms/Avatar";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser?: {
    name: string;
    email: string;
    image?: string; // Standardized from avatarUrl to image
  };
  onSuccess?: (updatedUser: { name: string; email: string; image?: string }) => void;
}

export const EditProfileModal = ({
  isOpen,
  onClose,
  currentUser,
  onSuccess,
}: EditProfileModalProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    if (currentUser) {
      setName(currentUser.name || "");
      setEmail(currentUser.email || "");
      setImage(currentUser.image);
    } else {
      setIsFetching(true);
      fetch("/api/me")
        .then((res) => {
          if (!res.ok) throw new Error("Failed to load user data");
          return res.json();
        })
        .then((data) => {
          setName(data.name || "");
          setEmail(data.email || "");
          setImage(data.image);
        })
        .catch((err) => setError(err.message))
        .finally(() => setIsFetching(false));
    }
  }, [isOpen, currentUser]);

  if (!isOpen) return null;

  // Convert uploaded image file into a persistable Base64 string
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, image }), // Send image payload
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to update profile");
      }

      if (onSuccess) {
        onSuccess(data);
      }
      onClose();
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl border border-stone-200">
        <h2 className="text-xl font-serif font-bold text-stone-900 mb-4">Edit Profile</h2>

        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 p-2.5 rounded border border-red-200">
            {error}
          </div>
        )}

        {isFetching ? (
          <div className="py-8 text-center text-stone-500 text-sm">Loading user profile...</div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Avatar Upload Section */}
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full overflow-hidden shrink-0 aspect-square flex items-center justify-center bg-stone-200">
                <Avatar src={image} size="lg" />
              </div>
              <div className="flex flex-col gap-1">
                <div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded-md transition-colors cursor-pointer"
                  >
                    Change Avatar
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </div>
                <p className="text-[11px] text-stone-400">JPG, PNG or GIF</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-stone-300 rounded-md p-2 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A4D3C]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-stone-300 rounded-md p-2 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A4D3C]"
                required
              />
            </div>

            <div className="flex justify-end gap-3 mt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm text-stone-600 hover:text-stone-900 transition-colors cursor-pointer"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 text-sm bg-[#0A4D3C] text-white rounded-md hover:bg-[#083d30] transition-colors disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};