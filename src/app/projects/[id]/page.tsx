import Navbar from '@/components/dashboard/Navbar'
import { cookies } from 'next/headers'
import { getIronSession } from 'iron-session'
import { SessionData, sessionOptions } from '@/libs/session'
import ProjectHeader from '@/components/project/details/ProjectHeader'
export default async function ProjectPage() {
  const cookieStore = await cookies()
  const session = await getIronSession<SessionData>(cookieStore, sessionOptions)

  return (
    <div className="min-h-full">
      <Navbar email={session.email ?? ''} />
      <div className="py-10">
        <main>
          <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
            <ProjectHeader />
          </div>
        </main>
      </div>
    </div>
  )
}
