"use client";

import React from "react";

export interface Template {
  id: string;
  title: string;
  defaultNumber?: string;
  defaultRecipient?: string;
  defaultBody?: string;
}

interface MiniPaperThumbnailProps {
  template: Template;
}

export function MiniPaperThumbnail({ template }: MiniPaperThumbnailProps) {
  const currentDate = new Date().toISOString().split("T")[0];

  return (
    <div className="w-full aspect-3/4 bg-stone-200/60 rounded-2xl border border-stone-300 overflow-hidden relative shadow-sm group-hover:shadow-md transition-all flex items-center justify-center p-2 select-none">
      <div className="w-[190%] h-[190%] scale-[0.52] shrink-0 pointer-events-none bg-white p-6 shadow-md border border-stone-200 text-[10px] font-serif leading-tight text-stone-900 flex flex-col justify-between origin-center">
        <div>
          <div className="relative border-b-2 border-double border-stone-900 pb-2 mb-3 text-center flex items-center justify-between">
            <img src="/logo_letris.png" alt="Logo Left" className="w-8 h-8 object-contain" />
            <div className="px-2">
              <p className="font-bold text-[8px] uppercase tracking-tighter">YAYASAN LEO SUTRISNO</p>
              <p className="font-bold text-[10px] uppercase">SMK LETRIS INDONESIA 2</p>
              <p className="text-[6px] font-sans text-stone-600">NPSN: 69894185 | NSS: 402286303080</p>
              <p className="text-[5px] font-sans text-blue-700 underline">www.smkletrisdua.sch.id</p>
            </div>
            <img src="/logo_banten.png" alt="Logo Right" className="w-8 h-8 object-contain" />
          </div>

          <div className="flex justify-between text-[8px] font-sans mb-3">
            <div>
              <p><span className="font-semibold">Nomor:</span> {template.defaultNumber || "-"}</p>
              <p><span className="font-semibold">Hal:</span> {template.title}</p>
            </div>
            <div className="text-right">
              <p>Tangsel, {currentDate}</p>
            </div>
          </div>

          <div className="text-[8px] font-sans mb-3">
            <p className="font-semibold">Kepada Yth.</p>
            <p>{template.defaultRecipient || "Penerima"}</p>
            <p className="text-stone-500">Di Tempat</p>
          </div>

          <div className="text-[7.5px] font-sans text-stone-700 leading-normal line-clamp-6 whitespace-pre-wrap">
            {template.defaultBody}
          </div>
        </div>

        <div className="flex justify-end pt-2 border-t border-stone-100 font-sans text-[7px]">
          <div className="text-center w-28 border border-dashed border-stone-300 p-1 rounded">
            <p className="text-stone-500">Mengetahui,</p>
            <p className="font-semibold">Kepala Sekolah / Admin</p>
            <div className="h-6"></div>
            <p className="font-bold underline">NIP. ....................</p>
          </div>
        </div>
      </div>
    </div>
  );
}