import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageBanner } from "@/components/ui/page-banner";
import { useTranslation } from "@/lib/simple-i18n";
import type { CompanyStats } from "@shared/schema";
import { 
  MapPin, 
  Users, 
  Award, 
  Globe, 
  Target, 
  Heart, 
  Star,
  Handshake,
  TrendingUp,
  Shield,
  Languages
} from "lucide-react";

export default function About() {
  const { t } = useTranslation();

  const { data: stats } = useQuery({
    queryKey: ["/api/stats"],
    staleTime: 5 * 60 * 1000, // 5 minutes
  }) as { data: CompanyStats | undefined };

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

  const values = [
    {
      icon: Shield,
      title: t('pages.about.reliability'),
      description: t('pages.about.reliabilityDesc')
    },
    {
      icon: Heart,
      title: t('pages.about.clientFocus'),
      description: t('pages.about.clientFocusDesc')
    },
    {
      icon: Star,
      title: t('pages.about.quality'),
      description: t('pages.about.qualityDesc')
    },
    {
      icon: Handshake,
      title: t('pages.about.partnership'),
      description: t('pages.about.partnershipDesc')
    },
    {
      icon: TrendingUp,
      title: t('pages.about.development'),
      description: t('pages.about.developmentDesc')
    },
    {
      icon: Globe,
      title: t('pages.about.global'),
      description: t('pages.about.globalDesc')
    }
  ];

  const timeline = [
    {
      year: "2017",
      title: t('pages.services.timeline.founding'),
      description: t('pages.services.timeline.foundingDesc')
    },
    {
      year: "2018",
      title: t('pages.services.timeline.warehouse'),
      description: t('pages.services.timeline.warehouseDesc')
    },
    {
      year: "2019",
      title: t('pages.services.timeline.oem'),
      description: t('pages.services.timeline.oemDesc')
    },
    {
      year: "2022",
      title: t('pages.services.timeline.international'),
      description: t('pages.services.timeline.internationalDesc')
    },
    {
      year: "2023",
      title: t('pages.services.timeline.tajikistan'),
      description: t('pages.services.timeline.tajikistanDesc')
    }
  ];

  const offices = [
    {
      city: t('pages.services.offices.dushanbe'),
      country: "Таджикистан",
      address: "ул. Рудаки 123, офис 45",
      phone: "+992 170 66 5555",
      email: "contact@farado.global",
      role: "Представительство"
    },
    {
      city: t('pages.services.offices.guangzhou'),
      country: "Китай",
      address: "Jiahecheng No.941, No. 90 Zhanqian Road, Guangzhou, Guangdong, China",
      phone: "+8613005133155",
      email: "farado.trade@gmail.com",
      role: "Головной офис, Представительство"
    }
  ];

  const team = [
    {
      name: t('pages.services.team.bakhtiyorName'),
      position: t('pages.services.team.bakhtiyorPosition'),
      experience: t('pages.services.team.bakhtiyorExperience'),
      description: t('pages.services.team.bakhtiyorDesc'),
      image: '/attached_assets/IMG_4505_1763379970229.PNG',
      imagePosition: 'scale-90'
    },
    {
      name: t('pages.services.team.alisherName'),
      position: t('pages.services.team.alisherPosition'),
      experience: t('pages.services.team.alisherExperience'),
      description: t('pages.services.team.alisherDesc'),
      image: '/attached_assets/IMG_4503_1763365902466.PNG'
    },
    {
      name: t('pages.services.team.umedName'),
      position: t('pages.services.team.umedPosition'),
      experience: t('pages.services.team.umedExperience'),
      description: t('pages.services.team.umedDesc'),
      image: '/attached_assets/photo_2023-12-15_14-28-45_1762861683805.jpg',
      imagePosition: 'object-[center_35%] scale-95'
    },
    {
      name: t('pages.services.team.pumbachaName'),
      position: t('pages.services.team.pumbachaPosition'),
      experience: t('pages.services.team.pumbachaExperience'),
      description: t('pages.services.team.pumbachaDesc'),
      image: '/attached_assets/hui_chi_photo.jpg',
      imagePosition: 'object-[center_40%]'
    },
    {
      name: t('pages.services.team.annaName'),
      position: t('pages.services.team.annaPosition'),
      experience: t('pages.services.team.annaExperience'),
      description: t('pages.services.team.annaDesc'),
      image: '/attached_assets/photo_2025-11-10_14-00-36 (3)_1762859892177.jpg',
      imagePosition: 'object-[center_40%]'
    },
    {
      name: t('pages.services.team.jianrongName'),
      position: t('pages.services.team.jianrongPosition'),
      experience: t('pages.services.team.jianrongExperience'),
      description: t('pages.services.team.jianrongDesc'),
      image: '/attached_assets/photo_2025-11-10_14-00-36 (4)_1762860764854.jpg'
    }
  ];

  return (
    <div className="min-h-screen">
      <PageBanner 
        title={t('pages.about.title')}
        subtitle={t('pages.about.subtitle')}
      />
      
      {/* Statistics Section */}
      <section className="py-12 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
              {t('pages.about.description')}
            </p>
            <div className="flex justify-center items-center space-x-8 pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600">
                  {stats?.yearsExperience || 7}+
                </div>
                <div className="text-sm text-gray-600">лет на рынке</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600">
                  {stats?.totalOrders || 2000}+
                </div>
                <div className="text-sm text-gray-600">довольных клиентов</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600">
                  {stats?.countriesServed || 3}+
                </div>
                <div className="text-sm text-gray-600">стран работы</div>
              </div>
            </div>
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

      {/* Values */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              {t('pages.about.ourValues')}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="bg-white hover:shadow-lg transition-shadow">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <value.icon className="text-red-600 w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Company History */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              {t('pages.about.history')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('pages.about.historySubtitle')}
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-red-200 hidden lg:block"></div>
            
            <div className="space-y-12">
              {timeline.map((item, index) => (
                <div key={index} className="relative flex items-center">
                  <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center text-white font-bold text-lg hidden lg:flex">
                    {item.year.slice(-2)}
                  </div>
                  <div className="lg:ml-12 flex-1">
                    <Card className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-8">
                        <div className="flex items-center space-x-4 mb-4">
                          <Badge className="bg-red-100 text-red-700 font-semibold">
                            {item.year}
                          </Badge>
                          <h3 className="text-xl font-semibold text-gray-900">{item.title}</h3>
                        </div>
                        <p className="text-gray-600 leading-relaxed">
                          {item.description}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              {t('pages.about.team')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('pages.about.teamSubtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="bg-white hover:shadow-lg transition-shadow">
                <CardContent className="p-8 text-center">
                  {member.image ? (
                    <div className="w-24 h-24 rounded-full mx-auto mb-6 overflow-hidden">
                      <img 
                        src={member.image} 
                        alt={member.name}
                        className={`w-full h-full object-cover ${(member as any).imagePosition || ''}`}
                      />
                    </div>
                  ) : (
                    <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-6 flex items-center justify-center">
                      <Users className="text-gray-500 w-12 h-12" />
                    </div>
                  )}
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{member.name}</h3>
                  <div className="text-red-600 font-medium mb-2">{member.position}</div>
                  <div className="text-sm text-gray-500 mb-4">{member.experience}</div>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {member.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Offices */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              {t('pages.about.offices')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('pages.about.officesSubtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {offices.map((office, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-8">
                  <div className="flex items-start space-x-4 mb-6">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <MapPin className="text-red-600 w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">{office.city}</h3>
                        <Badge variant="secondary">{office.role}</Badge>
                      </div>
                      <div className="text-gray-600 mb-1">{office.country}</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <i className="fas fa-phone text-gray-400 w-4"></i>
                      <a href={`tel:${office.phone}`} className="text-gray-600 hover:text-red-600 transition-colors">
                        {office.phone}
                      </a>
                    </div>
                    <div className="flex items-center space-x-3">
                      <i className="fas fa-envelope text-gray-400 w-4"></i>
                      <a href={`mailto:${office.email}`} className="text-gray-600 hover:text-red-600 transition-colors">
                        {office.email}
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Interactive Map Placeholder */}
          <div className="mt-16">
            <Card className="overflow-hidden">
              <div className="relative h-96 bg-gray-100">
                <img 
                  src="https://images.unsplash.com/photo-1519302959554-a75be0afc82a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=400" 
                  alt="World map showing FARADO office locations" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-blue-500/20"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 text-center">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {t('pages.services.offices.dushanbe')} ↔ {t('pages.services.offices.guangzhou')}
                    </h3>
                    <p className="text-gray-600">{t('pages.about.mapConnection')}</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

    </div>
  );
}
