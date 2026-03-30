'use client';

import { Printer } from 'lucide-react';

export function PrintButton() {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex gap-2 print:hidden">
      <button
        onClick={() => window.print()}
        className="flex items-center gap-2 rounded-full bg-amber-600 px-5 py-3 text-sm font-medium text-white shadow-lg transition-all hover:bg-amber-700 hover:shadow-xl active:scale-95"
      >
        <Printer className="h-4 w-4" />
        Export PDF
      </button>
    </div>
  );
}
