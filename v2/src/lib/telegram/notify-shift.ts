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

function esc(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function formatShiftMessage(shift: ShiftData): string {
  const date = new Date(shift.shift_date + 'T00:00:00').toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const dieselEmoji = shift.diesel_level === 'full' ? '🟢' : shift.diesel_level === 'medium' ? '🟡' : '🔴';

  let msg = `📋 <b>Shift Log — ${esc(date)}</b>\n\n`;
  msg += `👷 <b>Operator:</b> ${esc(shift.operator)}\n`;
  msg += `📊 <b>Sheets:</b> ${shift.sheets_produced} produced, ${shift.sheets_cooling} cooling\n`;
  msg += `📦 <b>Total to date:</b> ${shift.total_sheets_to_date}\n`;

  if (shift.plastic_shredded_kg > 0) {
    msg += `♻️ <b>Plastic shredded:</b> ${shift.plastic_shredded_kg}kg\n`;
  }

  msg += `${dieselEmoji} <b>Diesel:</b> ${esc(shift.diesel_level.charAt(0).toUpperCase() + shift.diesel_level.slice(1))}\n`;

  if (shift.issues && shift.issues.length > 0) {
    msg += `\n⚠️ <b>Issues:</b> ${esc(shift.issues.join(', '))}\n`;
    if (shift.issue_notes) {
      msg += `${esc(shift.issue_notes)}\n`;
    }
  }

  if (shift.handover_notes) {
    msg += `\n📝 <b>Handover:</b> ${esc(shift.handover_notes)}\n`;
  }

  if (shift.voice_note_transcripts && shift.voice_note_transcripts.length > 0) {
    const transcripts = shift.voice_note_transcripts.filter(Boolean);
    if (transcripts.length > 0) {
      msg += `\n🎙️ <b>Voice notes:</b>\n`;
      for (const t of transcripts) {
        msg += `<i>"${esc(t)}"</i>\n`;
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
      parse_mode: 'HTML',
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    console.error('Telegram notification failed:', res.status, body);
  }
}
