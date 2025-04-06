import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { fr } from "date-fns/locale";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { forwardRef } from "react";

interface DatePickerProps {
  selected?: Date;
  onSelect: (date?: Date) => void;
  placeholder?: string;
}

export const DatePicker = forwardRef<HTMLButtonElement, DatePickerProps>(
  ({ selected, onSelect, placeholder = "Sélectionner une date" }, ref) => {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button
            ref={ref}
            variant={"outline"}
            className={cn("w-full justify-start text-left font-normal", !selected && "text-muted-foreground")}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {selected ? format(selected, "P", { locale: fr }) : <span>{placeholder}</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar mode="single" selected={selected} onSelect={onSelect} initialFocus locale={fr} />
        </PopoverContent>
      </Popover>
    );
  }
);

DatePicker.displayName = "DatePicker";
