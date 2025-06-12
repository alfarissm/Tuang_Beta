import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'QR Food Order',
  description: 'Order makanan cepat dan praktis dengan QR code!',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* FontAwesome CDN */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}