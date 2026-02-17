'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface ReportContent {
  id: string;
  type: 'photo' | 'quote' | 'milestone' | 'stat';
  content: string;
  caption?: string;
  attribution?: string;
  approved: boolean;
  timestamp: string;
}

interface Report {
  id: string;
  title: string;
  period: string;
  communityName: string;
  contents: ReportContent[];
  createdAt: string;
}

const STORAGE_KEY = 'goods-portal-reports';

function loadReports(): Report[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveReports(reports: Report[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
}

const METRIC_TEMPLATES = [
  { label: 'Beds produced', icon: '🛏️', unit: '' },
  { label: 'Plastic diverted (kg)', icon: '♻️', unit: 'kg' },
  { label: 'People employed', icon: '👥', unit: '' },
  { label: 'Communities reached', icon: '🌏', unit: '' },
  { label: 'Sheets pressed', icon: '📋', unit: '' },
  { label: 'Training hours', icon: '🎓', unit: 'hrs' },
];

export default function OurStoryPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [showNewReport, setShowNewReport] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newPeriod, setNewPeriod] = useState('');
  const [newCommunity, setNewCommunity] = useState('');
  const [addingType, setAddingType] = useState<ReportContent['type'] | null>(null);
  const [addContent, setAddContent] = useState('');
  const [addCaption, setAddCaption] = useState('');
  const [addAttribution, setAddAttribution] = useState('');

  useEffect(() => {
    setReports(loadReports());
  }, []);

  const createReport = () => {
    if (!newTitle.trim()) return;
    const report: Report = {
      id: Date.now().toString(),
      title: newTitle.trim(),
      period: newPeriod.trim() || new Date().getFullYear().toString(),
      communityName: newCommunity.trim() || 'Our Community',
      contents: [],
      createdAt: new Date().toISOString(),
    };
    const updated = [...reports, report];
    setReports(updated);
    saveReports(updated);
    setSelectedReport(report);
    setShowNewReport(false);
    setNewTitle('');
    setNewPeriod('');
    setNewCommunity('');
  };

  const addContentItem = () => {
    if (!selectedReport || !addContent.trim() || !addingType) return;
    const item: ReportContent = {
      id: Date.now().toString(),
      type: addingType,
      content: addContent.trim(),
      caption: addCaption.trim() || undefined,
      attribution: addAttribution.trim() || undefined,
      approved: false,
      timestamp: new Date().toISOString(),
    };
    const updated = reports.map(r =>
      r.id === selectedReport.id
        ? { ...r, contents: [...r.contents, item] }
        : r
    );
    setReports(updated);
    saveReports(updated);
    setSelectedReport(updated.find(r => r.id === selectedReport.id) || null);
    setAddContent('');
    setAddCaption('');
    setAddAttribution('');
    setAddingType(null);
  };

  const toggleApproval = (contentId: string) => {
    if (!selectedReport) return;
    const updated = reports.map(r =>
      r.id === selectedReport.id
        ? {
            ...r,
            contents: r.contents.map(c =>
              c.id === contentId ? { ...c, approved: !c.approved } : c
            ),
          }
        : r
    );
    setReports(updated);
    saveReports(updated);
    setSelectedReport(updated.find(r => r.id === selectedReport.id) || null);
  };

  // Report detail view
  if (selectedReport) {
    const approvedCount = selectedReport.contents.filter(c => c.approved).length;
    return (
      <div className="max-w-2xl mx-auto px-4 py-4">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => setSelectedReport(null)}
            className="p-1 -ml-1 text-stone-500 hover:text-stone-700"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-stone-900">{selectedReport.title}</h1>
            <p className="text-xs text-stone-500">
              {selectedReport.communityName} &middot; {selectedReport.period}
            </p>
          </div>
        </div>

        {/* Stats bar */}
        <div className="flex gap-4 mb-6 p-3 bg-blue-50 rounded-xl border border-blue-100 text-sm">
          <div>
            <span className="font-bold text-blue-700">{selectedReport.contents.length}</span>
            <span className="text-blue-600 ml-1">items</span>
          </div>
          <div>
            <span className="font-bold text-green-700">{approvedCount}</span>
            <span className="text-green-600 ml-1">approved</span>
          </div>
          <div>
            <span className="font-bold text-amber-700">{selectedReport.contents.length - approvedCount}</span>
            <span className="text-amber-600 ml-1">pending</span>
          </div>
        </div>

        {/* Content items */}
        <div className="space-y-3 mb-6">
          {selectedReport.contents.length === 0 ? (
            <div className="text-center py-8 text-stone-500 text-sm">
              <p>No content yet. Add photos, quotes, stats, and milestones to build your report.</p>
            </div>
          ) : (
            selectedReport.contents.map(item => (
              <div
                key={item.id}
                className={`p-4 rounded-xl border ${
                  item.approved
                    ? 'border-green-200 bg-green-50'
                    : 'border-stone-200 bg-white'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <span className={`text-xs font-medium uppercase ${
                      item.type === 'quote' ? 'text-purple-500'
                        : item.type === 'photo' ? 'text-blue-500'
                        : item.type === 'stat' ? 'text-amber-500'
                        : 'text-green-500'
                    }`}>
                      {item.type}
                    </span>
                    <p className="text-sm text-stone-800 mt-1">
                      {item.type === 'quote' ? `"${item.content}"` : item.content}
                    </p>
                    {item.attribution && (
                      <p className="text-xs text-stone-500 mt-1">— {item.attribution}</p>
                    )}
                    {item.caption && (
                      <p className="text-xs text-stone-400 mt-1 italic">{item.caption}</p>
                    )}
                  </div>
                  <button
                    onClick={() => toggleApproval(item.id)}
                    className={`p-1.5 rounded-lg flex-shrink-0 ${
                      item.approved
                        ? 'text-green-600 bg-green-100'
                        : 'text-stone-400 bg-stone-100 hover:bg-stone-200'
                    }`}
                    title={item.approved ? 'Approved by Elder' : 'Mark as Elder approved'}
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Add content */}
        {addingType ? (
          <div className="border-t border-stone-200 pt-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-stone-700 capitalize">Add {addingType}</h3>
              <button onClick={() => setAddingType(null)} className="text-xs text-stone-500">Cancel</button>
            </div>
            <textarea
              value={addContent}
              onChange={(e) => setAddContent(e.target.value)}
              placeholder={
                addingType === 'quote' ? 'What did they say?'
                  : addingType === 'stat' ? 'e.g. "60 beds delivered"'
                  : addingType === 'milestone' ? 'What was achieved?'
                  : 'Describe the photo'
              }
              rows={2}
              className="w-full resize-none rounded-xl border border-stone-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-stone-50"
            />
            {addingType === 'quote' && (
              <input
                value={addAttribution}
                onChange={(e) => setAddAttribution(e.target.value)}
                placeholder="Who said it? (e.g. Elder Dianne Stokes)"
                className="w-full rounded-xl border border-stone-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-stone-50"
              />
            )}
            {addingType === 'photo' && (
              <input
                value={addCaption}
                onChange={(e) => setAddCaption(e.target.value)}
                placeholder="Photo caption"
                className="w-full rounded-xl border border-stone-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-stone-50"
              />
            )}
            <button
              onClick={addContentItem}
              disabled={!addContent.trim()}
              className="w-full py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              Add to Report
            </button>
          </div>
        ) : (
          <div className="border-t border-stone-200 pt-4">
            <p className="text-xs text-stone-500 mb-3">Add content to your report</p>
            <div className="grid grid-cols-2 gap-2">
              {(['photo', 'quote', 'stat', 'milestone'] as const).map(type => (
                <button
                  key={type}
                  onClick={() => setAddingType(type)}
                  className="p-3 bg-white border border-stone-200 rounded-xl text-sm font-medium text-stone-700 hover:bg-stone-50 hover:border-stone-300 capitalize transition-colors"
                >
                  {type === 'photo' ? '📷' : type === 'quote' ? '💬' : type === 'stat' ? '📊' : '🏆'} {type}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Report list
  return (
    <div className="max-w-2xl mx-auto px-4 py-4">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/portal" className="p-1 -ml-1 text-stone-500 hover:text-stone-700">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </Link>
        <div className="flex-1">
          <h1 className="text-lg font-bold text-stone-900">Our Story</h1>
          <p className="text-xs text-stone-500">Build your enterprise report</p>
        </div>
        <button
          onClick={() => setShowNewReport(true)}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors"
        >
          New Report
        </button>
      </div>

      {/* New report form */}
      {showNewReport && (
        <div className="mb-6 p-4 bg-white border border-stone-200 rounded-xl space-y-3">
          <h2 className="text-sm font-bold text-stone-700">Create a new report</h2>
          <input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Report title (e.g. 2026 Enterprise Report)"
            className="w-full rounded-xl border border-stone-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-stone-50"
          />
          <input
            value={newCommunity}
            onChange={(e) => setNewCommunity(e.target.value)}
            placeholder="Community name"
            className="w-full rounded-xl border border-stone-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-stone-50"
          />
          <input
            value={newPeriod}
            onChange={(e) => setNewPeriod(e.target.value)}
            placeholder="Period (e.g. Jan-Jun 2026)"
            className="w-full rounded-xl border border-stone-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-stone-50"
          />
          <div className="flex gap-2">
            <button
              onClick={createReport}
              disabled={!newTitle.trim()}
              className="flex-1 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              Create Report
            </button>
            <button
              onClick={() => setShowNewReport(false)}
              className="px-4 py-2.5 text-sm text-stone-500 hover:text-stone-700"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Report list */}
      {reports.length === 0 && !showNewReport ? (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 mb-4">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
          </div>
          <h2 className="text-lg font-bold text-stone-900 mb-1">No reports yet</h2>
          <p className="text-stone-500 text-sm mb-4">
            Start collecting photos, quotes, and stats for your enterprise report.
          </p>
          <button
            onClick={() => setShowNewReport(true)}
            className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors"
          >
            Create Your First Report
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {reports.map(report => (
            <button
              key={report.id}
              onClick={() => setSelectedReport(report)}
              className="w-full text-left p-4 bg-white border border-stone-200 rounded-xl hover:border-stone-300 hover:shadow-sm transition-all"
            >
              <h3 className="font-bold text-stone-900 text-sm">{report.title}</h3>
              <p className="text-xs text-stone-500 mt-0.5">
                {report.communityName} &middot; {report.period} &middot; {report.contents.length} items
              </p>
            </button>
          ))}
        </div>
      )}

      {/* Metric templates info */}
      <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-100">
        <h3 className="text-sm font-bold text-blue-800 mb-2">Track these metrics</h3>
        <div className="grid grid-cols-2 gap-2">
          {METRIC_TEMPLATES.map(metric => (
            <div key={metric.label} className="text-xs text-blue-700 flex items-center gap-1.5">
              <span>{metric.icon}</span>
              <span>{metric.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
