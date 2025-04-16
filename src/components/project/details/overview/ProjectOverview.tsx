'use client'

import { Project } from '@/types/project'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import ProjectStatCards from './ProjectStatCards'

interface DetailCardProps {
  title: string
  children: React.ReactNode
}

const DetailCard = ({ title, children }: DetailCardProps) => (
  <Card className="bg-white dark:bg-gray-800 col-span-2">
    <CardHeader>
      <CardTitle className="text-lg">{title}</CardTitle>
    </CardHeader>
    <CardContent>{children}</CardContent>
  </Card>
)

export default function ProjectOverview({ project }: { project: Project }) {
  return (
    <div className="space-y-6 mt-10">
      <ProjectStatCards projectId={project.id} />
      {/* 하단 큰 카드 6개 (2x3 그리드) */}
      <div className="grid grid-cols-4 gap-4">
        <DetailCard title="프로젝트 설명">
          <div className="prose dark:prose-invert max-w-none">{project.description || '설명이 없습니다.'}</div>
        </DetailCard>

        <DetailCard title="담당자 목록">
          <div className="space-y-2">
            {project.assignee.map((user) => (
              <div key={user.id} className="flex items-center gap-2">
                <span>{user.name}</span>
              </div>
            ))}
          </div>
        </DetailCard>

        <DetailCard title="일정">
          <div className="space-y-2">
            <div>시작일: {new Date(project.startDate).toLocaleDateString()}</div>
            <div>종료일: {new Date(project.endDate).toLocaleDateString()}</div>
            <div>마감일: {new Date(project.dueDate).toLocaleDateString()}</div>
          </div>
        </DetailCard>

        <DetailCard title="태그">
          <div className="flex flex-wrap gap-2">
            {project.tag.map((tag) => (
              <span key={tag} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-md text-sm">
                {tag}
              </span>
            ))}
          </div>
        </DetailCard>

        <DetailCard title="하위 이슈">
          <div className="space-y-2">
            {project.subIssues.map((issue) => (
              <div key={issue.id} className="flex items-center justify-between">
                <span>{issue.title}</span>
                <span className="text-sm text-muted-foreground">{issue.status}</span>
              </div>
            ))}
          </div>
        </DetailCard>

        <DetailCard title="활동 내역">
          <div className="space-y-2">
            <div>생성일: {new Date(project.createdDate).toLocaleDateString()}</div>
            <div>최종 수정일: {new Date(project.updatedDate).toLocaleDateString()}</div>
            <div>생성자: {project.creator.name}</div>
          </div>
        </DetailCard>
      </div>
    </div>
  )
}
