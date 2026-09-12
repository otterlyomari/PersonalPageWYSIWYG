// app/page.tsx
import type { Metadata } from 'next';
import HomeClient from './HomeClient';

export const metadata: Metadata = {
  title: 'C.L.A.W.S. — Your links. Your pages. Zero limits.',
  description: 'The hybrid builder built for creators who outgrew rigid link-in-bio tools.',
};

export default function Page() {
  return <HomeClient />;
}