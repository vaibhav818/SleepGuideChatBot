import { redirect } from 'next/navigation';

/**
 * Home page with server-side redirect to dashboard
 */
export default function Home() {
  redirect('/dashboard');
}

