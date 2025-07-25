// Simple Global Translation System without Context
import { useState, useEffect } from 'react';
import { TRANSLATIONS, TranslationKey, SupportedLanguage, getTranslation } from './translations';

export type Language = SupportedLanguage;

// Global language state
let currentLanguage: Language = 'ru';

// Load saved language from localStorage
if (typeof window !== 'undefined') {
  const saved = localStorage.getItem('language');
  if (saved && ['ru', 'tj', 'en', 'zh'].includes(saved)) {
    currentLanguage = saved as Language;
  }
}

// Complete translations for all languages
const translations = {
  ru: {
    // Navigation
    nav: {
      services: 'Услуги',
      programs: 'Программы',
      about: 'О компании',
      process: 'Как мы работаем',
      blog: 'Блог',
      contact: 'Контакты',
      clientPortal: 'Портал клиента'
    },
    
    // Hero Section
    hero: {
      title: 'Ваш надежный мост для бизнеса с Китаем',
      subtitle: 'Комплексные логистические решения, закуп товаров и OEM/ODM производство с полным циклом сопровождения от экспертов с 10+ летним опытом работы с Китаем.',
      cta: 'Рассчитать Стоимость',
      services: 'Наши Услуги'
    },
    
    // Pages
    pages: {
      about: {
        title: 'О компании FARADO',
        subtitle: 'Ваш надежный партнер в международной торговле с Китаем',
        description: 'Мы — международная логистическая компания, специализирующаяся на торговых маршрутах между Китаем и Центральной Азией.',
        ourStory: 'Наша история',
        ourValues: 'Наши ценности',
        team: 'Наша команда',
        achievements: 'Наши достижения',
        experience: 'лет опыта',
        orders: 'выполненных заказов',
        countries: 'стран',
        satisfaction: 'удовлетворенность клиентов',
        employees: 'сотрудников',
        mapConnection: 'Связующее звено',
        reliability: 'Надежность',
        reliabilityDesc: 'Мы обеспечиваем стабильность и предсказуемость в каждой поставке',
        clientFocus: 'Клиентоориентированность',
        clientFocusDesc: 'Каждое решение принимается с учетом потребностей клиента',
        quality: 'Качество',
        qualityDesc: 'Строгий контроль качества на всех этапах сотрудничества',
        partnership: 'Партнерство',
        partnershipDesc: 'Мы строим долгосрочные отношения, основанные на взаимном доверии',
        development: 'Развитие',
        developmentDesc: 'Постоянно совершенствуем наши услуги и расширяем возможности',
        global: 'Глобальность',
        globalDesc: 'Международная сеть партнеров и офисов для максимального охвата'
      },
      contact: {
        title: 'Контакты',
        subtitle: 'Свяжитесь с нами для получения консультации',
        error: 'Ошибка отправки сообщения',
        success: 'Сообщение отправлено успешно',
        name: 'Имя',
        subject: 'Тема',
        message: 'Сообщение',
        placeholder: {
          name: 'Ваше имя'
        },
        subjectPlaceholder: 'Тема сообщения',
        messagePlaceholder: 'Ваше сообщение',
        mapTitle: 'Наше местоположение',
        mapSubtitle: 'Мы находимся в ключевых торговых точках',
        coordinates: 'Координаты',
        distance: 'Расстояние',
        deliveryTime: 'Время доставки',
        days: 'дней',
        faqTitle: 'Часто задаваемые вопросы',
        faqSubtitle: 'Ответы на популярные вопросы о наших услугах',
        faq: {
          q1: 'Какие документы нужны для заказа?',
          a1: 'Для оформления заказа необходимы: паспорт, документы на компанию (для юр. лиц), техническое задание на товар.',
          q2: 'Сколько времени занимает доставка?',
          a2: 'Стандартная доставка занимает 15-25 дней в зависимости от маршрута. Экспресс-доставка - 7-10 дней.',
          q3: 'Предоставляете ли вы гарантии?',
          a3: 'Да, мы предоставляем полную гарантию на все этапы сделки, включая страхование груза.',
          q4: 'Можно ли отследить груз?',
          a4: 'Конечно! Каждому клиенту предоставляется трекинг-номер для отслеживания груза в реальном времени.',
          q5: 'Какие способы оплаты вы принимаете?',
          a5: 'Мы принимаем банковские переводы, наличные, криптовалюту. Возможна оплата частями.'
        }
      },
      home: {
        howWeWork: {
          title: 'Как мы работаем',
          subtitle: 'Наш процесс работы — прозрачный и эффективный путь к успеху вашего бизнеса',
          step1: 'Консультация',
          step2: 'Поиск поставщиков',
          step3: 'Переговоры',
          step4: 'Доставка',
          step1Desc: 'Бесплатная консультация и анализ ваших потребностей',
          step2Desc: 'Поиск и проверка надежных поставщиков в Китае',
          step3Desc: 'Переговоры о цене и условиях поставки',
          step4Desc: 'Организация доставки и таможенное оформление',
          startCollaboration: 'Начать сотрудничество'
        },
        numbers: {
          title: 'Наши достижения в цифрах',
          subtitle: 'Результаты, которые говорят о нашем профессионализме',
          completedOrders: 'Выполненных заказов',
          deliveryCountries: 'Стран доставки',
          averageSavings: 'Средняя экономия',
          warehousesInChina: 'Складов в Китае'
        },
        readyToStart: {
          title: 'Готовы начать работу с Китаем?',
          subtitle: 'Получите персональную консультацию и расчет стоимости вашего проекта',
          getQuote: 'Получить Расчет',
          freeConsultation: 'Бесплатная консультация',
          freeConsultationDesc: 'Обсудим ваши потребности и возможности',
          costCalculation: 'Расчет стоимости',
          costCalculationDesc: 'Точный расчет всех расходов на ваш проект',
          individualOffer: 'Индивидуальное предложение',
          individualOfferDesc: 'Персональные условия сотрудничества'
        },
        geography: {
          title: 'География наших услуг',
          subtitle: 'Международная сеть логистических маршрутов',
          routes: 'Основные маршруты доставки'
        },
        contact: {
          offices: 'Наши офисы',
          dushanbe: 'Душанбе',
          guangzhou: 'Гуанчжоу',
          office: 'Офис',
          phones: 'Телефоны',
          email: 'Email',
          workingHours: 'Режим работы',
          monday: 'Понедельник',
          saturday: 'Суббота',
          sunday: 'Воскресенье',
          weekend: 'Выходной',
          sendMessage: 'Отправить сообщение',
          headOffice: 'Головной офис',
          representative: 'Представительство'
        }
      },
      services: {
        title: 'Услуги',
        subtitle: 'Полный спектр услуг для вашего бизнеса с Китаем',
        getQuote: 'Получить расчет',
        team: {
          subtitle: 'Наша команда экспертов',
          farkhodName: 'Фарход Рахимов',
          farkhodPosition: 'Основатель и генеральный директор'
        },
        timeline: {
          founding: '2015 - Основание',
          foundingDesc: 'Начало деятельности в сфере логистики',
          warehouse: '2017 - Склады',
          warehouseDesc: 'Открытие складов в ключевых городах Китая',
          oem: '2019 - OEM производство',
          oemDesc: 'Запуск услуг OEM/ODM производства',
          international: '2021 - Международное расширение',
          internationalDesc: 'Выход на рынки Центральной Азии',
          tajikistan: '2023 - Таджикистан',
          tajikistanDesc: 'Открытие офиса в Душанбе'
        }
      },
      clientPortal: {
        title: 'Портал клиента',
        subtitle: 'Отслеживание ваших заказов и грузов',
        trackOrder: 'Отследить заказ',
        trackingNumber: 'Номер для отслеживания',
        search: 'Найти',
        searching: 'Поиск...',
        orderNotFound: 'Заказ не найден',
        orderCode: 'Код заказа',
        orderStatus: 'Статус заказа',
        customer: 'Заказчик',
        destination: 'Пункт назначения',
        expectedDelivery: 'Ожидаемая доставка',
        items: 'Товары',
        itemCode: 'Код товара',
        itemName: 'Название товара',
        quantity: 'Количество',
        status: 'Статус',
        warehouse: 'Склад',
        weight: 'Вес',
        volume: 'Объем',
        totalAmount: 'Итоговая сумма'
      },
      programs: {
        title: 'Программы',
        subtitle: 'Комплексные программы развития бизнеса',
        businessStart: {
          title: 'FARADO Business Start',
          subtitle: 'Запуск вашего бизнеса с нуля',
          description: 'Поможем запустить ваш бизнес, даже если он ещё не придуман. Предложим нишу, найдём поставщиков, заключим контракты и организуем первые поставки.',
          stages: '5 этапов',
          details: 'Подробнее',
          targetAudience: 'Целевая аудитория',
          audience1: 'Физические лица и компании, планирующие впервые организовать импортные поставки из Китая',
          audience2: 'Предприятия, заинтересованные в освоении новых товарных ниш через китайский импорт',
          implementationStages: 'Этапы реализации',
          stage1Title: 'Маркетинговый анализ и идентификация ниши',
          stage1Desc: 'Анализ рыночных тенденций, конкурентной среды и формирование списка рентабельных товарных категорий',
          stage2Title: 'Поиск и верификация поставщиков',
          stage2Desc: 'Подбор и проверка производителей в Китае по критериям цены, качества и надёжности',
          stage3Title: 'Организация закупки образцов',
          stage3Desc: 'Заказ и доставка образцов продукции от разных поставщиков для тестирования',
          stage4Title: 'Переговоры и контрактация',
          stage4Desc: 'Ведение переговоров и подготовка юридически защищённых контрактов ВЭД',
          stage5Title: 'Первая коммерческая партия',
          stage5Desc: 'Размещение заказа, контроль производства и организация доставки до клиента',
          expectedResults: 'Ожидаемые результаты',
          result1: 'Запущенный бизнес-проект по импорту выбранного товара из Китая',
          result2: 'Налаженные связи с проверенными китайскими поставщиками',
          result3: 'Протестированная и отлаженная схема поставки',
          result4: 'Минимизированные риски и издержки начального этапа ВЭД'
        },
        control: {
          title: 'FARADO Control',
          subtitle: 'Оптимизация существующих поставок',
          description: 'Найдём лучших поставщиков для вашего бизнеса со всего Китая. Проведём аудит вашей системы поставок и предложим новые решения для оптимизации ВЭД.',
          stages: '4 этапа',
          details: 'Подробнее',
          targetAudience: 'Целевая аудитория',
          audience1: 'Компании, имеющие опыт импорта из Китая и стремящиеся оптимизировать логистику',
          audience2: 'Предприятия, желающие расширить ассортимент или найти более выгодных поставщиков',
          implementationStages: 'Этапы реализации',
          stage1Title: 'Аудит текущих поставок',
          stage1Desc: 'Анализ существующих поставщиков, оценка качества продукции, логистических маршрутов и финансовых показателей',
          stage2Title: 'Поиск альтернативных поставщиков',
          stage2Desc: 'Исследование рынка и подбор потенциально более выгодных производителей с лучшими условиями',
          stage3Title: 'Сравнительный анализ предложений',
          stage3Desc: 'Комплексное сравнение текущих и предлагаемых поставщиков по цене, качеству и условиям',
          stage4Title: 'Внедрение оптимизированной схемы',
          stage4Desc: 'Постепенный переход на новых поставщиков с минимизацией рисков для бизнеса',
          expectedResults: 'Ожидаемые результаты',
          result1: 'Снижение себестоимости закупок на 15-30%',
          result2: 'Улучшение качества поставляемой продукции',
          result3: 'Диверсификация поставщиков для снижения рисков',
          result4: 'Оптимизированная логистическая схема доставки'
        },
        consultation: 'Консультация',
        getConsultation: 'Получить консультацию',
        contactUs: 'Свяжитесь с нами'
      }
    },
    
    // Services
    services: {
      sourcing: 'Закуп и Поиск Поставщиков',
      logistics: 'Международная Логистика',
      customs: 'Таможенное Оформление',
      oem: 'OEM/ODM Производство',
      warehouse: 'Складские Услуги',
      support: 'Полное Сопровождение',
      sampling: 'Образцы товаров',
      sourcingDesc: 'Поиск надежных производителей, аудит фабрик, переговоры и контроль качества на всех этапах сотрудничества.',
      logisticsDesc: 'Оптимальные маршруты доставки через авиа, также автомобильными и железнодорожными путями.',
      customsDesc: 'Полное юридическое сопровождение, подготовка документов, сертификация и декларирование грузов.',
      oemDesc: 'Производство товаров под вашим брендом с полным циклом — от разработки до готовой продукции.',
      warehouseDesc: 'Сеть складов в ключевых городах Китая для хранения, консолидации и подготовки грузов к отправке.',
      supportDesc: 'Персональный менеджер, прозрачная отчетность и поддержка на всех этапах сотрудничества 24/7.',
      
      title: 'Наши услуги',
      subtitle: 'Полный спектр логистических решений',
      experienceTitle: 'Опыт работы',
      experienceDesc: 'Более 10 лет успешной работы с китайскими поставщиками',
      officesTitle: 'Офисы в Китае',
      officesDesc: 'Представительства в ключевых торговых городах',
      guaranteesTitle: 'Гарантии качества',
      guaranteesDesc: 'Полный контроль качества на всех этапах',
      comprehensiveTitle: 'Комплексные решения',
      comprehensiveDesc: 'От поиска поставщиков до доставки "под ключ"',
      languageTitle: 'Языковая поддержка',
      languageDesc: 'Общение на русском, таджикском, английском и китайском',
      support247: 'Поддержка 24/7',
      whyChoose: 'Почему выбирают нас',
      whyChooseSubtitle: 'Преимущества работы с FARADO Global',
      
      sourcingDetails: {
        timeSaving: 'Экономия времени',
        verifiedSuppliers: 'Проверенные поставщики',
        directContact: 'Прямые контакты',
        logisticsSpeed: 'Скорость доставки',
        fullInsurance: 'Полное страхование',
        realTimeTracking: 'Отслеживание в реальном времени',
        customsExpertise: 'Экспертиза таможни',
        documentPrep: 'Подготовка документов',
        properDocuments: 'Правильное оформление',
        productionControl: 'Контроль производства',
        oemExperience: 'Опыт OEM',
        lowCosts: 'Низкие затраты',
        modernFacilities: 'Современные склады',
        goodsConsolidation: 'Консолидация товаров',
        flexibleStorage: 'Гибкое хранение',
        personalManager: 'Персональный менеджер',
        transparentReports: 'Прозрачная отчетность',
        expertConsultations: 'Экспертные консультации'
      },

      process: {
        search: 'Поиск',
        verification: 'Проверка',
        partnership: 'Партнерство',
        route: 'Маршрут',
        delivery: 'Доставка',
        tracking: 'Отслеживание',
        documents: 'Документы',
        processing: 'Обработка',
        receiving: 'Получение',
        production: 'Производство',
        control: 'Контроль',
        quality: 'Качество',
        warehouse: 'Склад',
        consolidation: 'Консолидация',
        shipment: 'Отгрузка',
        consultation: 'Консультация',
        support: 'Поддержка',
        success: 'Успех'
      }
    },
    
    // Forms
    forms: {
      quote: {
        title: 'Запрос коммерческого предложения',
        contactPerson: 'Контактное лицо',
        name: 'Имя',
        email: 'Email',
        phone: 'Телефон/Whatsapp/Telegram',
        companyName: 'Название компании',
        serviceType: 'Тип услуги',
        originCountry: 'Страна отправления',
        destinationCountry: 'Страна назначения',
        estimatedBudget: 'Примерный бюджет',
        timeline: 'Сроки выполнения',
        description: 'Описание запроса',
        submit: 'Отправить запрос',
        success: 'Запрос отправлен успешно',
        error: 'Ошибка отправки запроса',
        step: 'Шаг',
        of: 'из',
        contactInfo: 'Контактная информация',
        serviceDetails: 'Детали услуги',
        back: 'Назад',
        next: 'Далее',
        getQuote: 'Получить Предложение',
        sending: 'Отправка...',
        whatNext: 'Что будет дальше?',
        nextStep1: 'Мы изучим ваш запрос в течение 2-4 часов',
        nextStep2: 'Подготовим детальное коммерческое предложение',
        nextStep3: 'Свяжемся с вами для уточнения деталей',
        nextStep4: 'Предоставим расчет стоимости и сроков'
      }
    },
    
    // Footer
    footer: {
      aboutUs: 'О нас',
      careers: 'Карьера',
      partners: 'Партнеры',
      description: 'FARADO Global - ваш надежный партнер в международной торговле с Китаем. Мы предоставляем полный спектр логистических услуг.',
      company: 'Компания',
      copyright: '© 2025 FARADO Global. Все права защищены.'
    },

    // Statistics
    stats: {
      experience: 'Лет опыта',
      orders: 'Заказов выполнено',
      countries: 'Стран обслуживания',
      satisfaction: 'Довольных клиентов',
      onTime: 'Вовремя',
      savings: 'Экономия клиентов'
    },
    
    // Common
    common: {
      loading: 'Загрузка...',
      error: 'Ошибка',
      retry: 'Повторить',
      cancel: 'Отмена',
      save: 'Сохранить',
      edit: 'Редактировать',
      delete: 'Удалить',
      confirm: 'Подтвердить',
      back: 'Назад',
      next: 'Далее',
      close: 'Закрыть',
      submit: 'Отправить',
      send: 'Отправить'
    }
  },
  
  
  en: {
    nav: { services: 'Services', programs: 'Programs', about: 'About', process: 'How We Work', blog: 'Blog', contact: 'Contact', clientPortal: 'Client Portal' },
    hero: { title: 'Your Reliable Bridge for Business with China', subtitle: 'Comprehensive logistics solutions', cta: 'Calculate Cost', services: 'Our Services' },
    pages: {
      about: { title: 'About FARADO', subtitle: 'Your trusted partner', description: 'International logistics company', ourStory: 'Our Story', ourValues: 'Our Values', team: 'Our Team', achievements: 'Achievements', experience: 'years of experience', orders: 'completed orders', countries: 'countries', satisfaction: 'customer satisfaction', employees: 'employees', mapConnection: 'Connecting Link', reliability: 'Reliability', reliabilityDesc: 'We ensure stability', clientFocus: 'Client Focus', clientFocusDesc: 'Client needs focused', quality: 'Quality', qualityDesc: 'Strict quality control', partnership: 'Partnership', partnershipDesc: 'Long-term relationships', development: 'Development', developmentDesc: 'Constant improvement', global: 'Global Reach', globalDesc: 'International network' },
      contact: { title: 'Contact', subtitle: 'Contact us for consultation', error: 'Message sending error', success: 'Message sent successfully', name: 'Name', subject: 'Subject', message: 'Message', placeholder: { name: 'Your name' }, subjectPlaceholder: 'Message subject', messagePlaceholder: 'Your message', mapTitle: 'Our Location', mapSubtitle: 'Key trading points', coordinates: 'Coordinates', distance: 'Distance', deliveryTime: 'Delivery time', days: 'days', faqTitle: 'FAQ', faqSubtitle: 'Popular questions', faq: { q1: 'What documents needed?', a1: 'Passport, company documents', q2: 'Delivery time?', a2: '15-25 days standard', q3: 'Guarantees?', a3: 'Full guarantee provided', q4: 'Tracking?', a4: 'Real-time tracking', q5: 'Payment methods?', a5: 'Bank transfers, cash, crypto' } },
      home: { howWeWork: { title: 'How We Work', subtitle: 'Transparent process', step1: 'Consultation', step2: 'Supplier Search', step3: 'Negotiations', step4: 'Delivery', step1Desc: 'Free consultation', step2Desc: 'Reliable suppliers', step3Desc: 'Price negotiations', step4Desc: 'Delivery organization', startCollaboration: 'Start Collaboration' }, numbers: { title: 'Our Achievements', subtitle: 'Professional results', completedOrders: 'Completed Orders', deliveryCountries: 'Delivery Countries', averageSavings: 'Average Savings', warehousesInChina: 'Warehouses in China' }, readyToStart: { title: 'Ready to Start?', subtitle: 'Get consultation', getQuote: 'Get Quote', freeConsultation: 'Free Consultation', freeConsultationDesc: 'Discuss needs', costCalculation: 'Cost Calculation', costCalculationDesc: 'Accurate costs', individualOffer: 'Individual Offer', individualOfferDesc: 'Personal terms' }, geography: { title: 'Service Geography', subtitle: 'International routes', routes: 'Main routes' }, contact: { offices: 'Our Offices', dushanbe: 'Dushanbe', guangzhou: 'Guangzhou', office: 'Office', phones: 'Phones', email: 'Email', workingHours: 'Working Hours', monday: 'Monday', saturday: 'Saturday', sunday: 'Sunday', weekend: 'Weekend', sendMessage: 'Send Message', headOffice: 'Head Office', representative: 'Representative' } },
      services: { title: 'Services', subtitle: 'Full range of services', getQuote: 'Get Quote', team: { subtitle: 'Expert Team', farkhodName: 'Farkhod Rahimov', farkhodPosition: 'Founder and CEO' }, timeline: { founding: '2015 - Foundation', foundingDesc: 'Logistics start', warehouse: '2017 - Warehouses', warehouseDesc: 'Key cities warehouses', oem: '2019 - OEM Production', oemDesc: 'OEM/ODM services', international: '2021 - International', internationalDesc: 'Central Asia markets', tajikistan: '2023 - Tajikistan', tajikistanDesc: 'Dushanbe office' } },
      clientPortal: { title: 'Client Portal', subtitle: 'Track orders', trackOrder: 'Track Order', trackingNumber: 'Tracking Number', search: 'Search', searching: 'Searching...', orderNotFound: 'Order not found', orderCode: 'Order Code', orderStatus: 'Order Status', customer: 'Customer', destination: 'Destination', expectedDelivery: 'Expected Delivery', items: 'Items', itemCode: 'Item Code', itemName: 'Item Name', quantity: 'Quantity', status: 'Status', warehouse: 'Warehouse', weight: 'Weight', volume: 'Volume', totalAmount: 'Total Amount' },
      programs: {
        title: 'Programs',
        subtitle: 'Comprehensive business development programs',
        businessStart: {
          title: 'FARADO Business Start',
          subtitle: 'Launch your business from scratch',
          description: 'We will help launch your business, even if it has not been invented yet. We will suggest a niche, find suppliers, conclude contracts and organize the first deliveries.',
          stages: '5 stages',
          details: 'Details',
          targetAudience: 'Target Audience',
          audience1: 'Individuals and companies planning to organize import deliveries from China for the first time',
          audience2: 'Enterprises interested in developing new product niches through Chinese imports',
          implementationStages: 'Implementation Stages',
          stage1Title: 'Market analysis and niche identification',
          stage1Desc: 'Analysis of market trends, competitive environment and formation of a list of profitable product categories',
          stage2Title: 'Search and verification of suppliers',
          stage2Desc: 'Selection and verification of manufacturers in China by price, quality and reliability criteria',
          stage3Title: 'Organization of sample purchases',
          stage3Desc: 'Ordering and delivery of product samples from different suppliers for testing',
          stage4Title: 'Negotiations and contracting',
          stage4Desc: 'Conducting negotiations and preparing legally protected foreign trade contracts',
          stage5Title: 'First commercial batch',
          stage5Desc: 'Placing an order, production control and organizing delivery to the client',
          expectedResults: 'Expected Results',
          result1: 'Launched business project for importing selected goods from China',
          result2: 'Established connections with verified Chinese suppliers',
          result3: 'Tested and debugged supply scheme',
          result4: 'Minimized risks and costs of the initial stage of foreign trade'
        },
        control: {
          title: 'FARADO Control',
          subtitle: 'Optimization of existing supplies',
          description: 'We will find the best suppliers for your business from all over China. We will conduct an audit of your supply system and offer new solutions for foreign trade optimization.',
          stages: '4 stages',
          details: 'Details',
          targetAudience: 'Target Audience',
          audience1: 'Companies with experience in importing from China and seeking to optimize logistics',
          audience2: 'Enterprises wishing to expand their range or find more profitable suppliers',
          implementationStages: 'Implementation Stages',
          stage1Title: 'Audit of current supplies',
          stage1Desc: 'Analysis of existing suppliers, assessment of product quality, logistics routes and financial indicators',
          stage2Title: 'Search for alternative suppliers',
          stage2Desc: 'Market research and selection of potentially more profitable manufacturers with better conditions',
          stage3Title: 'Comparative analysis of offers',
          stage3Desc: 'Comprehensive comparison of current and proposed suppliers by price, quality and conditions',
          stage4Title: 'Implementation of optimized scheme',
          stage4Desc: 'Gradual transition to new suppliers with risk minimization for business',
          expectedResults: 'Expected Results',
          result1: 'Reduction of procurement costs by 15-30%',
          result2: 'Improvement of supplied product quality',
          result3: 'Supplier diversification to reduce risks',
          result4: 'Optimized logistics delivery scheme'
        },
        consultation: 'Consultation',
        getConsultation: 'Get Consultation',
        contactUs: 'Contact Us'
      }
    },
    services: { sourcing: 'Sourcing', logistics: 'Logistics', customs: 'Customs', oem: 'OEM/ODM', warehouse: 'Warehouse', support: 'Support', sampling: 'Samples', sourcingDesc: 'Reliable manufacturers', logisticsDesc: 'Optimal routes', customsDesc: 'Legal support', oemDesc: 'Brand manufacturing', warehouseDesc: 'Storage network', supportDesc: 'Personal manager', title: 'Our Services', subtitle: 'Logistics solutions', experienceTitle: 'Experience', experienceDesc: '10+ years with China', officesTitle: 'China Offices', officesDesc: 'Key trading cities', guaranteesTitle: 'Quality Guarantees', guaranteesDesc: 'Full quality control', comprehensiveTitle: 'Comprehensive', comprehensiveDesc: 'End-to-end solutions', languageTitle: 'Language Support', languageDesc: 'Multiple languages', support247: '24/7 Support', whyChoose: 'Why Choose Us', whyChooseSubtitle: 'FARADO Advantages', sourcingDetails: { timeSaving: 'Time Saving', verifiedSuppliers: 'Verified Suppliers', directContact: 'Direct Contact', logisticsSpeed: 'Delivery Speed', fullInsurance: 'Full Insurance', realTimeTracking: 'Real-time Tracking', customsExpertise: 'Customs Expertise', documentPrep: 'Document Prep', properDocuments: 'Proper Docs', productionControl: 'Production Control', oemExperience: 'OEM Experience', lowCosts: 'Low Costs', modernFacilities: 'Modern Warehouses', goodsConsolidation: 'Consolidation', flexibleStorage: 'Flexible Storage', personalManager: 'Personal Manager', transparentReports: 'Transparent Reports', expertConsultations: 'Expert Consultations' }, process: { search: 'Search', verification: 'Verification', partnership: 'Partnership', route: 'Route', delivery: 'Delivery', tracking: 'Tracking', documents: 'Documents', processing: 'Processing', receiving: 'Receiving', production: 'Production', control: 'Control', quality: 'Quality', warehouse: 'Warehouse', consolidation: 'Consolidation', shipment: 'Shipment', consultation: 'Consultation', support: 'Support', success: 'Success' } },
    forms: { quote: { title: 'Request Quote', contactPerson: 'Contact Person', name: 'Name', email: 'Email', phone: 'Phone/Whatsapp/Telegram', companyName: 'Company Name', serviceType: 'Service Type', originCountry: 'Origin Country', destinationCountry: 'Destination Country', estimatedBudget: 'Estimated Budget', timeline: 'Timeline', description: 'Description', submit: 'Submit Request', success: 'Request sent successfully', error: 'Request sending error', step: 'Step', of: 'of', contactInfo: 'Contact Information', serviceDetails: 'Service Details', back: 'Back', next: 'Next', getQuote: 'Get Quote', sending: 'Sending...', whatNext: 'What happens next?', nextStep1: 'We will review your request within 2-4 hours', nextStep2: 'Prepare detailed commercial proposal', nextStep3: 'Contact you for clarification', nextStep4: 'Provide cost and timeline calculation' } },
    footer: { aboutUs: 'About Us', careers: 'Careers', partners: 'Partners', description: 'FARADO Global - trusted partner', company: 'Company', copyright: '© 2025 FARADO Global' },
    stats: { experience: 'Years Experience', orders: 'Orders Completed', countries: 'Countries Served', satisfaction: 'Satisfied Clients', onTime: 'On Time', savings: 'Client Savings' },
    common: { loading: 'Loading...', error: 'Error', retry: 'Retry', cancel: 'Cancel', save: 'Save', edit: 'Edit', delete: 'Delete', confirm: 'Confirm', back: 'Back', next: 'Next', close: 'Close', submit: 'Submit', send: 'Send' }
  },
  
  tj: {
    nav: { services: 'Хизматрасонӣ', programs: 'Барномаҳо', about: 'Дар бораи ширкат', process: 'Тарзи кори мо', blog: 'Блог', contact: 'Тамос', clientPortal: 'Портали мизоҷон' },
    hero: { title: 'Кӯпраки боэътимоди шумо барои тиҷорат бо Чин', subtitle: 'Ҳаллҳои мукаммали логистикӣ', cta: 'Ҳисоб кардани нарх', services: 'Хизматрасониҳои мо' },
    pages: { about: { title: 'Дар бораи FARADO', subtitle: 'Шарики боэътимод', description: 'Ширкати логистикӣ', ourStory: 'Таърихи мо', ourValues: 'Арзишҳои мо', team: 'Дастаи мо', achievements: 'Дастовардҳо', experience: 'сол таҷриба', orders: 'фармоишҳои иҷрошуда', countries: 'кишварҳо', satisfaction: 'қаноатмандии мизоҷон', employees: 'кормандон', mapConnection: 'Пайванди алоқа', reliability: 'Боэътимодӣ', reliabilityDesc: 'Устуворӣ таъмин мекунем', clientFocus: 'Мизоҷцентрӣ', clientFocusDesc: 'Дар назари мизоҷон', quality: 'Сифат', qualityDesc: 'Назорати сифат', partnership: 'Шарикӣ', partnershipDesc: 'Муносибатҳои дарозмуддат', development: 'Рушд', developmentDesc: 'Такмили доимӣ', global: 'Ҷаҳонӣ', globalDesc: 'Шабакаи байналмилалӣ' }, contact: { title: 'Тамос', subtitle: 'Машварат гиред', error: 'Хатои фиристодан', success: 'Муваффақ фиристода шуд', name: 'Ном', subject: 'Мавзуъ', message: 'Паём', placeholder: { name: 'Номи шумо' }, subjectPlaceholder: 'Мавзӯи паём', messagePlaceholder: 'Паёми шумо', mapTitle: 'Мавқеи мо', mapSubtitle: 'Нуқтаҳои калидӣ', coordinates: 'Координатаҳо', distance: 'Масофа', deliveryTime: 'Вақти расонидан', days: 'рӯз', faqTitle: 'Саволҳои маъмул', faqSubtitle: 'Саволҳои маъмул', faq: { q1: 'Ҳуҷҷатҳо лозиманд?', a1: 'Паспорт, ҳуҷҷатҳои ширкат', q2: 'Вақти расонидан?', a2: '15-25 рӯз стандартӣ', q3: 'Кафолатҳо?', a3: 'Кафолати пурра', q4: 'Пайгирӣ?', a4: 'Пайгирии воқеӣ', q5: 'Усулҳои пардохт?', a5: 'Ҳавола, нақд, криптовалюта' } }, home: { howWeWork: { title: 'Тарзи кори мо', subtitle: 'Раванди шаффоф', step1: 'Машварат', step2: 'Ҷустуҷӯи таъминкунанда', step3: 'Музокирот', step4: 'Расонидан', step1Desc: 'Машварати ройгон', step2Desc: 'Таъминкунандагони боэътимод', step3Desc: 'Музокироти нарх', step4Desc: 'Ташкили расонидан', startCollaboration: 'Оғози ҳамкорӣ' }, numbers: { title: 'Дастовардҳои мо', subtitle: 'Натиҷаҳои касбӣ', completedOrders: 'Фармоишҳои иҷрошуда', deliveryCountries: 'Кишварҳои расонидан', averageSavings: 'Сарфаҷӯии миёна', warehousesInChina: 'Анборҳо дар Чин' }, readyToStart: { title: 'Омодаед оғоз кунед?', subtitle: 'Машварат гиред', getQuote: 'Ҳисоб гирифтан', freeConsultation: 'Машварати ройгон', freeConsultationDesc: 'Эҳтиёҷотро муҳокима', costCalculation: 'Ҳисоби нарх', costCalculationDesc: 'Нархҳои дақиқ', individualOffer: 'Пешниҳоди шахсӣ', individualOfferDesc: 'Шартҳои шахсӣ' }, geography: { title: 'Ҷуғрофияи хизматрасонӣ', subtitle: 'Роҳҳои байналмилалӣ', routes: 'Роҳҳои асосӣ' }, contact: { offices: 'Офисҳои мо', dushanbe: 'Душанбе', guangzhou: 'Гуанчжоу', office: 'Офис', phones: 'Телефонҳо', email: 'Email', workingHours: 'Соатҳои корӣ', monday: 'Душанбе', saturday: 'Шанбе', sunday: 'Якшанбе', weekend: 'Рӯзҳои истироҳат', sendMessage: 'Паём фиристодан', headOffice: 'Офиси марказӣ', representative: 'Намояндагӣ' } }, services: { title: 'Хизматрасонӣ', subtitle: 'Маҷмӯи пурра', getQuote: 'Ҳисоб гирифтан', team: { subtitle: 'Дастаи мутахассисон', farkhodName: 'Фарход Раҳимов', farkhodPosition: 'Муассис ва роҳбар' }, timeline: { founding: '2015 - Таъсис', foundingDesc: 'Оғози логистика', warehouse: '2017 - Анборҳо', warehouseDesc: 'Анборҳо дар шаҳрҳои калидӣ', oem: '2019 - Истеҳсолоти OEM', oemDesc: 'Хизматҳои OEM/ODM', international: '2021 - Байналмилалӣ', internationalDesc: 'Бозорҳои Осиёи Марказӣ', tajikistan: '2023 - Тоҷикистон', tajikistanDesc: 'Офис дар Душанбе' } }, clientPortal: { title: 'Портали мизоҷон', subtitle: 'Пайгирии фармоишҳо', trackOrder: 'Пайгирии фармоиш', trackingNumber: 'Рақами пайгирӣ', search: 'Ҷустуҷӯ', searching: 'Ҷустуҷӯ...', orderNotFound: 'Фармоиш ёфт нашуд', orderCode: 'Коди фармоиш', orderStatus: 'Ҳолати фармоиш', customer: 'Мизоҷ', destination: 'Таъйиноти ҷой', expectedDelivery: 'Расонидани интизорӣ', items: 'Ашё', itemCode: 'Коди ашё', itemName: 'Номи ашё', quantity: 'Миқдор', status: 'Ҳолат', warehouse: 'Анбор', weight: 'Вазн', volume: 'Ҳаҷм', totalAmount: 'Маблағи умумӣ' } },
    services: { sourcing: 'Ҷустуҷӯи маҳсулот', logistics: 'Логистика', customs: 'Гумрук', oem: 'OEM/ODM', warehouse: 'Анбор', support: 'Дастгирӣ', sampling: 'Намунаҳо', sourcingDesc: 'Истеҳсолкунандагони боэътимод', logisticsDesc: 'Роҳҳои беҳтарин', customsDesc: 'Дастгирии ҳуқуқӣ', oemDesc: 'Истеҳсолоти бренд', warehouseDesc: 'Шабакаи анборҳо', supportDesc: 'Менеҷери шахсӣ', title: 'Хизматрасониҳои мо', subtitle: 'Ҳаллҳои логистикӣ', experienceTitle: 'Таҷриба', experienceDesc: '10+ сол бо Чин', officesTitle: 'Офисҳо дар Чин', officesDesc: 'Шаҳрҳои калидии тиҷоратӣ', guaranteesTitle: 'Кафолатҳои сифат', guaranteesDesc: 'Назорати пурраи сифат', comprehensiveTitle: 'Мукаммал', comprehensiveDesc: 'Ҳаллҳои пурра', languageTitle: 'Дастгирии забонӣ', languageDesc: 'Забонҳои гуногун', support247: 'Дастгирӣ 24/7', whyChoose: 'Чаро моро интихоб кунед', whyChooseSubtitle: 'Бартариҳои FARADO', sourcingDetails: { timeSaving: 'Сарфаҷӯии вақт', verifiedSuppliers: 'Таъминкунандагони тасдиқшуда', directContact: 'Тамоси мустақим', logisticsSpeed: 'Суръати расонидан', fullInsurance: 'Суғуртаи пурра', realTimeTracking: 'Пайгирии воқеӣ', customsExpertise: 'Экспертизаи гумрукӣ', documentPrep: 'Тайёрии ҳуҷҷатҳо', properDocuments: 'Ҳуҷҷатҳои дуруст', productionControl: 'Назорати истеҳсолот', oemExperience: 'Таҷрибаи OEM', lowCosts: 'Нархҳои паст', modernFacilities: 'Анборҳои муосир', goodsConsolidation: 'Консолидатсия', flexibleStorage: 'Нигоҳдории чандир', personalManager: 'Менеҷери шахсӣ', transparentReports: 'Ҳисоботи шаффоф', expertConsultations: 'Машваратҳои экспертӣ' }, process: { search: 'Ҷустуҷӯ', verification: 'Тасдиқ', partnership: 'Шарикӣ', route: 'Роҳ', delivery: 'Расонидан', tracking: 'Пайгирӣ', documents: 'Ҳуҷҷатҳо', processing: 'Коркард', receiving: 'Гирифтан', production: 'Истеҳсолот', control: 'Назорат', quality: 'Сифат', warehouse: 'Анбор', consolidation: 'Консолидатсия', shipment: 'Фиристодан', consultation: 'Машварат', support: 'Дастгирӣ', success: 'Муваффақият' } },
    forms: { quote: { title: 'Дархости пешниҳоди тиҷоратӣ', contactPerson: 'Шахси тамосгир', name: 'Ном', email: 'Email', phone: 'Телефон/Whatsapp/Telegram', companyName: 'Номи ширкат', serviceType: 'Навъи хизматрасонӣ', originCountry: 'Кишвари аслӣ', destinationCountry: 'Кишвари таъйиншуда', estimatedBudget: 'Буҷаи тахминӣ', timeline: 'Мӯҳлатҳо', description: 'Тавсифи дархост', submit: 'Фиристодани дархост', success: 'Дархост бомуваффақият фиристода шуд', error: 'Хатои фиристодани дархост', step: 'Қадам', of: 'аз', contactInfo: 'Маълумоти тамос', serviceDetails: 'Тафсилоти хизматрасонӣ', back: 'Бозгашт', next: 'Оянда', getQuote: 'Гирифтани пешниҳод', sending: 'Фиристонда...', whatNext: 'Чӣ оянда мешавад?', nextStep1: 'Мо дархости шуморо дар давоми 2-4 соат баррасӣ мекунем', nextStep2: 'Пешниҳоди муфассали тиҷоратӣ тайёр мекунем', nextStep3: 'Барои тафсирот бо шумо тамос мегирем', nextStep4: 'Ҳисоби арзиш ва мӯҳлатҳоро пешкаш мекунем' } },
    footer: { aboutUs: 'Дар бораи мо', careers: 'Мансабҳо', partners: 'Шарикон', description: 'FARADO Global - шарики боэътимод', company: 'Ширкат', copyright: '© 2025 FARADO Global' },
    stats: { experience: 'Сол таҷриба', orders: 'Фармоишҳои иҷрошуда', countries: 'Кишварҳои хизматрасонӣ', satisfaction: 'Мизоҷони қаноатманд', onTime: 'Дар вақт', savings: 'Сарфаҷӯии мизоҷон' },
    common: { loading: 'Боркунӣ...', error: 'Хато', retry: 'Такрор', cancel: 'Бекор кардан', save: 'Нигоҳ доштан', edit: 'Таҳрир', delete: 'Несткунӣ', confirm: 'Тасдиқ', back: 'Бозгашт', next: 'Навбатӣ', close: 'Пӯшидан', submit: 'Фиристодан', send: 'Фиристодан' }
  },
  
  zh: {
    nav: { services: '服务', programs: '项目', about: '关于我们', process: '工作流程', blog: '博客', contact: '联系我们', clientPortal: '客户端口' },
    hero: { title: '您与中国商业往来的可靠桥梁', subtitle: '综合物流解决方案', cta: '计算成本', services: '我们的服务' },
    pages: { about: { title: '关于FARADO', subtitle: '可信赖的伙伴', description: '国际物流公司', ourStory: '我们的故事', ourValues: '我们的价值观', team: '我们的团队', achievements: '成就', experience: '年经验', orders: '完成订单', countries: '个国家', satisfaction: '客户满意度', employees: '名员工', mapConnection: '连接纽带', reliability: '可靠性', reliabilityDesc: '确保稳定性', clientFocus: '客户导向', clientFocusDesc: '关注客户需求', quality: '质量', qualityDesc: '严格质量控制', partnership: '合作伙伴关系', partnershipDesc: '长期关系', development: '发展', developmentDesc: '持续改进', global: '全球化', globalDesc: '国际网络' }, contact: { title: '联系我们', subtitle: '咨询联系', error: '发送错误', success: '发送成功', name: '姓名', subject: '主题', message: '消息', placeholder: { name: '您的姓名' }, subjectPlaceholder: '消息主题', messagePlaceholder: '您的消息', mapTitle: '我们的位置', mapSubtitle: '关键贸易点', coordinates: '坐标', distance: '距离', deliveryTime: '交付时间', days: '天', faqTitle: '常见问题', faqSubtitle: '热门问题', faq: { q1: '需要什么文件？', a1: '护照，公司文件', q2: '交付时间？', a2: '标准15-25天', q3: '保证？', a3: '提供全面保证', q4: '跟踪？', a4: '实时跟踪', q5: '付款方式？', a5: '银行转账、现金、加密货币' } }, home: { howWeWork: { title: '我们如何工作', subtitle: '透明流程', step1: '咨询', step2: '供应商搜索', step3: '谈判', step4: '交付', step1Desc: '免费咨询', step2Desc: '可靠供应商', step3Desc: '价格谈判', step4Desc: '交付组织', startCollaboration: '开始合作' }, numbers: { title: '我们的成就', subtitle: '专业结果', completedOrders: '完成订单', deliveryCountries: '交付国家', averageSavings: '平均节省', warehousesInChina: '中国仓库' }, readyToStart: { title: '准备开始？', subtitle: '获取咨询', getQuote: '获取报价', freeConsultation: '免费咨询', freeConsultationDesc: '讨论需求', costCalculation: '成本计算', costCalculationDesc: '准确成本', individualOffer: '个性化报价', individualOfferDesc: '个人条件' }, geography: { title: '服务地理', subtitle: '国际路线', routes: '主要路线' }, contact: { offices: '我们的办事处', dushanbe: '杜尚别', guangzhou: '广州', office: '办公室', phones: '电话', email: '邮箱', workingHours: '工作时间', monday: '星期一', saturday: '星期六', sunday: '星期日', weekend: '周末', sendMessage: '发送消息', headOffice: '总办事处', representative: '代表处' } }, services: { title: '服务', subtitle: '全方位服务', getQuote: '获取报价', team: { subtitle: '专家团队', farkhodName: '法尔霍德·拉希莫夫', farkhodPosition: '创始人兼首席执行官' }, timeline: { founding: '2015年 - 成立', foundingDesc: '物流开始', warehouse: '2017年 - 仓库', warehouseDesc: '关键城市仓库', oem: '2019年 - OEM生产', oemDesc: 'OEM/ODM服务', international: '2021年 - 国际化', internationalDesc: '中亚市场', tajikistan: '2023年 - 塔吉克斯坦', tajikistanDesc: '杜尚别办事处' } }, clientPortal: { title: '客户端口', subtitle: '跟踪订单', trackOrder: '跟踪订单', trackingNumber: '跟踪号码', search: '搜索', searching: '搜索中...', orderNotFound: '找不到订单', orderCode: '订单代码', orderStatus: '订单状态', customer: '客户', destination: '目的地', expectedDelivery: '预期交付', items: '商品', itemCode: '商品代码', itemName: '商品名称', quantity: '数量', status: '状态', warehouse: '仓库', weight: '重量', volume: '体积', totalAmount: '总金额' } },
    services: { sourcing: '采购', logistics: '物流', customs: '海关', oem: 'OEM/ODM', warehouse: '仓库', support: '支持', sampling: '样品', sourcingDesc: '可靠制造商', logisticsDesc: '最佳路线', customsDesc: '法律支持', oemDesc: '品牌制造', warehouseDesc: '存储网络', supportDesc: '个人经理', title: '我们的服务', subtitle: '物流解决方案', experienceTitle: '经验', experienceDesc: '与中国10+年', officesTitle: '中国办事处', officesDesc: '主要贸易城市', guaranteesTitle: '质量保证', guaranteesDesc: '全面质量控制', comprehensiveTitle: '综合', comprehensiveDesc: '端到端解决方案', languageTitle: '语言支持', languageDesc: '多种语言', support247: '24/7支持', whyChoose: '为什么选择我们', whyChooseSubtitle: 'FARADO优势', sourcingDetails: { timeSaving: '节省时间', verifiedSuppliers: '经过验证的供应商', directContact: '直接联系', logisticsSpeed: '交付速度', fullInsurance: '全面保险', realTimeTracking: '实时跟踪', customsExpertise: '海关专业知识', documentPrep: '文件准备', properDocuments: '正确文档', productionControl: '生产控制', oemExperience: 'OEM经验', lowCosts: '低成本', modernFacilities: '现代化仓库', goodsConsolidation: '货物整合', flexibleStorage: '灵活存储', personalManager: '个人经理', transparentReports: '透明报告', expertConsultations: '专家咨询' }, process: { search: '搜索', verification: '验证', partnership: '合作伙伴关系', route: '路线', delivery: '交付', tracking: '跟踪', documents: '文档', processing: '处理', receiving: '接收', production: '生产', control: '控制', quality: '质量', warehouse: '仓库', consolidation: '整合', shipment: '发货', consultation: '咨询', support: '支持', success: '成功' } },
    forms: { quote: { title: '商业报价请求', contactPerson: '联系人', name: '姓名', email: '邮箱', phone: '电话/微信/电报', companyName: '公司名称', serviceType: '服务类型', originCountry: '原产国', destinationCountry: '目的国', estimatedBudget: '预估预算', timeline: '时间表', description: '需求描述', submit: '提交请求', success: '请求发送成功', error: '请求发送错误', step: '步骤', of: '共', contactInfo: '联系信息', serviceDetails: '服务详情', back: '返回', next: '下一步', getQuote: '获取报价', sending: '发送中...', whatNext: '接下来会怎样？', nextStep1: '我们将在2-4小时内审核您的请求', nextStep2: '准备详细的商业提案', nextStep3: '联系您进行详细沟通', nextStep4: '提供成本和时间计算' } },
    footer: { aboutUs: '关于我们', careers: '职业', partners: '合作伙伴', description: 'FARADO Global - 可信伙伴', company: '公司', copyright: '© 2025 FARADO Global' },
    stats: { experience: '年经验', orders: '完成订单', countries: '服务国家', satisfaction: '满意客户', onTime: '准时', savings: '客户节省' },
    common: { loading: '加载中...', error: '错误', retry: '重试', cancel: '取消', save: '保存', edit: '编辑', delete: '删除', confirm: '确认', back: '返回', next: '下一步', close: '关闭', submit: '提交', send: '发送' }
  }
} as const;

