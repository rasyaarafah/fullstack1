"use client";

import React from "react";

export interface LetterFormData {
  institutionName: string; // Data Pengirim
  letterNumber: string;    // Nomor & Hal surat
  date: string;            // Tanggal Surat
  recipient: string;       // Data Penerima
  body: string;            // Isi Surat
}

interface LetterFormEditorProps {
  formData: LetterFormData;
  onChange: (updatedData: LetterFormData) => void;
  onSubmit?: () => void;
  onGeneratePdf?: () => void;
  onGenerateDocx?: () => void;
}

export const LetterFormEditor = ({
  formData,
  onChange,
  onSubmit,
  onGeneratePdf,
  onGenerateDocx,
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

  return (
    <div className="flex flex-col gap-4 max-w-lg w-full">
      {/* 1. Data Pengirim */}
      <div className="flex flex-col gap-1.5">
        <label className="font-serif text-sm font-semibold text-stone-900">
          Data Pengirim
        </label>
        <input
          type="text"
          name="institutionName"
          value={formData.institutionName}
          onChange={handleChange}
          placeholder="Enter..."
          className="w-full px-4 py-2.5 rounded-2xl border border-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900 bg-white"
        />
      </div>

      {/* 2. Nomor & Hal surat */}
      <div className="flex flex-col gap-1.5">
        <label className="font-serif text-sm font-semibold text-stone-900">
          Nomor & Hal surat
        </label>
        <input
          type="text"
          name="letterNumber"
          value={formData.letterNumber}
          onChange={handleChange}
          placeholder="Enter..."
          className="w-full px-4 py-2.5 rounded-2xl border border-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900 bg-white"
        />
      </div>

      {/* 3. Tanggal Surat */}
      <div className="flex flex-col gap-1.5">
        <label className="font-serif text-sm font-semibold text-stone-900">
          Tanggal Surat
        </label>
        <input
          type="text"
          name="date"
          value={formData.date}
          onChange={handleChange}
          placeholder="Enter..."
          className="w-full px-4 py-2.5 rounded-2xl border border-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900 bg-white"
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
          placeholder="Enter..."
          className="w-full px-4 py-2.5 rounded-2xl border border-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900 bg-white"
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
          placeholder="Enter..."
          className="w-full px-4 py-3 rounded-2xl border border-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900 bg-white resize-none"
        />
      </div>

      {/* Button Action Row */}
      <div className="flex flex-col gap-2.5 mt-2">
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onGeneratePdf}
            className="py-2.5 px-4 rounded-2xl bg-[#7CFF00] border border-black text-black font-semibold text-sm hover:brightness-95 transition-all shadow-sm"
          >
            Buat PDF
          </button>
          <button
            type="button"
            onClick={onGenerateDocx}
            className="py-2.5 px-4 rounded-2xl bg-[#00B2FF] border border-black text-white font-semibold text-sm hover:brightness-95 transition-all shadow-sm"
          >
            Buat DOCX
          </button>
        </div>

        <button
          type="button"
          onClick={onSubmit}
          className="w-full py-2.5 px-4 rounded-2xl bg-[#FDF8F5] border border-black text-black font-serif text-sm font-semibold hover:bg-stone-100 transition-colors shadow-sm"
        >
          Simpan
        </button>
      </div>
    </div>
  );
};