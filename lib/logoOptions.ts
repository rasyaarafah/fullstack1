// Single source of truth for Kop Surat logo choices.
// Add a new logo by adding one line here — every form and preview
// that imports from this file picks it up automatically.

export interface LogoOption {
  value: string;
  label: string;
}

export const LEFT_LOGO_OPTIONS: LogoOption[] = [
  { value: "/logo_letris.png", label: "SMK Letris Indonesia 2" },
  { value: "/logo_letris_kesehatan.png", label: "SMK Letris Kesehatan" },
  { value: "", label: "Tanpa Logo Kiri" },
];

export const RIGHT_LOGO_OPTIONS: LogoOption[] = [
  { value: "/logo_banten.png", label: "Provinsi Banten" },
  { value: "/logo_tangsel.png", label: "Kota Tangerang Selatan" },
  { value: "", label: "Tanpa Logo Kanan" },
];

export const DEFAULT_LEFT_LOGO = LEFT_LOGO_OPTIONS[0].value;
export const DEFAULT_RIGHT_LOGO = RIGHT_LOGO_OPTIONS[0].value;