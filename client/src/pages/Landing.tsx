import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Building2, Globe, Users } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="space-y-8">
          <div className="space-y-6">
            <div className="text-5xl font-bold text-gray-900">
              Добро пожаловать в 
              <span className="text-red-600 block">FARADO</span>
            </div>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Ваш надежный партнер для успешного ведения бизнеса с Китаем. 
              Комплексные логистические решения и полный цикл сопровождения.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 my-12">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6 text-center">
                <Building2 className="w-12 h-12 text-red-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">7+ лет опыта</h3>
                <p className="text-sm text-gray-600">
                  Проверенная экспертиза в международной торговле
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6 text-center">
                <Globe className="w-12 h-12 text-red-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">3+ стран</h3>
                <p className="text-sm text-gray-600">
                  География наших поставок по всему миру
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6 text-center">
                <Users className="w-12 h-12 text-red-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">2000+ заказов</h3>
                <p className="text-sm text-gray-600">
                  Успешно выполненных проектов
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900">
                Начните сотрудничество прямо сейчас
              </h2>
              <p className="text-gray-600">
                Войдите в клиентский портал для доступа к персональным услугам 
                и отслеживанию ваших заказов
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => window.location.href = '/api/login'}
                size="lg"
                className="bg-red-600 hover:bg-red-700 text-lg px-8 py-4"
              >
                Войти в Портал
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>

              <Link href="/">
                <Button 
                  variant="outline" 
                  size="lg"
                  className="text-lg px-8 py-4 border-gray-300 hover:border-red-600 hover:text-red-600"
                >
                  Узнать больше
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
