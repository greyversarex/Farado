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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useTranslation } from "@/lib/simple-i18n";

const quoteRequestSchema = z.object({
  name: z.string().min(1, "Имя обязательно"),
  email: z.string().email("Введите корректный email"),
  phone: z.string().optional(),
  company: z.string().optional(),
  serviceType: z.string().min(1, "Выберите тип услуги"),
  description: z.string().min(10, "Опишите ваш запрос подробнее"),
  estimatedBudget: z.string().optional(),
  timeline: z.string().optional(),
  sourceCountry: z.string().optional(),
  destinationCountry: z.string().optional(),
});

type QuoteRequestForm = z.infer<typeof quoteRequestSchema>;

interface QuoteRequestFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const getServiceTypes = (t: any) => [
  { value: "sourcing", label: t('services.sourcing') },
  { value: "logistics", label: t('services.logistics') },
  { value: "customs", label: t('services.customs') },
  { value: "oem", label: t('services.oem') },
  { value: "warehouse", label: t('services.warehouse') },
  { value: "comprehensive", label: t('services.support') },
];

export function QuoteRequestForm({ open, onOpenChange }: QuoteRequestFormProps) {
  const { toast } = useToast();
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;
  
  const serviceTypes = getServiceTypes(t);

  const form = useForm<QuoteRequestForm>({
    resolver: zodResolver(quoteRequestSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      company: "",
      serviceType: "",
      description: "",
      estimatedBudget: "",
      timeline: "",
      sourceCountry: "",
      destinationCountry: "",
    },
  });

  const createQuoteMutation = useMutation({
    mutationFn: async (data: QuoteRequestForm) => {
      return await apiRequest("/api/quote-requests", {
        method: "POST",
        body: JSON.stringify(data)
      });
    },
    onSuccess: () => {
      toast({
        title: t('forms.quote.success'),
        description: "Мы свяжемся с вами в течение 24 часов",
      });
      onOpenChange(false);
      form.reset();
      setCurrentStep(1);
    },
    onError: (error: Error) => {
      toast({
        title: t('forms.quote.error'),
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: QuoteRequestForm) => {
    createQuoteMutation.mutate(data);
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const progress = (currentStep / totalSteps) * 100;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">
{t('forms.quote.title')}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Шаг {currentStep} из {totalSteps}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {currentStep === 1 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Контактная информация</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('forms.quote.contactPerson')} *</FormLabel>
                          <FormControl>
                            <Input placeholder={t('pages.contact.placeholder.name')} {...field} />
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
                        <FormLabel>{t('forms.quote.email')} *</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="your@email.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="company"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('forms.quote.companyName')}</FormLabel>
                        <FormControl>
                          <Input placeholder={t('forms.quote.companyName')} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Детали услуги</h3>
                  
                  <FormField
                    control={form.control}
                    name="serviceType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('forms.quote.serviceType')} *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={t('forms.quote.serviceType')} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {serviceTypes.map((service) => (
                              <SelectItem key={service.value} value={service.value}>
                                {service.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="sourceCountry"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('forms.quote.originCountry')}</FormLabel>
                          <FormControl>
                            <Input placeholder={t('forms.quote.originCountry')} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="destinationCountry"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('forms.quote.destinationCountry')}</FormLabel>
                          <FormControl>
                            <Input placeholder={t('forms.quote.destinationCountry')} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="estimatedBudget"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('forms.quote.estimatedBudget')}</FormLabel>
                          <FormControl>
                            <Input placeholder="$ 10,000 - 50,000" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="timeline"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('forms.quote.timeline')}</FormLabel>
                          <FormControl>
                            <Input placeholder="1-2 месяца" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">{t('forms.quote.description')}</h3>
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('forms.quote.description')} *</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Расскажите подробнее о ваших потребностях, требованиях к товарам, объемах, особенностях доставки и других важных деталях..."
                            rows={6}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Что будет дальше?</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Мы изучим ваш запрос в течение 2-4 часов</li>
                      <li>• Подготовим детальное коммерческое предложение</li>
                      <li>• Свяжемся с вами для уточнения деталей</li>
                      <li>• Предоставим расчет стоимости и сроков</li>
                    </ul>
                  </div>
                </div>
              )}

              <div className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Назад
                </Button>

                {currentStep < totalSteps ? (
                  <Button
                    type="button"
                    onClick={nextStep}
                    className="flex items-center gap-2 bg-red-600 hover:bg-red-700"
                  >
                    Далее
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={createQuoteMutation.isPending}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    {createQuoteMutation.isPending ? "Отправка..." : "Получить Предложение"}
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
