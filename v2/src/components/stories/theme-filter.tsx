'use client';

import { Button } from '@/components/ui/button';
import { themeDefinitions, type ThemeId } from '@/lib/data/content';

interface ThemeFilterProps {
  themes: {
    id: ThemeId;
    count: number;
  }[];
  activeTheme: ThemeId | 'all';
  onThemeChange: (theme: ThemeId | 'all') => void;
}

export function ThemeFilter({ themes, activeTheme, onThemeChange }: ThemeFilterProps) {
  const totalCount = themes.reduce((sum, t) => sum + t.count, 0);

  return (
    <div className="flex flex-wrap gap-2">
      {/* All button */}
      <Button
        variant={activeTheme === 'all' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onThemeChange('all')}
        className="transition-all"
      >
        All
        <span className="ml-1.5 text-xs opacity-60">{totalCount}</span>
      </Button>

      {/* Theme buttons */}
      {themes.map((theme) => {
        const definition = themeDefinitions[theme.id];
        const isActive = activeTheme === theme.id;

        return (
          <Button
            key={theme.id}
            variant={isActive ? 'default' : 'outline'}
            size="sm"
            onClick={() => onThemeChange(theme.id)}
            className="transition-all"
          >
            {definition.title}
            <span className="ml-1.5 text-xs opacity-60">{theme.count}</span>
          </Button>
        );
      })}
    </div>
  );
}
