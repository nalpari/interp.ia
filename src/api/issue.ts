import axios from "axios"

export async function getIssuesByProjectId(projectId: number, issueId: number | null) {
  const response = await axios.get(`/api/issue`, {
    params: {
      projectId,
      issueId,
    },
  })
  return response.data
}

