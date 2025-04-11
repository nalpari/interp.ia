import axios from "axios"

export async function getIssuesByProjectIssueId(projectId: number | null, issueId: number | null) {
  const response = await axios.get(`/api/issue`, {
    params: {
      projectId,
      issueId,
    },
  })
  return response.data
}