// Comprehensive Multi-Language Translation System
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'ru' | 'tj' | 'en' | 'zh';

// Complete translations for all languages
const translations = {
  ru: {
    // Navigation
    nav: {
      services: 'Услуги',
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
        satisfaction: 'удовлетворенность клиентов'
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
          getQuote: 'Получить Расчет'
        }
      },
      services: {
        title: 'Услуги',
        subtitle: 'Полный спектр услуг для вашего бизнеса с Китаем',
        getQuote: 'Получить расчет'
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
        totalAmount: 'Общая сумма'
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
      sourcingDesc: 'Поиск надежных производителей, аудит фабрик, переговоры и контроль качества на всех этапах сотрудничества.',
      logisticsDesc: 'Оптимальные маршруты доставки через авиа, также автомобильными и железнодорожными путями.',
      customsDesc: 'Полное юридическое сопровождение, подготовка документов, сертификация и декларирование грузов.',
      oemDesc: 'Производство товаров под вашим брендом с полным циклом — от разработки до готовой продукции.',
      warehouseDesc: 'Сеть складов в ключевых городах Китая для хранения, консолидации и подготовки грузов к отправке.',
      supportDesc: 'Персональный менеджер, прозрачная отчетность и поддержка на всех этапах сотрудничества 24/7.'
    },
    
    // Forms
    forms: {
      quote: {
        title: 'Запрос коммерческого предложения',
        name: 'Имя',
        email: 'Email',
        phone: 'Телефон',
        company: 'Компания',
        serviceType: 'Тип услуги',
        originCountry: 'Страна отправления',
        destinationCountry: 'Страна назначения',
        estimatedBudget: 'Примерный бюджет',
        timeline: 'Сроки выполнения',
        description: 'Описание запроса',
        submit: 'Отправить запрос',
        success: 'Запрос отправлен успешно',
        error: 'Ошибка отправки запроса'
      }
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
  
  tj: {
    // Navigation
    nav: {
      services: 'Хизматрасонӣ',
      about: 'Дар бораи ширкат',
      process: 'Тарзи кори мо',
      blog: 'Блог',
      contact: 'Тамос',
      clientPortal: 'Портали мизоҷон'
    },
    
    // Hero Section
    hero: {
      title: 'Кӯпраки боэътимоди шумо барои тиҷорат бо Чин',
      subtitle: 'Ҳаллҳои мукаммали логистикӣ, харидории молҳо ва истеҳсолоти OEM/ODM бо дастгирии пурра аз ҷониби мутахассисони 10+ солаи таҷриба бо Чин.',
      cta: 'Ҳисоб кардани нарх',
      services: 'Хизматрасониҳои мо'
    },
    
    // Pages
    pages: {
      about: {
        title: 'Дар бораи ширкати FARADO',
        subtitle: 'Шарики боэътимоди шумо дар тиҷорати байналмилалӣ бо Чин',
        description: 'Мо - ширкати байналмилалии логистикӣ, ки дар роҳҳои тиҷоратии байни Чин ва Осиёи Марказӣ мутахассис аст.',
        ourStory: 'Таърихи мо',
        ourValues: 'Арзишҳои мо',
        team: 'Дастаи мо',
        achievements: 'Дастовардҳои мо',
        experience: 'сол таҷриба',
        orders: 'фармоишҳои иҷрошуда',
        countries: 'кишварҳо',
        satisfaction: 'қаноатмандии мизоҷон'
      },
      contact: {
        title: 'Тамос',
        subtitle: 'Бо мо тамос гиред барои гирифтани машварат',
        error: 'Хатои фиристодани паём',
        success: 'Паём бомуваффақият фиристода шуд',
        name: 'Ном',
        subject: 'Мавзуъ',
        message: 'Паём',
        placeholder: {
          name: 'Номи шумо'
        }
      },
      home: {
        howWeWork: {
          title: 'Тарзи кори мо',
          subtitle: 'Раванди кори мо - роҳи шаффоф ва самаранок ба муваффақияти тиҷорати шумо',
          step1: 'Машварат',
          step2: 'Ҷустуҷӯи таъминкунандагон',
          step3: 'Музокирот',
          step4: 'Расонидан',
          step1Desc: 'Машварати ройгон ва таҳлили эҳтиёҷоти шумо',
          step2Desc: 'Ҷустуҷӯ ва санҷиши таъминкунандагони боэътимод дар Чин',
          step3Desc: 'Музокирот дар бораи нарх ва шартҳои расонидан',
          step4Desc: 'Ташкили расонидан ва расмикунии гумрукӣ',
          startCollaboration: 'Оғози ҳамкорӣ'
        },
        numbers: {
          title: 'Дастовардҳои мо дар рақамҳо',
          subtitle: 'Натиҷаҳое, ки дар бораи профессионализми мо ҳикоят мекунанд',
          completedOrders: 'Фармоишҳои иҷрошуда',
          deliveryCountries: 'Кишварҳои расонидан',
          averageSavings: 'Сарфаҷӯии миёна',
          warehousesInChina: 'Анборҳо дар Чин'
        },
        readyToStart: {
          title: 'Омодаед кор бо Чинро оғоз кунед?',
          subtitle: 'Машварати шахсӣ ва ҳисоби нархи лоиҳаи худро гиред',
          getQuote: 'Ҳисоб гирифтан'
        }
      },
      services: {
        title: 'Хизматрасонӣ',
        subtitle: 'Маҷмӯи пурраи хизматрасониҳо барои тиҷорати шумо бо Чин',
        getQuote: 'Ҳисоб гирифтан'
      },
      clientPortal: {
        title: 'Портали мизоҷон',
        subtitle: 'Пайгирии фармоишҳо ва бораҳои шумо',
        trackOrder: 'Пайгирии фармоиш',
        trackingNumber: 'Рақами пайгирӣ',
        search: 'Ҷустуҷӯ',
        searching: 'Ҷустуҷӯ...',
        orderNotFound: 'Фармоиш ёфт нашуд',
        orderCode: 'Коди фармоиш',
        orderStatus: 'Ҳолати фармоиш',
        customer: 'Мизоҷ',
        destination: 'Нуқтаи таъйиншуда',
        expectedDelivery: 'Расонидани интизорӣ',
        items: 'Молҳо',
        itemCode: 'Коди мол',
        itemName: 'Номи мол',
        quantity: 'Миқдор',
        status: 'Ҳолат',
        warehouse: 'Анбор',
        weight: 'Вазн',
        volume: 'Ҳаҷм',
        totalAmount: 'Маблағи умумӣ'
      }
    },
    
    // Services
    services: {
      sourcing: 'Харид ва Ҷустуҷӯи Таъминкунандагон',
      logistics: 'Логистикаи Байналмилалӣ',
      customs: 'Расмикунии Гумрукӣ',
      oem: 'Истеҳсолоти OEM/ODM',
      warehouse: 'Хизматрасониҳои Анборӣ',
      support: 'Дастгирии Пурра',
      sourcingDesc: 'Ҷустуҷӯи истеҳсолкунандагони боэътимод, аудити заводҳо, музокирот ва назорати сифат дар ҳамаи марҳилаҳо.',
      logisticsDesc: 'Роҳҳои беҳтарини расонидан тавассути ҳаво, роҳи автомобилӣ ва роҳи оҳан.',
      customsDesc: 'Дастгирии пурраи ҳуқуқӣ, тайёр кардани ҳуҷҷатҳо, сертификатсия ва декларатсияи борҳо.',
      oemDesc: 'Истеҳсоли молҳо зери брендеди шумо бо давраи пурра - аз таҳия то маҳсулоти тайёр.',
      warehouseDesc: 'Шабакаи анборҳо дар шаҳрҳои калидии Чин барои нигоҳдорӣ, консолидатсия ва тайёр кардани борҳо.',
      supportDesc: 'Менеҷери шахсӣ, ҳисоботи шаффоф ва дастгирӣ дар ҳамаи марҳилаҳо 24/7.'
    },
    
    // Forms
    forms: {
      quote: {
        title: 'Дархости пешниҳоди тиҷоратӣ',
        name: 'Ном',
        email: 'Email',
        phone: 'Телефон',
        company: 'Ширкат',
        serviceType: 'Навъи хизматрасонӣ',
        originCountry: 'Кишвари фиристодан',
        destinationCountry: 'Кишвари таъйиншуда',
        estimatedBudget: 'Буҷаи тахминӣ',
        timeline: 'Мӯҳлатҳои иҷро',
        description: 'Тавсифи дархост',
        submit: 'Фиристодани дархост',
        success: 'Дархост бомуваффақият фиристода шуд',
        error: 'Хатои фиристодани дархост'
      }
    },
    
    // Common
    common: {
      loading: 'Боркунӣ...',
      error: 'Хато',
      retry: 'Такрор',
      cancel: 'Бекор кардан',
      save: 'Нигоҳ доштан',
      edit: 'Таҳрир',
      delete: 'Несткунӣ',
      confirm: 'Тасдиқ',
      back: 'Бозгашт',
      next: 'Навбатӣ',
      close: 'Пӯшидан',
      submit: 'Фиристодан',
      send: 'Фиристодан'
    }
  },
  
  en: {
    // Navigation
    nav: {
      services: 'Services',
      about: 'About',
      process: 'How We Work',
      blog: 'Blog',
      contact: 'Contact',
      clientPortal: 'Client Portal'
    },
    
    // Hero Section
    hero: {
      title: 'Your Reliable Bridge for Business with China',
      subtitle: 'Comprehensive logistics solutions, product sourcing, and OEM/ODM manufacturing with full-cycle support from experts with 10+ years of experience working with China.',
      cta: 'Calculate Cost',
      services: 'Our Services'
    },
    
    // Pages
    pages: {
      about: {
        title: 'About FARADO Company',
        subtitle: 'Your trusted partner in international trade with China',
        description: 'We are an international logistics company specializing in trade routes between China and Central Asia.',
        ourStory: 'Our Story',
        ourValues: 'Our Values',
        team: 'Our Team',
        achievements: 'Our Achievements',
        experience: 'years of experience',
        orders: 'completed orders',
        countries: 'countries',
        satisfaction: 'customer satisfaction'
      },
      contact: {
        title: 'Contact',
        subtitle: 'Contact us for consultation',
        error: 'Message sending error',
        success: 'Message sent successfully',
        name: 'Name',
        subject: 'Subject',
        message: 'Message',
        placeholder: {
          name: 'Your name'
        }
      },
      home: {
        howWeWork: {
          title: 'How We Work',
          subtitle: 'Our work process - a transparent and efficient path to your business success',
          step1: 'Consultation',
          step2: 'Supplier Search',
          step3: 'Negotiations',
          step4: 'Delivery',
          step1Desc: 'Free consultation and analysis of your needs',
          step2Desc: 'Search and verification of reliable suppliers in China',
          step3Desc: 'Negotiations on price and delivery terms',
          step4Desc: 'Delivery organization and customs clearance',
          startCollaboration: 'Start Collaboration'
        },
        numbers: {
          title: 'Our Achievements in Numbers',
          subtitle: 'Results that speak of our professionalism',
          completedOrders: 'Completed Orders',
          deliveryCountries: 'Delivery Countries',
          averageSavings: 'Average Savings',
          warehousesInChina: 'Warehouses in China'
        },
        readyToStart: {
          title: 'Ready to Start Working with China?',
          subtitle: 'Get personalized consultation and cost calculation for your project',
          getQuote: 'Get Quote'
        }
      },
      services: {
        title: 'Services',
        subtitle: 'Full range of services for your business with China',
        getQuote: 'Get Quote'
      },
      clientPortal: {
        title: 'Client Portal',
        subtitle: 'Track your orders and shipments',
        trackOrder: 'Track Order',
        trackingNumber: 'Tracking Number',
        search: 'Search',
        searching: 'Searching...',
        orderNotFound: 'Order not found',
        orderCode: 'Order Code',
        orderStatus: 'Order Status',
        customer: 'Customer',
        destination: 'Destination',
        expectedDelivery: 'Expected Delivery',
        items: 'Items',
        itemCode: 'Item Code',
        itemName: 'Item Name',
        quantity: 'Quantity',
        status: 'Status',
        warehouse: 'Warehouse',
        weight: 'Weight',
        volume: 'Volume',
        totalAmount: 'Total Amount'
      }
    },
    
    // Services
    services: {
      sourcing: 'Sourcing & Supplier Search',
      logistics: 'International Logistics',
      customs: 'Customs Clearance',
      oem: 'OEM/ODM Manufacturing',
      warehouse: 'Warehouse Services',
      support: 'Full Support',
      sourcingDesc: 'Search for reliable manufacturers, factory audits, negotiations and quality control at all stages.',
      logisticsDesc: 'Optimal delivery routes via air, road and rail transport.',
      customsDesc: 'Full legal support, document preparation, certification and cargo declaration.',
      oemDesc: 'Manufacturing goods under your brand with full cycle - from development to finished products.',
      warehouseDesc: 'Network of warehouses in key Chinese cities for storage, consolidation and cargo preparation.',
      supportDesc: 'Personal manager, transparent reporting and support at all stages 24/7.'
    },
    
    // Forms
    forms: {
      quote: {
        title: 'Request Commercial Proposal',
        name: 'Name',
        email: 'Email',
        phone: 'Phone',
        company: 'Company',
        serviceType: 'Service Type',
        originCountry: 'Origin Country',
        destinationCountry: 'Destination Country',
        estimatedBudget: 'Estimated Budget',
        timeline: 'Timeline',
        description: 'Request Description',
        submit: 'Submit Request',
        success: 'Request sent successfully',
        error: 'Request sending error'
      }
    },
    
    // Common
    common: {
      loading: 'Loading...',
      error: 'Error',
      retry: 'Retry',
      cancel: 'Cancel',
      save: 'Save',
      edit: 'Edit',
      delete: 'Delete',
      confirm: 'Confirm',
      back: 'Back',
      next: 'Next',
      close: 'Close',
      submit: 'Submit',
      send: 'Send'
    }
  },
  
  zh: {
    // Navigation
    nav: {
      services: '服务',
      about: '关于我们',
      process: '工作流程',
      blog: '博客',
      contact: '联系我们',
      clientPortal: '客户端口'
    },
    
    // Hero Section
    hero: {
      title: '您与中国商业往来的可靠桥梁',
      subtitle: '综合物流解决方案、产品采购和OEM/ODM制造，由拥有10年以上中国工作经验的专家提供全周期支持。',
      cta: '计算成本',
      services: '我们的服务'
    },
    
    // Pages
    pages: {
      about: {
        title: '关于FARADO公司',
        subtitle: '您在中国国际贸易中的可信赖伙伴',
        description: '我们是一家专业从事中国与中亚贸易路线的国际物流公司。',
        ourStory: '我们的故事',
        ourValues: '我们的价值观',
        team: '我们的团队',
        achievements: '我们的成就',
        experience: '年经验',
        orders: '完成订单',
        countries: '个国家',
        satisfaction: '客户满意度'
      },
      contact: {
        title: '联系我们',
        subtitle: '联系我们获取咨询',
        error: '消息发送错误',
        success: '消息发送成功',
        name: '姓名',
        subject: '主题',
        message: '消息',
        placeholder: {
          name: '您的姓名'
        }
      },
      home: {
        howWeWork: {
          title: '我们如何工作',
          subtitle: '我们的工作流程——通往您商业成功的透明高效之路',
          step1: '咨询',
          step2: '供应商搜索',
          step3: '谈判',
          step4: '交付',
          step1Desc: '免费咨询和需求分析',
          step2Desc: '在中国搜索和验证可靠供应商',
          step3Desc: '价格和交付条件谈判',
          step4Desc: '交付组织和清关',
          startCollaboration: '开始合作'
        },
        numbers: {
          title: '我们的数字成就',
          subtitle: '体现我们专业性的结果',
          completedOrders: '完成订单',
          deliveryCountries: '交付国家',
          averageSavings: '平均节省',
          warehousesInChina: '中国仓库'
        },
        readyToStart: {
          title: '准备好开始与中国合作吗？',
          subtitle: '获取个性化咨询和项目成本计算',
          getQuote: '获取报价'
        }
      },
      services: {
        title: '服务',
        subtitle: '为您的中国业务提供全方位服务',
        getQuote: '获取报价'
      },
      clientPortal: {
        title: '客户端口',
        subtitle: '跟踪您的订单和货物',
        trackOrder: '跟踪订单',
        trackingNumber: '跟踪号码',
        search: '搜索',
        searching: '搜索中...',
        orderNotFound: '找不到订单',
        orderCode: '订单代码',
        orderStatus: '订单状态',
        customer: '客户',
        destination: '目的地',
        expectedDelivery: '预期交付',
        items: '商品',
        itemCode: '商品代码',
        itemName: '商品名称',
        quantity: '数量',
        status: '状态',
        warehouse: '仓库',
        weight: '重量',
        volume: '体积',
        totalAmount: '总金额'
      }
    },
    
    // Services
    services: {
      sourcing: '采购与供应商搜索',
      logistics: '国际物流',
      customs: '清关',
      oem: 'OEM/ODM制造',
      warehouse: '仓储服务',
      support: '全面支持',
      sourcingDesc: '搜索可靠制造商、工厂审计、谈判和各阶段质量控制。',
      logisticsDesc: '通过航空、公路和铁路运输的最优交付路线。',
      customsDesc: '全法律支持、文件准备、认证和货物申报。',
      oemDesc: '在您的品牌下制造商品，全周期 - 从开发到成品。',
      warehouseDesc: '在中国主要城市的仓库网络，用于存储、整合和货物准备。',
      supportDesc: '个人经理、透明报告和24/7全阶段支持。'
    },
    
    // Forms
    forms: {
      quote: {
        title: '商业提案请求',
        name: '姓名',
        email: '邮箱',
        phone: '电话',
        company: '公司',
        serviceType: '服务类型',
        originCountry: '原产国',
        destinationCountry: '目的国',
        estimatedBudget: '预算',
        timeline: '时间表',
        description: '请求描述',
        submit: '提交请求',
        success: '请求发送成功',
        error: '请求发送错误'
      }
    },
    
    // Common
    common: {
      loading: '加载中...',
      error: '错误',
      retry: '重试',
      cancel: '取消',
      save: '保存',
      edit: '编辑',
      delete: '删除',
      confirm: '确认',
      back: '返回',
      next: '下一步',
      close: '关闭',
      submit: '提交',
      send: '发送'
    }
  }
} as const;

// Language Context
interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Language Provider
export function LanguageProvider({ children }: { children: ReactNode }): React.ReactElement {
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('language');
      return (saved as Language) || 'ru';
    }
    return 'ru';
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', language);
    }
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

// Translation function
export function useTranslation() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  
  const { language } = context;
  
  const t = (key: string) => {
    const keys = key.split('.');
    let value: any = translations[language];
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        console.warn(`Translation key not found: ${key} for language: ${language}`);
        // Return English translation as fallback
        let fallbackValue: any = translations.en;
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
  };
  
  return { t, language, setLanguage: context.setLanguage };
}

// Language options for the selector
export const languageOptions = [
  { code: 'ru' as Language, name: 'Русский', flag: '🇷🇺' },
  { code: 'tj' as Language, name: 'Тоҷикӣ', flag: '🇹🇯' },
  { code: 'en' as Language, name: 'English', flag: '🇺🇸' },
  { code: 'zh' as Language, name: '中文', flag: '🇨🇳' }
];