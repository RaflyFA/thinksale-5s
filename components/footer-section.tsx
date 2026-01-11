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

export default function FooterSection() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">T</span>
              </div>
              <span className="text-2xl font-bold">ThinkSale</span>
            </div>

            <p className="text-gray-400 mb-6 leading-relaxed">
              Toko laptop terpercaya dengan koleksi lengkap untuk kebutuhan mahasiswa dan profesional. Kami berkomitmen
              memberikan produk berkualitas dengan harga terbaik.
            </p>

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

         
          <div>
            <h3 className="text-lg font-semibold mb-6">Hubungi Kami</h3>
            <div className="space-y-4">
          
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-blue-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-400 leading-relaxed">
                    Jl. Teknologi Raya No. 123
                    <br />
                    Gedung ThinkSale Center
                    <br />
                    Jakarta Selatan, 12345
                  </p>
                </div>
              </div>

            
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-blue-400 flex-shrink-0" />
                <div>
                  <p className="text-gray-400">+62 812-3456-7890</p>
                  <p className="text-gray-500 text-sm">WhatsApp & Telepon</p>
                </div>
              </div>

            
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-blue-400 flex-shrink-0" />
                <div>
                  <p className="text-gray-400">info@thinksale.com</p>
                  <p className="text-gray-500 text-sm">Email Support</p>
                </div>
              </div>

              
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

  
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <p className="text-gray-400 text-sm">© {currentYear} ThinkSale. Semua hak dilindungi undang-undang.</p>
              <p className="text-gray-500 text-xs mt-1">Terdaftar sebagai CV. ThinkSale Indonesia</p>
            </div>

            <div className="flex flex-wrap justify-center md:justify-end space-x-6">
              {[
                { href: "/privacy-policy", label: "Kebijakan Privasi" },
                { href: "/terms-of-service", label: "Syarat & Ketentuan" },
                { href: "/cookie-policy", label: "Kebijakan Cookie" },
                { href: "/sitemap", label: "Peta Situs" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-gray-400 hover:text-white text-sm transition-colors duration-200"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
