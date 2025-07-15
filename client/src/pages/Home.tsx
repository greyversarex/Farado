import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { QuoteRequestForm } from "@/components/forms/QuoteRequestForm";
import { useTranslation } from "@/lib/simple-i18n";

import type { CompanyStats } from "@shared/schema";
import { 
  Search, 
  Truck, 
  FileText, 
  Factory, 
  Warehouse, 
  Headphones,
  Award,
  Globe,
  Shield,
  Users,
  Languages,
  Check,
  ArrowRight,
  BarChart3,
  MapPin,
  MessageCircle,
  CheckCircle,
  ClipboardCheck,
  Package,
  Handshake,
  Eye,
  Download,
  Star,
  Send,
  Trophy
} from "lucide-react";

export default function Home() {
  const [isQuoteFormOpen, setIsQuoteFormOpen] = useState(false);
  const { t } = useTranslation();

  const { data: stats } = useQuery({
    queryKey: ["/api/stats"],
  }) as { data: CompanyStats | undefined };

  const services = [
    {
      icon: Search,
      title: t('services.sourcing'),
      description: t('services.sourcingDesc')
    },
    {
      icon: Truck,
      title: t('services.logistics'),
      description: t('services.logisticsDesc')
    },
    {
      icon: FileText,
      title: t('services.customs'),
      description: t('services.customsDesc')
    },
    {
      icon: Factory,
      title: t('services.oem'),
      description: t('services.oemDesc')
    },
    {
      icon: Warehouse,
      title: t('services.warehouse'),
      description: t('services.warehouseDesc')
    },
    {
      icon: Headphones,
      title: t('services.support'),
      description: t('services.supportDesc')
    }
  ];

  const advantages = [
    {
      icon: Award,
      title: t('services.experienceTitle'),
      description: t('services.experienceDesc')
    },
    {
      icon: Globe,
      title: t('services.officesTitle'),
      description: t('services.officesDesc')
    },
    {
      icon: Shield,
      title: t('services.guaranteesTitle'),
      description: t('services.guaranteesDesc')
    },
    {
      icon: Users,
      title: t('services.comprehensiveTitle'),
      description: t('services.comprehensiveDesc')
    },
    {
      icon: Languages,
      title: t('services.languageTitle'),
      description: t('services.languageDesc')
    }
  ];

  const processSteps = [
    {
      number: 1,
      title: t('pages.home.howWeWork.step1'),
      description: t('pages.home.howWeWork.step1Desc')
    },
    {
      number: 2,
      title: t('pages.home.howWeWork.step2'),
      description: t('pages.home.howWeWork.step2Desc')
    },
    {
      number: 3,
      title: t('pages.home.howWeWork.step3'),
      description: t('pages.home.howWeWork.step3Desc')
    },
    {
      number: 4,
      title: t('pages.home.howWeWork.step4'),
      description: t('pages.home.howWeWork.step4Desc')
    }
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-50 to-white">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-red-600 opacity-5 transform rotate-45 rounded-3xl"></div>
          <div className="absolute bottom-1/4 left-1/4 w-48 h-48 bg-gray-300 opacity-5 transform -rotate-12 rounded-2xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 lg:py-28 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="space-y-6 md:space-y-8">
              <div className="space-y-4 md:space-y-6">
                <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  {t('hero.title')}
                </h1>
                <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
                  {t('hero.subtitle')}
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                <Button 
                  onClick={() => setIsQuoteFormOpen(true)}
                  className="bg-red-600 text-white px-6 md:px-8 py-3 md:py-4 rounded-lg font-semibold text-base md:text-lg hover:bg-red-700 transition-colors shadow-lg"
                >
                  {t('hero.cta')}
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => scrollToSection('services')}
                  className="border-2 border-gray-300 text-gray-700 px-6 md:px-8 py-3 md:py-4 rounded-lg font-semibold text-base md:text-lg hover:border-red-600 hover:text-red-600 transition-colors"
                >
                  {t('hero.services')}
                </Button>
              </div>
              
              <div className="flex items-center justify-center sm:justify-start space-x-6 md:space-x-8 pt-4 md:pt-6">
                <div className="text-center">
                  <div className="text-xl md:text-2xl font-bold text-gray-900">
                    {stats?.yearsExperience || 7}+
                  </div>
                  <div className="text-xs md:text-sm text-gray-600">{t('stats.experience')}</div>
                </div>
                <div className="text-center">
                  <div className="text-xl md:text-2xl font-bold text-gray-900">
                    {stats?.totalOrders || 2000}+
                  </div>
                  <div className="text-xs md:text-sm text-gray-600">{t('stats.orders')}</div>
                </div>
                <div className="text-center">
                  <div className="text-xl md:text-2xl font-bold text-gray-900">
                    {stats?.countriesServed || 3}+
                  </div>
                  <div className="text-xs md:text-sm text-gray-600">{t('stats.countries')}</div>
                </div>
              </div>
            </div>
            
            <div className="relative mt-8 lg:mt-0">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src="/attached_assets/ChatGPT Image 21 июн. 2025 г., 19_40_27_1750516876387.png" 
                  alt="FARADO office reception with professional staff" 
                  className="w-full h-64 md:h-96 lg:h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-red-600/20 to-transparent"></div>
              </div>
              
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Check className="text-green-600 w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">
                      {stats?.satisfactionRate || 99.2}%
                    </div>
                    <div className="text-sm text-gray-600">{t('stats.satisfaction')}</div>
                  </div>
                </div>
              </div>
              
              <div className="absolute -top-6 -right-6 bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Headphones className="text-blue-600 w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">24/7</div>
                    <div className="text-sm text-gray-600">{t('services.support247')}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Services Section */}
      <section id="services" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              {t('services.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('services.subtitle')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="bg-white hover:shadow-lg transition-shadow h-full flex flex-col">
                <CardContent className="p-6 flex-1 flex flex-col pt-[8px] pb-[8px] pl-[24px] pr-[24px] ml-[1px] mr-[1px] mt-[0px] mb-[0px]">
                  <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center ml-[0px] mr-[0px] mt-[7px] mb-[7px]">
                    <service.icon className="text-red-600 w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 ml-[0px] mr-[0px] mt-[10px] mb-[10px] pt-[0px] pb-[0px] pl-[0px] pr-[0px]">{service.title}</h3>
                  <div className="flex-1 mb-4">
                    <p className="text-gray-600 mt-[-2px] mb-[-2px] ml-[0px] mr-[0px] pl-[0px] pr-[0px] pt-[0px] pb-[0px] text-[15px]">
                      {service.description}
                    </p>
                  </div>
                  
                  {/* Преимущества услуги */}
                  <div className="mb-4">
                    <div className="space-y-2">
                      {index === 0 && (
                        <>
                          <div className="flex items-start text-sm text-gray-600">
                            <Check className="text-green-500 w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                            <span>{t('services.sourcingDetails.timeSaving')}</span>
                          </div>
                          <div className="flex items-start text-sm text-gray-600">
                            <Check className="text-green-500 w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                            <span>{t('services.sourcingDetails.verifiedSuppliers')}</span>
                          </div>
                          <div className="flex items-start text-sm text-gray-600">
                            <Check className="text-green-500 w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                            <span>{t('services.sourcingDetails.directContact')}</span>
                          </div>
                        </>
                      )}
                      {index === 1 && (
                        <>
                          <div className="flex items-start text-sm text-gray-600">
                            <Check className="text-green-500 w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                            <span>{t('services.sourcingDetails.logisticsSpeed')}</span>
                          </div>
                          <div className="flex items-start text-sm text-gray-600">
                            <Check className="text-green-500 w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                            <span>{t('services.sourcingDetails.fullInsurance')}</span>
                          </div>
                          <div className="flex items-start text-sm text-gray-600">
                            <Check className="text-green-500 w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                            <span>{t('services.sourcingDetails.realTimeTracking')}</span>
                          </div>
                        </>
                      )}
                      {index === 2 && (
                        <>
                          <div className="flex items-start text-sm text-gray-600">
                            <Check className="text-green-500 w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                            <span>{t('services.sourcingDetails.customsExpertise')}</span>
                          </div>
                          <div className="flex items-start text-sm text-gray-600">
                            <Check className="text-green-500 w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                            <span>{t('services.sourcingDetails.documentPrep')}</span>
                          </div>
                          <div className="flex items-start text-sm text-gray-600">
                            <Check className="text-green-500 w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                            <span>{t('services.sourcingDetails.properDocuments')}</span>
                          </div>
                        </>
                      )}
                      {index === 3 && (
                        <>
                          <div className="flex items-start text-sm text-gray-600">
                            <Check className="text-green-500 w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                            <span>{t('services.sourcingDetails.productionControl')}</span>
                          </div>
                          <div className="flex items-start text-sm text-gray-600">
                            <Check className="text-green-500 w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                            <span>{t('services.sourcingDetails.oemExperience')}</span>
                          </div>
                          <div className="flex items-start text-sm text-gray-600">
                            <Check className="text-green-500 w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                            <span>{t('services.sourcingDetails.lowCosts')}</span>
                          </div>
                        </>
                      )}
                      {index === 4 && (
                        <>
                          <div className="flex items-start text-sm text-gray-600">
                            <Check className="text-green-500 w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                            <span>{t('services.sourcingDetails.modernFacilities')}</span>
                          </div>
                          <div className="flex items-start text-sm text-gray-600">
                            <Check className="text-green-500 w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                            <span>{t('services.sourcingDetails.goodsConsolidation')}</span>
                          </div>
                          <div className="flex items-start text-sm text-gray-600">
                            <Check className="text-green-500 w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                            <span>{t('services.sourcingDetails.flexibleStorage')}</span>
                          </div>
                        </>
                      )}
                      {index === 5 && (
                        <>
                          <div className="flex items-start text-sm text-gray-600">
                            <Check className="text-green-500 w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                            <span>{t('services.sourcingDetails.personalManager')}</span>
                          </div>
                          <div className="flex items-start text-sm text-gray-600">
                            <Check className="text-green-500 w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                            <span>{t('services.sourcingDetails.transparentReports')}</span>
                          </div>
                          <div className="flex items-start text-sm text-gray-600">
                            <Check className="text-green-500 w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                            <span>{t('services.sourcingDetails.expertConsultations')}</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  
                  {/* Инфографика процесса для каждой услуги */}
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 pt-[20px] pb-[20px] pl-[20px] pr-[20px] ml-[-1px] mr-[-1px] mt-[20px] mb-[20px]">
                    <div className="grid grid-cols-5 gap-0">
                      <div className="flex flex-col items-center space-y-0.5">
                        <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
                          {index === 0 && <Search className="w-5 h-5 text-white" />}
                          {index === 1 && <MapPin className="w-5 h-5 text-white" />}
                          {index === 2 && <FileText className="w-5 h-5 text-white" />}
                          {index === 3 && <Factory className="w-5 h-5 text-white" />}
                          {index === 4 && <Warehouse className="w-5 h-5 text-white" />}
                          {index === 5 && <MessageCircle className="w-5 h-5 text-white" />}
                        </div>
                        <span className="text-xs text-center font-medium text-gray-700 leading-3 h-5 flex items-center">
                          {index === 0 && t('services.process.search')}
                          {index === 1 && t('services.process.route')}
                          {index === 2 && t('services.process.documents')}
                          {index === 3 && t('services.process.production')}
                          {index === 4 && t('services.process.warehouse')}
                          {index === 5 && t('services.process.consultation')}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-center">
                        <div className="w-full flex items-center justify-center">
                          <div className="w-3 h-px bg-red-300"></div>
                          <div className="w-1 h-1 bg-red-500 rounded-full mx-1"></div>
                          <div className="w-3 h-px bg-red-300"></div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-center space-y-0.5">
                        <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
                          {index === 0 && <CheckCircle className="w-5 h-5 text-white" />}
                          {index === 1 && <Truck className="w-5 h-5 text-white" />}
                          {index === 2 && <ClipboardCheck className="w-5 h-5 text-white" />}
                          {index === 3 && <Shield className="w-5 h-5 text-white" />}
                          {index === 4 && <Package className="w-5 h-5 text-white" />}
                          {index === 5 && <Users className="w-5 h-5 text-white" />}
                        </div>
                        <span className="text-xs text-center font-medium text-gray-700 leading-3 h-5 flex items-center">
                          {index === 0 && t('services.process.verification')}
                          {index === 1 && t('services.process.delivery')}
                          {index === 2 && t('services.process.processing')}
                          {index === 3 && t('services.process.control')}
                          {index === 4 && t('services.process.consolidation')}
                          {index === 5 && t('services.process.support')}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-center">
                        <div className="w-full flex items-center justify-center">
                          <div className="w-3 h-px bg-red-300"></div>
                          <div className="w-1 h-1 bg-red-500 rounded-full mx-1"></div>
                          <div className="w-3 h-px bg-red-300"></div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-center space-y-0.5">
                        <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
                          {index === 0 && <Handshake className="w-5 h-5 text-white" />}
                          {index === 1 && <Eye className="w-5 h-5 text-white" />}
                          {index === 2 && <Download className="w-5 h-5 text-white" />}
                          {index === 3 && <Star className="w-5 h-5 text-white" />}
                          {index === 4 && <Send className="w-5 h-5 text-white" />}
                          {index === 5 && <Trophy className="w-5 h-5 text-white" />}
                        </div>
                        <span className="text-xs text-center font-medium text-gray-700 leading-3 h-5 flex items-center">
                          {index === 0 && t('services.process.partnership')}
                          {index === 1 && t('services.process.tracking')}
                          {index === 2 && t('services.process.receiving')}
                          {index === 3 && t('services.process.quality')}
                          {index === 4 && t('services.process.shipment')}
                          {index === 5 && t('services.process.success')}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      {/* Why FARADO Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              {t('services.whyChoose')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('services.whyChooseSubtitle')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              {advantages.map((advantage, index) => (
                <div key={index} className="flex items-start space-x-6">
                  <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <advantage.icon className="text-white w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{advantage.title}</h3>
                    <p className="text-gray-600 leading-relaxed">
                      {advantage.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800" 
                alt="Professional business team meeting in modern office" 
                className="rounded-2xl shadow-2xl w-full h-96 lg:h-[500px] object-cover"
              />
              
              <div className="absolute bottom-6 left-6 right-6">
                <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-lg">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-gray-900">
                        {stats?.satisfactionRate || 99.2}%
                      </div>
                      <div className="text-xs text-gray-600">{t('stats.satisfaction')}</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900">
                        {stats?.onTimeDelivery || 98.7}%
                      </div>
                      <div className="text-xs text-gray-600">{t('stats.onTime')}</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900">
                        {stats?.averageSavings || 25}%
                      </div>
                      <div className="text-xs text-gray-600">{t('stats.savings')}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Process Section */}
      <section id="process" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              {t('pages.home.howWeWork.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('pages.home.howWeWork.subtitle')}
            </p>
          </div>
          
          <div className="relative">
            <div className="absolute top-12 left-8 right-8 h-0.5 bg-gradient-to-r from-red-600 via-red-600 to-red-600 hidden lg:block"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {processSteps.map((step, index) => (
                <div key={index} className="relative text-center">
                  <div className="w-24 h-24 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-6 relative z-10">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                      <span className="text-red-600 font-bold text-xl">{step.number}</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Button 
              onClick={() => setIsQuoteFormOpen(true)}
              className="bg-red-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-red-700 transition-colors shadow-lg"
            >
              {t('pages.home.howWeWork.startCollaboration')}
            </Button>
          </div>
        </div>
      </section>
      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              {t('pages.home.numbers.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('pages.home.numbers.subtitle')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-8 bg-gradient-to-br from-red-50 to-red-100 rounded-2xl">
              <div className="text-4xl lg:text-5xl font-bold text-red-600 mb-2">
                {stats?.totalOrders || 2000}+
              </div>
              <div className="text-gray-600 font-medium">{t('pages.home.numbers.completedOrders')}</div>
            </div>
            
            <div className="text-center p-8 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl">
              <div className="text-4xl lg:text-5xl font-bold text-blue-600 mb-2">
                {stats?.countriesServed || 15}+
              </div>
              <div className="text-gray-600 font-medium">{t('pages.home.numbers.deliveryCountries')}</div>
            </div>
            
            <div className="text-center p-8 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl">
              <div className="text-4xl lg:text-5xl font-bold text-green-600 mb-2">
                {stats?.averageSavings || 25}%
              </div>
              <div className="text-gray-600 font-medium">{t('pages.home.numbers.averageSavings')}</div>
            </div>
            
            <div className="text-center p-8 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl">
              <div className="text-4xl lg:text-5xl font-bold text-purple-600 mb-2">
                {stats?.warehouses || 6}
              </div>
              <div className="text-gray-600 font-medium">{t('pages.home.numbers.warehousesInChina')}</div>
            </div>
          </div>
          
          <div className="mt-16 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-8">{t('pages.home.geography.title')}</h3>
            <div className="bg-gray-50 rounded-2xl p-8 relative overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1516738901171-8eb4fc13bd20?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=600" 
                alt="World map showing global trade routes and connections" 
                className="w-full h-64 lg:h-80 object-cover rounded-xl"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-blue-500/20 rounded-xl"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 text-center">
                  <div className="text-2xl font-bold text-gray-900 mb-2">{t('pages.home.geography.subtitle')}</div>
                  <div className="text-gray-600">{t('pages.home.geography.routes')}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-red-600 to-red-700 rounded-3xl p-8 lg:p-16 text-white text-center">
            <h2 className="text-3xl lg:text-5xl font-bold mb-6">
              {t('pages.home.readyToStart.title')}
            </h2>
            <p className="text-xl lg:text-2xl opacity-90 mb-12 max-w-3xl mx-auto">
              {t('pages.home.readyToStart.subtitle')}
            </p>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8 text-left">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <i className="fas fa-phone text-white"></i>
                  </div>
                  <div>
                    <div className="font-semibold">{t('pages.home.readyToStart.freeConsultation')}</div>
                    <div className="opacity-90">{t('pages.home.readyToStart.freeConsultationDesc')}</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <i className="fas fa-calculator text-white"></i>
                  </div>
                  <div>
                    <div className="font-semibold">{t('pages.home.readyToStart.costCalculation')}</div>
                    <div className="opacity-90">{t('pages.home.readyToStart.costCalculationDesc')}</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <i className="fas fa-file-contract text-white"></i>
                  </div>
                  <div>
                    <div className="font-semibold">{t('pages.home.readyToStart.individualOffer')}</div>
                    <div className="opacity-90">{t('pages.home.readyToStart.individualOfferDesc')}</div>
                  </div>
                </div>
              </div>
              
              <div>
                <Button 
                  onClick={() => setIsQuoteFormOpen(true)}
                  size="lg"
                  className="bg-white text-red-600 hover:bg-gray-100 font-semibold text-lg px-8 py-4"
                >
                  {t('pages.home.readyToStart.getQuote')}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <QuoteRequestForm 
        open={isQuoteFormOpen} 
        onOpenChange={setIsQuoteFormOpen} 
      />
    </div>
  );
}
