'use client'

import Script from 'next/script'
import { useState } from 'react'

export default function TestGalleryPage() {
  // Toggle between local (http://localhost:3001) and production
  const [useLocal, setUseLocal] = useState(true)
  const baseUrl = useLocal ? 'http://localhost:3001' : 'https://empathy-ledger-v2.vercel.app'

  return (
    <div className="min-h-screen bg-[#FDF8F3] py-16">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-light text-[#2E2E2E] mb-4" style={{ fontFamily: 'Georgia, serif' }}>
          Empathy Ledger Gallery Test
        </h1>
        <p className="text-[#5E5E5E] mb-8">
          Testing syndication embed from Empathy Ledger
        </p>

        {/* Environment Toggle */}
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={useLocal}
              onChange={(e) => setUseLocal(e.target.checked)}
              className="w-5 h-5"
            />
            <span className="text-sm text-yellow-800">
              <strong>Use Local Empathy Ledger</strong> (http://localhost:3001)
              <br />
              <span className="text-xs">Uncheck to use production (requires embed files to be deployed)</span>
            </span>
          </label>
        </div>

        {/* Empathy Ledger Gallery Embed */}
        <div className="bg-white rounded-xl shadow-sm border border-[#E8DED4] p-6">
          {/* Set API base before script loads */}
          <Script
            id="el-config"
            strategy="beforeInteractive"
            dangerouslySetInnerHTML={{
              __html: `window.EL_API_BASE = '${baseUrl}';`
            }}
          />
          <div
            id="el-gallery-1094e4f1-81c4-4613-a3b9-3670b33ff737"
            data-gallery-id="1094e4f1-81c4-4613-a3b9-3670b33ff737"
            data-token="6hOcX7YSlWaH1JFaRdEYqrUEY7AHKxqmg3A_5yvYK-4"
          />
          <Script
            src={`${baseUrl}/embed/gallery.js`}
            strategy="lazyOnload"
          />
        </div>

        <div className="mt-8 p-4 bg-[#8B9D77]/10 rounded-lg border border-[#8B9D77]/30">
          <h3 className="font-medium text-[#2E2E2E] mb-2">Embed Details</h3>
          <ul className="text-sm text-[#5E5E5E] space-y-1">
            <li><strong>Gallery ID:</strong> 1094e4f1-81c4-4613-a3b9-3670b33ff737</li>
            <li><strong>Token:</strong> 6hOcX7YSlWaH1JFaRdEYqrUEY7AHKxqmg3A_5yvYK-4</li>
            <li><strong>Script:</strong> {baseUrl}/embed/gallery.js</li>
            <li><strong>API Base:</strong> {baseUrl}</li>
          </ul>
        </div>

        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <h3 className="font-medium text-red-800 mb-2">⚠️ Deployment Required</h3>
          <p className="text-sm text-red-700 mb-2">
            The embed files need to be committed and pushed to Empathy Ledger:
          </p>
          <code className="text-xs bg-red-100 p-2 block rounded">
            cd empathy-ledger-v2<br/>
            git add public/embed src/app/api/v1/galleries<br/>
            git commit -m &quot;feat: add gallery embed API and script&quot;<br/>
            git push
          </code>
        </div>
      </div>
    </div>
  )
}
