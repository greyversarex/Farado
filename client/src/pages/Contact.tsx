import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { PageBanner } from "@/components/ui/page-banner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useTranslation } from "@/lib/simple-i18n";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock,
  MessageSquare,
  Send,
  CheckCircle
} from "lucide-react";

const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().optional(),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactForm = z.infer<typeof contactSchema>;

export default function Contact() {
  const { toast } = useToast();
  const { t } = useTranslation();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    },
  });

  const contactMutation = useMutation({
    mutationFn: async (data: ContactForm) => {
      return await apiRequest("/api/contact", {
        method: "POST",
        body: JSON.stringify(data)
      });
    },
    onSuccess: () => {
      setIsSubmitted(true);
      toast({
        title: t('pages.contact.success'),
        description: "We will contact you soon",
      });
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        title: t('pages.contact.error'),
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ContactForm) => {
    contactMutation.mutate(data);
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: t('pages.home.contact.offices'),
      details: [
        `${t('pages.home.contact.dushanbe')}: ул. Рудаки 123, ${t('pages.home.contact.office')} 45`,
        `${t('pages.home.contact.guangzhou')}: Tianhe District, Office 1201`
      ]
    },
    {
      icon: Phone,
      title: t('pages.home.contact.phones'),
      details: [
        "+992 170 66 5555",
        "+86 20 123 456 789"
      ]
    },
    {
      icon: Mail,
      title: t('pages.home.contact.email'),
      details: [
        "contact@farado.global",
        "support@farado.global"
      ]
    },
    {
      icon: Clock,
      title: t('pages.home.contact.workingHours'),
      details: [
        `${t('pages.home.contact.monday')}: 9:00 - 18:00`,
        `${t('pages.home.contact.saturday')}: 9:00 - 14:00`,
        `${t('pages.home.contact.sunday')}: ${t('pages.home.contact.weekend')}`
      ]
    }
  ];

  const faqs = [
    {
      question: t('pages.contact.faq.q1'),
      answer: t('pages.contact.faq.a1')
    },
    {
      question: t('pages.contact.faq.q2'),
      answer: t('pages.contact.faq.a2')
    },
    {
      question: t('pages.contact.faq.q3'),
      answer: t('pages.contact.faq.a3')
    },
    {
      question: t('pages.contact.faq.q4'),
      answer: t('pages.contact.faq.a4')
    },
    {
      question: t('pages.contact.faq.q5'),
      answer: t('pages.contact.faq.a5')
    }
  ];

  return (
    <div className="min-h-screen">
      <PageBanner 
        title={t('pages.contact.title')}
        subtitle={t('pages.contact.subtitle')}
      />
      {/* Contact Info */}
      <section className="py-12 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-12 md:mb-16">
            {contactInfo.map((info, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6 md:p-8">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                    <info.icon className="text-red-600 w-6 h-6 md:w-8 md:h-8" />
                  </div>
                  <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4">{info.title}</h3>
                  <div className="space-y-2">
                    {info.details.map((detail, idx) => (
                      <div key={idx} className="text-gray-600 text-sm md:text-base">
                        {info.title === "Телефоны" ? (
                          <a href={`tel:${detail}`} className="hover:text-red-600 transition-colors">
                            {detail}
                          </a>
                        ) : info.title === "Email" ? (
                          <a href={`mailto:${detail}`} className="hover:text-red-600 transition-colors">
                            {detail}
                          </a>
                        ) : (
                          detail
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
            {/* Contact Form */}
            <div>
              <Card>
                <CardContent className="p-6 md:p-8">
                  <div className="flex items-center space-x-3 mb-4 md:mb-6">
                    <MessageSquare className="text-red-600 w-6 h-6 md:w-8 md:h-8" />
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900">{t('pages.home.contact.sendMessage')}</h2>
                  </div>

                  {isSubmitted ? (
                    <div className="text-center py-8">
                      <CheckCircle className="text-green-600 w-16 h-16 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        Сообщение отправлено!
                      </h3>
                      <p className="text-gray-600">
                        Спасибо за обращение. Мы свяжемся с вами в течение 24 часов.
                      </p>
                      <Button 
                        onClick={() => setIsSubmitted(false)}
                        variant="outline"
                        className="mt-4"
                      >
                        Отправить еще сообщение
                      </Button>
                    </div>
                  ) : (
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t('pages.contact.name')} *</FormLabel>
                                <FormControl>
                                  <Input placeholder={t('pages.contact.name')} {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t('forms.quote.phone')}</FormLabel>
                                <FormControl>
                                  <Input placeholder="+992 XX XXX XX XX" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email *</FormLabel>
                              <FormControl>
                                <Input type="email" placeholder="your@email.com" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="subject"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t('pages.contact.subject')} *</FormLabel>
                              <FormControl>
                                <Input placeholder={t('pages.contact.subjectPlaceholder')} {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="message"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t('pages.contact.message')} *</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder={t('pages.contact.messagePlaceholder')}
                                  rows={5}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <Button
                          type="submit"
                          disabled={contactMutation.isPending}
                          className="w-full bg-red-600 hover:bg-red-700"
                        >
                          {contactMutation.isPending ? (
                            t('pages.contact.sending')
                          ) : (
                            <>
                              {t('pages.home.contact.sendMessage')}
                              <Send className="ml-2 w-4 h-4" />
                            </>
                          )}
                        </Button>
                      </form>
                    </Form>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Map */}
            <div>
              <Card className="h-full">
                <CardContent className="p-0 h-full">
                  <div className="relative h-full min-h-[500px] bg-gray-100 rounded-lg overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                      alt="FARADO office locations on world map" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 to-blue-500/20"></div>
                    
                    {/* Office Markers - Positioned according to user map */}
                    {/* Dushanbe: Головной офис */}
                    <div className="absolute top-[35%] left-[58%] transform -translate-x-1/2 -translate-y-1/2">
                      <div className="bg-red-600 rounded-full p-3 shadow-lg animate-pulse">
                        <MapPin className="text-white w-6 h-6" />
                      </div>
                      <div className="bg-white rounded-lg p-2 mt-2 shadow-lg text-center text-sm border-2 border-red-200">
                        <div className="font-semibold text-red-700">{t('pages.home.contact.dushanbe')}</div>
                        <div className="text-gray-600">Головной офис</div>
                      </div>
                    </div>

                    {/* Guangzhou: Представительство */}
                    <div className="absolute top-[58%] right-[25%] transform translate-x-1/2 -translate-y-1/2">
                      <div className="bg-blue-600 rounded-full p-3 shadow-lg animate-pulse">
                        <MapPin className="text-white w-6 h-6" />
                      </div>
                      <div className="bg-white rounded-lg p-2 mt-2 shadow-lg text-center text-sm border-2 border-blue-200">
                        <div className="font-semibold text-blue-700">{t('pages.home.contact.guangzhou')}</div>
                        <div className="text-gray-600">Представительство</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              {t('pages.contact.faqTitle')}
            </h2>
            <p className="text-xl text-gray-600">
              {t('pages.contact.faqSubtitle')}
            </p>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    {faq.question}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">
              Не нашли ответ на свой вопрос?
            </p>
            <Button 
              onClick={() => {
                const element = document.querySelector('[name="subject"]') as HTMLInputElement;
                element?.focus();
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              Задать Вопрос
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
