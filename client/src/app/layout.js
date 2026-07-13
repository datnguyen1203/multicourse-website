import './globals.css'
import { AuthProvider } from '@/context/authContext'
import { Toaster } from '@/components/ui/sonner'

export default function RootLayout({ children }) {
    return (
        <html lang="vi">
            <head>
                <meta charSet="utf-8" />
            </head>
            <body>
                <AuthProvider>
                    {children}
                    <Toaster richColors position="bottom-right" />
                </AuthProvider>
            </body>
        </html>
    )
}
