interface ShiftData {
  operator: string;
  shift_date: string;
  sheets_produced: number;
  sheets_cooling: number;
  plastic_shredded_kg: number;
  diesel_level: string;
  issues: string[];
  issue_notes: string | null;
  handover_notes: string | null;
  voice_note_transcripts: string[];
  total_sheets_to_date: number;
}

function escapeMarkdown(text: string): string {
  return text.replace(/[_*[\]()~`>#+\-=|{}.!]/g, '\\$&');
}

function formatShiftMessage(shift: ShiftData): string {
  const date = new Date(shift.shift_date + 'T00:00:00').toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const dieselEmoji = shift.diesel_level === 'full' ? '🟢' : shift.diesel_level === 'medium' ? '🟡' : '🔴';

  let msg = `📋 *Shift Log — ${escapeMarkdown(date)}*\n\n`;
  msg += `👷 *Operator:* ${escapeMarkdown(shift.operator)}\n`;
  msg += `📊 *Sheets:* ${shift.sheets_produced} produced, ${shift.sheets_cooling} cooling\n`;
  msg += `📦 *Total to date:* ${shift.total_sheets_to_date}\n`;

  if (shift.plastic_shredded_kg > 0) {
    msg += `♻️ *Plastic shredded:* ${shift.plastic_shredded_kg}kg\n`;
  }

  msg += `${dieselEmoji} *Diesel:* ${escapeMarkdown(shift.diesel_level.charAt(0).toUpperCase() + shift.diesel_level.slice(1))}\n`;

  if (shift.issues && shift.issues.length > 0) {
    msg += `\n⚠️ *Issues:* ${escapeMarkdown(shift.issues.join(', '))}\n`;
    if (shift.issue_notes) {
      msg += `${escapeMarkdown(shift.issue_notes)}\n`;
    }
  }

  if (shift.handover_notes) {
    msg += `\n📝 *Handover:* ${escapeMarkdown(shift.handover_notes)}\n`;
  }

  if (shift.voice_note_transcripts && shift.voice_note_transcripts.length > 0) {
    const transcripts = shift.voice_note_transcripts.filter(Boolean);
    if (transcripts.length > 0) {
      msg += `\n🎙️ *Voice notes:*\n`;
      for (const t of transcripts) {
        msg += `_"${escapeMarkdown(t)}"_\n`;
      }
    }
  }

  return msg;
}

export async function notifyShiftToTelegram(shift: ShiftData): Promise<void> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    console.log('Telegram notification skipped — env vars not configured');
    return;
  }

  const text = formatShiftMessage(shift);

  const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: 'MarkdownV2',
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    console.error('Telegram notification failed:', res.status, body);
  }
}
