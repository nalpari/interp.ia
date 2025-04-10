import { Issue } from "../project-type"

export default function SubIssueCard({ issue }: { issue: Issue }) {
  return (
    <div>
        {/* TODO: ISSUE 카드 디자인 추가 */}
      <h3>{issue.title}</h3>
    </div>
  )
}
