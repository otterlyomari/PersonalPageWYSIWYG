// app/page.tsx
import type { Metadata } from 'next';
import BuilderClient from './BuilderClient';

export const metadata: Metadata = {
  title: "Page Editor - C.L.A.W.S.",
};

export default function Page() {
  return <BuilderClient />;
}