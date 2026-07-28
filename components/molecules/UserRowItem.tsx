import React from "react";
import { Avatar } from "../atoms/Avatar";
import { IconButton } from "../atoms/IconButton";


interface UserRowItemProps {
    name: string;
    username: string;
    email?: string;
    role: "Admin" | "Pembuat";
    avatarUrl?: string;
    onChangeRole?: () => void;
    onRemoveAccess?: () => void; 
}

export const UserRowItem = ({
    name,
    username,
    email,
    role,
    avatarUrl,
    onChangeRole,
    onRemoveAccess,
}: UserRowItemProps) => {
    const isAdmin = role === "Admin";

    return (
        <div className="flex items-center justify-between p-3 px-4 rounded-xl border border-black/10 bg-white hover:border-black/20 transition-all">
            {/*User Info*/}
            <div className="flex items-center gap-3">
                <Avatar src={avatarUrl} alt={name} />
                <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-black">{name}</span>
                        <span className="text-xs text-gray-400"> @{username}</span>
                    </div>
                    {email && <span className="text-xs text-gray-500 ">{email}</span>}
                </div>
            </div>

            {/* Role Badge & Actions */}
            <div className={`flex items-center gap-3`}>
                <span 
                className={`px-3 py-1 rounded-full text-xs font-bold ${
                isAdmin
                ? "bg-purple-100 text-purple-700"
                : "bg-blue-100 text-blue-700"     
                }`}
            >
                {role}
                 </span>

                 {/* User Management Actions Icons */}
                 <div className="flex items-center gap-1">
                    {/* Swap Role Icon */}
                    <IconButton 
                    variant="ghost"
                    title="Ubah Akses Role"
                    onClick={onChangeRole}
                    >
                        <svg 
                        className="w-4 h-4 text-gray-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        >
                            <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="m8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                            />
                                
                        </svg>
                    </IconButton>
                    {/* Remove Access / Delete Icon */}
                    <IconButton 
                    variant="danger"
                    title="Hapus Akses"
                    onClick={onRemoveAccess}
                    >
                        <svg 
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"

                        >
                            <path 
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />

                        </svg>
                    </IconButton>
                 </div>
            </div>
        </div>
    );
};