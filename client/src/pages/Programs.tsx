import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useTranslation } from "@/lib/simple-i18n";
import { 
  Rocket, 
  Settings, 
  CheckCircle, 
  Star,
  Target,
  Users,
  Calendar,
  TrendingUp,
  Factory,
  Handshake,
  BarChart3,
  ShieldCheck,
  Award,
  ArrowRight,
  Phone,
  Mail,
  MessageCircle
} from "lucide-react";

export default function Programs() {
  const { t } = useTranslation();
  const [selectedProgram, setSelectedProgram] = useState<string | null>(null);

  const programs = [
    {
      id: 'business-start',
      title: 'FARADO Business Start',
      subtitle: 'Запуск вашего бизнеса с нуля',
      description: 'Поможем запустить ваш бизнес, даже если он ещё не придуман. Предложим нишу, найдём поставщиков, заключим контракты и организуем первые поставки.',
      icon: <Rocket className="w-8 h-8" />,
      color: 'from-blue-500 to-blue-600',
      hoverColor: 'hover:from-blue-600 hover:to-blue-700',
      targetAudience: [
        'Физические лица и компании, планирующие впервые организовать импортные поставки из Китая',
        'Предприятия, заинтересованные в освоении новых товарных ниш через китайский импорт'
      ],
      stages: [
        {
          title: 'Маркетинговый анализ и идентификация ниши',
          description: 'Анализ рыночных тенденций, конкурентной среды и формирование списка рентабельных товарных категорий',
          icon: <BarChart3 className="w-6 h-6" />
        },
        {
          title: 'Поиск и верификация поставщиков',
          description: 'Подбор и проверка производителей в Китае по критериям цены, качества и надёжности',
          icon: <Factory className="w-6 h-6" />
        },
        {
          title: 'Организация закупки образцов',
          description: 'Заказ и доставка образцов продукции от разных поставщиков для тестирования',
          icon: <Star className="w-6 h-6" />
        },
        {
          title: 'Переговоры и контрактация',
          description: 'Ведение переговоров и подготовка юридически защищённых контрактов ВЭД',
          icon: <Handshake className="w-6 h-6" />
        },
        {
          title: 'Первая коммерческая партия',
          description: 'Размещение заказа, контроль производства и организация доставки до клиента',
          icon: <TrendingUp className="w-6 h-6" />
        }
      ],
      results: [
        'Запущенный бизнес-проект по импорту выбранного товара из Китая',
        'Налаженные связи с проверенными китайскими поставщиками',
        'Протестированная и отлаженная схема поставки',
        'Минимизированные риски и издержки начального этапа ВЭД'
      ]
    },
    {
      id: 'control',
      title: 'FARADO Control',
      subtitle: 'Оптимизация существующих поставок',
      description: 'Найдём лучших поставщиков для вашего бизнеса со всего Китая. Проведём аудит вашей системы поставок и предложим новые решения для оптимизации ВЭД.',
      icon: <Settings className="w-8 h-8" />,
      color: 'from-green-500 to-green-600',
      hoverColor: 'hover:from-green-600 hover:to-green-700',
      targetAudience: [
        'Компании с устоявшимися процессами импорта из Китая, стремящиеся к сокращению издержек',
        'Предприятия, сталкивающиеся с регулярными проблемами в цепи поставок'
      ],
      stages: [
        {
          title: 'Комплексный аудит системы ВЭД',
          description: 'Анализ закупочной деятельности, логистической цепи, таможенных операций и финансовых аспектов',
          icon: <ShieldCheck className="w-6 h-6" />
        },
        {
          title: 'Идентификация проблемных зон',
          description: 'Выявление "узких мест" в цепи поставок и оценка рисков, связанных с поставщиками',
          icon: <Target className="w-6 h-6" />
        },
        {
          title: 'Детальный отчёт с рекомендациями',
          description: 'Структурированный отчёт с конкретными предложениями по оптимизации каждого аспекта ВЭД',
          icon: <BarChart3 className="w-6 h-6" />
        },
        {
          title: 'Консультационная поддержка',
          description: 'Помощь в разработке плана внедрения изменений и сопровождение переговоров',
          icon: <Users className="w-6 h-6" />
        }
      ],
      results: [
        'Четкое понимание сильных и слабых сторон текущей системы ВЭД',
        'Конкретный план действий по оптимизации процессов и сокращению издержек',
        'Повышение эффективности и прозрачности цепи поставок',
        'Снижение операционных и финансовых рисков',
        'Улучшение ключевых показателей: себестоимость, сроки доставки, уровень сервиса'
      ]
    }
  ];

  const handleContactClick = () => {
    // Scroll to contact section or open contact modal
    window.location.href = '/contact';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-red-700 to-red-800"></div>
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6">
              Наши программы
            </h1>
            <p className="text-xl lg:text-2xl text-white/90 mb-12 leading-relaxed">
              Комплексные решения для развития вашего бизнеса с Китаем. 
              От запуска с нуля до оптимизации существующих процессов.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                className="bg-white text-red-600 hover:bg-gray-50 font-semibold px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={handleContactClick}
              >
                <Phone className="w-5 h-5 mr-2" />
                Бесплатная консультация
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-red-600 font-semibold px-8 py-4 rounded-full transition-all duration-300"
                onClick={() => document.getElementById('programs')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Выбрать программу
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section id="programs" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Выберите подходящую программу
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Мы разработали две специализированные программы для разных этапов развития вашего бизнеса
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {programs.map((program) => (
              <Card 
                key={program.id}
                className={`relative overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${
                  selectedProgram === program.id ? 'ring-4 ring-red-500 shadow-2xl' : 'hover:shadow-xl'
                }`}
                onClick={() => setSelectedProgram(selectedProgram === program.id ? null : program.id)}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${program.color} opacity-5`}></div>
                <CardHeader className="relative pb-6">
                  <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${program.color} text-white mb-4 w-fit`}>
                    {program.icon}
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                    {program.title}
                  </CardTitle>
                  <p className="text-lg font-medium text-gray-700">
                    {program.subtitle}
                  </p>
                  <p className="text-gray-600 leading-relaxed">
                    {program.description}
                  </p>
                </CardHeader>
                <CardContent className="relative">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="font-medium">
                      {program.stages.length} этапов
                    </Badge>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className={`${program.hoverColor} hover:text-white transition-all duration-300`}
                    >
                      {selectedProgram === program.id ? 'Скрыть детали' : 'Подробнее'}
                      <ArrowRight className={`w-4 h-4 ml-2 transition-transform duration-300 ${
                        selectedProgram === program.id ? 'rotate-90' : ''
                      }`} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Program Details */}
          {selectedProgram && (
            <div className="animate-in slide-in-from-bottom-4 duration-500">
              {programs
                .filter(program => program.id === selectedProgram)
                .map((program) => (
                  <Card key={program.id} className="bg-white shadow-2xl border-0">
                    <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl bg-gradient-to-br ${program.color} text-white`}>
                          {program.icon}
                        </div>
                        <div>
                          <CardTitle className="text-3xl font-bold text-gray-900">
                            {program.title}
                          </CardTitle>
                          <p className="text-lg text-gray-600">{program.subtitle}</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-8">
                      {/* Target Audience */}
                      <div className="mb-12">
                        <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                          <Users className="w-6 h-6 mr-3 text-red-600" />
                          Целевая аудитория
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {program.targetAudience.map((audience, index) => (
                            <div key={index} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                              <p className="text-gray-700">{audience}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <Separator className="my-8" />

                      {/* Stages */}
                      <div className="mb-12">
                        <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                          <Calendar className="w-6 h-6 mr-3 text-red-600" />
                          Этапы реализации программы
                        </h3>
                        <div className="space-y-6">
                          {program.stages.map((stage, index) => (
                            <div key={index} className="flex gap-4 p-6 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-shadow duration-300">
                              <div className="flex-shrink-0">
                                <div className={`p-3 rounded-lg bg-gradient-to-br ${program.color} text-white`}>
                                  {stage.icon}
                                </div>
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <Badge variant="outline" className="text-xs">
                                    Этап {index + 1}
                                  </Badge>
                                </div>
                                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                                  {stage.title}
                                </h4>
                                <p className="text-gray-600">
                                  {stage.description}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <Separator className="my-8" />

                      {/* Expected Results */}
                      <div className="mb-8">
                        <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                          <Award className="w-6 h-6 mr-3 text-red-600" />
                          Ожидаемые результаты
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {program.results.map((result, index) => (
                            <div key={index} className="flex items-start gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
                              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                              <p className="text-gray-800">{result}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* CTA */}
                      <div className="text-center pt-8 border-t border-gray-200">
                        <Button 
                          size="lg"
                          className={`bg-gradient-to-r ${program.color} ${program.hoverColor} text-white font-semibold px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300`}
                          onClick={handleContactClick}
                        >
                          <MessageCircle className="w-5 h-5 mr-2" />
                          Обсудить программу {program.title}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          )}
        </div>
      </section>

      {/* Contact CTA Section */}
      <section className="py-20 bg-gradient-to-r from-red-600 to-red-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Готовы начать?
          </h2>
          <p className="text-xl text-white/90 mb-8 leading-relaxed">
            Получите персональную консультацию и узнайте, какая программа 
            подходит именно для вашего бизнеса
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              className="bg-white text-red-600 hover:bg-gray-50 font-semibold px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={handleContactClick}
            >
              <Phone className="w-5 h-5 mr-2" />
              +992 93 570 0007
            </Button>
            <Button 
              size="lg"
              className="bg-white text-red-600 hover:bg-gray-50 font-semibold px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={() => window.open('mailto:info@farado.tj')}
            >
              <Mail className="w-5 h-5 mr-2" />
              info@farado.tj
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}