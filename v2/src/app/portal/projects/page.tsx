'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

type ProjectStatus = 'getting-started' | 'underway' | 'wrapping-up' | 'done';

interface CaptureItem {
  id: string;
  type: 'note' | 'photo' | 'meeting' | 'milestone';
  content: string;
  timestamp: string;
  photoUrl?: string;
}

interface Project {
  id: string;
  title: string;
  description: string;
  status: ProjectStatus;
  template?: string;
  captures: CaptureItem[];
  createdAt: string;
}

const STATUS_LABELS: Record<ProjectStatus, { label: string; colour: string }> = {
  'getting-started': { label: 'Getting Started', colour: 'bg-blue-100 text-blue-700' },
  'underway': { label: 'Underway', colour: 'bg-amber-100 text-amber-700' },
  'wrapping-up': { label: 'Wrapping Up', colour: 'bg-green-100 text-green-700' },
  'done': { label: 'Done', colour: 'bg-stone-100 text-stone-600' },
};

const PROJECT_TEMPLATES = [
  {
    id: 'production-facility',
    title: 'Set Up Production Facility',
    description: 'From container delivery to first bed — all the steps to get manufacturing running.',
    steps: ['Container delivery', 'Equipment install', 'Power setup', 'First shred batch', 'First sheet pressed', 'First bed cut', 'Ongoing production'],
  },
  {
    id: 'plastic-collection',
    title: 'Community Plastic Collection',
    description: 'Identify sources, set up collection points, train sorters, and start shredding.',
    steps: ['Identify plastic sources', 'Set up collection points', 'Train sorters', 'First collection run', 'First shred batch', 'Ongoing collection'],
  },
  {
    id: 'ownership-transfer',
    title: 'Ownership Transfer',
    description: 'The journey from training to independent production to full community ownership.',
    steps: ['Initial training', 'Supervised production', 'Independent production', 'Quality assurance handover', 'Full transfer'],
  },
  {
    id: 'elders-advisory',
    title: 'Elders Advisory',
    description: 'Establish Elder guidance for enterprise decisions and cultural direction.',
    steps: ['Identify Elders', 'First yarn-up', 'Design input session', 'Ongoing guidance', 'Advisory structure formalised'],
  },
  {
    id: 'custom',
    title: 'Custom Project',
    description: 'Create your own project for a community-specific goal.',
    steps: [],
  },
];

const STORAGE_KEY = 'goods-portal-projects';

