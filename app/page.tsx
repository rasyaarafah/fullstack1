"use client";

import React from "react";
import { DashboardLayout } from "@/components/templates/DashboardLayout";
import { StatCard } from "@/components/molecules/StatCard";
import {
  RecentLetterList,
  LetterItemData,
} from "@/components/organisms/RecentLetterList";
import { FileText, Clock, CheckCircle, XCircle } from "lucide-react";

export default function DashboardPage() {
  // Mock Navigation for testing
  const navItems = [
    { label: "Dashboard", href: "/", icon: <FileText className="w-4 h-4" />, isActive: true },
    { label: "Buat Surat", href: "/new-letter", icon: <FileText className="w-4 h-4" />, isActive: false },
    { label: "Riwayat Surat", href: "/history", icon: <FileText className="w-4 h-4" />, isActive: false },
    { label: "Manajemen User", href: "/users", icon: <FileText className="w-4 h-4" />, isActive: false },
  ];

  // Mock user
  const mockUser = {
    name: "Rasya",
    username: "rasya_dev",
    avatarUrl: "", // Added avatarUrl
  };

  // Mock sample letter data
  const sampleLetters: LetterItemData[] = [
    {
      id: "1",
      title: "Surat permohonan surat kegiatan sekolah",
      authorUsername: "rasya_dev",
      date: "2026-04-12",
      status: "approved",
    },
    {
      id: "2",
      title: "Surat undangan rapat orang tua murid",
      authorUsername: "admin-sekolah",
      date: "2026-04-14",
      status: "pending",
    },
    {
      id: "3",
      title: "Surat pengajuan Kerjasama Sponsor",
      authorUsername: "rasya-dev",
      date: "2026-04-10",
      status: "rejected",
    },
  ];

  return (
    <DashboardLayout
      navItems={navItems}
      currentUser={mockUser}
      title="Dashboard Utama"
      description="Kelola dan pantau pembuatan kop surat instansi dengan cepat."
    >
      <div className="flex flex-col gap-8">
        {/* Statistics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Total Surat"
            count="24"
            icon={<FileText className="w-5 h-5 text-black" />}
          />
          <StatCard
            label="Menunggu persetujuan"
            count="5"
            icon={<Clock className="w-5 h-5 text-yellow-600" />}
          />
          <StatCard
            label="Surat Disetujui"
            count="16"
            icon={<CheckCircle className="w-5 h-5 text-green-600" />}
          />
          <StatCard
            label="Surat Ditolak"
            count="3"
            icon={<XCircle className="w-5 h-5 text-red-600" />}
          />
        </div>

        {/* Recent Letters Section */}
        <div className="bg-white p-6 rounded-2xl border border-black/10 shadow-sm flex flex-col gap-4">
          <h2 className="text-lg font-bold text-black">Surat Terbaru</h2>
          <RecentLetterList
            letters={sampleLetters}
            onViewLetter={(id) => alert(`Melihat surat ID: ${id}`)}
            onEditLetter={(id) => alert(`Mengedit surat ID: ${id}`)}
            onCancelLetter={(id) => alert(`Membatalkan surat ID: ${id}`)}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}