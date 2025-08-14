import type { Metadata } from 'next'
import './globals.css'
import { NuqsAdapter } from 'nuqs/adapters/next/app'

export const metadata: Metadata = {
  title: 'Testdino AI UI',
  description: 'Testdino AI UI',
  generator: 'Testdino AI UI',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="h-full w-full">
      <body className="h-full w-full">
        <NuqsAdapter>{children}</NuqsAdapter>
      </body>
    </html>
  )
}