function loadProjects(): Project[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveProjects(projects: Project[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [showNew, setShowNew] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [captureText, setCaptureText] = useState('');
  const [captureType, setCaptureType] = useState<CaptureItem['type']>('note');
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    setProjects(loadProjects());
  }, []);

  const createProject = (template: typeof PROJECT_TEMPLATES[0]) => {
    const project: Project = {
      id: Date.now().toString(),
      title: template.id === 'custom' ? 'New Project' : template.title,
      description: template.description,
      status: 'getting-started',
      template: template.id,
      captures: template.steps.map((step, i) => ({
        id: `step-${i}`,
        type: 'milestone' as const,
        content: step,
        timestamp: new Date().toISOString(),
      })),
      createdAt: new Date().toISOString(),
    };
    const updated = [...projects, project];
    setProjects(updated);
    saveProjects(updated);
    setShowNew(false);
    setSelectedProject(project);
  };

  const addCapture = () => {
    if (!selectedProject || !captureText.trim()) return;
    const capture: CaptureItem = {
      id: Date.now().toString(),
      type: captureType,
      content: captureText.trim(),
      timestamp: new Date().toISOString(),
    };
    const updated = projects.map(p =>
      p.id === selectedProject.id
        ? { ...p, captures: [...p.captures, capture] }
        : p
    );
    setProjects(updated);
    saveProjects(updated);
    setSelectedProject(updated.find(p => p.id === selectedProject.id) || null);
    setCaptureText('');
  };

  const updateStatus = (projectId: string, status: ProjectStatus) => {
    const updated = projects.map(p =>
      p.id === projectId ? { ...p, status } : p
    );
    setProjects(updated);
    saveProjects(updated);
    if (selectedProject?.id === projectId) {
      setSelectedProject(updated.find(p => p.id === projectId) || null);
    }
  };

  const toggleRecording = async () => {
    if (isRecording) {
      mediaRecorderRef.current?.stop();
      setIsRecording(false);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        stream.getTracks().forEach(t => t.stop());
        // For now, just add a note that a recording was captured
        // In production, this would upload to Supabase and trigger transcription
        setCaptureText(prev =>
          prev ? `${prev}\n[Voice recording captured]` : '[Voice recording captured — transcription coming soon]'
        );
        setCaptureType('meeting');
      };

      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
    } catch {
      // Mic not available
    }
  };

  // Project detail view
  if (selectedProject) {
    const statusInfo = STATUS_LABELS[selectedProject.status];
    return (
      <div className="max-w-2xl mx-auto px-4 py-4">
        {/* Back + title */}
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => setSelectedProject(null)}
            className="p-1 -ml-1 text-stone-500 hover:text-stone-700"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-stone-900">{selectedProject.title}</h1>
            <p className="text-xs text-stone-500">{selectedProject.description}</p>
          </div>
        </div>

        {/* Status selector */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {(Object.entries(STATUS_LABELS) as [ProjectStatus, { label: string; colour: string }][]).map(([key, val]) => (
            <button
              key={key}
              onClick={() => updateStatus(selectedProject.id, key)}
              className={`px-3 py-1.5 text-xs font-medium rounded-full whitespace-nowrap transition-colors ${
                selectedProject.status === key
                  ? val.colour
                  : 'bg-stone-50 text-stone-400 hover:bg-stone-100'
              }`}
            >
              {val.label}
            </button>
          ))}
        </div>

        {/* Capture feed */}
        <div className="space-y-3 mb-6">
          {selectedProject.captures.map((capture) => (
            <div
              key={capture.id}
              className={`p-3 rounded-lg border ${
                capture.type === 'milestone'
                  ? 'border-green-200 bg-green-50'
                  : capture.type === 'meeting'
                  ? 'border-blue-200 bg-blue-50'
                  : 'border-stone-200 bg-white'
              }`}
            >
              <div className="flex items-start gap-2">
                <span className="text-xs font-medium uppercase text-stone-400 mt-0.5">
                  {capture.type === 'milestone' ? 'Step' : capture.type}
                </span>
                <p className="text-sm text-stone-800 flex-1">{capture.content}</p>
              </div>
              <p className="text-xs text-stone-400 mt-1">
                {new Date(capture.timestamp).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
            </div>
          ))}
        </div>

        {/* Add capture */}
        <div className="border-t border-stone-200 pt-4">
          <div className="flex gap-2 mb-3">
            {(['note', 'photo', 'meeting', 'milestone'] as const).map(type => (
              <button
                key={type}
                onClick={() => setCaptureType(type)}
                className={`px-3 py-1 text-xs rounded-full capitalize ${
                  captureType === type
                    ? 'bg-green-600 text-white'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <div className="flex items-end gap-2">
            {/* Record button */}
            <button
              onClick={toggleRecording}
              className={`p-3 rounded-full flex-shrink-0 ${
                isRecording
                  ? 'bg-red-500 text-white animate-pulse'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
              title={isRecording ? 'Stop recording' : 'Record meeting'}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
              </svg>
            </button>

            <textarea
              value={captureText}
              onChange={(e) => setCaptureText(e.target.value)}
              placeholder="Add a note, update, or decision..."
              rows={2}
              className="flex-1 resize-none rounded-xl border border-stone-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-stone-50"
            />

            <button
              onClick={addCapture}
              disabled={!captureText.trim()}
              className="p-3 rounded-full bg-green-600 text-white flex-shrink-0 hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Project list view
  return (
    <div className="max-w-2xl mx-auto px-4 py-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/portal" className="p-1 -ml-1 text-stone-500 hover:text-stone-700">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </Link>
        <div className="flex-1">
          <h1 className="text-lg font-bold text-stone-900">Walk Together</h1>
          <p className="text-xs text-stone-500">Your enterprise projects and milestones</p>
        </div>
        <button
          onClick={() => setShowNew(true)}
          className="px-4 py-2 bg-amber-600 text-white text-sm font-medium rounded-xl hover:bg-amber-700 transition-colors"
        >
          New Project
        </button>
      </div>

      {/* New project template picker */}
      {showNew && (
        <div className="mb-6 space-y-3">
          <h2 className="text-sm font-bold text-stone-700">Choose a template</h2>
          {PROJECT_TEMPLATES.map(template => (
            <button
              key={template.id}
              onClick={() => createProject(template)}
              className="w-full text-left p-4 bg-white border border-stone-200 rounded-xl hover:border-amber-300 hover:shadow-sm transition-all"
            >
              <h3 className="font-bold text-stone-900 text-sm">{template.title}</h3>
              <p className="text-xs text-stone-500 mt-0.5">{template.description}</p>
              {template.steps.length > 0 && (
                <p className="text-xs text-amber-600 mt-1">{template.steps.length} steps</p>
              )}
            </button>
          ))}
          <button
            onClick={() => setShowNew(false)}
            className="w-full text-center text-sm text-stone-500 py-2"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Project list */}
      {projects.length === 0 && !showNew ? (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-100 text-amber-600 mb-4">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15a2.25 2.25 0 012.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
            </svg>
          </div>
          <h2 className="text-lg font-bold text-stone-900 mb-1">No projects yet</h2>
          <p className="text-stone-500 text-sm mb-4">
            Start tracking your enterprise journey. Choose a template to get going.
          </p>
          <button
            onClick={() => setShowNew(true)}
            className="px-6 py-2.5 bg-amber-600 text-white font-medium rounded-xl hover:bg-amber-700 transition-colors"
          >
            Start a Project
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {projects.map(project => {
            const statusInfo = STATUS_LABELS[project.status];
            return (
              <button
                key={project.id}
                onClick={() => setSelectedProject(project)}
                className="w-full text-left p-4 bg-white border border-stone-200 rounded-xl hover:border-stone-300 hover:shadow-sm transition-all"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-stone-900 text-sm">{project.title}</h3>
                    <p className="text-xs text-stone-500 mt-0.5">
                      {project.captures.length} items
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusInfo.colour}`}>
                    {statusInfo.label}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
