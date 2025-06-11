// components/configure-product.tsx
"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Minus, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { ArrowLeft } from "lucide-react"; // Import ArrowLeft icon

interface ConfigureProductProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export default function ConfigureProduct({
  product,
  isOpen,
  onClose,
}: ConfigureProductProps) {
  // Inisialisasi state dengan opsi pertama dari produk yang sedang dilihat
  const [selectedRam, setSelectedRam] = useState(product.ramOptions[0]);
  const [selectedSsd, setSelectedSsd] = useState(product.ssdOptions[0]);
  const [quantity, setQuantity] = useState(1);
  const [showForm, setShowForm] = useState(false); // State ini mengontrol tampilan form atau konfigurasi
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [deliveryOption, setDeliveryOption] = useState<string | null>(null); // State baru untuk opsi pengiriman: 'cod' atau 'delivery'
  const [contactNumber, setContactNumber] = useState(""); // State baru untuk nomor telepon opsional
  const [slideIn, setSlideIn] = useState(false);

  // Temukan harga berdasarkan kombinasi RAM dan SSD yang dipilih
  const getPrice = (): number => {
    const variant = product.variants.find(
      (v) => v.ram === selectedRam && v.ssd === selectedSsd
    );
    return variant ? variant.price : 0;
  };

  const totalPrice = getPrice() * quantity;

  // Efek untuk slide-in/out modal dan reset state
  useEffect(() => {
    if (isOpen) {
      // Reset pilihan dan kuantitas saat modal dibuka untuk produk baru
      setSelectedRam(product.ramOptions[0]);
      setSelectedSsd(product.ssdOptions[0]);
      setQuantity(1);
      setShowForm(false); // Pastikan form checkout disembunyikan saat modal dibuka
      setName(""); // Reset nama
      setAddress(""); // Reset alamat
      setDeliveryOption(null); // Reset opsi pengiriman
      setContactNumber(""); // Reset nomor kontak
      setTimeout(() => setSlideIn(true), 50);
    } else {
      setSlideIn(false);
    }
  }, [isOpen, product]);

  const handleCheckout = () => {
    setShowForm(true); // Menampilkan form pemesanan
  };

  // FUNGSI INI DITAMBAHKAN UNTUK KEMBALI KE TAMPILAN KONFIGURASI
  const handleBackToConfigure = () => {
    setShowForm(false); // Kembali ke tampilan konfigurasi produk
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      alert("Nama lengkap wajib diisi!");
      return;
    }

    // Validasi alamat: Hanya wajib jika opsi pengiriman adalah 'delivery'
    if (deliveryOption === "delivery" && !address.trim()) {
      alert(
        "Alamat wajib diisi untuk opsi pengiriman 'Antarkan Langsung ke Alamat Rumah'!"
      );
      return;
    }

    // Validasi pilihan pengiriman (tetap wajib)
    if (!deliveryOption) {
      alert("Pilih salah satu opsi pengiriman.");
      return;
    }

    // Format pesan WhatsApp
    const message = `
Halo, saya ingin memesan:

Nama Lengkap: ${name}
Alamat: ${
      address.trim() ||
      (deliveryOption === "cod"
        ? "COD di Universitas Siliwangi"
        : "[Alamat belum diisi]")
    }
Produk: ${product.name}
Spesifikasi: - RAM ${selectedRam}, - SSD ${selectedSsd}
Total Harga: Rp. ${formatPrice(getPrice())}

Metode Pengiriman: ${
      deliveryOption === "cod"
        ? "COD di Universitas Siliwangi"
        : "Kirim ke Alamat Rumah"
    }
${
  contactNumber.trim()
    ? `Nomor yang bisa dihubungi: ${contactNumber}`
    : "Nomor yang bisa dihubungi: [Tidak ada nomor lain]"
}

Terima kasih!
    `.trim();

    window.open(
      `https://wa.me/6281224086200?text=${encodeURIComponent(message)}`,
      "_blank"
    );

    // Reset form dan tutup modal
    setName("");
    setAddress("");
    setDeliveryOption(null); // Reset opsi pengiriman
    setContactNumber(""); // Reset nomor kontak
    setShowForm(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 bg-black/50 z-50 transition-opacity duration-300 ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      onClick={onClose} // Menutup modal saat klik di luar
    >
      <div
        className={`fixed bottom-0 left-0 right-0 bg-white rounded-t-xl max-h-[90vh] overflow-y-auto transition-transform duration-500 ease-out transform ${
          slideIn ? "translate-y-0" : "translate-y-full"
        }`}
        onClick={(e) => e.stopPropagation()} // Mencegah klik di dalam modal menutup modal
      >
        {/* Header Konfigurasi Produk */}
        <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
          <h2 className="text-lg font-bold ml-14">Konfigurasi Produk</h2>
          {showForm && ( // Tampilkan tombol kembali hanya jika form checkout aktif
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBackToConfigure}
              className="absolute left-4"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {showForm ? (
          /* Form Pemesanan */
          <form onSubmit={handleSubmitOrder} className="p-6 space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Lengkap <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Masukkan nama lengkap"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Alamat
                  {deliveryOption === "delivery" && (
                    <span className="text-red-500">*</span>
                  )}{" "}
                  {/* Tandai wajib hanya jika delivery */}
                </label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Masukkan alamat lengkap"
                  rows={3}
                  required={deliveryOption === "delivery"}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Isi alamat yaitu RT/RW, Kampung, Desa, Kecamatan, Kode Pos
                </p>
              </div>

              {/* Pilihan Pengiriman Paket */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Opsi Pengiriman <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-wrap gap-3">
                  <Button
                    type="button"
                    variant={deliveryOption === "cod" ? "default" : "outline"}
                    className={`rounded-lg px-4 py-2 transition-all duration-200 ${
                      deliveryOption === "cod"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300"
                    }`}
                    onClick={() => setDeliveryOption("cod")}
                  >
                    COD di Universitas Siliwangi
                  </Button>
                  <Button
                    type="button"
                    variant={
                      deliveryOption === "delivery" ? "default" : "outline"
                    }
                    className={`rounded-lg px-4 py-2 transition-all duration-200 ${
                      deliveryOption === "delivery"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300"
                    }`}
                    onClick={() => setDeliveryOption("delivery")}
                  >
                    Antarkan Langsung ke Alamat Rumah
                  </Button>
                </div>
              </div>

              {/* Input Nomor yang bisa dihubungi (Opsional) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nomor yang bisa dihubungi (Opsional)
                </label>
                <input
                  type="tel"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Contoh: 081234567890"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Nomor telepon selain nomor WhatsApp pemesan.
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Ringkasan Pesanan</h3>
                <p className="text-sm">Produk: {product.name}</p>
                <p className="text-sm">
                  Spesifikasi: RAM {selectedRam}, SSD {selectedSsd}
                </p>
                <p className="text-sm">Jumlah: {quantity}</p>
                <p className="text-sm">
                  Opsi Pengiriman:{" "}
                  {deliveryOption === "cod"
                    ? "COD di Universitas Siliwangi"
                    : deliveryOption === "delivery"
                    ? "Antar Alamat Rumah"
                    : "Belum Dipilih"}
                </p>
                {contactNumber.trim() && (
                  <p className="text-sm">Nomor Kontak: {contactNumber}</p>
                )}
                <p className="font-bold mt-2">
                  Total: Rp {formatPrice(totalPrice)}
                </p>
              </div>
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
              >
                Lanjutkan ke WhatsApp
              </Button>
            </div>
          </form>
        ) : (
          /* Konfigurasi Produk - Bagian utama dengan penyesuaian layout */
          <div className="p-6 space-y-6">
            {/* Area Gambar Produk dan Harga Sebelahnya */}
            <div className="flex gap-4 items-start">
              <div className="w-32 h-32 flex-shrink-0 border rounded-lg overflow-hidden">
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  width={128}
                  height={128}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 pt-2">
                <p className="text-gray-600 text-sm mb-1">Harga Awal</p>
                <p className="text-xl font-bold text-blue-600">
                  Rp {product.priceRange}
                </p>
              </div>
            </div>

            {/* RAM Selection */}
            <div className="">
              <h3 className="font-bold text-lg mb-4">RAM</h3>
              <div className="flex flex-wrap gap-3">
                {product.ramOptions.map((ram) => (
                  <Button
                    key={ram}
                    variant={selectedRam === ram ? "default" : "outline"}
                    className={`rounded-lg px-4 py-2 transition-all duration-200 ${
                      selectedRam === ram
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300"
                    }`}
                    onClick={() => setSelectedRam(ram)}
                  >
                    {ram}
                  </Button>
                ))}
              </div>
            </div>

            {/* SSD Selection */}
            <div className="">
              <h3 className="font-bold text-lg mb-4">SSD</h3>
              <div className="flex flex-wrap gap-3">
                {product.ssdOptions.map((ssd) => (
                  <Button
                    key={ssd}
                    variant={selectedSsd === ssd ? "default" : "outline"}
                    className={`rounded-lg px-4 py-2 transition-all duration-200 ${
                      selectedSsd === ssd
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300"
                    }`}
                    onClick={() => setSelectedSsd(ssd)}
                  >
                    {ssd}
                  </Button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="flex justify-end p-0">
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full w-7 h-7"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="w-6 text-center text-sm font-medium">
                  {quantity}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full w-7 h-7"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            </div>

            {/* Price */}
            <div className="pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <p className="text-gray-600 text-sm">Total</p>
                  <p className="text-2xl font-bold">
                    Rp {formatPrice(totalPrice)}
                  </p>
                </div>
                <Button
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
                  onClick={handleCheckout}
                >
                  Checkout
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
