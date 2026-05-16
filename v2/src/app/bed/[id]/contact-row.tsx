import Link from 'next/link';

type Props = {
  uniqueId: string;
  productNoun: string;
};

// Goods support number — routes to GoHighLevel for SMS + WhatsApp inbound.
// Inbound is free under GHL/Twilio. Outbound replies cost ~AU$0.05 per 160-char segment + AU$6.50/mo number rental.
const SUPPORT_PHONE_RAW = (process.env.NEXT_PUBLIC_GOODS_SUPPORT_PHONE || '+61468052660').replace(/\s+/g, '');
const SUPPORT_PHONE_INTL = SUPPORT_PHONE_RAW.replace(/^\+/, ''); // wa.me wants no plus

function buildWhatsAppHref(uniqueId: string): string {
  const message = `Hi Goods, scanning ${uniqueId} — `;
  return `https://wa.me/${SUPPORT_PHONE_INTL}?text=${encodeURIComponent(message)}`;
}

function buildSmsHref(uniqueId: string): string {
  const message = `Hi Goods, scanning ${uniqueId} — `;
  // ios uses ?&body=, android uses ?body= — both tolerate the ampersand variant.
  return `sms:${SUPPORT_PHONE_RAW}?&body=${encodeURIComponent(message)}`;
}

export function ContactRow({ uniqueId, productNoun }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
      <a
        href={buildWhatsAppHref(uniqueId)}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-xl border bg-card hover:bg-emerald-50 dark:hover:bg-emerald-950/30 p-3 flex items-center gap-3 transition-colors"
      >
        <span className="text-2xl" aria-hidden>💚</span>
        <div>
          <p className="text-sm font-semibold">WhatsApp Goods</p>
          <p className="text-xs text-muted-foreground">Message about this {productNoun.toLowerCase()}</p>
        </div>
      </a>
      <a
        href={buildSmsHref(uniqueId)}
        className="rounded-xl border bg-card hover:bg-amber-50 dark:hover:bg-amber-950/30 p-3 flex items-center gap-3 transition-colors"
      >
        <span className="text-2xl" aria-hidden>📱</span>
        <div>
          <p className="text-sm font-semibold">Text us</p>
          <p className="text-xs text-muted-foreground">Standard SMS, no app needed</p>
        </div>
      </a>
      <a
        href={`tel:${SUPPORT_PHONE_RAW}`}
        className="rounded-xl border bg-card hover:bg-stone-50 dark:hover:bg-stone-800 p-3 flex items-center gap-3 transition-colors"
      >
        <span className="text-2xl" aria-hidden>📞</span>
        <div>
          <p className="text-sm font-semibold">Call</p>
          <p className="text-xs text-muted-foreground">For something urgent</p>
        </div>
      </a>
    </div>
  );
}
