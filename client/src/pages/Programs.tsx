import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useTranslation } from "@/lib/simple-i18n";
import { 
  Rocket, 
  Settings, 
  CheckCircle, 
  Target,
  Users,
  BarChart3,
  Factory,
  Handshake,
  TrendingUp,
  ArrowRight,
  Phone,
  ShieldCheck,
  Award,
  Zap,
  Star
} from "lucide-react";

export default function Programs() {
  const { t } = useTranslation();
  const [selectedProgram, setSelectedProgram] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    const timer = setInterval(() => {
      setCurrentStep(prev => (prev + 1) % 5);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const handleContactClick = () => {
    window.location.href = '/contact';
  };

  const businessStartProgram = {
    id: 'business-start',
    title: t('pages.programs.businessStart.title'),
    subtitle: t('pages.programs.businessStart.subtitle'),
    description: t('pages.programs.businessStart.description'),
    icon: <Rocket className="w-8 h-8" />,
    color: 'from-red-500 to-red-600',
    hoverColor: 'hover:from-red-600 hover:to-red-700',
    stages: '5',
    targetAudience: [
      t('pages.programs.businessStart.audience1'),
      t('pages.programs.businessStart.audience2')
    ],
    stagesList: [
      {
        title: t('pages.programs.businessStart.stage1Title'),
        description: t('pages.programs.businessStart.stage1Desc'),
        icon: <BarChart3 className="w-6 h-6" />
      },
      {
        title: t('pages.programs.businessStart.stage2Title'),
        description: t('pages.programs.businessStart.stage2Desc'),
        icon: <Factory className="w-6 h-6" />
      },
      {
        title: t('pages.programs.businessStart.stage3Title'),
        description: t('pages.programs.businessStart.stage3Desc'),
        icon: <Target className="w-6 h-6" />
      },
      {
        title: t('pages.programs.businessStart.stage4Title'),
        description: t('pages.programs.businessStart.stage4Desc'),
        icon: <Handshake className="w-6 h-6" />
      },
      {
        title: t('pages.programs.businessStart.stage5Title'),
        description: t('pages.programs.businessStart.stage5Desc'),
        icon: <TrendingUp className="w-6 h-6" />
      }
    ],
    results: [
      t('pages.programs.businessStart.result1'),
      t('pages.programs.businessStart.result2'),
      t('pages.programs.businessStart.result3'),
      t('pages.programs.businessStart.result4')
    ]
  };

  const controlProgram = {
    id: 'control',
    title: t('pages.programs.control.title'),
    subtitle: t('pages.programs.control.subtitle'),
    description: t('pages.programs.control.description'),
    icon: <Settings className="w-8 h-8" />,
    color: 'from-red-500 to-red-600',
    hoverColor: 'hover:from-red-600 hover:to-red-700',
    stages: '4',
    targetAudience: [
      t('pages.programs.control.audience1'),
      t('pages.programs.control.audience2')
    ],
    stagesList: [
      {
        title: t('pages.programs.control.stage1Title'),
        description: t('pages.programs.control.stage1Desc'),
        icon: <ShieldCheck className="w-6 h-6" />
      },
      {
        title: t('pages.programs.control.stage2Title'),
        description: t('pages.programs.control.stage2Desc'),
        icon: <Factory className="w-6 h-6" />
      },
      {
        title: t('pages.programs.control.stage3Title'),
        description: t('pages.programs.control.stage3Desc'),
        icon: <BarChart3 className="w-6 h-6" />
      },
      {
        title: t('pages.programs.control.stage4Title'),
        description: t('pages.programs.control.stage4Desc'),
        icon: <Award className="w-6 h-6" />
      }
    ],
    results: [
      t('pages.programs.control.result1'),
      t('pages.programs.control.result2'),
      t('pages.programs.control.result3'),
      t('pages.programs.control.result4')
    ]
  };

  const programs = [businessStartProgram, controlProgram];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-red-700 to-red-800"></div>
        <div className="absolute inset-0 bg-black/20"></div>
        
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full animate-pulse"></div>
          <div className="absolute top-40 right-20 w-32 h-32 bg-white/5 rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-white/10 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className={`text-4xl lg:text-6xl font-bold text-white mb-6 transition-all duration-1000 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}>
              {t('pages.programs.title')}
            </h1>
            <p className={`text-xl lg:text-2xl text-white/90 mb-12 leading-relaxed transition-all duration-1000 delay-300 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}>
              {t('pages.programs.subtitle')}
            </p>
            <div className={`flex flex-col sm:flex-row gap-4 justify-center transition-all duration-1000 delay-500 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}>
              <Button 
                size="lg"
                className="bg-white text-red-600 hover:bg-gray-50 font-semibold px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
                onClick={handleContactClick}
              >
                <Phone className="w-5 h-5 mr-2 group-hover:animate-pulse" />
                {t('pages.programs.getConsultation')}
              </Button>
              
            </div>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section id="programs" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {programs.map((program, index) => (
              <Card 
                key={program.id}
                className={`relative overflow-hidden cursor-pointer transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 ${
                  selectedProgram === program.id ? 'ring-4 ring-red-500 shadow-2xl scale-[1.02]' : 'hover:shadow-xl'
                } ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}
                style={{ transitionDelay: `${800 + index * 200}ms` }}
                onClick={() => setSelectedProgram(selectedProgram === program.id ? null : program.id)}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${program.color} opacity-5 transition-opacity duration-300 hover:opacity-10`}></div>
                <CardHeader className="relative pb-6">
                  <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${program.color} text-white mb-4 w-fit transition-all duration-300 hover:scale-110 hover:rotate-3 group`}>
                    <div className="group-hover:animate-pulse">
                      {program.icon}
                    </div>
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
                      {program.id === 'business-start' ? t('pages.programs.businessStart.stages') : t('pages.programs.control.stages')}
                    </Badge>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className={`${program.hoverColor} hover:text-white transition-all duration-300`}
                    >
                      {selectedProgram === program.id ? 'Скрыть детали' : t('pages.programs.businessStart.details')}
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
                  <Card key={program.id} className="bg-white border-2 border-red-100 overflow-hidden">
                    {/* Animated progress bar */}
                    <div className="h-1 bg-gradient-to-r from-red-500 to-red-600 animate-pulse"></div>
                    <CardHeader className="border-b bg-gradient-to-r from-red-50 to-gray-50">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl bg-gradient-to-br ${program.color} text-white`}>
                          {program.icon}
                        </div>
                        <div>
                          <CardTitle className="text-2xl text-gray-900">
                            {program.title}
                          </CardTitle>
                          <p className="text-gray-600">
                            {program.subtitle}
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-8">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Target Audience */}
                        <div>
                          <div className="flex items-center gap-2 mb-4">
                            <Users className="w-5 h-5 text-red-600" />
                            <h3 className="text-xl font-semibold text-gray-900">
                              {program.id === 'business-start' ? t('pages.programs.businessStart.targetAudience') : t('pages.programs.control.targetAudience')}
                            </h3>
                          </div>
                          <div className="space-y-3">
                            {program.targetAudience.map((audience, index) => (
                              <div key={index} className="flex items-start gap-3">
                                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                                <p className="text-gray-600 leading-relaxed">
                                  {audience}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Expected Results */}
                        <div>
                          <div className="flex items-center gap-2 mb-4">
                            <Target className="w-5 h-5 text-red-600" />
                            <h3 className="text-xl font-semibold text-gray-900">
                              {program.id === 'business-start' ? t('pages.programs.businessStart.expectedResults') : t('pages.programs.control.expectedResults')}
                            </h3>
                          </div>
                          <div className="space-y-3">
                            {program.results.map((result, index) => (
                              <div key={index} className="flex items-start gap-3">
                                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                                <p className="text-gray-600 leading-relaxed">
                                  {result}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <Separator className="my-8" />

                      {/* Implementation Stages */}
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-6">
                          {program.id === 'business-start' ? t('pages.programs.businessStart.implementationStages') : t('pages.programs.control.implementationStages')}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {program.stagesList.map((stage, index) => (
                            <div 
                              key={index}
                              className={`flex gap-4 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-all duration-300 hover:scale-105 hover:shadow-md ${
                                currentStep === index ? 'bg-red-50 border-2 border-red-200 shadow-lg' : ''
                              }`}
                            >
                              <div className="flex-shrink-0">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
                                  currentStep === index 
                                    ? 'bg-red-500 text-white scale-110 shadow-lg animate-pulse' 
                                    : 'bg-red-100 text-red-600'
                                }`}>
                                  {currentStep === index ? (
                                    <Star className="w-5 h-5" />
                                  ) : (
                                    index + 1
                                  )}
                                </div>
                              </div>
                              <div className="flex-1">
                                <h4 className="font-semibold text-gray-900 mb-2">
                                  {stage.title}
                                </h4>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                  {stage.description}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mt-8 text-center">
                        <Button 
                          size="lg"
                          className="relative bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group overflow-hidden"
                          onClick={handleContactClick}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                          <Phone className="w-5 h-5 mr-2 group-hover:animate-bounce" />
                          {t('pages.programs.contactUs')}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}