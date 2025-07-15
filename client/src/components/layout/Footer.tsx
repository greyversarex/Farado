import { Link } from "wouter";
import { useTranslation } from "@/lib/simple-i18n";

export function Footer() {
  const { t } = useTranslation();

  const services = [
    t('services.sourcing'),
    t('services.logistics'),
    t('services.customs'),
    t('services.oem'),
    t('services.warehouse'),
    t('services.sampling'),
  ];

  const companyLinks = [
    { name: t('footer.aboutUs'), href: '/about' },
    { name: t('nav.process'), href: '/#process' },
    { name: t('nav.blog'), href: '/blog' },
    { name: t('footer.careers'), href: '#' },
    { name: t('footer.partners'), href: '#' },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-6">
            <div className="text-2xl font-bold">
              <span className="text-red-600">FARADO</span>
            </div>
            <p className="text-gray-300 leading-relaxed">
              {t('footer.description')}
            </p>

          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-6">{t('nav.services')}</h3>
            <ul className="space-y-3">
              {services.map((service, index) => (
                <li key={index}>
                  <a href="/services" className="text-gray-300 hover:text-white transition-colors">
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-6">{t('footer.company')}</h3>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-gray-300 hover:text-white transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-6">{t('nav.contact')}</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <i className="fas fa-map-marker-alt text-red-600 mt-1"></i>
                <div>
                  <div className="font-medium">Душанбе</div>
                  <div className="text-gray-300 text-sm">ул. Рудаки 123, офис 45</div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <i className="fas fa-map-marker-alt text-red-600 mt-1"></i>
                <div>
                  <div className="font-medium">Гуанчжоу</div>
                  <div className="text-gray-300 text-sm">Tianhe District, Office 1201</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <i className="fas fa-phone text-red-600"></i>
                <a href="tel:+992170665555" className="text-gray-300 hover:text-white transition-colors">
                  +992 170 66 5555
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <i className="fas fa-envelope text-red-600"></i>
                <a href="mailto:contact@farado.global" className="text-gray-300 hover:text-white transition-colors">
                  contact@farado.global
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-300">
              {t('footer.copyright')}
            </div>
            
            <div className="flex space-x-6">
              <a 
                href="https://t.me/Farado_Global" 
                className="text-gray-400 hover:text-red-500 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fab fa-telegram text-xl"></i>
              </a>
              <a 
                href="https://wa.me/992170665555" 
                className="text-gray-400 hover:text-red-500 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fab fa-whatsapp text-xl"></i>
              </a>
              <a 
                href="https://www.instagram.com/farado.global/" 
                className="text-gray-400 hover:text-red-500 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fab fa-instagram text-xl"></i>
              </a>
            </div>

          </div>
        </div>
      </div>
    </footer>
  );
}
