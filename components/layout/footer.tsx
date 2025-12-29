/**
 * Footer Component
 *
 * Komponen footer yang konsisten untuk seluruh aplikasi
 * Mencakup informasi perusahaan, links, dan kontak
 *
 * @author ThinkSale Development Team
 * @version 1.0.0
 */

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Phone,
  Mail,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface FooterProps {
  className?: string;
}

export default function Footer({ className }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { href: "/", label: "Beranda" },
    { href: "/produk", label: "Semua Produk" },
    { href: "/team", label: "Tim Developer" },
  ];

  const customerServiceLinks = [
    { href: "/help", label: "Pusat Bantuan" },
    { href: "/shipping-info", label: "Informasi Pengiriman" },
  ];



  return (
    <footer className={cn("bg-gray-900 text-white", className)}>
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Information */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-6">
              <img src="/logo.png" alt="ThinkSale Logo" className="w-12" />
              <span className="text-2xl font-bold">ThinkSale</span>
            </div>

            <p className="text-gray-400 mb-6 leading-relaxed">
              Toko laptop terpercaya dengan koleksi lengkap untuk kebutuhan
              mahasiswa dan profesional. Kami berkomitmen memberikan produk
              berkualitas dengan harga terbaik.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Tautan Cepat</h3>
            <ul className="space-y-1">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center group"
                  >
                    <span className=" transition-transform duration-200">
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Layanan Pelanggan</h3>
            <ul className="space-y-1">
              {customerServiceLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center group"
                  >
                    <span className="transition-transform duration-200">
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Hubungi Kami</h3>
            <div className="space-y-4">
              {/* Phone */}
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-blue-400 flex-shrink-0" />
                <div>
                  <p className="text-gray-400">+62 812-2408-6200</p>
                  <p className="text-gray-500 text-sm">WhatsApp & Telepon</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-blue-400 flex-shrink-0" />
                <div>
                  <p className="text-gray-400">info@thinksale.com</p>
                  <p className="text-gray-500 text-sm">Email Support</p>
                </div>
              </div>

              {/* Business Hours */}
              <div className="flex items-start space-x-3">
                <Clock className="h-5 w-5 text-blue-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-400">
                    Senin - Jumat: 08:00 - 21:00
                    <br />
                    Sabtu: 08:00 - 19:00
                    <br />
                    Minggu: 09:00 - 15:00
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <p className="text-gray-400 text-sm">
                © {currentYear} ThinkSale. Semua hak dilindungi undang-undang.
              </p>
              <p className="text-gray-500 text-xs mt-1">
                Terdaftar sebagai CV. ThinkSale Indonesia
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
