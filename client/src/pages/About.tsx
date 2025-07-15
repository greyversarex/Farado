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
  Shield
} from "lucide-react";

export default function About() {
  const { t } = useTranslation();

  const { data: stats } = useQuery({
    queryKey: ["/api/stats"],
    staleTime: 5 * 60 * 1000, // 5 minutes
  }) as { data: CompanyStats | undefined };

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
      address: "Tianhe District, Office 1201",
      phone: "+86 20 123 456 789",
      email: "guangzhou@farado.global",
      role: "Головной офис"
    }
  ];

  const team = [
    {
      name: t('pages.services.team.farkhodName'),
      position: t('pages.services.team.farkhodPosition'),
      experience: t('pages.services.team.farkhodExperience'),
      description: t('pages.services.team.farkhodDesc')
    },
    {
      name: t('pages.services.team.liName'),
      position: t('pages.services.team.liPosition'),
      experience: t('pages.services.team.liExperience'),
      description: t('pages.services.team.liDesc')
    },
    {
      name: t('pages.services.team.annaName'),
      position: t('pages.services.team.annaPosition'),
      experience: t('pages.services.team.annaExperience'),
      description: t('pages.services.team.annaDesc')
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

      {/* Mission & Vision */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <Target className="text-red-600 w-8 h-8" />
                  <h2 className="text-3xl font-bold text-gray-900">{t('pages.about.mission')}</h2>
                </div>
                <p className="text-lg text-gray-600 leading-relaxed">
                  {t('pages.about.missionText')}
                </p>
              </div>

              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <Globe className="text-red-600 w-8 h-8" />
                  <h2 className="text-3xl font-bold text-gray-900">{t('pages.about.vision')}</h2>
                </div>
                <p className="text-lg text-gray-600 leading-relaxed">
                  {t('pages.about.visionText')}
                </p>
              </div>
            </div>

            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800" 
                alt="Business team collaboration and strategic planning" 
                className="rounded-2xl shadow-2xl w-full h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-red-600/10 to-transparent rounded-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              {t('pages.about.values')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('pages.about.valuesSubtitle')}
            </p>
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
                  <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-6 flex items-center justify-center">
                    <Users className="text-gray-500 w-12 h-12" />
                  </div>
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
                      <MapPin className="text-gray-400 w-4 h-4 flex-shrink-0" />
                      <span className="text-gray-600">{office.address}</span>
                    </div>
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

      {/* Achievements */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              {t('pages.about.achievements')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('pages.services.team.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center bg-gradient-to-br from-red-50 to-red-100 border-red-200">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="text-white w-8 h-8" />
                </div>
                <div className="text-3xl font-bold text-red-600 mb-2">
                  {stats?.satisfactionRate || 99.2}%
                </div>
                <div className="text-gray-700 font-medium">{t('stats.satisfaction')}</div>
              </CardContent>
            </Card>

            <Card className="text-center bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="text-white w-8 h-8" />
                </div>
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {stats?.onTimeDelivery || 98.7}%
                </div>
                <div className="text-gray-700 font-medium">{t('stats.onTime')}</div>
              </CardContent>
            </Card>

            <Card className="text-center bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="text-white w-8 h-8" />
                </div>
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {stats?.countriesServed || 15}+
                </div>
                <div className="text-gray-700 font-medium">{t('stats.countries')}</div>
              </CardContent>
            </Card>

            <Card className="text-center bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="text-white w-8 h-8" />
                </div>
                <div className="text-3xl font-bold text-purple-600 mb-2">50+</div>
                <div className="text-gray-700 font-medium">{t('pages.about.employees')}</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
