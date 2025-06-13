// components/scroll-to-top-button.tsx
"use client";

import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // Deteksi scroll pada window (yang akan sama dengan body/html)
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    // Tambahkan event listener ke window
    window.addEventListener("scroll", toggleVisibility);

    // Bersihkan event listener saat komponen di-unmount
    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []); // Dependensi tetap kosong

  const scrollToTop = () => {
    // Kembali ke window.scrollTo, yang akan menghormati scroll-behavior: smooth dari CSS global
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <Button
      className={`fixed bottom-20 right-4 z-10 rounded-full px-8 py-3
                 bg-gradient-to-r from-blue-600 to-purple-600 text-white
                 shadow-lg border border-gray-300 transition-opacity duration-300 p-3 ${
                   isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
                 }`}
      onClick={scrollToTop}
      size="icon"
    >
      <ArrowUp className="h-5 w-5 text-white" />
    </Button>
  );
}
