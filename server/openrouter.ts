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

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const SITE_URL = process.env.OPENROUTER_SITE_URL || "https://farado.uz";
const APP_TITLE = process.env.OPENROUTER_APP_TITLE || "FARADO Consultant";

const MODELS: string[] = (
  process.env.OPENROUTER_MODELS ||
  "qwen/qwen3-next-80b-a3b-instruct:free,google/gemma-3-27b-it:free,openai/gpt-oss-120b:free,meta-llama/llama-3.3-70b-instruct:free,z-ai/glm-4.5-air:free"
)
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

let workingModel: string | null = null;

async function tryModel(modelName: string, messages: ChatMessage[]): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY не настроен.");
  }

  const payload = {
    model: modelName,
    messages: [
      { role: "system", content: FARADO_SYSTEM_PROMPT },
      ...messages.map((m) => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: m.content,
      })),
    ],
    temperature: 0.7,
  };

  const res = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": SITE_URL,
      "X-Title": APP_TITLE,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`OpenRouter ${res.status}: ${text}`);
  }

  const data = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
    error?: { message?: string };
  };

  if (data.error) {
    throw new Error(`OpenRouter error: ${data.error.message || "unknown"}`);
  }

  const content = data.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("Пустой ответ от OpenRouter.");
  }
  return content;
}

export async function chat(messages: ChatMessage[]): Promise<string> {
  if (workingModel) {
    try {
      return await tryModel(workingModel, messages);
    } catch (error: any) {
      console.log(`Cached model ${workingModel} failed: ${error.message}, trying others...`);
      workingModel = null;
    }
  }

  const errors: string[] = [];
  for (const modelName of MODELS) {
    try {
      console.log(`Trying OpenRouter model: ${modelName}`);
      const response = await tryModel(modelName, messages);
      workingModel = modelName;
      console.log(`Success! Using model: ${modelName}`);
      return response;
    } catch (error: any) {
      console.log(`Model ${modelName} failed: ${error.message}`);
      errors.push(`${modelName}: ${error.message}`);
      continue;
    }
  }

  throw new Error(`Все модели OpenRouter недоступны. Ошибки: ${errors.join(" | ")}`);
}

export function isAIConfigured(): boolean {
  return !!process.env.OPENROUTER_API_KEY;
}
