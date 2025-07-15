import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { QuoteRequestForm } from "@/components/forms/QuoteRequestForm";
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
  Send,
  Trophy
} from "lucide-react";

export default function Home() {
  const [isQuoteFormOpen, setIsQuoteFormOpen] = useState(false);

  const { data: stats } = useQuery({
    queryKey: ["/api/stats"],
  }) as { data: CompanyStats | undefined };

  const services = [
    {
      icon: Search,
      title: 'Закуп и Поиск Поставщиков',
      description: 'Поиск надежных производителей, аудит фабрик, переговоры и контроль качества на всех этапах сотрудничества.'
    },
    {
      icon: Truck,
      title: 'Международная Логистика',
      description: 'Оптимальные маршруты доставки через авиа, также автомобильными и железнодорожными путями.'
    },
    {
      icon: FileText,
      title: 'Таможенное Оформление',
      description: 'Полное юридическое сопровождение, подготовка документов, сертификация и декларирование грузов.'
    },
    {
      icon: Factory,
      title: 'OEM/ODM Производство',
      description: 'Производство товаров под вашим брендом с полным циклом — от разработки до готовой продукции.'
    },
    {
      icon: Warehouse,
      title: 'Складские Услуги',
      description: 'Сеть складов в ключевых городах Китая для хранения, консолидации и подготовки грузов к отправке.'
    },
    {
      icon: Headphones,
      title: 'Полное Сопровождение',
      description: 'Персональный менеджер, прозрачная отчетность и поддержка на всех этапах сотрудничества 24/7.'
    }
  ];

  const advantages = [
    {
      icon: Award,
      title: "Опыт 7+ лет",
      description: "Более семи лет успешной работы на рынке международной торговли с Китаем. Знаем все тонкости и подводные камни."
    },
    {
      icon: Globe,
      title: "Представительства в Китае",
      description: "Офисы в Гуанчжоу и собственные склады в ключевых торговых городах Китая."
    },
    {
      icon: Shield,
      title: "Гарантии и Прозрачность",
      description: "Прозрачное ценообразование, договорные гарантии и полная отчетность."
    },
    {
      icon: Users,
      title: "Комплексный Подход",
      description: "Все задачи решаем под ключ — от поиска поставщика до доставки товара."
    },
    {
      icon: Languages,
      title: "Языковые Компетенции",
      description: "Свободное владение китайским, русским, таджикским и английским языками."
    },
    {
      icon: Headphones,
      title: "Поддержка 24/7",
      description: "Круглосуточная поддержка клиентов и оперативное решение возникающих вопросов."
    }
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Ваш надежный мост для бизнеса с Китаем
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-red-100 leading-relaxed">
              Комплексные логистические решения, закуп товаров и OEM/ODM производство с полным циклом сопровождения от экспертов с 10+ летним опытом работы с Китаем.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-red-600 hover:bg-red-50 font-semibold px-8 py-4 text-lg"
                onClick={() => setIsQuoteFormOpen(true)}
              >
                Рассчитать Стоимость
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-red-600 font-semibold px-8 py-4 text-lg"
              >
                Наши Услуги
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-red-600 mb-2">{stats?.yearsExperience || 7}+</div>
              <div className="text-gray-600">лет опыта</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-red-600 mb-2">{stats?.totalOrders || 2000}+</div>
              <div className="text-gray-600">заказов</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-red-600 mb-2">{stats?.countriesServed || 3}</div>
              <div className="text-gray-600">стран</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-red-600 mb-2">{stats?.warehouses || 6}</div>
              <div className="text-gray-600">складов</div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Наши ключевые услуги</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Полный спектр услуг для успешного ведения бизнеса с Китаем — от поиска поставщиков до доставки товаров
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <service.icon className="w-12 h-12 text-red-600 mb-4" />
                  <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
                  <p className="text-gray-600">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Почему выбирают FARADO?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Наши конкурентные преимущества, которые делают нас надежным партнером для вашего бизнеса
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {advantages.map((advantage, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <advantage.icon className="w-12 h-12 text-red-600 mb-4" />
                  <h3 className="text-xl font-semibold mb-3">{advantage.title}</h3>
                  <p className="text-gray-600">{advantage.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-red-600 to-red-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Готовы начать работу с Китаем?</h2>
          <p className="text-xl mb-8 text-red-100">
            Получите персональную консультацию и расчет стоимости вашего проекта
          </p>
          <Button 
            size="lg" 
            className="bg-white text-red-600 hover:bg-red-50 font-semibold px-8 py-4 text-lg"
            onClick={() => setIsQuoteFormOpen(true)}
          >
            Получить Расчет
          </Button>
        </div>
      </section>

      {/* Quote Form Modal */}
      <QuoteRequestForm 
        isOpen={isQuoteFormOpen}
        onClose={() => setIsQuoteFormOpen(false)}
      />
    </>
  );
}