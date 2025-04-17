import { IssuePriority, IssueRequest, IssueStatus, IssueType, Issue } from '@/types/issue'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Textarea } from '../ui/textarea'
import { Button } from '../ui/button'
import { DialogFooter } from '../ui/dialog'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { DateFields } from '../project/create/DateFields'
import { AssigneeSelect } from '../project/list/AssigneeSelect'
import { Badge } from '../ui/badge'
import { X } from 'lucide-react'
import { Label } from '../ui/label'
import { DateField } from '../project/create/DateField'
import { format } from 'date-fns'

const initialFormData: IssueRequest = {
  title: '',
  subTitle: '',
  type: IssueType.TASK,
  status: IssueStatus.TODO,
  priority: IssuePriority.MEDIUM,
  assigneeId: [],
  dueDate: null,
  startDate: null,
  endDate: null,
  description: '',
  tag: [],
  parentProjectId: 0,
  parentIssueId: null,
  relatedIssuesId: [],
}

const formSchema = z.object({
  title: z.string().min(1, '제목을 입력해주세요'),
  subTitle: z.string().nullable(),
  type: z.nativeEnum(IssueType),
  status: z.nativeEnum(IssueStatus).nullable(),
  priority: z.nativeEnum(IssuePriority).nullable(),
  assigneeId: z.array(z.number()).nullable(),
  dueDate: z.date().nullable(),
  startDate: z.date().nullable(),
  endDate: z.date().nullable(),
  description: z.string().nullable(),
  tag: z.array(z.string()).nullable(),
  parentProjectId: z.number(),
  parentIssueId: z.number().nullable(),
  relatedIssuesId: z.array(z.number()).nullable(),
})

export function IssueCreateForm({
  parentIssue,
  onSubmit,
  parentProjectId,
}: {
  parentIssue?: Issue | null
  onSubmit: (formData: IssueRequest) => void
  parentProjectId: number | null
}) {
  const form = useForm<IssueRequest>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...initialFormData,
      parentProjectId: parentIssue?.parentProject?.id || parentProjectId || undefined,
      parentIssueId: parentIssue?.id || null,
    },
  })

  const [currentTag, setCurrentTag] = useState('')

  const handleSubmit = form.handleSubmit((data) => {
    onSubmit(data)
  })

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="title" className="text-right">
            Title<span className="text-red-500">*</span>
          </Label>
          <div className="col-span-3">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="subTitle" className="text-right">
            SubTitle
          </Label>
          <div className="col-span-3">
            <FormField
              control={form.control}
              name="subTitle"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="SubTitle" {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="description" className="text-right">
            Description
          </Label>
          <div className="col-span-3">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea placeholder="Description" {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-4">
            <Label htmlFor="type" className="w-20 text-right font-medium">
              Type
            </Label>
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <Select onValueChange={field.onChange} defaultValue={field.value || undefined}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(IssueType).map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex items-center gap-4">
            <Label htmlFor="priority" className="w-20 text-right font-medium">
              Priority
            </Label>
            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <Select onValueChange={field.onChange} defaultValue={field.value || undefined}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="EMERGENCY">긴급</SelectItem>
                      <SelectItem value="HIGH">높음</SelectItem>
                      <SelectItem value="MEDIUM">중간</SelectItem>
                      <SelectItem value="LOW">낮음</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="status" className="text-right">
            Status
          </Label>
          <div className="col-span-3">
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <Select onValueChange={field.onChange} defaultValue={field.value || undefined}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="TODO">할 일</SelectItem>
                      <SelectItem value="IN_PROGRESS">진행중</SelectItem>
                      <SelectItem value="DONE">완료</SelectItem>
                      <SelectItem value="CANCELED">취소됨</SelectItem>
                      <SelectItem value="ANALYSIS">분석중</SelectItem>
                      <SelectItem value="UNPRODUCIBLE">재현불가</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="assignee" className="text-right font-medium">
            담당자
          </Label>
          <div className="col-span-3">
            <FormField
              control={form.control}
              name="assigneeId"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <AssigneeSelect selectedIds={field.value || []} onSelect={(ids) => field.onChange(ids)} className="flex-1" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex justify-between">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem className="w-[32%]">
                <FormControl>
                  <DateField
                    label="시작일"
                    value={field.value ? format(field.value, 'yyyy-MM-dd') : null}
                    onChange={(value) => field.onChange(value ? new Date(value) : null)}
                    onReset={() => field.onChange(null)}
                    disabled={(date) => {
                      const endDate = form.getValues().endDate;
                      return endDate ? date > new Date(endDate) : false;
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem className="w-[32%]">
                <FormControl>
                  <DateField
                    label="종료일"
                    value={field.value ? format(field.value, 'yyyy-MM-dd') : null}
                    onChange={(value) => field.onChange(value ? new Date(value) : null)}
                    onReset={() => field.onChange(null)}
                    disabled={(date) => {
                      const startDate = form.getValues().startDate;
                      return startDate ? date < new Date(startDate) : false;
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dueDate"
            render={({ field }) => (
              <FormItem className="w-[32%]">
                <FormControl>
                  <DateField
                    label="마감일"
                    value={field.value ? format(field.value, 'yyyy-MM-dd') : null}
                    onChange={(value) => field.onChange(value ? new Date(value) : null)}
                    onReset={() => field.onChange(null)}
                    disabled={(date) => {
                      const startDate = form.getValues().startDate;
                      return startDate ? date < new Date(startDate) : false;
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="tags" className="text-right">
            Tags
          </Label>
          <div className="col-span-3">
            <FormField
              control={form.control}
              name="tag"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex flex-wrap gap-1 border rounded-md px-3 py-2 focus-within:outline-none focus-within:ring-2 focus-within:ring-ring">
                      {field.value?.map((tag) => (
                        <Badge key={tag} variant="secondary" className="h-6 bg-muted hover:bg-muted-foreground/20">
                          {tag}
                          <button
                            type="button"
                            className="ml-1 hover:text-destructive"
                            onClick={() => {
                              field.onChange(field.value?.filter((t) => t !== tag))
                            }}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                      <input
                        type="text"
                        className="flex-1 min-w-[120px] outline-none bg-transparent"
                        placeholder={!field.value?.length ? '태그 입력 후 Enter' : ''}
                        value={currentTag}
                        onChange={(e) => setCurrentTag(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && currentTag.trim()) {
                            e.preventDefault()
                            if (!field.value?.includes(currentTag.trim())) {
                              field.onChange([...(field.value || []), currentTag.trim()])
                            }
                            setCurrentTag('')
                          } else if (e.key === 'Backspace' && !currentTag && field.value?.length) {
                            field.onChange(field.value.slice(0, -1))
                          }
                        }}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Create Issue</Button>
        </DialogFooter>
      </form>
    </Form>
  )
}
