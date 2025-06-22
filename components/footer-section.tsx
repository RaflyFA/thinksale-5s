/**
 * Footer Section Component
 *
 * Komponen footer yang komprehensif dengan:
 * - Informasi perusahaan
 * - Tautan navigasi
 * - Informasi kontak
 * - Social media links
 * - Newsletter subscription
 * - Legal links
 *
 * @author ThinkSale Development Team
 * @version 1.0.0
 */

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Facebook, Instagram, Twitter, Youtube, MapPin, Phone, Mail, Clock } from "lucide-react"
import { useSettings } from "@/lib/providers/settings-provider"
import BrandLogo from "@/components/ui/brand-logo"

export default function FooterSection() {
  const currentYear = new Date().getFullYear()
  const { settings, loading } = useSettings()

  // Use settings data or fallback to defaults
  const storeName = settings?.general?.store_name || "ThinkSale"
  const storeDescription = settings?.general?.store_description || "Toko laptop terpercaya dengan koleksi lengkap untuk kebutuhan mahasiswa dan profesional. Kami berkomitmen memberikan produk berkualitas dengan harga terbaik."
  const contactEmail = settings?.general?.contact_email || "info@thinksale.com"
  const contactPhone = settings?.general?.contact_phone || "+62 812-3456-7890"

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Information */}
          <div className="lg:col-span-1">
            <div className="mb-6">
              <BrandLogo size="lg" showText={true} className="text-white" textClassName="text-white" />
            </div>

            <p className="text-gray-400 mb-6 leading-relaxed">
              {storeDescription}
            </p>

            {/* Social Media Links */}
            <div className="flex space-x-4">
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-400 hover:text-white hover:bg-blue-600 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-400 hover:text-white hover:bg-pink-600 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-400 hover:text-white hover:bg-blue-400 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-400 hover:text-white hover:bg-red-600 transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Tautan Cepat</h3>
            <ul className="space-y-3">
              {[
                { href: "/", label: "Beranda" },
                { href: "/products", label: "Semua Produk" },
                { href: "/categories/thinkpad", label: "ThinkPad" },
                { href: "/categories/dell", label: "Dell" },
                { href: "/deals", label: "Penawaran Spesial" },
                { href: "/new-arrivals", label: "Produk Terbaru" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center group"
                  >
                    <span className="group-hover:translate-x-1 transition-transform duration-200">{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Layanan Pelanggan</h3>
            <ul className="space-y-3">
              {[
                { href: "/help", label: "Pusat Bantuan" },
                { href: "/shipping-info", label: "Informasi Pengiriman" },
                { href: "/returns", label: "Kebijakan Pengembalian" },
                { href: "/warranty", label: "Garansi Produk" },
                { href: "/payment-methods", label: "Metode Pembayaran" },
                { href: "/track-order", label: "Lacak Pesanan" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center group"
                  >
                    <span className="group-hover:translate-x-1 transition-transform duration-200">{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Hubungi Kami</h3>
            <div className="space-y-4">
              {/* Address */}
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-blue-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-400 leading-relaxed">
                    Jl. Teknologi Raya No. 123
                    <br />
                    Gedung {storeName} Center
                    <br />
                    Jakarta Selatan, 12345
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-blue-400 flex-shrink-0" />
                <div>
                  <p className="text-gray-400">{contactPhone}</p>
                  <p className="text-gray-500 text-sm">WhatsApp & Telepon</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-blue-400 flex-shrink-0" />
                <div>
                  <p className="text-gray-400">{contactEmail}</p>
                  <p className="text-gray-500 text-sm">Email Support</p>
                </div>
              </div>

              {/* Business Hours */}
              <div className="flex items-start space-x-3">
                <Clock className="h-5 w-5 text-blue-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-400">
                    Senin - Jumat: 09:00 - 18:00
                    <br />
                    Sabtu: 09:00 - 15:00
                    <br />
                    Minggu: Tutup
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-xl font-semibold mb-4">Berlangganan Newsletter Kami</h3>
            <p className="text-gray-400 mb-6">
              Dapatkan informasi terbaru tentang produk, penawaran khusus, dan tips teknologi
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Masukkan alamat email Anda"
                className="flex-1 bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500"
              />
              <Button className="bg-blue-600 hover:bg-blue-700 px-8">Berlangganan</Button>
            </div>
            <p className="text-xs text-gray-500 mt-3">Dengan berlangganan, Anda menyetujui kebijakan privasi kami</p>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {currentYear} {storeName}. Semua hak dilindungi.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">
                Kebijakan Privasi
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">
                Syarat & Ketentuan
              </Link>
              <Link href="/cookies" className="text-gray-400 hover:text-white text-sm transition-colors">
                Kebijakan Cookie
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
