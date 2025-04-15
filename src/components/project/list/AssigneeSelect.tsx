'use client'

import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";
import { cn } from "@/libs/utils";
import { useState, useEffect } from "react";
import { getUsers } from "@/api/user";

interface User {
    id: number;
    name: string;
}

interface AssigneeSelectProps {
    selectedIds: number[];
    onSelect: (ids: number[]) => void;
    type?: 'single' | 'multiple';
    required?: boolean;
    placeholder?: string;
    searchPlaceholder?: string;
    users?: User[];
    className?: string;
}

// 담당자 선택 필드 컴포넌트
export function AssigneeSelect({
    selectedIds,
    onSelect,
    type = 'multiple',
    required = false,
    placeholder = '담당자 선택',
    searchPlaceholder = '담당자 검색...',
    users: initialUsers,
    className
}: AssigneeSelectProps) {
    const [users, setUsers] = useState<User[]>(initialUsers || []);
    const [selected, setSelected] = useState<number[]>(selectedIds);

    // 선택된 담당자 아이디 상태 관리
    useEffect(() => {
        setSelected(selectedIds);
    }, [selectedIds]);

    // 초기 담당자 목록 로드
    useEffect(() => {
        if (!initialUsers) {
            loadUsers();
        }
    }, [initialUsers]);

    // 담당자 목록 로드
    const loadUsers = async () => {
        try {
            const response = await getUsers(null);
            setUsers(response.data);
        } catch (error) {
            console.error('Failed to load users:', error);
        }
    };

    // 담당자 선택 핸들러   
    const handleSelect = (userId: number) => {
        let newSelected: number[];
        
        if (type === 'single') {
            newSelected = [userId];
        } else {
            const isSelected = selected.includes(userId);
            newSelected = isSelected
                ? selected.filter(id => id !== userId)
                : [...selected, userId];
        }
        
        setSelected(newSelected);
        onSelect(newSelected);
    };

    const handleRemove = (userId: number, e?: React.MouseEvent) => {
        e?.stopPropagation();
        e?.preventDefault();
        
        const newSelected = type === 'single'
            ? []
            : selected.filter(id => id !== userId);
            
        setSelected(newSelected);
        onSelect(newSelected);
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className={cn(
                        "w-full justify-start text-left font-normal",
                        required && selected.length === 0 && "border-red-500 focus-visible:ring-red-500",
                        className
                    )}
                    onClick={() => !initialUsers && loadUsers()}
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
                                                handleRemove(userId);
                                            }
                                        }}
                                        onMouseDown={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                        }}
                                        onClick={(e) => handleRemove(userId, e)}
                                    >
                                        <X className="h-3 w-3" />
                                    </div>
                                </Badge>
                            ))}
                        </div>
                    ) : (
                        <span className="text-muted-foreground">
                            {placeholder}{required && ' (필수)'}
                        </span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
                <Command>
                    <CommandInput placeholder={searchPlaceholder} />
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
    );
}