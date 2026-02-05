import { GoogleGenerativeAI } from "@google/generative-ai";

const FARADO_SYSTEM_PROMPT = `Ты - профессиональный консультант компании FARADO, специализирующейся на логистике и торговле с Китаем.

О компании FARADO:
- Более 7 лет опыта работы с Китаем
- Более 2000 успешных заказов
- Работаем с Китаем, Узбекистаном и Россией
- Собственные склады в Китае (Гуанчжоу, Иу, Шэньчжэнь)
- 24/7 поддержка клиентов
- 99.2% удовлетворённость клиентов

Наши услуги:
1. Закуп товаров в Китае - поиск поставщиков, проверка качества, переговоры
2. Логистика - авиа, ж/д, авто, морские перевозки
3. Таможенное оформление - полное сопровождение
4. Складские услуги - консолидация, хранение, упаковка
5. OEM/ODM производство - разработка и производство под заказ
6. Инспекция качества - проверка товаров перед отправкой

Ты помогаешь:
- Консультируешь по услугам компании
- Отвечаешь на вопросы о логистике с Китаем
- Рекомендуешь оптимальные решения для бизнеса
- Помогаешь рассчитать примерные сроки и стоимость доставки
- Объясняешь процессы закупки и доставки

Правила общения:
- Отвечай на русском языке (или на языке пользователя)
- Будь профессиональным, но дружелюбным
- Давай конкретные и полезные ответы
- Если не знаешь точного ответа, предложи связаться с менеджером
- Для точного расчёта стоимости рекомендуй заполнить форму заявки на сайте

Контакты для связи:
- Telegram: @farado_logistics
- WhatsApp: доступен на сайте
- Email: info@farado.uz`;

const GEMINI_MODELS = [
  "gemini-2.0-flash",
  "gemini-1.5-flash",
  "gemini-1.5-flash-latest",
  "gemini-1.5-pro",
  "gemini-pro",
];

let genAI: GoogleGenerativeAI | null = null;
let workingModel: string | null = null;

function getGenAI(): GoogleGenerativeAI {
  if (!genAI) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY не настроен. Добавьте его в переменные окружения.");
    }
    genAI = new GoogleGenerativeAI(apiKey);
  }
  return genAI;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

async function tryModelChat(ai: GoogleGenerativeAI, modelName: string, messages: ChatMessage[]): Promise<string> {
  const model = ai.getGenerativeModel({ model: modelName });

  const chat = model.startChat({
    history: [
      {
        role: "user",
        parts: [{ text: "Системные инструкции: " + FARADO_SYSTEM_PROMPT }],
      },
      {
        role: "model",
        parts: [{ text: "Понял. Я готов помочь клиентам FARADO с вопросами о логистике и торговле с Китаем." }],
      },
      ...messages.slice(0, -1).map((msg) => ({
        role: msg.role === "user" ? "user" : "model" as const,
        parts: [{ text: msg.content }],
      })),
    ],
  });

  const lastMessage = messages[messages.length - 1];
  const result = await chat.sendMessage(lastMessage.content);
  const response = result.response;
  
  return response.text();
}

export async function chat(messages: ChatMessage[]): Promise<string> {
  const ai = getGenAI();

  if (workingModel) {
    try {
      return await tryModelChat(ai, workingModel, messages);
    } catch (error: any) {
      console.log(`Cached model ${workingModel} failed, trying others...`);
      workingModel = null;
    }
  }

  for (const modelName of GEMINI_MODELS) {
    try {
      console.log(`Trying Gemini model: ${modelName}`);
      const response = await tryModelChat(ai, modelName, messages);
      workingModel = modelName;
      console.log(`Success! Using model: ${modelName}`);
      return response;
    } catch (error: any) {
      console.log(`Model ${modelName} failed: ${error.message}`);
      continue;
    }
  }

  throw new Error("Все модели Gemini недоступны. Попробуйте позже.");
}

export function isGeminiConfigured(): boolean {
  return !!process.env.GEMINI_API_KEY;
}
