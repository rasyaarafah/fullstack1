"use client";

import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/templates/DashboardLayout";
import { LetterFormEditor } from "@/components/organisms/LetterFormEditor";

export default function TeacherEditPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [letterData, setLetterData] = useState({
    institutionName: "",
    letterNumber: "",
    recipient: "",
    subject: "",
    date: new Date().toISOString().split("T")[0],
    body: "",
    attachmentUrl: null as string | null,
    status: "DRAFT"
  });

  const navItems = [
    { label: "Overview", href: "/teacher", isActive: false },
    { label: "New letter", href: "/teacher/new-letter", isActive: false },
    { label: "History", href: "/teacher/history", isActive: true },
    { label: "Pending", href: "/teacher/pending", isActive: false },
  ];

  useEffect(() => {
    async function fetchLetter() {
      try {
        const res = await fetch(`/api/letters/${unwrappedParams.id}`);
        if (res.ok) {
          const data = await res.json();
          setLetterData({
            institutionName: data.institutionName || "",
            letterNumber: data.letterNumber || "",
            recipient: data.recipient || "",
            subject: data.subject || data.title || "",
            date: data.createdAt ? new Date(data.createdAt).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
            body: data.body || "",
            attachmentUrl: data.attachmentUrl || null,
            status: data.status,
          });
        } else {
          router.push("/teacher/history");
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchLetter();
  }, [unwrappedParams.id, router]);

  const handleUpdateLetter = async (newStatus: "PENDING" | "DRAFT") => {
    try {
      setIsSubmitting(true);
      const res = await fetch(`/api/letters/${unwrappedParams.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: letterData.subject || "Surat",
          letterNumber: letterData.letterNumber,
          recipient: letterData.recipient,
          subject: letterData.subject,
          body: letterData.body,
          attachmentUrl: letterData.attachmentUrl,
          institutionName: letterData.institutionName,
          status: newStatus,
        }),
      });

      if (!res.ok) throw new Error("Gagal mengupdate surat.");
      
      alert(newStatus === "PENDING" ? "Surat berhasil diajukan ulang!" : "Draf diperbarui!");
      router.push("/teacher/history");
    } catch (err: any) {
      alert(err.message || "Terjadi kesalahan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <DashboardLayout navItems={navItems}><div className="p-8">Loading...</div></DashboardLayout>;

  return (
    <DashboardLayout navItems={navItems}>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-serif font-bold text-stone-900">Edit Document</h1>
          <p className="text-sm font-sans text-stone-500 mt-1">Current Status: {letterData.status}</p>
        </div>
        <LetterFormEditor
          formData={letterData}
          onChange={(updatedData) => setLetterData((prev) => ({ ...prev, ...updatedData }))}
          onSubmitForApproval={() => handleUpdateLetter("PENDING")}
          onSaveDraft={() => handleUpdateLetter("DRAFT")}
          isSubmitting={isSubmitting}
        />
      </div>
    </DashboardLayout>
  );
}