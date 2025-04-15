import { DateField } from "./DateField";
import { cn } from "@/libs/utils";
import { ProjectRequest } from "@/components/project/project-type";

interface DateFieldsProps {
    project?: any;
    form: {
        startDate: string | null;
        endDate: string | null;
        dueDate: string | null;
    };
    onUpdate: (key: string, value: any) => void;
    onFieldChange: <K extends keyof ProjectRequest>(field: K, value: ProjectRequest[K]) => void;
}

export function DateFields({
    project,
    form,
    onUpdate,
    onFieldChange
}: DateFieldsProps) {
    return (
        <div className={cn(
            "grid gap-4",
            project ? "grid-cols-1" : "grid-cols-3"
        )}>
            <DateField
                label="시작일"
                value={project ? project.startDate : form.startDate}
                onChange={(date) => project ? onUpdate('startDate', date) : onFieldChange('startDate', date)}
                onReset={() => project ? onUpdate('startDate', null) : onFieldChange('startDate', null)}
                showLabel={!!project}
                disabled={(date) => project 
                    ? (project.endDate ? date > new Date(project.endDate) : false)
                    : (form.endDate ? date > new Date(form.endDate) : false)}
            />
            <DateField
                label="종료일"
                value={project ? project.endDate : form.endDate}
                onChange={(date) => project ? onUpdate('endDate', date) : onFieldChange('endDate', date)}
                onReset={() => project ? onUpdate('endDate', null) : onFieldChange('endDate', null)}
                showLabel={!!project}
                disabled={(date) => project
                    ? (project.startDate ? date < new Date(project.startDate) : false)
                    : (form.startDate ? date < new Date(form.startDate) : false)}
            />
            <DateField
                label="마감일"
                value={project ? project.dueDate : form.dueDate}
                onChange={(date) => project ? onUpdate('dueDate', date) : onFieldChange('dueDate', date)}
                onReset={() => project ? onUpdate('dueDate', null) : onFieldChange('dueDate', null)}
                showLabel={!!project}
                disabled={(date) => project
                    ? (project.startDate ? date < new Date(project.startDate) : false)
                    : (form.startDate ? date < new Date(form.startDate) : false)}
            />
        </div>
    );
}