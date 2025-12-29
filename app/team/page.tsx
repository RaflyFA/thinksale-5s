"use client"

import Image from "next/image"
import Link from "next/link"
import { Github, Linkedin, Instagram, MessageCircle, Code2, Zap, ExternalLink, ArrowLeft } from "lucide-react"
import { SiReact, SiNextdotjs, SiTypescript, SiTailwindcss, SiNodedotjs, SiFigma } from "react-icons/si";
import PageLayout from "@/components/layout/page-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import SectionHeader from "@/components/ui/section-header"
import { cn } from "@/lib/utils/cn"

const developers = [
  {
    id: 1,
    name: "Rafly Fahusnul Akbar",
    position: "Frontend & UI Designer",
    jabatan: "Mahasiswa Sistem Informasi",
    photo: "/rafly.jpg",
    bio:
      "Menggarap desain UI/UX ThinkSale agar konsisten dan modern, sekaligus mengimplementasikan antarmuka frontend yang cepat, ringan, dan responsif.",
    social: {
      github: "https://github.com/RaflyFA",
      linkedin: "https://www.linkedin.com/in/rafly-fahusnul-akbar/",
      instagram: "https://www.instagram.com/rfl.yfa/",
      whatsapp: "https://wa.me/6281224086200",
      portfolio: "https://portfolioraflyfa.vercel.app/",
    },
  },
  {
    id: 2,
    name: "Dimas Setiawan",
    position: "Frontend Developer",
    jabatan: "Mahasiswa Informatika",
    photo: "/dimas.png",
    bio:
      "Fokus memastikan komponen dan alur frontend berjalan mulus, terstruktur, dan mudah dirawat — dari state hingga performa rendering.",
    social: {
      github: "https://github.com/Dimas-es",
      linkedin: "https://linkedin.com",
      instagram: "https://www.instagram.com/dimasadjy/",
      whatsapp: "https://wa.me/6281224086200",
      portfolio: "https://portfolio.example.com/dimas",
    },
  },
]

const techStack = [
  { name: "TypeScript", icon: SiTypescript, color: "#3178c6" },
  { name: "React", icon: SiReact, color: "#61dafb" },
  { name: "Next.js", icon: SiNextdotjs, color: "#000000" },
  { name: "Tailwind CSS", icon: SiTailwindcss, color: "#06b6d4" },
  { name: "Node.js", icon: SiNodedotjs, color: "#339933" },
  { name: "Figma", icon: SiFigma, color: "#a259ff" },
]

