'use client'

import { usePathname } from 'next/navigation'
import Header from './Header'
import Footer from './Footer'
import Sidebar from './Sidebar'

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAuthPage = pathname.startsWith('/auth')

  if (isAuthPage) {
    return <>{children}</>
  }

  return (
    <>
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 p-6 bg-[#FAF9F6] overflow-auto">
          {children}
        </main>
      </div>
      <Footer />
    </>
  )
}
