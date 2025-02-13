import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Brand UI Example',
  description: 'Example app for Brand UI components',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