export default function TeamPage() {
  return (
    <PageLayout className="bg-white">
      {/* Back Header under Navbar */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-lg font-semibold text-gray-900">Tim Developer</h1>
          </div>
        </div>
      </div>
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 py-16 md:py-24">
        <div className="text-center space-y-6 mb-16">
          <div className="inline-block">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200">
              <Code2 className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-600">Meet The Creators</span>
            </span>
          </div>

          <div className="flex flex-col items-center justify-center gap-4">
            <Image src="/logo.png" alt="ThinkSale Logo" width={160} height={160} className="w-96 h-44 object-contain" />
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900">ThinkSale</h1>
          </div>

          <h3 className="text-xl md:text-xl lg:text-xl font-bold text-gray-900 leading-tight">
            Dibuat dengan <span>🍵 & 💸</span>
          </h3>

          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            ThinkSale lahir dari visi untuk menyediakan solusi belanja laptop bekas yang terpercaya, aman, dan mudah diakses. 
            Platform ini dikembangkan oleh tim developer muda yang berdedikasi untuk memberikan pengalaman terbaik bagi setiap pengguna.
          </p>

          <div className="pt-4 flex flex-wrap gap-3 justify-center">
            <div className="px-4 py-2 rounded-lg bg-blue-50 border border-blue-100">
              <p className="text-sm text-gray-700">
                <span className="font-semibold text-blue-600">Misi:</span> Terpercaya & Transparan
              </p>
            </div>
            <div className="px-4 py-2 rounded-lg bg-purple-50 border border-purple-100">
              <p className="text-sm text-gray-700">
                <span className="font-semibold text-purple-600">Visi:</span> Akses Laptop Berkualitas
              </p>
            </div>
          </div>
        </div>

        {/* Developer Cards Section */}
        <div className="mb-20">
          <SectionHeader
            title="Tim Developer"
            description="Orang-orang hebat developer dan pencetus ide di balik ThinkSale"
            align="center"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            {developers.map((dev) => (
              <Card
                key={dev.id}
                className={cn(
                  "overflow-hidden group hover:shadow-xl transition-all duration-300",
                  "border-0 bg-gradient-to-br from-white via-gray-50 to-gray-100"
                )}
              >
                <CardContent className="p-0">
                  <div className="relative overflow-hidden bg-gradient-to-b from-blue-100 to-purple-100 aspect-square">
                    <Image
                      src={dev.photo}
                      alt={dev.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">{dev.name}</h3>
                      <p className="text-sm font-semibold text-blue-600 mt-1">{dev.position}</p>
                      <p className="text-xs text-gray-500 mt-1">{dev.jabatan}</p>
                    </div>

                    <p className="text-sm text-gray-600 leading-relaxed">{dev.bio}</p>

                    {/* Social Links */}
                    <div className="flex gap-3 pt-4 border-t border-gray-200">
                      <a
                        href={dev.social.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg bg-gray-100 hover:bg-gray-900 hover:text-white text-gray-900 transition-all duration-200"
                        aria-label="GitHub"
                      >
                        <Github className="h-5 w-5" />
                      </a>
                      <a
                        href={dev.social.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg bg-gray-100 hover:bg-blue-600 hover:text-white text-gray-900 transition-all duration-200"
                        aria-label="LinkedIn"
                      >
                        <Linkedin className="h-5 w-5" />
                      </a>
                      <a
                        href={dev.social.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg bg-gray-100 hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 hover:text-white text-gray-900 transition-all duration-200"
                        aria-label="Instagram"
                      >
                        <Instagram className="h-5 w-5" />
                      </a>
                      <a
                        href={dev.social.whatsapp}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg bg-gray-100 hover:bg-green-600 hover:text-white text-gray-900 transition-all duration-200"
                        aria-label="WhatsApp"
                      >
                        <MessageCircle className="h-5 w-5" />
                      </a>
                      {dev.social.portfolio && (
                        <a
                          href={dev.social.portfolio}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg bg-gray-100 hover:bg-gray-900 hover:text-white text-gray-900 transition-all duration-200"
                          aria-label="Portfolio"
                        >
                          <ExternalLink className="h-5 w-5" />
                        </a>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Tech Stack Section */}
        <div className="mb-12">
          <SectionHeader
            title="Tech Stack"
            description="Tools dan teknologi yang kami gunakan untuk membangun ThinkSale"
            align="center"
          />

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-12">
            {techStack.map((tech) => (
              <div
                key={tech.name}
                className={cn(
                  "p-6 rounded-xl border-2 border-gray-200 bg-white text-center group cursor-pointer",
                  "transition-all duration-300 hover:shadow-lg hover:translate-y-[-4px]"
                )}
                onMouseEnter={(e) => {
                  const div = e.currentTarget;
                  div.style.borderColor = tech.color;
                  const icon = div.querySelector(".tech-icon") as HTMLElement;
                  const text = div.querySelector(".tech-text") as HTMLElement;
                  if (icon) icon.style.color = tech.color;
                  if (text) text.style.color = tech.color;
                }}
                onMouseLeave={(e) => {
                  const div = e.currentTarget;
                  div.style.borderColor = "rgb(229, 231, 235)";
                  const icon = div.querySelector(".tech-icon") as HTMLElement;
                  const text = div.querySelector(".tech-text") as HTMLElement;
                  if (icon) icon.style.color = "rgb(31, 41, 55)";
                  if (text) text.style.color = "rgb(17, 24, 39)";
                }}
              >
                <div className="tech-icon text-4xl mb-3 flex justify-center text-gray-800 transition-colors duration-300">
                  {tech.icon && <tech.icon />}
                </div>
                <p className="tech-text text-sm font-semibold text-gray-900 transition-colors duration-300">
                  {tech.name}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* About Website Section */}
        <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 rounded-2xl p-8 md:p-12 border border-blue-100 mb-12">
          <div className="space-y-4">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Zap className="h-7 w-7 text-blue-600" />
              Tentang ThinkSale
            </h2>
            <p className="text-gray-700 leading-relaxed text-lg">
              ThinkSale adalah platform e-commerce yang berfokus pada penjualan laptop bekas berkualitas tinggi. 
              Kami memahami bahwa banyak orang membutuhkan laptop yang powerful dengan harga terjangkau. Oleh karena itu, 
              kami menghadirkan solusi tepat dengan menyediakan berbagai pilihan laptop bekas dari brand ternama seperti Lenovo ThinkPad dan Dell.
            </p>
            <p className="text-gray-700 leading-relaxed text-lg">
              Setiap produk yang kami jual telah melalui proses kurasi ketat untuk memastikan kualitas dan keaslian. 
              Kami berkomitmen untuk memberikan pengalaman berbelanja yang transparan, aman, dan memuaskan bagi setiap pelanggan kami.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center py-8">
          <p className="text-gray-600 mb-6">
            Punya pertanyaan atau ingin berkolaborasi? Hubungi kami!
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button
              onClick={() =>
                window.open(
                  "https://wa.me/6281224086200?text=Halo%2C%20saya%20tertarik%20dengan%20ThinkSale",
                  "_blank"
                )
              }
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-semibold"
            >
              Hubungi Kami
            </Button>
            <Button
              variant="outline"
              onClick={() => (window.location.href = "/")}
              className="px-8 py-3 rounded-xl border-2 border-gray-300 hover:border-blue-500 hover:text-blue-600"
            >
              Kembali ke Beranda
            </Button>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
