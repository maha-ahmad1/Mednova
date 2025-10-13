import Link from "next/link"
import { Mail, Phone, MapPin, ChevronLeft, Linkedin, Facebook, Twitter, Instagram } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-[#32A88D] text-white" dir="rtl">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info - Right side */}
          <div className="space-y-4">
            <div className="flex flex-col items-start">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center">
                  <span className="text-teal-600 font-bold">M</span>
                </div>
              </div>
              <span className="text-sm font-semibold">MEDOVA</span>
            </div>
            <p className="text-sm leading-relaxed">
              منصة صحية متطورة تجمع بكفاءة في المنصة بين الطبيب والمريض والخدمات الطبية والخدمات الدوائية المتميزة والتي
              تهدف إلى الاستشارات الطبية الفورية والمتابعة الصحية الدائمة، لتقديم تجربة صحية متكاملة ومستقبلية في
              متناولك.
            </p>
            <div className="flex gap-3">
              <Link href="#" className="hover:opacity-80 transition-opacity">
                <Linkedin className="h-5 w-5" />
              </Link>
              <Link href="#" className="hover:opacity-80 transition-opacity">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="hover:opacity-80 transition-opacity">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="hover:opacity-80 transition-opacity">
                <Instagram className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links Column 1 */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">روابط سريعة</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="flex items-center gap-2 text-sm hover:opacity-80 transition-opacity">
                  <ChevronLeft className="h-4 w-4" />
                  الرئيسية
                </Link>
              </li>
              <li>
                <Link href="#" className="flex items-center gap-2 text-sm hover:opacity-80 transition-opacity">
                  <ChevronLeft className="h-4 w-4" />
                  خدماتنا
                </Link>
              </li>
              <li>
                <Link href="#" className="flex items-center gap-2 text-sm hover:opacity-80 transition-opacity">
                  <ChevronLeft className="h-4 w-4" />
                  المزايا الأساسية
                </Link>
              </li>
              <li>
                <Link href="#" className="flex items-center gap-2 text-sm hover:opacity-80 transition-opacity">
                  <ChevronLeft className="h-4 w-4" />
                  شهادة مستخدمينا
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links Column 2 */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">تدوالنا</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="flex items-center gap-2 text-sm hover:opacity-80 transition-opacity">
                  <ChevronLeft className="h-4 w-4" />
                  استشارات فورية
                </Link>
              </li>
              <li>
                <Link href="#" className="flex items-center gap-2 text-sm hover:opacity-80 transition-opacity">
                  <ChevronLeft className="h-4 w-4" />
                  ملفات صحية
                </Link>
              </li>
              <li>
                <Link href="#" className="flex items-center gap-2 text-sm hover:opacity-80 transition-opacity">
                  <ChevronLeft className="h-4 w-4" />
                  متابعة مستمرة
                </Link>
              </li>
              <li>
                <Link href="#" className="flex items-center gap-2 text-sm hover:opacity-80 transition-opacity">
                  <ChevronLeft className="h-4 w-4" />
                  برامج تثقيفية
                </Link>
              </li>
              <li>
                <Link href="#" className="flex items-center gap-2 text-sm hover:opacity-80 transition-opacity">
                  <ChevronLeft className="h-4 w-4" />
                  متابعة مستمرة
                </Link>
              </li>
              <li>
                <Link href="#" className="flex items-center gap-2 text-sm hover:opacity-80 transition-opacity">
                  <ChevronLeft className="h-4 w-4" />
                  تقريرنا عنك
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">تواصل معنا</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-sm">
                <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <Mail className="h-4 w-4" />
                </div>
                <span>midnova@gmail.com</span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <Phone className="h-4 w-4" />
                </div>
                <span>+968 0000 0000</span>
              </li>
              <li className="flex items-start gap-3 text-sm">
                <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-4 w-4" />
                </div>
                <span>سلطنة عمان - مسقط</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}