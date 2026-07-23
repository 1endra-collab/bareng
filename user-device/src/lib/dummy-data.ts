export interface Laptop {
  id: string;
  nama: string;
  merk: string;
  kelas: string;
  lokasi: string;
  status: "tersedia" | "dipinjam";
  image: string;
  ram: string;
  cpu: string;
}

export const laptops: Laptop[] = [
  {
    id: "1",
    nama: "ASUS TUF F15",
    merk: "ASUS",
    kelas: "XI SIJA",
    lokasi: "Lab RPL",
    status: "tersedia",
    image: "/images/asus.jpg",
    ram: "16GB",
    cpu: "i5-12450H",
  },
  {
    id: "2",
    nama: "Lenovo ThinkPad E14",
    merk: "Lenovo",
    kelas: "XI RPL",
    lokasi: "Lab 1",
    status: "dipinjam",
    image: "/images/lenovo.jpg",
    ram: "8GB",
    cpu: "i5-1135G7",
  },
  {
    id: "3",
    nama: "HP Pavilion 14",
    merk: "HP",
    kelas: "XII SIJA",
    lokasi: "Lab AI",
    status: "tersedia",
    image: "/images/hp.jpg",
    ram: "8GB",
    cpu: "Ryzen 5 5500U",
  },
];

export interface Lab {
  id: string;
  nama: string;
  totalKomputer: number;
}

export const labs: Lab[] = [
  { id: "lab-1", nama: "Lab 1", totalKomputer: 20 },
  { id: "lab-2", nama: "Lab 2", totalKomputer: 20 },
  { id: "lab-ai", nama: "Lab AI", totalKomputer: 16 },
];

export interface KomputerSlot {
  id: string;
  nomor: number;
  status: "tersedia" | "dipinjam" | "rusak";
}

// dummy denah, nanti per lab beda-beda dari DB
export function getKomputerByLab(labId: string): KomputerSlot[] {
  const total = labs.find((l) => l.id === labId)?.totalKomputer ?? 20;

  return Array.from({ length: total }, (_, i) => ({
    id: `${labId}-pc-${i + 1}`,
    nomor: i + 1,
    status: i % 5 === 0 ? "dipinjam" : "tersedia",
  }));
}