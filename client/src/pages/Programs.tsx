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
  Target,
  Users,
  BarChart3,
  Factory,
  Handshake,
  TrendingUp,
  ArrowRight,
  Phone,
  ShieldCheck,
  Award
} from "lucide-react";

export default function Programs() {
  const { t } = useTranslation();
  const [selectedProgram, setSelectedProgram] = useState<string | null>(null);

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
    color: 'from-gray-500 to-gray-600',
    hoverColor: 'hover:from-gray-600 hover:to-gray-700',
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
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6">
              {t('pages.programs.title')}
            </h1>
            <p className="text-xl lg:text-2xl text-white/90 mb-12 leading-relaxed">
              {t('pages.programs.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                className="bg-white text-red-600 hover:bg-gray-50 font-semibold px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={handleContactClick}
              >
                <Phone className="w-5 h-5 mr-2" />
                {t('pages.programs.getConsultation')}
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-red-600 font-semibold px-8 py-4 rounded-full transition-all duration-300"
                onClick={() => document.getElementById('programs')?.scrollIntoView({ behavior: 'smooth' })}
              >
                {t('pages.programs.consultation')}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section id="programs" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                      {program.stages} {program.id === 'business-start' ? t('pages.programs.businessStart.stages') : t('pages.programs.control.stages')}
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
                  <Card key={program.id} className="bg-white border-2 border-red-100">
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
                              className="flex gap-4 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
                            >
                              <div className="flex-shrink-0">
                                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-semibold">
                                  {index + 1}
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
                          className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                          onClick={handleContactClick}
                        >
                          <Phone className="w-5 h-5 mr-2" />
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