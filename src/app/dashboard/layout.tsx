import { getSession } from '@/api/auth'
import Nav from '@/components/dashboard/Nav'
import { SessionData, sessionOptions } from '@/libs/session'
import { getIronSession } from 'iron-session'
import { cookies } from 'next/headers'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const session = await getIronSession<SessionData>(cookieStore, sessionOptions)
  console.log('🚀 ~ session:', session)

  return (
    <div className="min-h-full">
      <Nav email={session.email ?? ''} />

      <div className="py-10">
        <main>
          <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </div>
  )
}
