import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("id-ID").format(price);
}

export function formatWhatsAppMessage(
  name: string,
  address: string,
  product: string,
  specs: string,
  price: string
): string {
  return `
Halo, saya ingin memesan:

Nama Lengkap: ${name}
Alamat: ${address || "[Belum diisi]"}
Produk: ${product}
Spesifikasi: ${specs}
Harga: Rp. ${price}

Metode Pengiriman:
[ ] COD di Universitas Siliwangi
[ ] Kirim ke alamat
ketik pilihan disini!!!

Terima kasih!
  `.trim();
}
