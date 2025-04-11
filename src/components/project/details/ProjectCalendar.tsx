import { getIssuesByProjectIssueId } from '@/api/issue'
import { useQuery } from '@tanstack/react-query'
import { Project, Issue } from '../project-type'
import CustomCalendar from './CustomCalendar'
import { useState } from 'react'

export default function ProjectCalendar({ project }: { project: Project }) {
    const today = new Date();
    const initialSelectedDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const [selectedDate, setSelectedDate] = useState<string | null>(initialSelectedDate);

    const { data: issues } = useQuery({
        queryKey: ['issues', project.id],
        queryFn: () => getIssuesByProjectIssueId(project.id, null),
    });

    const handleDateSelect = (date: string) => {
        setSelectedDate(date);
    }

    const getDateInfo = () => {
        if (!selectedDate) return null;
        
        const date = new Date(selectedDate);
        const formattedDate = `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')} ${date.toLocaleDateString('en-US', { weekday: 'long' })}`;

        const isStartDate = project.startDate && new Date(project.startDate).toISOString().split('T')[0] === selectedDate;
        const isCreatedDate = project.createdDate && new Date(project.createdDate).toISOString().split('T')[0] === selectedDate;
        const isDueDate = project.dueDate && new Date(project.dueDate).toISOString().split('T')[0] === selectedDate;
        const isEndDate = project.endDate && new Date(project.endDate).toISOString().split('T')[0] === selectedDate;

        const dateIssues = issues?.filter((issue: Issue) => 
            String(issue.dueDate) === selectedDate
        ) || [];

        return (
            <div className="space-y-4">
                <div className="text-xl font-bold">{formattedDate}</div>
                <div className="space-y-2">
                    {isStartDate && (
                        <div className="flex items-center text-sm">
                            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                            Project Start Date
                        </div>
                    )}
                    {isCreatedDate && (
                        <div className="flex items-center text-sm">
                            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                            Project Created Date
                        </div>
                    )}
                    {isDueDate && (
                        <div className="flex items-center text-sm">
                            <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                            Project Due Date
                        </div>
                    )}
                    {isEndDate && (
                        <div className="flex items-center text-sm">
                            <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                            Project End Date
                        </div>
                    )}
                </div>
                {dateIssues.length > 0 && (
                    <div className="mt-4">
                        <div className="text-sm font-medium mb-2">Issues :</div>
                        <div className="space-y-2">
                            {dateIssues.map((issue: Issue) => (
                                <div key={issue.id} className="text-sm p-2 bg-muted rounded">
                                    {issue.title}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return(
        <div className='mt-10'>
            <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
                <div className='lg:col-span-3 border rounded-xl p-4'>
                    <CustomCalendar project={project} issues={issues} onDateSelect={handleDateSelect} />
                </div>
                <div className='border rounded-xl p-4 bg-card'>
                    {getDateInfo()}
                </div>
            </div>
        </div>
    );
}
