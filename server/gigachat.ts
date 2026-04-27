import { randomUUID } from "crypto";
import https from "https";
import { URL } from "url";

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

const OAUTH_URL = "https://ngw.devices.sberbank.ru:9443/api/v2/oauth";
const CHAT_URL = "https://gigachat.devices.sberbank.ru/api/v1/chat/completions";
const SCOPE = process.env.GIGACHAT_SCOPE || "GIGACHAT_API_PERS";
const MODEL = process.env.GIGACHAT_MODEL || "GigaChat";

const sberAgent = new https.Agent({ rejectUnauthorized: false });

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface HttpResponse {
  status: number;
  body: string;
}

function httpsRequest(
  urlStr: string,
  options: { method: string; headers: Record<string, string>; body?: string },
): Promise<HttpResponse> {
  const url = new URL(urlStr);
  return new Promise((resolve, reject) => {
    const req = https.request(
      {
        method: options.method,
        hostname: url.hostname,
        port: url.port || 443,
        path: url.pathname + url.search,
        headers: options.headers,
        agent: sberAgent,
      },
      (res) => {
        const chunks: Buffer[] = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", () =>
          resolve({
            status: res.statusCode || 0,
            body: Buffer.concat(chunks).toString("utf8"),
          }),
        );
      },
    );
    req.on("error", reject);
    if (options.body) req.write(options.body);
    req.end();
  });
}

let cachedToken: { token: string; expiresAt: number } | null = null;

async function getAccessToken(): Promise<string> {
  const authKey = process.env.GIGACHAT_AUTH_KEY;
  if (!authKey) {
    throw new Error("GIGACHAT_AUTH_KEY не настроен.");
  }

  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) {
    return cachedToken.token;
  }

  const body = new URLSearchParams({ scope: SCOPE }).toString();
  const res = await httpsRequest(OAUTH_URL, {
    method: "POST",
    headers: {
      Authorization: `Basic ${authKey}`,
      RqUID: randomUUID(),
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
      "Content-Length": Buffer.byteLength(body).toString(),
    },
    body,
  });

  if (res.status < 200 || res.status >= 300) {
    throw new Error(`Ошибка авторизации GigaChat: ${res.status} ${res.body}`);
  }

  const data = JSON.parse(res.body) as { access_token: string; expires_at: number };
  cachedToken = { token: data.access_token, expiresAt: data.expires_at };
  return data.access_token;
}

export async function chat(messages: ChatMessage[]): Promise<string> {
  const token = await getAccessToken();

  const payload = JSON.stringify({
    model: MODEL,
    messages: [
      { role: "system", content: FARADO_SYSTEM_PROMPT },
      ...messages.map((m) => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: m.content,
      })),
    ],
    stream: false,
    temperature: 0.7,
  });

  const res = await httpsRequest(CHAT_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
      "Content-Length": Buffer.byteLength(payload).toString(),
    },
    body: payload,
  });

  if (res.status === 401) {
    cachedToken = null;
    throw new Error("Истёк токен GigaChat. Повторите попытку.");
  }

  if (res.status < 200 || res.status >= 300) {
    throw new Error(`Ошибка GigaChat: ${res.status} ${res.body}`);
  }

  const data = JSON.parse(res.body) as {
    choices: Array<{ message: { content: string } }>;
  };

  const content = data.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("Пустой ответ от GigaChat.");
  }
  return content;
}

export function isAIConfigured(): boolean {
  return !!process.env.GIGACHAT_AUTH_KEY;
}
