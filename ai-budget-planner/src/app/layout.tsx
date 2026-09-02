import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'BudgetAI — Smart Finance for Young Adults',
  description: 'AI-powered budget planner that helps you track income, manage expenses, and reach your savings goals.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      {/* Inter font loaded via CSS @import for deployment compatibility */}
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased bg-slate-950 text-slate-100">
        {children}
      </body>
    </html>
  );
}
