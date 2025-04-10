import { ProjectListRequest, ProjectRequest } from '@/components/project/project-type'
import axios from 'axios'
import qs from 'qs'

export async function getProjects(request: ProjectListRequest) {
  try {
    const response = await axios.get('/api/project', {
      params: request,
      paramsSerializer: (params) => {
        return qs.stringify(params, {
          arrayFormat: 'repeat',
          skipNulls: true,
        })
      },
    })
    return response.data || []
  } catch (error) {
    return []
  }
}

export async function createProject(request: ProjectRequest) {
  try {
    const response = await axios.post('/api/project', request)
    return response.data
  } catch (error) {
    console.error('Error in createProject:', error)
    throw error
  }
}

export async function getProject(id: string) {
  try {
    const response = await axios.get(`/api/project/${id}`)
    return response.data
  } catch (error) {
    console.error('Error in getProject:', error)
    throw error
  }
}

export async function updateProject(id: number, key: string, value: object | string) {
  console.log("key-value:: ",key, value); 
  try {
    const response = await axios.patch(`/api/project/${id}`, {
        [key]: value
      });
    return response.data
  } catch (error) {
    console.error('Error in updateProject:', error)
    throw error
  } 
}

export async function deleteProject(id: number) {
  try {
    const response = await axios.patch(`/api/project/${id}/delete`)
    return response.data
  } catch (error) {
    console.error('Error in deleteProject:', error)
    throw error
  }
}
