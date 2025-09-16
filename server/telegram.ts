interface TelegramMessage {
  chat_id: string;
  text: string;
  parse_mode?: 'HTML' | 'Markdown';
}

export async function sendTelegramNotification(message: string): Promise<boolean> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    console.warn('Telegram bot credentials not configured. Set TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID environment variables.');
    return false;
  }

  const telegramMessage: TelegramMessage = {
    chat_id: chatId,
    text: message,
    parse_mode: 'HTML'
  };

  try {
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(telegramMessage),
    });

    if (!response.ok) {
      const errorData = await response.text();
      // Telegram API error
      return false;
    }

    // Telegram notification sent successfully
    return true;
  } catch (error) {
    // Error sending Telegram notification
    return false;
  }
}

export function formatQuoteRequestMessage(quoteRequest: any): string {
  return `
🔔 <b>Новый запрос расчета стоимости!</b>

👤 <b>Имя:</b> ${quoteRequest.name}
🏢 <b>Компания:</b> ${quoteRequest.company || 'Не указана'}
📧 <b>Email:</b> ${quoteRequest.email}
📱 <b>Телефон:</b> ${quoteRequest.phone || 'Не указан'}

🚛 <b>Тип услуги:</b> ${quoteRequest.serviceType}
📍 <b>Откуда:</b> ${quoteRequest.sourceCountry || 'Не указано'}
📍 <b>Куда:</b> ${quoteRequest.destinationCountry || 'Не указано'}

💰 <b>Бюджет:</b> ${quoteRequest.estimatedBudget || 'Не указан'}
⏰ <b>Сроки:</b> ${quoteRequest.timeline || 'Не указаны'}

📝 <b>Описание:</b>
${quoteRequest.description || 'Не указано'}

<i>Время запроса: ${new Date().toLocaleString('ru-RU', { timeZone: 'Asia/Dushanbe' })}</i>
  `.trim();
}

export function formatContactMessage(contact: any): string {
  return `
📧 <b>Новое сообщение с сайта!</b>

👤 <b>Имя:</b> ${contact.name}
📧 <b>Email:</b> ${contact.email}
📋 <b>Тема:</b> ${contact.subject}

💬 <b>Сообщение:</b>
${contact.message}

<i>Время отправки: ${new Date().toLocaleString('ru-RU', { timeZone: 'Asia/Dushanbe' })}</i>
  `.trim();
}