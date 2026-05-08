'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

// Mirrors the signature block in wiki/articles/brand-comms/04-email-templates.md
// Plain. No logo image (it makes emails look transactional). No "warm regards" gloss.

export default function SignatureGeneratorPage() {
  const [firstName, setFirstName] = useState('');
  const [role, setRole] = useState('');
  const [mobile, setMobile] = useState('');
  const [emailAddress, setEmailAddress] = useState('hi@act.place');
  const [copied, setCopied] = useState<'plain' | 'html' | null>(null);

  const plain = useMemo(() => {
    const lines = [
      firstName.trim() || 'First name',
      'Goods on Country',
      role.trim(),
      `goodsoncountry.com  |  ${emailAddress.trim() || 'hi@act.place'}`,
      mobile.trim(),
    ].filter((l) => l && l !== '');
    return lines.join('\n');
  }, [firstName, role, mobile, emailAddress]);

  const html = useMemo(() => {
    const safeFirstName = (firstName.trim() || 'First name').replace(/</g, '&lt;');
    const safeRole = role.trim().replace(/</g, '&lt;');
    const safeMobile = mobile.trim().replace(/</g, '&lt;');
    const safeEmail = (emailAddress.trim() || 'hi@act.place').replace(/</g, '&lt;');
    const lines = [
      `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 1.5; color: #2E2E2E;">`,
      `<div><strong>${safeFirstName}</strong></div>`,
      `<div>Goods on Country</div>`,
      safeRole ? `<div>${safeRole}</div>` : '',
      `<div><a href="https://www.goodsoncountry.com" style="color: #2E2E2E; text-decoration: none;">goodsoncountry.com</a> &nbsp;|&nbsp; <a href="mailto:${safeEmail}" style="color: #2E2E2E; text-decoration: none;">${safeEmail}</a></div>`,
      safeMobile ? `<div>${safeMobile}</div>` : '',
      `</div>`,
    ].filter(Boolean);
    return lines.join('\n');
  }, [firstName, role, mobile, emailAddress]);

  function copy(format: 'plain' | 'html') {
    const text = format === 'html' ? html : plain;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(format);
      setTimeout(() => setCopied(null), 2000);
    });
  }

  return (
    <main style={{ backgroundColor: '#FDF8F3', color: '#2E2E2E', minHeight: '100vh' }}>
      <div className="container mx-auto px-4 py-12 md:py-16 max-w-5xl">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.3em] mb-3" style={{ color: '#8B9D77' }}>
            Tools
          </p>
          <h1
            className="text-3xl md:text-4xl font-light leading-tight mb-3"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            Email signature
          </h1>
          <p className="text-base max-w-2xl" style={{ color: '#5E5E5E' }}>
            Goods on Country uses a single, plain signature block across the team.
            Generate yours, paste it into Gmail, Outlook, or Apple Mail.
            No logo image (makes emails look transactional). No &ldquo;warm regards&rdquo;
            gloss. Plain wins.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <section>
            <h2 className="text-sm font-medium mb-4 uppercase tracking-wider" style={{ color: '#7A7A7A' }}>
              Your details
            </h2>
            <div className="space-y-4">
              <Field label="First name" value={firstName} onChange={setFirstName} placeholder="Nic" />
              <Field
                label="Role (optional)"
                value={role}
                onChange={setRole}
                placeholder="Co-founder, manufacturing"
                helper="Only include where useful for the recipient."
              />
              <Field
                label="Email"
                value={emailAddress}
                onChange={setEmailAddress}
                placeholder="hi@act.place"
                helper="Default is hi@act.place. Change if you have a personal alias."
              />
              <Field
                label="Mobile (optional)"
                value={mobile}
                onChange={setMobile}
                placeholder="0400 000 000"
                helper="Skip unless you genuinely want recipients to call."
              />
            </div>

            <div className="mt-8 pt-6 border-t" style={{ borderColor: '#E8DED4' }}>
              <h3 className="text-sm font-medium mb-3 uppercase tracking-wider" style={{ color: '#7A7A7A' }}>
                Brand-guide rules
              </h3>
              <ul className="text-xs space-y-1.5" style={{ color: '#5E5E5E' }}>
                <li>One line per field. No fancy spacing.</li>
                <li>No logo image. No social icons.</li>
                <li>First name only on sign-off (the line above your sig).</li>
                <li>No &ldquo;Sent from my iPhone&rdquo; bloat.</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-sm font-medium mb-4 uppercase tracking-wider" style={{ color: '#7A7A7A' }}>
              Preview
            </h2>
            <div
              className="p-6 rounded border"
              style={{ borderColor: '#E8DED4', backgroundColor: '#fff', minHeight: '200px' }}
              dangerouslySetInnerHTML={{ __html: html }}
            />

            <div className="mt-6 grid grid-cols-2 gap-3">
              <Button variant="outline" onClick={() => copy('plain')} className="justify-between">
                <span>Copy plain text</span>
                <span className="text-xs ml-2" style={{ color: copied === 'plain' ? '#8B9D77' : '#7A7A7A' }}>
                  {copied === 'plain' ? '✓ copied' : 'plain'}
                </span>
              </Button>
              <Button onClick={() => copy('html')} className="justify-between">
                <span>Copy HTML</span>
                <span className="text-xs ml-2" style={{ color: copied === 'html' ? '#FDF8F3' : 'rgba(255,255,255,0.7)' }}>
                  {copied === 'html' ? '✓ copied' : 'html'}
                </span>
              </Button>
            </div>

            <details className="mt-4">
              <summary className="text-sm cursor-pointer" style={{ color: '#7A7A7A' }}>
                View raw output
              </summary>
              <div className="mt-3 grid gap-3">
                <div>
                  <p className="text-xs mb-1 uppercase tracking-wider" style={{ color: '#7A7A7A' }}>
                    Plain
                  </p>
                  <pre
                    className="text-xs p-3 rounded font-mono whitespace-pre-wrap break-words"
                    style={{ borderColor: '#E8DED4', backgroundColor: '#fff', border: '1px solid #E8DED4' }}
                  >
                    {plain}
                  </pre>
                </div>
                <div>
                  <p className="text-xs mb-1 uppercase tracking-wider" style={{ color: '#7A7A7A' }}>
                    HTML
                  </p>
                  <pre
                    className="text-xs p-3 rounded font-mono whitespace-pre-wrap break-words overflow-x-auto"
                    style={{ borderColor: '#E8DED4', backgroundColor: '#fff', border: '1px solid #E8DED4' }}
                  >
                    {html}
                  </pre>
                </div>
              </div>
            </details>
          </section>
        </div>

        <div className="mt-12 grid sm:grid-cols-3 gap-6 text-sm" style={{ color: '#5E5E5E' }}>
          <div>
            <h3 className="font-medium mb-2" style={{ color: '#2E2E2E' }}>
              Gmail
            </h3>
            <p className="text-xs">
              Settings → See all settings → General → Signature → Create new → Paste HTML.
            </p>
          </div>
          <div>
            <h3 className="font-medium mb-2" style={{ color: '#2E2E2E' }}>
              Apple Mail
            </h3>
            <p className="text-xs">
              Mail → Settings → Signatures → + → Paste plain. Edit Format → As Rich Text if styling not held.
            </p>
          </div>
          <div>
            <h3 className="font-medium mb-2" style={{ color: '#2E2E2E' }}>
              Outlook
            </h3>
            <p className="text-xs">
              File → Options → Mail → Signatures → New → Paste HTML.
            </p>
          </div>
        </div>

        <p className="mt-12 text-xs" style={{ color: '#7A7A7A' }}>
          Reference:{' '}
          <Link href="/brand" className="underline" style={{ color: '#C45C3E' }}>
            /brand
          </Link>
          {' · '}
          <Link href="/tools/brand-lint" className="underline" style={{ color: '#C45C3E' }}>
            /tools/brand-lint
          </Link>
          {' · '}signature template lives in{' '}
          <code className="text-xs" style={{ fontFamily: 'monospace' }}>
            wiki/articles/brand-comms/04-email-templates.md
          </code>
          .
        </p>
      </div>
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  helper,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  helper?: string;
}) {
  return (
    <div>
      <label className="text-sm font-medium block mb-1" style={{ color: '#2E2E2E' }}>
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 rounded border text-sm"
        style={{ borderColor: '#E8DED4', backgroundColor: '#fff' }}
      />
      {helper && (
        <p className="text-xs mt-1" style={{ color: '#7A7A7A' }}>
          {helper}
        </p>
      )}
    </div>
  );
}
