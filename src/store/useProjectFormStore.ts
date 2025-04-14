import { Project, ProjectRequest } from "@/components/project/project-type";
import { create } from "zustand";

export const initialData: ProjectRequest = {
    title: '',
    subTitle: '',
    description: '',
    status: 'TODO',
    priority: 'MEDIUM',
    assigneeId: [],
    dueDate: '',
    startDate: '',
    endDate: '',
    tag: [],
    subIssuesId: []
}

interface ProjectFormStore {
    form: ProjectRequest
    setField: <K extends keyof ProjectRequest>(field: K, value: ProjectRequest[K]) => void
    reset: (project?: Project) => void
}

export const useProjectFormStore = create<ProjectFormStore>((set) => ({
    form: initialData,
    setField: (field, value) => set((state) => ({ form: { ...state.form, [field]: value } })),
    reset: (project) => set({ 
        form: project ? {
            title: project.title,
            subTitle: project.subTitle,
            description: project.description,
            status: project.status,
            priority: project.priority,
            assigneeId: project.assignee.map((user) => user.id),
            dueDate: project.dueDate ? (typeof project.dueDate === 'string' ? project.dueDate : project.dueDate.toISOString()) : '',
            startDate: project.startDate ? (typeof project.startDate === 'string' ? project.startDate : project.startDate.toISOString()) : '',
            endDate: project.endDate ? (typeof project.endDate === 'string' ? project.endDate : project.endDate.toISOString()) : '',
            tag: project.tag,
            subIssuesId: project.subIssues.map((issue) => issue.id)
        } : initialData 
    }),
}))