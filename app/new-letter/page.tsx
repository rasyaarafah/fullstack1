"use client";

import React, { useState } from "react";
import { DashboardLayout } from "@/components/templates/DashboardLayout";
import { TemplateGallery } from "@/components/organisms/TemplateGallery";
import { LetterFormEditor } from "@/components/organisms/LetterFormEditor";
import { FileText, PlusSquare, History, Users } from "lucide-react";

export default function NewLetterPage() {
    const [SelectedTemplate, setSelectedTemplate] = useState<string | null>(null);

    const navItems = [
        { label: "Dashboard", href: "/", icon: <FileText className="w-4 h-4" />, isActive: false },
        { label: "Buat Surat", href: "/new-letter", icon: <PlusSquare className="w-4 h-4" />, isActive: true },
        { label: "Riwayat Surat", href: "/history", icon: <History className="w-4 h-4" />, isActive: false },
        { label: "Manajemen User", href: "/users", icon: <Users className="w-4 h-4" />, isActive: false },
      ];

    const mockUser = {
        name:"Rasya",
        username: "rasya_dev",
        avatarUrl:"",
    };

    // Sample templates for selection
    const templates = [
        {
            id: "1",
            title: "Surat izin resmi",
            description: "Template standar permohonan izin kegiatan atau ketidakhadiran.",
            category:"izin",
        },

        {   id: "2",
            title: "Surat undangan rapat",
            description: "Template formal undangan pertemuan instansi atau komite.",
            category:"undangan",
        },

        {   id: "3",
            title: "surat Pengajuan Sponsor",
            description: "Template formal permohonan dana dan kerjasama event",
            category: "Kerjasama"

        },
    ];

    return (
        <DashboardLayout
         navItems={navItems}
         currentUser={mockUser}
         title="Buat Surat Baru"
         description="Pilih template kop surat dan isi formulir di bawah ini."
        >
            <div className="flex flex-col gap-8">
                {/* Template Selector Section */}
                <div className="  ">

                </div>
            </div>
           
        </DashboardLayout>
    )


}