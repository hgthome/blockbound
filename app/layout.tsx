import './globals.css';
import { Press_Start_2P } from 'next/font/google';

const pressStart2P = Press_Start_2P({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-press-start-2p',
});

export const metadata = {
  title: 'BlockBound - Pixel RPG Adventure',
  description: 'A blockchain-powered RPG game with pixel art, item generation and turn-based combat',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={pressStart2P.className}>
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
