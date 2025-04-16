import { ProjectListRequest } from "@/types/project";
import { create } from "zustand";

const initialRequest: ProjectListRequest = {
    assigneeId: null,
    status: null,
    priority: null,
    title: null,
    subTitle: null,
    creatorId: null,
    createdDateFrom: null,
    createdDateTo: null,
    updatedDateFrom: null,
    updatedDateTo: null,
    dueDateFrom: null,
    dueDateTo: null,
    startDateFrom: null,
    startDateTo: null,
    endDateFrom: null,
    endDateTo: null,
  }

  interface ProjectListStore {
    request: ProjectListRequest
    setFilter: (key: keyof ProjectListRequest, value: any) => void
    reset: () => void
  }
  
  export const useProjectListStore = create<ProjectListStore>((set) => ({
    request: initialRequest,
    setFilter: (key, value) => set((state) => ({ request: { ...state.request, [key]: value } })),
    reset: () => set({ request: initialRequest }),
  }))
  
