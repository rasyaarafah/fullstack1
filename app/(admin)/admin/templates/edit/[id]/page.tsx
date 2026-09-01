"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/templates/DashboardLayout";

interface TemplateData {
  id: string;
  title: string;
  category: string;
  yayasan?: string;
  namaSekolah?: string;
  npsnNss?: string;
  akreditasi?: string;
  jurusan?: string;
  alamat?: string;
  website?: string;
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

const DEFAULT_HEADER = {
  yayasan: "YAYASAN LEO SUTRISNO",
  namaSekolah: "SMK LETRIS INDONESIA 2",
  npsnNss: "NPSN : 69894185 NSS : 402286303080",
  akreditasi: '( AKREDITASI " A " )',
  jurusan:
    "Kompetensi Keahlian : Desain Komunikasi Visual (DKV), Teknik Jaringan Komputer dan Telekomunikasi (TJKT), Pengembangan Perangkat Lunak dan Gim (PPLG), Manajemen Perkantoran dan Layanan Bisnis (MPLB), Pemasaran (PM), Akuntansi Keuangan Lembaga",
  alamat:
    "Jl. Raya Siliwangi No. 55 Pondok Benda - Pamulang Telp. 021-29446273 Kota Tangerang Selatan Provinsi Banten",
  website: "www.smkletrisdua.sch.id",
};

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
    ...DEFAULT_HEADER,
    nomorSurat: "[Disi oleh Admin]",
    kotaTanggal: "Tangerang Selatan, {tanggal_surat}",
    perihal: "",
    penerima: "Bapak/Ibu Penerima",
    bodyContent: "",
    paragrafPenutup: "",
    hariTanggal: "",
    waktu: "",
    tempat: "",
    jabatanPenandaTangan: "Kepala Sekolah / Admin",
    namaPenandaTangan: "[Belum Ditandatangani]",
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
            item.jabatanPenandaTangan ||
            item.signer ||
            "Kepala Sekolah / Admin",
          namaPenandaTangan: item.namaPenandaTangan || "[Belum Ditandatangani]",
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
    ]),
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
          ...formData,
          category: formData.category,
          bodyContent: formData.bodyContent,
          content: formData.bodyContent,
          description: formData.bodyContent,
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
      <div className="space-y-4 max-w-7xl mx-auto w-full font-serif text-stone-800">
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
          {/* Editor Form Controls */}
          <div className="lg:col-span-6 bg-white border border-stone-300 rounded-xl p-5 space-y-5 max-h-[80vh] overflow-y-auto font-sans">
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

          {/* Live Document Canvas */}
          <div className="lg:col-span-6 bg-stone-200/70 p-6 rounded-xl border border-stone-300 flex justify-center sticky top-4">
            <div className="w-full bg-white shadow-xl border border-stone-200 p-8 min-h-175 flex flex-col justify-between text-[11px] leading-relaxed font-serif">
              <div>
                {/* Kop Header */}
                <div className="border-b-2 border-solid border-stone-900 pb-2 mb-4 text-center flex items-center justify-between">
                  <img
                    src="/logo_letris.png"
                    alt="Logo"
                    className="w-10 h-10 object-contain"
                  />
                  <div className="flex-1 px-3 text-center">
                    <p className="font-bold text-[10px] uppercase">
                      {formData.yayasan}
                    </p>
                    <p className="font-bold text-[13px] uppercase">
                      {formData.namaSekolah}
                    </p>
                    <p className="text-[7.5px] font-sans text-stone-700">
                      {formData.npsnNss}
                    </p>
                    <p className="text-[7.5px] font-sans font-bold">
                      {formData.akreditasi}
                    </p>
                  </div>
                  <img
                    src="/logo_banten.png"
                    alt="Logo"
                    className="w-10 h-10 object-contain"
                  />
                </div>

                {/* Letter Info */}
                <div className="flex justify-between font-sans text-[10px] mb-4">
                  <div>
                    <p>
                      <span className="font-semibold">Nomor:</span>{" "}
                      {formData.nomorSurat}
                    </p>
                    <p>
                      <span className="font-semibold">Hal:</span>{" "}
                      {formData.perihal}
                    </p>
                  </div>
                  <div>Tangerang Selatan, 2026-09-01</div>
                </div>

                <div className="font-sans text-[10px] space-y-0.5 mb-4">
                  <p className="font-semibold">Kepada Yth.</p>
                  <p>{formData.penerima}</p>
                  <p className="text-stone-500">Di Tempat</p>
                </div>

                {/* Live Rendering Body Content */}
                <div className="font-sans text-[10px] whitespace-pre-wrap leading-relaxed text-stone-800">
                  {formData.bodyContent}
                </div>
              </div>

              {/* Signer Block */}
              <div className="flex justify-end pt-4 font-sans text-[9px]">
                <div className="text-center w-40 border border-dashed border-stone-300 p-2 rounded">
                  <p className="text-stone-500">Mengetahui,</p>
                  <p className="font-semibold">
                    {formData.jabatanPenandaTangan}
                  </p>
                  <div className="h-8"></div>
                  <p className="font-bold underline">
                    {formData.namaPenandaTangan}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}