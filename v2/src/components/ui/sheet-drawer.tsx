'use client';

import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * A right-hand detail drawer, built on the dialog primitive already in the project. No new
 * dependency was needed. Escape and the overlay both close it, and focus returns to the row.
 */

function Drawer({ ...props }: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root {...props} />;
}

function DrawerContent({ className, children, title, ...props }: React.ComponentProps<typeof DialogPrimitive.Content> & { title: string }) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/30 data-[state=open]:animate-in data-[state=open]:fade-in-0 motion-reduce:animate-none" />
      <DialogPrimitive.Content
        className={cn(
          'fixed right-0 top-0 z-50 flex h-full w-full max-w-lg flex-col gap-4 overflow-y-auto border-l bg-background p-6 shadow-lg',
          'data-[state=open]:animate-in data-[state=open]:slide-in-from-right motion-reduce:animate-none',
          className,
        )}
        {...props}
      >
        <DialogPrimitive.Title className="font-display text-xl leading-snug pr-8">{title}</DialogPrimitive.Title>
        <DialogPrimitive.Close className="absolute right-5 top-5 rounded-sm opacity-60 transition-opacity hover:opacity-100 motion-reduce:transition-none">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
        {children}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

export { Drawer, DrawerContent };
