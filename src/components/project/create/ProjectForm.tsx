'use client'

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { useProjectFormStore } from "@/store/useProjectFormStore";
import { getUsers } from "@/api/user";
import { useState } from "react";
import { LoginedUserInfo } from "@/store/useUserStore";
import { CalendarIcon, Check, X } from "lucide-react";
import { cn } from "@/libs/utils";
import { Priority, IssueStatus, Project } from "@/components/project/project-type";


export function ProjectForm({ project, updateProjectMutation }: { project?: Project | null, updateProjectMutation: (request: {id: number, key: string, value: object | string}) => void }) {
    const {form, setField} = useProjectFormStore()
    const [users, setUsers] = useState<LoginedUserInfo[]>([])
    const [currentTag, setCurrentTag] = useState('')

    const handleUpdate = async (key: string, value: any) => {
        if (project?.id) {
            await updateProjectMutation({id: project.id, key, value})
        }
    }

    const getUsersForAsignee = async () => {
      const users = await getUsers(null)
      setUsers(users.data)
    }

    const removeTag = (tagToRemove: string) => {
      setField('tag',form.tag.filter((tag) => tag !== tagToRemove))
    }

    return (
        <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                    Title
                </Label>
                <div className="col-span-3 flex gap-2">
                    <Input 
                        id="title"
                        value={form.title}
                        onChange={(e) => setField('title', e.target.value)}
                        placeholder="Title"
                    />
                    {project && (
                        <Button 
                            size="sm"
                            onClick={() => handleUpdate('title', form.title)}
                        >
                            Save
                        </Button>
                    )}
                </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="subTitle" className="text-right">
                    SubTitle
                </Label>
                <div className="col-span-3 flex gap-2">
                    <Input 
                        id="subTitle" 
                        value={form.subTitle} 
                        onChange={(e) => setField('subTitle',e.target.value)} 
                        placeholder="SubTitle" 
                    />
                    {project && (
                        <Button  
                            size="sm"
                            onClick={() => handleUpdate('subTitle', form.subTitle)}
                        >
                            Save
                        </Button>
                    )}
                </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                    Description
                </Label>
                <div className="col-span-3 flex gap-2">
                    <Textarea
                        id="description"
                        value={form.description}
                        onChange={(e) => setField('description',e.target.value)}
                        placeholder="Description"
                    />
                    {project && (
                        <Button 
                            size="sm"
                            onClick={() => handleUpdate('description', form.description)}
                        >
                            Save
                        </Button>
                    )}
                </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="assignee" className="text-right font-medium">
                    담당자
                </Label>
                <div className="col-span-3 flex gap-2">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className="w-full justify-start text-left font-normal"
                                onClick={() => {
                                    getUsersForAsignee()
                                }}
                            >
                                {form.assigneeId.length > 0 ? (
                                    <div className="flex gap-1 flex-wrap">
                                        {form.assigneeId.map((userId) => (
                                            <Badge key={userId} variant="secondary" className="mr-1">
                                                {project ? project.assignee.find((user) => user.id === userId)?.name : users.find((user) => user.id === userId)?.name}
                                                <div
                                                    role="button"
                                                    tabIndex={0}
                                                    className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') {
                                                            setField('assigneeId',form.assigneeId.filter((item) => item !== userId))
                                                        }
                                                    }}
                                                    onMouseDown={(e) => {
                                                        e.preventDefault()
                                                        e.stopPropagation()
                                                    }}
                                                    onClick={() => setField('assigneeId',form.assigneeId.filter((item) => item !== userId))}
                                                >
                                                    <X className="h-3 w-3" />
                                                </div>
                                            </Badge>
                                        ))}
                                    </div>
                                ) : (
                                    '담당자 선택'
                                )}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0" align="start">
                            <Command>
                                <CommandInput placeholder="담당자 검색..." />
                                <CommandEmpty>검색 결과가 없습니다.</CommandEmpty>
                                <CommandGroup>
                                    {users.map((user) => (
                                        <CommandItem
                                            key={user.id}
                                            onSelect={() => {
                                                const isSelected = form.assigneeId.find((item: number) => item === user.id)
                                                if (isSelected) {
                                                    setField('assigneeId', form.assigneeId.filter((item: number) => item !== user.id))
                                                } else {
                                                    setField('assigneeId', [...form.assigneeId, user.id])
                                                }
                                            }}
                                        >
                                            <div
                                                className={cn(
                                                    'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                                                    form.assigneeId.find((item) => item === user.id)
                                                        ? 'bg-primary text-primary-foreground'
                                                        : 'opacity-50 [&_svg]:invisible',
                                                )}
                                            >
                                                <Check className={cn('h-4 w-4')} />
                                            </div>
                                            {user.name}
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </Command>
                        </PopoverContent>
                    </Popover>
                    {project && (
                        <Button 
                            size="sm"
                            onClick={() => handleUpdate('assigneeId', form.assigneeId)}
                        >
                            Save
                        </Button>
                    )}
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-4">
                    <Label htmlFor="status" className="w-20 text-right font-medium">
                        Status
                    </Label>
                    <Select value={project ? project.status : form.status} onValueChange={(value) => {
                        project? handleUpdate('status', value as IssueStatus) : setField('status',value as IssueStatus)
                    }}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="상태 선택" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="TODO">할 일</SelectItem>
                            <SelectItem value="IN_PROGRESS">진행중</SelectItem>
                            <SelectItem value="DONE">완료</SelectItem>
                            <SelectItem value="CANCELED">취소됨</SelectItem>
                            <SelectItem value="ANALYSIS">분석중</SelectItem>
                            <SelectItem value="UNPRODUCIBLE">재현불가</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex items-center gap-4">
                    <Label htmlFor="priority" className="w-20 text-right font-medium">
                        Priority
                    </Label>
                    <Select value={project ? project.priority : form.priority} onValueChange={(value) => {
                        project? handleUpdate('priority', value as Priority) : setField('priority',value as Priority)
                    }}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="우선순위 선택" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="EMERGENCY">긴급</SelectItem>
                            <SelectItem value="HIGH">높음</SelectItem>
                            <SelectItem value="MEDIUM">중간</SelectItem>
                            <SelectItem value="LOW">낮음</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
                <div className="flex items-center gap-4">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className={cn('w-full justify-start text-left font-normal', !(project ? project.dueDate : form.dueDate) && 'text-muted-foreground')}>
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {project ? (project.dueDate ? format(new Date(project.dueDate), 'yyyy-MM-dd') : '마감일 선택') : (form.dueDate ? format(new Date(form.dueDate), 'yyyy-MM-dd') : '마감일 선택')}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar
                                mode="single"
                                selected={project ? (project.dueDate ? new Date(project.dueDate) : undefined) : (form.dueDate ? new Date(form.dueDate) : undefined)}
                                onSelect={(date) => {
                                    project? handleUpdate('dueDate', date ? format(date, 'yyyy-MM-dd') : '') : setField('dueDate', date ? format(date, 'yyyy-MM-dd') : '')
                                }}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                </div>

                <div className="flex items-center gap-4">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className={cn('w-full justify-start text-left font-normal', !(project ? project.startDate : form.startDate) && 'text-muted-foreground')}>
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {project ? (project.startDate ? format(new Date(project.startDate), 'yyyy-MM-dd') : '시작일 선택') : (form.startDate ? format(new Date(form.startDate), 'yyyy-MM-dd') : '시작일 선택')}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar
                                mode="single"
                                selected={project ? (project.startDate ? new Date(project.startDate) : undefined) : (form.startDate ? new Date(form.startDate) : undefined)}
                                onSelect={(date) => {
                                    project? handleUpdate('startDate', date ? format(date, 'yyyy-MM-dd') : '') : setField('startDate', date ? format(date, 'yyyy-MM-dd') : '')
                                }}
                                initialFocus
                                disabled={(date) => (project ? (project.endDate ? date > new Date(project.endDate) : false) : (form.endDate ? date > new Date(form.endDate) : false))}
                            />
                        </PopoverContent>
                    </Popover>
                </div>

                <div className="flex items-center gap-4">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className={cn('w-full justify-start text-left font-normal', !(project ? project.endDate : form.endDate) && 'text-muted-foreground')}>
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {project ? (project.endDate ? format(new Date(project.endDate), 'yyyy-MM-dd') : '종료일 선택') : (form.endDate ? format(new Date(form.endDate), 'yyyy-MM-dd') : '종료일 선택')}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar
                                mode="single"
                                selected={project ? (project.endDate ? new Date(project.endDate) : undefined) : (form.endDate ? new Date(form.endDate) : undefined)}
                                onSelect={(date) => {
                                    project? handleUpdate('endDate', date ? format(date, 'yyyy-MM-dd') : '') : setField('endDate', date ? format(date, 'yyyy-MM-dd') : '')
                                }}
                                initialFocus
                                disabled={(date) => (project ? (project.startDate ? date < new Date(project.startDate) : false) : (form.startDate ? date < new Date(form.startDate) : false))}
                            />
                        </PopoverContent>
                    </Popover>
                </div>
            </div>
            <div className="grid grid-cols-6 items-center gap-4">
                <Label htmlFor="tags" className="text-right">
                    Tags
                </Label>
                <div className="col-span-5 flex flex-wrap gap-1 border rounded-md px-3 py-2 focus-within:outline-none focus-within:ring-2 focus-within:ring-ring">
                    {form.tag.map((tag) => (
                        <Badge key={tag} variant="secondary" className="h-6 bg-muted hover:bg-muted-foreground/20">
                            {tag}
                            <button type="button" className="ml-1 hover:text-destructive" onClick={() => removeTag(tag)}>
                                <X className="h-3 w-3" />
                            </button>
                        </Badge>
                    ))}
                    <input
                        type="text"
                        className="flex-1 min-w-[120px] outline-none bg-transparent"
                        placeholder={form.tag.length === 0 ? '태그 입력 후 Enter' : ''}
                        value={currentTag}
                        onChange={(e) => setCurrentTag(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && currentTag.trim()) {
                                e.preventDefault()
                                if (!form.tag.includes(currentTag.trim())) {
                                    setField('tag', [...form.tag, currentTag.trim()])
                                }   
                                setCurrentTag('')
                            } else if (e.key === 'Backspace' && !currentTag && form.tag.length > 0) {
                                setField('tag', form.tag.slice(0, -1))
                            }
                        }}
                    />
                    {project && (
                        <Button 
                            size="sm"
                            onClick={() => handleUpdate('tag', form.tag)}
                            className="ml-2"
                        >
                            Save
                        </Button>
                    )}
                </div>
            </div>
        </div>
    )
}
