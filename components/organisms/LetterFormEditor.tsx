"use client";

import React from "react";

export interface LetterFormData {
  institutionName: string; // Data Pengirim
  letterNumber: string;    // Nomor & Hal surat (Optional/Auto-generated)
  date: string;            // Tanggal Surat
  recipient: string;       // Data Penerima
  body: string;            // Isi Surat
}

interface LetterFormEditorProps {
  formData: LetterFormData;
  onChange: (updatedData: LetterFormData) => void;
  onSubmitForApproval: () => void;
  onSaveDraft?: () => void;
}

export const LetterFormEditor = ({
  formData,
  onChange,
  onSubmitForApproval,
  onSaveDraft,
}: LetterFormEditorProps) => {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    onChange({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitForApproval();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-lg w-full">
      {/* 1. Data Pengirim */}
      <div className="flex flex-col gap-1.5">
        <label className="font-serif text-sm font-semibold text-stone-900">
          Data Pengirim / Unit Kerja
        </label>
        <input
          type="text"
          name="institutionName"
          value={formData.institutionName}
          onChange={handleChange}
          placeholder="e.g. Guru Mata Pelajaran Matematika"
          className="w-full px-4 py-2.5 rounded-2xl border border-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900 bg-white"
          required
        />
      </div>

      {/* 2. Nomor & Hal surat */}
      <div className="flex flex-col gap-1.5">
        <label className="font-serif text-sm font-semibold text-stone-900">
          Usulan Nomor / Hal Surat
        </label>
        <input
          type="text"
          name="letterNumber"
          value={formData.letterNumber}
          onChange={handleChange}
          placeholder="e.g. Undangan Rapat Orang Tua"
          className="w-full px-4 py-2.5 rounded-2xl border border-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900 bg-white"
          required
        />
      </div>

      {/* 3. Tanggal Surat */}
      <div className="flex flex-col gap-1.5">
        <label className="font-serif text-sm font-semibold text-stone-900">
          Tanggal Surat
        </label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="w-full px-4 py-2.5 rounded-2xl border border-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900 bg-white"
          required
        />
      </div>

      {/* 4. Data Penerima */}
      <div className="flex flex-col gap-1.5">
        <label className="font-serif text-sm font-semibold text-stone-900">
          Data Penerima
        </label>
        <input
          type="text"
          name="recipient"
          value={formData.recipient}
          onChange={handleChange}
          placeholder="e.g. Orang Tua / Wali Murid Kelas X"
          className="w-full px-4 py-2.5 rounded-2xl border border-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900 bg-white"
          required
        />
      </div>

      {/* 5. Isi Surat */}
      <div className="flex flex-col gap-1.5">
        <label className="font-serif text-sm font-semibold text-stone-900">
          Isi Surat
        </label>
        <textarea
          name="body"
          rows={5}
          value={formData.body}
          onChange={handleChange}
          placeholder="Tuliskan rincian kegiatan atau permohonan surat di sini..."
          className="w-full px-4 py-3 rounded-2xl border border-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900 bg-white resize-none"
          required
        />
      </div>

      {/* Button Action Row */}
      <div className="flex flex-col gap-2.5 mt-2">
        <button
          type="submit"
          className="w-full py-3 px-4 rounded-2xl bg-[#0A4D3C] border border-black text-white font-serif text-sm font-semibold hover:bg-[#07382c] transition-colors shadow-sm flex items-center justify-center gap-2"
        >
          <span>Kirim untuk Persetujuan Admin</span>
          <span>→</span>
        </button>

        {onSaveDraft && (
          <button
            type="button"
            onClick={onSaveDraft}
            className="w-full py-2.5 px-4 rounded-2xl bg-[#FDF8F5] border border-black text-black font-serif text-sm font-semibold hover:bg-stone-100 transition-colors shadow-sm"
          >
            Simpan Draf
          </button>
        )}
      </div>
    </form>
  );
};