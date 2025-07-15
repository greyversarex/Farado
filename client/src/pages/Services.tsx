import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck, Ship, Package, MapPin, Clock, DollarSign, Users, CheckCircle, ArrowRight, Star, Shield, Zap, Globe, PhoneCall, Mail, Factory, Warehouse, Search, FileText, Plane, Train, TrendingUp, Users2, Eye, Target, Award } from "lucide-react";
import { useTranslation } from '@/lib/simple-i18n';
import { useState } from 'react';
import { QuoteRequestForm } from '@/components/forms/QuoteRequestForm';
import { PageBanner } from '@/components/ui/page-banner';

export default function Services() {
  const { t } = useTranslation();
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);

  // Основные услуги
  const services = [
    {
      title: t('pages.services.procurement.title'),
      description: t('pages.services.procurement.subtitle'),
      icon: Search,
      features: [
        t('pages.services.procurement.benefit1'),
        t('pages.services.procurement.benefit2'),
        t('pages.services.procurement.benefit3'),
        t('pages.services.procurement.benefit4')
      ],
      process: [
        t('pages.services.procurement.workflow.step1'),
        t('pages.services.procurement.workflow.step2'),
        t('pages.services.procurement.workflow.step3'),
        t('pages.services.procurement.workflow.step4'),
        t('pages.services.procurement.workflow.step5')
      ],
      buttonText: t('pages.services.buttons.procurement')
    },
    {
      title: t('pages.services.logistics.title'),
      description: t('pages.services.logistics.subtitle'),
      icon: Truck,
      features: [
        t('pages.services.logistics.benefit1'),
        t('pages.services.logistics.benefit2'),
        t('pages.services.logistics.benefit3'),
        t('pages.services.logistics.benefit4')
      ],
      process: [
        t('pages.services.logistics.workflow.step1'),
        t('pages.services.logistics.workflow.step2'),
        t('pages.services.logistics.workflow.step3'),
        t('pages.services.logistics.workflow.step4'),
        t('pages.services.logistics.workflow.step5')
      ],
      buttonText: t('pages.services.buttons.logistics')
    },
    {
      title: t('pages.services.customs.title'),
      description: t('pages.services.customs.subtitle'),
      icon: FileText,
      features: [
        t('pages.services.customs.benefit1'),
        t('pages.services.customs.benefit2'),
        t('pages.services.customs.benefit3'),
        t('pages.services.customs.benefit4')
      ],
      process: [
        t('pages.services.customs.workflow.step1'),
        t('pages.services.customs.workflow.step2'),
        t('pages.services.customs.workflow.step3'),
        t('pages.services.customs.workflow.step4'),
        t('pages.services.customs.workflow.step5')
      ],
      buttonText: t('pages.services.buttons.customs')
    },
    {
      title: t('pages.services.consultation.title'),
      description: t('pages.services.consultation.subtitle'),
      icon: Factory,
      features: [
        t('pages.services.consultation.benefit1'),
        t('pages.services.consultation.benefit2'),
        t('pages.services.consultation.benefit3'),
        t('pages.services.consultation.benefit4')
      ],
      process: [
        t('pages.services.consultation.workflow.step1'),
        t('pages.services.consultation.workflow.step2'),
        t('pages.services.consultation.workflow.step3'),
        t('pages.services.consultation.workflow.step4'),
        t('pages.services.consultation.workflow.step5')
      ],
      buttonText: t('pages.services.buttons.consultation')
    },
    {
      title: t('pages.services.warehouse.title'),
      description: t('pages.services.warehouse.subtitle'),
      icon: Warehouse,
      features: [
        t('pages.services.warehouse.benefit1'),
        t('pages.services.warehouse.benefit2'),
        t('pages.services.warehouse.benefit3'),
        t('pages.services.warehouse.benefit4')
      ],
      process: [
        t('pages.services.warehouse.workflow.step1'),
        t('pages.services.warehouse.workflow.step2'),
        t('pages.services.warehouse.workflow.step3'),
        t('pages.services.warehouse.workflow.step4'),
        t('pages.services.warehouse.workflow.step5')
      ],
      buttonText: t('pages.services.buttons.warehouse')
    },
    {
      title: t('pages.services.fullsupport.title'),
      description: t('pages.services.fullsupport.subtitle'),
      icon: Users2,
      features: [
        t('pages.services.fullsupport.benefit1'),
        t('pages.services.fullsupport.benefit2'),
        t('pages.services.fullsupport.benefit3'),
        t('pages.services.fullsupport.benefit4')
      ],
      process: [
        t('pages.services.fullsupport.workflow.step1'),
        t('pages.services.fullsupport.workflow.step2'),
        t('pages.services.fullsupport.workflow.step3'),
        t('pages.services.fullsupport.workflow.step4'),
        t('pages.services.fullsupport.workflow.step5')
      ],
      buttonText: t('pages.services.buttons.fullsupport')
    }
  ];

  // Типы транспорта
  const transportTypes = [
    {
      type: 'Авиатранспорт',
      icon: Plane,
      time: '3-7 дней',
      cost: 'Высокая стоимость',
      description: 'Для срочных и ценных грузов'
    },
    {
      type: 'Автомобильный',
      icon: Truck,
      time: '10-15 дней',
      cost: 'Средняя стоимость',
      description: 'Оптимальное соотношение цены и скорости'
    },
    {
      type: 'Железнодорожный',
      icon: Train,
      time: '15-20 дней',
      cost: 'Низкая стоимость',
      description: 'Экономичная доставка больших объемов'
    },
    {
      type: 'Морской',
      icon: Ship,
      time: '25-35 дней',
      cost: 'Минимальная стоимость',
      description: 'Для крупных партий товаров'
    }
  ];

  // Гарантии качества
  const guarantees = [
    {
      title: t('pages.services.guarantees.quality.title'),
      description: t('pages.services.guarantees.quality.description'),
      icon: Shield
    },
    {
      title: t('pages.services.guarantees.timing.title'),
      description: t('pages.services.guarantees.timing.description'),
      icon: Clock
    },
    {
      title: t('pages.services.guarantees.manager.title'),
      description: t('pages.services.guarantees.manager.description'),
      icon: Users2
    },
    {
      title: t('pages.services.guarantees.transparency.title'),
      description: t('pages.services.guarantees.transparency.description'),
      icon: Eye
    }
  ];

  return (
    <div className="min-h-screen">
      <PageBanner 
        title={t('pages.services.title')}
        subtitle={t('pages.services.subtitle')}
      />
      {/* Основные услуги */}
      <section className="py-12 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {services.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <Card key={index} className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-0 h-full flex flex-col">
                  <CardHeader className="bg-white p-4 md:p-6">
                    <div className="flex items-center space-x-3 md:space-x-4">
                      <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center group-hover:from-red-600 group-hover:to-red-700 transition-all duration-300 shadow-lg group-hover:shadow-xl">
                        <IconComponent className="w-6 h-6 md:w-8 md:h-8 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg md:text-xl font-bold text-gray-900 group-hover:text-red-600 transition-colors">
                          {service.title}
                        </CardTitle>
                      </div>
                    </div>
                    <CardDescription className="text-gray-600 mt-3 md:mt-4 leading-relaxed text-sm md:text-base">
                      {service.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="bg-white flex-grow flex flex-col p-4 md:p-6">
                    <div className="space-y-4 md:space-y-6 flex-grow">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2 md:mb-3 text-sm md:text-base">
                          {t('common.benefits')}
                        </h4>
                        <div className="space-y-2">
                          {service.features.map((feature, idx) => (
                            <div key={idx} className="flex items-center text-xs md:text-sm text-gray-600">
                              <CheckCircle className="w-3 h-3 md:w-4 md:h-4 mr-2 md:mr-3 text-green-500 flex-shrink-0" />
                              {feature}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2 md:mb-3 text-sm md:text-base">
                          {t('common.howWeWork')}
                        </h4>
                        <div className="space-y-2">
                          {service.process.map((step, idx) => (
                            <div key={idx} className="flex items-start text-xs md:text-sm text-gray-600">
                              <div className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-red-600 text-white flex items-center justify-center text-xs font-bold mr-2 md:mr-3 mt-0.5 flex-shrink-0">
                                {idx + 1}
                              </div>
                              {step}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 md:mt-6">
                      <Button 
                        className="w-full bg-red-600 hover:bg-red-700 text-white py-2 md:py-3 text-sm md:text-base"
                        onClick={() => setIsQuoteModalOpen(true)}
                      >
                        {service.buttonText}
                        <ArrowRight className="w-3 h-3 md:w-4 md:h-4 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>
      {/* Наши гарантии */}
      <section className="py-20 bg-[#ffffff]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('pages.services.guarantees.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('pages.services.guarantees.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {guarantees.map((guarantee, index) => {
              const IconComponent = guarantee.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-red-100 rounded-full mx-auto flex items-center justify-center mb-6">
                    <IconComponent className="w-8 h-8 text-red-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {guarantee.title}
                  </h3>
                  <p className="text-gray-600">
                    {guarantee.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      {/* Готовы начать? */}
      <section className="py-20 bg-gradient-to-r from-red-600 to-red-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              {t('pages.services.cta.title')}
            </h2>
            <p className="text-xl text-red-100 mb-8">
              {t('pages.services.cta.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                variant="secondary"
                className="bg-white text-red-600 hover:bg-gray-100"
                onClick={() => setIsQuoteModalOpen(true)}
              >
                <Mail className="w-5 h-5 mr-2" />
                {t('pages.services.cta.getQuote')}
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-red-600"
              >
                <PhoneCall className="w-5 h-5 mr-2" />
                {t('pages.services.cta.contact')}
              </Button>
            </div>
          </div>
        </div>
      </section>
      {/* Модальное окно для запроса предложения */}
      <QuoteRequestForm 
        open={isQuoteModalOpen}
        onOpenChange={setIsQuoteModalOpen}
      />
    </div>
  );
}