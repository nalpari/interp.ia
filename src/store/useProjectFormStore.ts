import { ProjectRequest } from "@/components/project/project-type";
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
    reset: () => void
}

export const useProjectFormStore = create<ProjectFormStore>((set) => ({
    form: initialData,
    setField: (field, value) => set((state) => ({ form: { ...state.form, [field]: value } })),
    reset: () => set({ form: initialData }),
}))