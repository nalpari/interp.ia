import { IssueAccordion } from '@/components/issue/IssueAccordion'

export default function IssuesPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">땡땡 프로젝트</h1>
      <main className="container mx-auto py-10 px-4">
        <IssueAccordion projectId={2} />
      </main>
    </div>
  )
}
