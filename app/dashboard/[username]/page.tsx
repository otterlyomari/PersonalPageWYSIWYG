// app/page.tsx
import type { Metadata } from 'next';
import DashboardClient from './DashboardClient';

export const metadata: Metadata = {
  title: "User Overview - C.L.A.W.S.",
};

export default function Page() {
  return <DashboardClient />;
}