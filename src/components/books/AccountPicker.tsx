import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import type { ChartAccount } from "@/lib/books/types";

interface AccountPickerProps {
  accounts: ChartAccount[];
  value: string | null;
  onChange: (accountId: string) => void;
  label?: string;
  className?: string;
}

/** Type-ahead chart-of-accounts picker. Never allows a free-text account. */
export const AccountPicker = ({ accounts, value, onChange, label, className }: AccountPickerProps) => {
  const [open, setOpen] = useState(false);
  const selected = accounts.find((a) => a.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-label={label ?? "Choose an account"}
          className={cn("h-8 justify-between gap-2 px-2.5 text-[12px] font-normal", className)}
        >
          <span className="truncate">
            {selected ? (
              <>
                <span className="tabular text-muted-foreground">{selected.code}</span> {selected.name}
              </>
            ) : (
              <span className="text-muted-foreground">Choose account…</span>
            )}
          </span>
          <ChevronsUpDown className="h-3.5 w-3.5 shrink-0 opacity-50" aria-hidden="true" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[320px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search code or name…" />
          <CommandList>
            <CommandEmpty>No matching account.</CommandEmpty>
            <CommandGroup>
              {accounts.map((account) => (
                <CommandItem
                  key={account.id}
                  value={`${account.code} ${account.name} ${account.type}`}
                  onSelect={() => {
                    onChange(account.id);
                    setOpen(false);
                  }}
                  className="gap-2 text-[12.5px]"
                >
                  <Check
                    className={cn("h-3.5 w-3.5", account.id === value ? "opacity-100" : "opacity-0")}
                    aria-hidden="true"
                  />
                  <span className="tabular w-10 text-muted-foreground">{account.code}</span>
                  <span className="flex-1 truncate">{account.name}</span>
                  <span className="text-[10.5px] uppercase tracking-wide text-muted-foreground/70">
                    {account.type}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
