'use client';

import * as React from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';

interface ProductionHeaderProps {
  onProfileLoaded?: (profile: { id: string; display_name: string | null }) => void;
}

export function ProductionHeader({ onProfileLoaded }: ProductionHeaderProps) {
  const [displayName, setDisplayName] = React.useState<string | null>(null);
  const [userId, setUserId] = React.useState<string | null>(null);
  const [editingName, setEditingName] = React.useState(false);
  const [nameInput, setNameInput] = React.useState('');
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    const supabase = createClient();

    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      setUserId(user.id);

      const { data: profile } = await supabase
        .from('profiles')
        .select('id, display_name')
        .eq('id', user.id)
        .single();

      if (profile) {
        setDisplayName(profile.display_name);
        onProfileLoaded?.({ id: profile.id, display_name: profile.display_name });
      }
    }

    loadProfile();
  }, [onProfileLoaded]);

  const handleSaveName = async () => {
    if (!nameInput.trim() || !userId) return;
    setSaving(true);

    const supabase = createClient();
    const newName = nameInput.trim();

    const { error } = await supabase
      .from('profiles')
      .update({ display_name: newName })
      .eq('id', userId);

    if (!error) {
      setDisplayName(newName);
      setEditingName(false);
      onProfileLoaded?.({ id: userId, display_name: newName });
    }
    setSaving(false);
  };

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = '/auth/phone-login';
  };

  if (!userId) return null;

  const isDefaultName = !displayName || displayName === 'User';

  return (
    <div className="flex items-center justify-between gap-3 py-2">
      <div className="flex items-center gap-2 min-w-0">
        {isDefaultName && !editingName ? (
          <button
            onClick={() => setEditingName(true)}
            className="text-sm text-background/70 underline underline-offset-2 hover:text-background"
          >
            Set your name
          </button>
        ) : editingName ? (
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="Your name"
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
              className="h-8 px-2 rounded-md text-sm bg-background/10 text-background placeholder:text-background/50 border border-background/30 focus:outline-none focus:ring-1 focus:ring-background/50"
            />
            <Button
              type="button"
              size="sm"
              onClick={handleSaveName}
              disabled={saving || !nameInput.trim()}
              className="h-8 bg-background/20 hover:bg-background/30 text-background text-xs"
            >
              {saving ? '...' : 'Save'}
            </Button>
          </div>
        ) : (
          <span className="text-sm text-background/80 truncate">
            Logged in as <span className="font-semibold text-background">{displayName}</span>
          </span>
        )}
      </div>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={handleSignOut}
        className="text-background/70 hover:text-background hover:bg-background/10 text-xs flex-shrink-0"
      >
        Sign Out
      </Button>
    </div>
  );
}
