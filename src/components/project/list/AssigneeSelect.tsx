'use client'

import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { cn } from "@/libs/utils";
import { Check, X } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";

interface AssigneeSelectProps {
    users: { id: number; name: string }[]
    selectedIds: number[] | null
    onSelect: (ids: number[] | null) => void
    type: 'assignee' | 'creator'
}

export default function AssigneeSelect({ users, selectedIds, onSelect, type }: AssigneeSelectProps) {
    const [selected, setSelected] = useState<number[]>(selectedIds || [])

    useEffect(() => {
        setSelected(selectedIds || [])
    }, [selectedIds])

    const handleSelect = (userId: number) => {
        if (type === 'creator') {
            setSelected([userId])
            onSelect([userId])
        } else {
            const isSelected = selected.includes(userId)
            let newSelected: number[]
            
            if (isSelected) {
                newSelected = selected.filter(id => id !== userId)
            } else {
                newSelected = [...selected, userId]
            }
            
            setSelected(newSelected)
            onSelect(newSelected.length > 0 ? newSelected : null)
        }
    }

    const removeUser = (userId: number) => {
        if (type === 'creator') {
            setSelected([])
            onSelect(null)
        } else {
            const newSelected = selected.filter(id => id !== userId)
            setSelected(newSelected)
            onSelect(newSelected.length > 0 ? newSelected : null)
        }
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                >
                    {selected.length > 0 ? (
                        <div className="flex gap-1 flex-wrap">
                            {selected.map((userId) => (
                                <Badge key={userId} variant="secondary" className="mr-1">
                                    {users.find((user) => user.id === userId)?.name}
                                    <div
                                        role="button"
                                        tabIndex={0}
                                        className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                removeUser(userId)
                                            }
                                        }}
                                        onMouseDown={(e) => {
                                            e.preventDefault()
                                            e.stopPropagation()
                                        }}
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            removeUser(userId)
                                        }}
                                    >
                                        <X className="h-3 w-3" />
                                    </div>
                                </Badge>
                            ))}
                        </div>
                    ) : (
                        type === 'assignee' ? '담당자 선택' : '생성자 선택'
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
                <Command>
                    <CommandInput placeholder={`${type === 'assignee' ? '담당자' : '생성자'} 검색...`} />
                    <CommandEmpty>검색 결과가 없습니다.</CommandEmpty>
                    <CommandGroup>
                        {users.map((user) => (
                            <CommandItem
                                key={user.id}
                                onSelect={() => handleSelect(user.id)}
                            >
                                <div
                                    className={cn(
                                        'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                                        selected.includes(user.id)
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
    )
}