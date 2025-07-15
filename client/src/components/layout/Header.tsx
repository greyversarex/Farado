import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { useTranslation } from "@/lib/simple-i18n";
import { LanguageSelector } from "@/components/ui/language-selector";
import logoImage from "@assets/Гаризонтально Синий-Photoroom.png";

export function Header() {
  const [location] = useLocation();
  const { t } = useTranslation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: t('nav.services'), href: '/services' },
    { name: t('nav.about'), href: '/about' },
    { name: t('nav.blog'), href: '/blog' },
    { name: t('nav.contact'), href: '/contact' },
  ];

  const isActive = (href: string) => {
    if (href.includes('#')) {
      return location === '/';
    }
    return location === href;
  };

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20 md:h-32 w-full">
          {/* Logo */}
          <div className="flex-shrink-0 -ml-4">
            <Link href="/" className="block">
              <img 
                src={logoImage} 
                alt="FARADO" 
                className="h-16 md:h-40 w-auto hover:opacity-80 transition-opacity duration-200 md:-mb-4 md:-mt-0 mt-[-2px] mb-[-2px]"
              />
            </Link>
          </div>

          {/* Centered Navigation */}
          <nav className="hidden lg:flex items-center justify-center flex-1 px-8">
            <div className="flex items-center space-x-4">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={`relative px-4 py-3 text-sm font-medium transition-all duration-300 rounded-full group ${
                    isActive(item.href)
                      ? "text-red-600 bg-red-50"
                      : "text-gray-700 hover:text-red-600 hover:bg-gray-50"
                  }`}
                >
                  {item.name}
                  <span 
                    className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-red-600 transition-all duration-300 group-hover:w-full ${
                      isActive(item.href) ? "w-full" : ""
                    }`}
                  ></span>
                </a>
              ))}
            </div>
          </nav>

          {/* Right Side Actions */}
          <div className="hidden lg:flex items-center space-x-3 flex-shrink-0">
            <LanguageSelector />
            <Link href="/portal">
              <Button className="bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 shadow-lg hover:shadow-xl transition-all duration-300 px-5 py-2.5 rounded-full font-medium text-sm">
                {t('nav.clientPortal')}
              </Button>
            </Link>
          </div>
          
          {/* Mobile Navigation */}
          <div className="lg:hidden flex items-center space-x-3">
            <LanguageSelector />
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="p-2">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[320px] bg-white">
                <div className="flex flex-col space-y-4 mt-8">
                  {navigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`text-lg font-medium transition-all duration-300 px-5 py-4 rounded-xl ${
                        isActive(item.href)
                          ? "text-red-600 bg-red-50 border border-red-200"
                          : "text-gray-700 hover:text-red-600 hover:bg-gray-50"
                      }`}
                    >
                      {item.name}
                    </a>
                  ))}
                  <div className="pt-6 border-t border-gray-200">
                    <Link href="/portal">
                      <Button 
                        className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 shadow-lg hover:shadow-xl transition-all duration-300 py-4 rounded-xl font-medium"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {t('nav.clientPortal')}
                      </Button>
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}