// Observers for language change
const observers: (() => void)[] = [];

// Set language function
export function setLanguage(lang: Language) {
  currentLanguage = lang;
  if (typeof window !== 'undefined') {
    localStorage.setItem('language', lang);
  }
  // Notify all observers
  observers.forEach(observer => observer());
}

// Get current language
export function getCurrentLanguage(): Language {
  return currentLanguage;
}

// Translation function
export function t(key: string): string {
  // Try to get translation from new system first
  if (key in TRANSLATIONS.ru) {
    return getTranslation(key as TranslationKey, currentLanguage);
  }
  
  // Fallback to old nested system for compatibility
  const keys = key.split('.');
  let value: any = (translations as any)[currentLanguage];
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      console.warn(`Translation key not found: ${key} for language: ${currentLanguage}`);
      // Return English translation as fallback
      let fallbackValue: any = (translations as any).en;
      for (const k of keys) {
        if (fallbackValue && typeof fallbackValue === 'object' && k in fallbackValue) {
          fallbackValue = fallbackValue[k];
        } else {
          // Return the last part of the key as ultimate fallback
          return key.split('.').pop() || key;
        }
      }
      return fallbackValue;
    }
  }
  
  return value;
}

// Hook for React components
export function useTranslation() {
  const [, forceUpdate] = useState<object>();
  
  // Subscribe to language changes on mount
  useEffect(() => {
    const observer = () => forceUpdate({});
    observers.push(observer);
    
    return () => {
      const index = observers.indexOf(observer);
      if (index > -1) {
        observers.splice(index, 1);
      }
    };
  }, []);
  
  return {
    t,
    language: currentLanguage,
    setLanguage
  };
}

// Language options for the selector
export const languageOptions = [
  { code: 'ru' as Language, name: 'Русский', flag: '🇷🇺' },
  { code: 'tj' as Language, name: 'Тоҷикӣ', flag: '🇹🇯' },
  { code: 'en' as Language, name: 'English', flag: '🇺🇸' },
  { code: 'zh' as Language, name: '中文', flag: '🇨🇳' }
];