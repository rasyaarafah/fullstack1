"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export interface LetterFormData {
  institutionName: string;
  letterNumber: string;
  date: string;
  recipient: string;
  subject?: string;
  body: string;
  attachmentUrl?: string | null;
  leftLogo?: string;
  rightLogo?: string;
}

interface LetterFormEditorProps {
  formData: LetterFormData;
  onChange: (updatedData: LetterFormData) => void;
  currentUser?: { name?: string; username?: string; email?: string; role?: string };
  onSubmitForApproval?: () => void;
  onSaveDraft?: () => void;
  onSelectTemplatePreset?: (templateTitle: string) => void;
  isSubmitting?: boolean;
}

export const LetterFormEditor = ({
  formData,
  onChange,
  currentUser,
  onSubmitForApproval,
  onSaveDraft,
  onSelectTemplatePreset,
  isSubmitting: externalIsSubmitting = false,
}: LetterFormEditorProps) => {
  const router = useRouter();
  const [internalSubmitting, setInternalSubmitting] = useState(false);
  const isSubmitting = externalIsSubmitting || internalSubmitting;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    onChange({
      ...formData,
      [name]: value,
    });
  };

  useEffect(() => {
    return () => {
      if (formData.attachmentUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(formData.attachmentUrl);
      }
    };
  }, [formData.attachmentUrl]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (formData.attachmentUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(formData.attachmentUrl);
      }
      const url = URL.createObjectURL(file);
      onChange({
        ...formData,
        attachmentUrl: url,
      });
    }
  };

  const handleRemoveImage = () => {
    if (formData.attachmentUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(formData.attachmentUrl);
    }
    onChange({
      ...formData,
      attachmentUrl: null,
    });
  };

  const submitToApi = async (status: "approved" | "draft") => {
    setInternalSubmitting(true);
    try {
      const adminName =
        currentUser?.name || currentUser?.username || currentUser?.email || "Admin";

      const payload = {
        title: formData.subject || "Surat Permohonan",
        letterNumber: formData.letterNumber,
        recipient: formData.recipient,
        subject: formData.subject || "Tanpa Perihal",
        body: formData.body,
        author: adminName,
        createdByRole: currentUser?.role?.toUpperCase() || "ADMIN",
        status: status.toUpperCase(),
      };

      const res = await fetch("/api/letters", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to save letter");
      }

      router.push("/admin/history");
      router.refresh();
    } catch (error: any) {
      console.error("Submission error:", error);
      alert(`Gagal menyimpan surat: ${error.message}`);
    } finally {
      setInternalSubmitting(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSubmitting) {
      if (onSubmitForApproval) {
        onSubmitForApproval();
      } else {
        submitToApi("approved");
      }
    }
  };

  const handleDraft = () => {
    if (!isSubmitting) {
      if (onSaveDraft) {
        onSaveDraft();
      } else {
        submitToApi("draft");
      }
    }
  };

  const isAdmin = currentUser?.role?.toLowerCase() === "admin";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-lg w-full print:hidden">
      {onSelectTemplatePreset && (
        <div className="flex flex-col gap-1.5 bg-stone-100 p-3 rounded-2xl border border-stone-200">
          <label className="font-serif text-xs font-semibold text-stone-700">
            Ganti Template Cepat (Isi Otomatis)
          </label>
          <select
            onChange={(e) => {
              if (e.target.value) {
                onSelectTemplatePreset(e.target.value);
              }
            }}
            value=""
            className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs bg-white text-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-900"
            disabled={isSubmitting}
          >
            <option value="" disabled>-- Pilih Preset Template --</option>
            <option value="Surat Undangan">Surat Undangan</option>
            <option value="Surat Tugas">Surat Tugas</option>
            <option value="Surat Keterangan">Surat Keterangan</option>
            <option value="Surat Keputusan">Surat Keputusan</option>
            <option value="Surat Pemberitahuan">Surat Pemberitahuan</option>
          </select>
        </div>
      )}

      <div className="flex flex-col gap-2 bg-stone-50 p-3.5 rounded-2xl border border-stone-300">
        <label className="font-serif text-xs font-semibold text-stone-900">
          Pilih Logo Kop Surat
        </label>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <span className="text-[11px] text-stone-600 font-medium">Logo Kiri</span>
            <select
              name="leftLogo"
              value={formData.leftLogo ?? "/logo_letris.png"}
              onChange={handleChange}
              disabled={isSubmitting}
              className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs bg-white text-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-900 disabled:opacity-50"
            >
              <option value="/logo_letris.png">SMK Letris Indonesia 2</option>
              <option value="/logo_letris_kesehatan.png">SMK Letris Kesehatan</option>
              <option value="">Tanpa Logo Kiri</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-[11px] text-stone-600 font-medium">Logo Kanan</span>
            <select
              name="rightLogo"
              value={formData.rightLogo ?? "/logo_banten.png"}
              onChange={handleChange}
              disabled={isSubmitting}
              className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs bg-white text-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-900 disabled:opacity-50"
            >
              <option value="/logo_banten.png">Provinsi Banten</option>
              <option value="/logo_tangsel.png">Kota Tangerang Selatan</option>
              <option value="">Tanpa Logo Kanan</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="font-serif text-sm font-semibold text-stone-900 flex items-center justify-between">
          <span>Data Pengirim / Unit Kerja</span>
          <span className="text-[10px] font-sans font-normal text-stone-500">Wajib diisi</span>
        </label>
        <input
          type="text"
          name="institutionName"
          value={formData.institutionName}
          onChange={handleChange}
          placeholder="e.g. Guru Mata Pelajaran Matematika"
          className="w-full px-4 py-2.5 rounded-2xl border border-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900 bg-white disabled:bg-stone-100"
          required
          disabled={isSubmitting}
        />
        <p className="text-[11px] text-stone-500">Isi dengan nama jabatan atau unit penanggung jawab surat.</p>
      </div>

      <div className="flex flex-col gap-1">
        <label className="font-serif text-sm font-semibold text-stone-900 flex items-center justify-between">
          <span>Usulan Nomor Surat</span>
          <span className="text-[10px] font-sans font-normal text-stone-500">Wajib diisi</span>
        </label>
        <input
          type="text"
          name="letterNumber"
          value={formData.letterNumber}
          onChange={handleChange}
          placeholder="e.g. 001/UND/SMK-2/2026"
          className="w-full px-4 py-2.5 rounded-2xl border border-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900 bg-white disabled:bg-stone-100"
          required
          disabled={isSubmitting}
        />
        <p className="text-[11px] text-stone-500">Format standar: [No]/[KODE]/SMK-2/[TAHUN]</p>
      </div>

      <div className="flex flex-col gap-1">
        <label className="font-serif text-sm font-semibold text-stone-900">
          Tanggal Surat
        </label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="w-full px-4 py-2.5 rounded-2xl border border-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900 bg-white disabled:bg-stone-100"
          required
          disabled={isSubmitting}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="font-serif text-sm font-semibold text-stone-900">
          Data Penerima
        </label>
        <input
          type="text"
          name="recipient"
          value={formData.recipient}
          onChange={handleChange}
          placeholder="e.g. Orang Tua / Wali Murid Kelas X"
          className="w-full px-4 py-2.5 rounded-2xl border border-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900 bg-white disabled:bg-stone-100"
          required
          disabled={isSubmitting}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="font-serif text-sm font-semibold text-stone-900">
          Isi Surat
        </label>
        <textarea
          name="body"
          rows={5}
          value={formData.body}
          onChange={handleChange}
          placeholder="Tuliskan rincian kegiatan atau permohonan surat di sini..."
          className="w-full px-4 py-3 rounded-2xl border border-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900 bg-white resize-none disabled:bg-stone-100"
          required
          disabled={isSubmitting}
        />
      </div>

      <div className="flex flex-col gap-2 bg-stone-50 p-3.5 rounded-2xl border border-dashed border-stone-400">
        <label className="font-serif text-sm font-semibold text-stone-900">
          Upload Lampiran / Stempel / Gambar
        </label>
        
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          disabled={isSubmitting}
          className="text-xs text-stone-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-stone-900 file:text-white hover:file:bg-stone-800 cursor-pointer disabled:opacity-50"
        />

        {formData.attachmentUrl && (
          <div className="flex items-center justify-between pt-2 border-t border-stone-200">
            <span className="text-xs text-emerald-700 font-medium">✓ Gambar berhasil diunggah</span>
            <button
              type="button"
              onClick={handleRemoveImage}
              disabled={isSubmitting}
              className="text-xs text-red-600 hover:text-red-800 font-medium underline disabled:opacity-50"
            >
              Hapus Gambar
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2.5 mt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 px-4 rounded-2xl bg-[#0A4D3C] border border-black text-white font-serif text-sm font-semibold hover:bg-[#07382c] transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>
            {isSubmitting
              ? "Memproses..."
              : isAdmin
              ? "Terbitkan Surat"
              : "Kirim untuk Persetujuan Admin"}
          </span>
          {!isSubmitting && <span>→</span>}
        </button>

        <button
          type="button"
          onClick={handleDraft}
          disabled={isSubmitting}
          className="w-full py-2.5 px-4 rounded-2xl bg-[#FDF8F5] border border-black text-black font-serif text-sm font-semibold hover:bg-stone-100 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Memproses..." : "Simpan Sebagai Draf"}
        </button>
      </div>
    </form>
  );
};