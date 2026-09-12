// app/page.tsx
import type { Metadata } from 'next';
import AuthClient from './AuthClient';

export const metadata: Metadata = {
  title: "Log in or Sign Up - C.L.A.W.S.",
};

export default function Page() {
  return <AuthClient />;
}