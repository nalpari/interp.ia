import type { Metadata } from 'next'
import ReactQueryProviders from '@/providers/ReactQueryProvider'
import './globals.css'

export const metadata: Metadata = {
  title: 'INTERP.IA | Advanced Project Management',
  description: 'Premium platform for managing and optimizing your projects',
}

interface NavLinkProps {
  href: string
  children: React.ReactNode
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <html lang="en" className="h-full bg-gray-100">
        <body className={`h-full`}>
          <ReactQueryProviders>{children}</ReactQueryProviders>
        </body>
      </html>
    </>
  )
}
