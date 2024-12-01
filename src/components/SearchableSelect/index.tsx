import { ChevronsUpDown } from 'lucide-react';
import { useEffect, useState } from 'react';

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

import { Button } from '../ui/button';

type Props = {
  options: { value: string; label: string; icon?: string }[];
  onSelect: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  value?: string;
  className?: string;
};

export default function SearchableSelect({
  options,
  onSelect,
  placeholder,
  value,
  disabled,
  className,
}: Props) {
  const [open, setOpen] = useState(false);
  const [selectValue, setSelectValue] = useState<{
    value: string;
    label: string;
    icon?: string;
  }>();

  useEffect(() => {
    if (value) {
      const selectedValue = options.find((option) => option.value === value);
      if (selectedValue) {
        setSelectValue(selectedValue);
      }
    } else {
      setSelectValue(undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild disabled={disabled} className={`${className}`}>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="flex justify-between font-normal items-center w-full"
        >
          {selectValue ? (
            <div className="flex w-full">
              {selectValue.icon && (
                <img
                  src={selectValue.icon}
                  alt={selectValue.label}
                  className="h-5"
                />
              )}
              <span className="text-ellipsis whitespace-nowrap overflow-hidden">
                {selectValue.label}
              </span>
            </div>
          ) : (
            <div className="flex opacity-50">{placeholder}</div>
          )}
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50 md:ml-0 ml-[-10px]" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-[300px] md:w-[500px]">
        <Command>
          <CommandInput placeholder={'Tìm...'} />
          <CommandList className="w-full">
            <CommandEmpty>Không có kết quả</CommandEmpty>
            <CommandGroup className="w-full">
              {options.map((option) => (
                <CommandItem
                  className="w-full"
                  key={option.value}
                  onSelect={() => {
                    setSelectValue(option);
                    onSelect(option.value);
                    setOpen(false);
                  }}
                >
                  <span className="text-ellipsis flex items-center space-x-2">
                    {option.icon && (
                      <img
                        className="h-5"
                        src={option.icon}
                        alt={option.label}
                      />
                    )}
                    {option.label}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
