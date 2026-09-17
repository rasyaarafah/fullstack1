"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/templates/DashboardLayout";
import { AdminLetterPreview } from "@/components/organisms/AdminLetterPreview";
import { KOP_SURAT_DEFAULTS } from "@/lib/kopSuratDefault";

interface TemplateData {
  id: string;
  title: string;
  category: string;
  nomorSurat?: string;
  kotaTanggal?: string;
  perihal?: string;
  penerima?: string;
  bodyContent?: string;
  paragrafPenutup?: string;
  hariTanggal?: string;
  waktu?: string;
  tempat?: string;
  jabatanPenandaTangan?: string;
  namaPenandaTangan?: string;
}

const CATEGORY_OPTIONS = [
  "Surat Keterangan",
  "Surat Undangan",
  "Surat Tugas",
  "Surat Keputusan",
  "Surat Pemberitahuan",
];

export default function EditTemplatePage() {
  const params = useParams();
  const router = useRouter();
  const templateId = params?.id as string;

  const [formData, setFormData] = useState<TemplateData>({
    id: templateId || "",
    title: "",
    category: "Surat Keterangan",
    nomorSurat: "[Disi oleh Admin]",
    kotaTanggal: "Tangerang Selatan, {tanggal_surat}",
    perihal: "",
    penerima: "Bapak/Ibu Penerima",
    bodyContent: "",
    paragrafPenutup: "",
    hariTanggal: "",
    waktu: "",
    tempat: "",
    jabatanPenandaTangan: KOP_SURAT_DEFAULTS.defaultSignerRole,
    namaPenandaTangan: KOP_SURAT_DEFAULTS.defaultSignerName,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [focusedField, setFocusedField] =
    useState<keyof TemplateData>("bodyContent");

  useEffect(() => {
    async function loadTemplate() {
      if (!templateId) return;
      try {
        const res = await fetch(`/api/templates/${templateId}`);
        if (!res.ok) {
          console.warn("API route returned non-200 status:", res.status);
          return;
        }

        const data = await res.json();
        console.log("Fetched template data:", data);

        const item = data.template || data.data || data;

        const extractedBody =
          item.bodyContent ||
          item.content ||
          item.body ||
          item.isiSurat ||
          item.paragrafPembuka ||
          item.description ||
          "";

        setFormData((prev) => ({
          ...prev,
          title: item.title || item.nama || item.name || "Untitled Template",
          category: item.category || "Surat Keterangan",
          perihal: item.perihal || item.hal || item.subject || item.title || "",
          bodyContent: extractedBody,
          nomorSurat: item.nomorSurat || item.nomor || "[Disi oleh Admin]",
          penerima: item.penerima || item.recipient || "Bapak/Ibu Penerima",
          jabatanPenandaTangan:
            item.signerRole || KOP_SURAT_DEFAULTS.defaultSignerRole,
          namaPenandaTangan:
            item.signerName || KOP_SURAT_DEFAULTS.defaultSignerName,
        }));
      } catch (err) {
        console.error("Failed loading template details:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadTemplate();
  }, [templateId]);

  const detectedPlaceholders = Array.from(
    new Set([
      ...(formData.bodyContent?.match(/\{\{([^}]+)\}\}/g) || []).map((v) => v),
      "{tanggal_surat}",
      "{nomor_surat}",
      "{{nama_penerima}}",
      "{{jabatan}}",
    ])
  );

  const insertVariable = (variable: string) => {
    if (!focusedField) return;
    const currentVal = formData[focusedField] || "";
    setFormData((prev) => ({
      ...prev,
      [focusedField]: `${currentVal} ${variable}`.trim(),
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch(`/api/templates/${templateId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          category: formData.category,
          bodyContent: formData.bodyContent,
          description: formData.bodyContent,
          signerName: formData.namaPenandaTangan,
          signerRole: formData.jabatanPenandaTangan,
        }),
      });

      if (res.ok) {
        alert("Template successfully updated!");
        router.push("/admin/templates/edit");
      } else {
        alert("Failed to update template.");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving data.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 text-stone-500 font-sans">
        Loading template content...
      </div>
    );
  }

  return (
    <DashboardLayout
      navItems={[
        { label: "Overview", href: "/admin" },
        { label: "Pending Approval", href: "/admin/pending" },
        { label: "Archive", href: "/admin/history" },
        { label: "User Management", href: "/admin/users" },
        { label: "New letter", href: "/admin/new-letter" },
      ]}
      adminTools={[
        {
          label: "Edit template",
          href: "/admin/templates/edit",
          isActive: true,
        },
        { label: "Add template", href: "/admin/templates/new" },
        { label: "Broadcast notice", href: "/admin/notice" },
      ]}
    >
      <div className="space-y-4 max-w-[1600px] mx-auto w-full font-serif text-stone-800">
        <div className="flex items-center justify-between border-b border-stone-200 pb-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/admin/templates/edit")}
              className="w-8 h-8 rounded-full border border-stone-300 flex items-center justify-center text-stone-600 hover:bg-stone-100"
            >
              ←
            </button>
            <div>
              <h1 className="text-xl font-serif text-stone-900 font-bold flex items-center gap-2">
                Edit Template:{" "}
                <span className="italic font-normal">
                  {formData.title || "Untitled"}
                </span>
              </h1>
              <p className="text-[11px] font-sans text-stone-500">
                A4 Document Standard (210mm x 297mm)
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-1 bg-stone-900 text-white text-xs rounded hover:bg-stone-800 disabled:opacity-50 cursor-pointer"
            >
              {isSaving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>

        {/* Dynamic Placeholders Bar */}
        <div className="p-2.5 bg-stone-50 border border-stone-200 rounded-lg flex items-center gap-2 flex-wrap">
          <span className="text-[11px] font-sans text-stone-500">
            Click variable to insert at cursor:
          </span>
          {detectedPlaceholders.map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => insertVariable(v)}
              className="px-2 py-0.5 bg-white border border-stone-300 text-stone-700 font-mono text-[11px] rounded hover:bg-stone-100 cursor-pointer"
            >
              {v}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Editor Form Controls (5 columns ~ 41.6% width) */}
          <div className="lg:col-span-5 bg-white border border-stone-300 rounded-xl p-5 space-y-5 max-h-[80vh] overflow-y-auto font-sans">
            <h2 className="text-base font-serif font-bold text-stone-900 border-b pb-2">
              Template Controls
            </h2>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700">
                  Nama Template
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onFocus={() => setFocusedField("title")}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full border border-stone-300 rounded p-2 text-xs focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700">
                  Kategori Surat
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full border border-stone-300 rounded p-2 text-xs bg-white focus:outline-none"
                >
                  {CATEGORY_OPTIONS.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-3 pt-3 border-t">
              <span className="text-xs font-bold uppercase text-stone-400">
                SURAT INFORMATION
              </span>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    Nomor Surat
                  </label>
                  <input
                    type="text"
                    value={formData.nomorSurat}
                    onFocus={() => setFocusedField("nomorSurat")}
                    onChange={(e) =>
                      setFormData({ ...formData, nomorSurat: e.target.value })
                    }
                    className="w-full border border-stone-300 rounded p-2 text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    Hal / Perihal
                  </label>
                  <input
                    type="text"
                    value={formData.perihal}
                    onFocus={() => setFocusedField("perihal")}
                    onChange={(e) =>
                      setFormData({ ...formData, perihal: e.target.value })
                    }
                    className="w-full border border-stone-300 rounded p-2 text-xs focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-3 border-t">
              <span className="text-xs font-bold uppercase text-stone-400">
                PENANDA TANGAN
              </span>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    Jabatan
                  </label>
                  <input
                    type="text"
                    value={formData.jabatanPenandaTangan}
                    onFocus={() => setFocusedField("jabatanPenandaTangan")}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        jabatanPenandaTangan: e.target.value,
                      })
                    }
                    className="w-full border border-stone-300 rounded p-2 text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    Nama
                  </label>
                  <input
                    type="text"
                    value={formData.namaPenandaTangan}
                    onFocus={() => setFocusedField("namaPenandaTangan")}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        namaPenandaTangan: e.target.value,
                      })
                    }
                    className="w-full border border-stone-300 rounded p-2 text-xs focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-3 border-t">
              <span className="text-xs font-bold uppercase text-stone-400">
                ISI SURAT (BODY & PLACEHOLDERS)
              </span>
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Content Text
                </label>
                <textarea
                  rows={10}
                  value={formData.bodyContent}
                  onFocus={() => setFocusedField("bodyContent")}
                  onChange={(e) =>
                    setFormData({ ...formData, bodyContent: e.target.value })
                  }
                  className="w-full border border-stone-300 rounded p-3 text-xs font-mono focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Live Preview Pane (7 columns ~ 58.3% width) */}
          <div className="lg:col-span-7 bg-stone-200/70 p-6 rounded-xl border border-stone-300 flex justify-center items-start sticky top-4 overflow-x-auto">
            <AdminLetterPreview
              letterData={{
                letterNumber: formData.nomorSurat,
                recipient: formData.penerima,
                subject: formData.perihal,
                body: formData.bodyContent,
                leftLogo: "/logo_letris.png",
                rightLogo: "/logo_banten.png",
                signerName: formData.namaPenandaTangan,
                signerRole: formData.jabatanPenandaTangan,
              }}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}