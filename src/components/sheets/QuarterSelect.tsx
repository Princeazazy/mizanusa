import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cvsQuarters } from "@/data/cvsQuarters";
import { CalendarRange } from "lucide-react";

interface QuarterSelectProps {
  value: string;
  onChange: (key: string) => void;
}

export const QuarterSelect = ({ value, onChange }: QuarterSelectProps) => (
  <div className="flex items-center gap-2">
    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
      Period
    </span>
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger
        className="w-[200px] h-11 border-primary/50 bg-primary/10 text-foreground font-semibold shadow-lg hover:bg-primary/20"
        aria-label="Select reporting period"
      >
        <CalendarRange className="h-4 w-4 text-primary shrink-0" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="z-[100] bg-popover shadow-2xl">
        {cvsQuarters.map((q) => (
          <SelectItem key={q.key} value={q.key}>
            {q.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);
