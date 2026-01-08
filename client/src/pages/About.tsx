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
  Languages,
  Truck
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
      image: '/attached_assets/photo_2025-11-19_16-43-30_1763552620386.jpg'
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
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
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
                src="/attached_assets/Generated_Image_January_08,_2026_-_12_23PM_1767857005847.png" 
                alt="Business meeting in office with port view - FARADO logistics" 
                className="rounded-2xl shadow-2xl w-full h-96 lg:h-[500px] object-cover"
              />
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
                  <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-red-500 via-red-600 to-red-700 rounded-2xl flex items-center justify-center shadow-lg shadow-red-300/50 transform hover:scale-105 transition-transform">
                    <value.icon className="text-white w-8 h-8 stroke-[2] drop-shadow-md" />
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
            {/* Road/path line */}
            <div className="absolute left-8 top-0 bottom-0 w-1 hidden lg:block overflow-visible">
              <div className="absolute inset-0 bg-gradient-to-b from-gray-300 via-gray-400 to-gray-300 rounded-full"></div>
              <div className="absolute inset-0 bg-gradient-to-b from-red-600 via-red-500 to-red-600 rounded-full opacity-60"></div>
              
              {/* Dashed road markings */}
              <div className="absolute inset-0 flex flex-col items-center justify-between py-4">
                <div className="flex-1 border-l-2 border-dashed border-white/50"></div>
              </div>
              
              {/* Driving truck animation */}
              <div className="absolute left-1/2 animate-drive-truck">
                <svg 
                  className="w-12 h-12 text-red-600 drop-shadow-xl" 
                  viewBox="0 0 24 24" 
                  fill="currentColor"
                >
                  <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
                </svg>
              </div>
            </div>
            
            <div className="space-y-12">
              {timeline.map((item, index) => (
                <div key={index} className="relative flex items-center">
                  <div className={`w-16 h-16 bg-red-600 rounded-full flex items-center justify-center text-white font-bold text-lg hidden lg:flex timeline-circle`}>
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
