// components/product/product-configuration.tsx
"use client";

import { useState, useEffect, useRef } from "react"; // Tambahkan useRef dan useEffect
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X } from "lucide-react";
import type { Product } from "@/lib/types";
import { useCart } from "@/lib/cart/cart-context";
import { useAuth } from "@/lib/auth/auth-context";
import { cn } from "@/lib/utils/cn";

interface ProductConfigurationProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductConfiguration({
  product,
  isOpen,
  onClose,
}: ProductConfigurationProps) {
  const [selectedRam, setSelectedRam] = useState(product.ramOptions[0]);
  const [selectedSsd, setSelectedSsd] = useState(product.ssdOptions[0]);
  const [isProcessing, setIsProcessing] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null); // Ref untuk modal content
  const overlayRef = useRef<HTMLDivElement>(null); // Ref untuk overlay

  const { addItem } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  // Find the price for selected configuration
  const selectedVariant = product.variants.find(
    (variant) => variant.ram === selectedRam && variant.ssd === selectedSsd
  );
  const currentPrice = selectedVariant?.price || 0;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  // --- LOGIKA UTAMA PERBAIKAN ---

  // Efek untuk mengontrol overflow body saat modal terbuka/tertutup
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"; // Mencegah scroll body saat modal terbuka
    } else {
      document.body.style.overflow = ""; // Mengembalikan scroll body saat modal tertutup
    }
    return () => {
      document.body.style.overflow = ""; // Pastikan dikembalikan saat komponen unmount
    };
  }, [isOpen]);

  // Efek untuk menutup modal saat klik di luar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Pastikan klik di luar konten modal, bukan di overlay itu sendiri jika overlay berfungsi sebagai target klik
      // Serta pastikan modal memang sedang terbuka
      if (
        isOpen &&
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    const currentOverlayRef = overlayRef.current;
    if (currentOverlayRef) {
      // Tambahkan listener ke overlay
      currentOverlayRef.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      // Bersihkan listener saat unmount atau isOpen berubah
      if (currentOverlayRef) {
        currentOverlayRef.removeEventListener("mousedown", handleClickOutside);
      }
    };
  }, [isOpen, onClose]);

  // Efek untuk menutup modal saat menekan tombol ESC
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  const handleAddToCart = () => {
    if (!user) {
      router.push("/login?redirect=/keranjang"); // Tetap arahkan ke login jika belum login
      onClose(); // Tutup modal jika dialihkan ke login
      return;
    }

    setIsProcessing(true);
    addItem({
      product,
      ram: selectedRam,
      ssd: selectedSsd,
      price: currentPrice,
    });

    // Setelah menambah ke keranjang, *cukup tutup modal*.
    // Jangan langsung redirect kecuali ada kebutuhan khusus.
    setTimeout(() => {
      setIsProcessing(false);
      onClose(); // Tutup modal setelah selesai proses
      // Opsional: Tampilkan notifikasi "Produk berhasil ditambahkan!" di halaman detail produk.
      // Jika Anda tetap ingin redirect ke keranjang setelah menambah, uncomment baris bawah:
      // router.push("/keranjang");
    }, 1000); // Penundaan untuk feedback "Menambah..."
  };

  const handleCheckout = () => {
    if (!user) {
      router.push("/login?redirect=/keranjang"); // Tetap arahkan ke login jika belum login
      onClose(); // Tutup modal jika dialihkan ke login
      return;
    }

    setIsProcessing(true);
    addItem({
      product,
      ram: selectedRam,
      ssd: selectedSsd,
      price: currentPrice,
    });

    // Setelah menambah dan checkout, *baru redirect ke keranjang*.
    setTimeout(() => {
      setIsProcessing(false);
      onClose(); // Tutup modal sebelum redirect
      router.push("/keranjang"); // Langsung redirect ke keranjang
    }, 500); // Penundaan singkat untuk animasi atau feedback
  };

  // Kita akan selalu merender div overlay, tapi mengatur opacity dan pointer-events-nya
  // agar transisinya halus.
  // Properti `translate-y-full` di awal, dan `translate-y-0` saat `isOpen`.

  return (
    <div
      ref={overlayRef} // Pasang ref ke overlay
      className={cn(
        "fixed inset-0 z-[999] flex items-end justify-center",
        "bg-black/50", // Warna backdrop
        "transition-opacity duration-300", // Transisi untuk opacity
        isOpen
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none" // Kontrol opacity & interaksi
      )}
    >
      <div
        ref={modalRef} // Pasang ref ke konten modal
        className={cn(
          "bg-white w-full max-w-2xl rounded-t-2xl shadow-xl ", // Styling dasar
          "transform transition-transform duration-300 ease-out", // Transisi slide-up/down
          isOpen ? "translate-y-0" : "translate-y-full", // Efek slide
          "max-h-[90vh] overflow-y-auto" // Memastikan modal bisa discroll jika kontennya panjang
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-configuration-title"
        onClick={(e) => e.stopPropagation()} // Stop event propagation to prevent clicking through the modal to the background
      >
        <Card className="border-0 rounded-t-2xl ">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle
              id="product-configuration-title"
              className="text-xl font-bold"
            >
              Konfigurasi Produk
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              aria-label="Tutup konfigurasi"
            >
              <X className="h-5 w-5" />
            </Button>
          </CardHeader>

          <CardContent className="space-y-6 ">
            {/* Product Info */}
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 relative bg-gray-50 rounded-lg overflow-hidden">
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{product.name}</h3>
                <p className="text-gray-600 text-sm">{product.processor}</p>
                <p className="text-xl font-bold text-blue-600 mt-2">
                  {formatPrice(currentPrice)}
                </p>
              </div>
            </div>

            {/* RAM Selection */}
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">RAM</h4>
              <div className="flex flex-wrap gap-3">
                {product.ramOptions.map((ram) => (
                  <Button
                    key={ram}
                    variant={selectedRam === ram ? "default" : "outline"}
                    onClick={() => setSelectedRam(ram)}
                    className={cn(
                      "px-4 py-0 rounded-lg transition-all duration-200",
                      selectedRam === ram
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                        : "hover:from-blue-700 hover:to-purple-700"
                    )}
                  >
                    {ram}
                  </Button>
                ))}
              </div>
            </div>

            {/* SSD Selection */}
            <div className="space-y-3 mb-6">
              <h4 className="font-semibold text-gray-900">SSD</h4>
              <div className="flex flex-wrap gap-3">
                {product.ssdOptions.map((ssd) => (
                  <Button
                    key={ssd}
                    variant={selectedSsd === ssd ? "default" : "outline"}
                    onClick={() => setSelectedSsd(ssd)}
                    className={cn(
                      "px-4 py-0 rounded-lg transition-all duration-200 ",
                      selectedSsd === ssd
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                        : "hover:from-blue-700 hover:to-purple-700"
                    )}
                  >
                    {ssd}
                  </Button>
                ))}
              </div>
            </div>

            {/* Total and Actions */}
            <div className="flex items-center justify-between pt-6 pb-6 border-t">
              <div>
                <p className="text-sm text-gray-600">Total Harga</p>
                <p className="text-2xl font-bold text-blue-600">
                  {formatPrice(currentPrice)}
                </p>
              </div>

              <div className="flex gap-3">
                
                <Button
                  onClick={handleCheckout}
                  disabled={isProcessing}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold"
                >
                  Checkout
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
