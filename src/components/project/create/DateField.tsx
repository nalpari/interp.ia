import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { CalendarIcon, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/libs/utils";

interface DateFieldProps {
    label: string;
    value: string | null;
    onChange: (date: string) => void;
    onReset: () => void;
    showLabel?: boolean;
    disabled?: (date: Date) => boolean;
}

export function DateField({
    label,
    value,
    onChange,
    onReset,
    showLabel = false,
    disabled
}: DateFieldProps) {
    return (
        <div className="flex items-center gap-4">
            <Label 
                htmlFor={label} 
                className={cn(
                    "font-medium",
                    showLabel ? "w-24" : "hidden"
                )}
            >
                {label}
            </Label>
            <div className="flex gap-2 flex-1">
                <Popover>
                    <PopoverTrigger asChild>
                        <Button 
                            variant="outline" 
                            className={cn('w-full justify-start text-left font-normal', !value && 'text-muted-foreground')}
                            title={label}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {value ? format(new Date(value), 'yyyy-MM-dd') : `${label} 선택`}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                        <Calendar
                            mode="single"
                            selected={value ? new Date(value) : undefined}
                            onSelect={(date) => {
                                const newDate = date ? format(date, 'yyyy-MM-dd') : '';
                                if (value === newDate) {
                                    onReset();
                                } else {
                                    onChange(newDate);
                                }
                            }}
                            initialFocus
                            disabled={disabled}
                        />
                    </PopoverContent>
                </Popover>
                {showLabel && (
                    <Button 
                        size="sm"
                        variant="outline"
                        onClick={onReset}
                        className="shrink-0"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                )}
            </div>
        </div>
    );
}