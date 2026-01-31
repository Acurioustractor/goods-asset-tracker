'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface OTPInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  onComplete?: (value: string) => void;
  disabled?: boolean;
  error?: boolean;
  className?: string;
}

export function OTPInput({
  length = 6,
  value,
  onChange,
  onComplete,
  disabled = false,
  error = false,
  className,
}: OTPInputProps) {
  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);

  // Initialize refs array
  React.useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, length);
  }, [length]);

  const handleChange = (index: number, inputValue: string) => {
    // Only allow digits
    const digit = inputValue.replace(/\D/g, '').slice(-1);

    // Build new value
    const newValue = value.slice(0, index) + digit + value.slice(index + 1);
    const trimmedValue = newValue.slice(0, length);

    onChange(trimmedValue);

    // Move to next input if digit entered
    if (digit && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Trigger onComplete when all digits entered
    if (trimmedValue.length === length && onComplete) {
      onComplete(trimmedValue);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      e.preventDefault();

      if (value[index]) {
        // Clear current digit
        const newValue = value.slice(0, index) + value.slice(index + 1);
        onChange(newValue);
      } else if (index > 0) {
        // Move to previous input and clear it
        inputRefs.current[index - 1]?.focus();
        const newValue = value.slice(0, index - 1) + value.slice(index);
        onChange(newValue);
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    onChange(pastedData);

    // Focus appropriate input
    const focusIndex = Math.min(pastedData.length, length - 1);
    inputRefs.current[focusIndex]?.focus();

    // Trigger onComplete if all digits pasted
    if (pastedData.length === length && onComplete) {
      onComplete(pastedData);
    }
  };

  const handleFocus = (index: number) => {
    // Select the input content on focus
    inputRefs.current[index]?.select();
  };

  return (
    <div className={cn('flex justify-center gap-2 sm:gap-3', className)}>
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          pattern="[0-9]"
          maxLength={1}
          value={value[index] || ''}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          onFocus={() => handleFocus(index)}
          disabled={disabled}
          className={cn(
            'h-12 w-10 sm:h-14 sm:w-12 rounded-lg border-2 bg-background text-center text-xl sm:text-2xl font-semibold transition-all',
            'focus:outline-none focus:ring-2 focus:ring-ring/50',
            value[index]
              ? 'border-primary bg-primary/5'
              : 'border-input',
            error && 'border-destructive animate-shake',
            disabled && 'opacity-50 cursor-not-allowed',
          )}
          aria-label={`Digit ${index + 1}`}
        />
      ))}
    </div>
  );
}
