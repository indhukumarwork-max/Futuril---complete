import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { Select } from '@/components/ui/select';

export default function PrimitivesDemo() {
  return (
    <main className="min-h-screen bg-bg p-8 text-ink flex flex-col items-center">
      <div className="w-full max-w-4xl space-y-10">
        {/* Header */}
        <header className="border-b border-border pb-6 space-y-2">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight text-ink">
              Futuril Design System & Primitive Components
            </h1>
            <Badge variant="primary">Design Tokens Active</Badge>
          </div>
          <p className="text-ink-secondary text-sm">
            Standardized UI primitives enforcing strict background, surface, border, ink, and accent tokens.
          </p>
        </header>

        {/* 1. Buttons */}
        <section className="bg-surface border border-border rounded-xl p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-semibold text-ink border-b border-border pb-2">
            Button Component System
          </h2>
          <div className="flex flex-wrap gap-3 items-center">
            <Button variant="default">Default Surface</Button>
            <Button variant="primary">Primary Accent</Button>
            <Button variant="secondary">Secondary Slate</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="primary" disabled>
              Disabled
            </Button>
          </div>
          <div className="flex flex-wrap gap-3 items-center pt-2">
            <Button variant="primary" size="sm">
              Small
            </Button>
            <Button variant="primary" size="md">
              Medium
            </Button>
            <Button variant="primary" size="lg">
              Large
            </Button>
          </div>
        </section>

        {/* 2. Badges */}
        <section className="bg-surface border border-border rounded-xl p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-semibold text-ink border-b border-border pb-2">
            Badge Tokens
          </h2>
          <div className="flex flex-wrap gap-3 items-center">
            <Badge variant="default">Default Token</Badge>
            <Badge variant="primary">Primary Accent</Badge>
            <Badge variant="secondary">Secondary Slate</Badge>
            <Badge variant="success">Active / Success</Badge>
            <Badge variant="destructive">Warning / Error</Badge>
            <Badge variant="outline">Border Outline</Badge>
          </div>
        </section>

        {/* 3. Inputs & Selects */}
        <section className="bg-surface border border-border rounded-xl p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-semibold text-ink border-b border-border pb-2">
            Form Control Primitives
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-ink-secondary">Standard Input</label>
              <Input placeholder="Enter your text..." />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-ink-secondary">Error State Input</label>
              <Input placeholder="Invalid field value" error defaultValue="Invalid input" />
            </div>
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-medium text-ink-secondary">Select Dropdown</label>
              <Select
                options={[
                  { value: 'option1', label: 'Option 1 - Futuril Token Selection' },
                  { value: 'option2', label: 'Option 2 - Surface Tokens' },
                ]}
              />
            </div>
          </div>
        </section>

        {/* 4. Surface Cards & Avatars */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="space-y-3">
            <h3 className="font-semibold text-ink text-base">Card Surface Primitive</h3>
            <p className="text-sm text-ink-secondary">
              Cards utilize surface background tokens (`var(--color-surface)`), crisp border tokens, and soft elevation shadows.
            </p>
          </Card>

          <Card className="space-y-3">
            <h3 className="font-semibold text-ink text-base">Avatar Primitive</h3>
            <div className="flex items-center space-x-4">
              <Avatar size="sm" fallback="SM" />
              <Avatar size="md" fallback="MD" />
              <Avatar size="lg" fallback="LG" />
            </div>
          </Card>
        </section>
      </div>
    </main>
  );
}
