import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cvsQuarters } from "@/data/cvsQuarters";

interface QuarterSelectProps {
  value: string;
  onChange: (key: string) => void;
}

export const QuarterSelect = ({ value, onChange }: QuarterSelectProps) => (
  <Select value={value} onValueChange={onChange}>
    <SelectTrigger className="w-[180px]" aria-label="Select reporting period">
      <SelectValue />
    </SelectTrigger>
    <SelectContent>
      {cvsQuarters.map((q) => (
        <SelectItem key={q.key} value={q.key}>
          {q.label}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
);
