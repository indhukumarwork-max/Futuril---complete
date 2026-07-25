import React from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card } from '../../components/ui/card';

export default function PrimitivesDemo() {
  return (
    <main className="flex flex-col items-center justify-start min-h-screen p-8 space-y-8 bg-bg">
      <h1 className="text-2xl font-bold text-ink">Design Token & Primitive Component Library Demo</h1>
      <section className="flex flex-col items-center space-y-4 w-full max-w-md">
        <h2 className="text-xl font-semibold text-ink">Button Variants</h2>
        <div className="flex space-x-4">
          <Button>Default</Button>
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button disabled>Disabled</Button>
        </div>
      </section>
      <section className="flex flex-col items-center space-y-4 w-full max-w-md">
        <h2 className="text-xl font-semibold text-ink">Input</h2>
        <Input placeholder="Enter text..." />
        <Input placeholder="Disabled" disabled />
      </section>
      <section className="flex flex-col items-center space-y-4 w-full max-w-md">
        <h2 className="text-xl font-semibold text-ink">Card</h2>
        <Card>
          <p className="text-ink">This is a card component using surface background and border token.</p>
        </Card>
      </section>
    </main>
  );
}
