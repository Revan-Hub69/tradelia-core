'use client';

// data
import { countries } from 'country-data-list';
// assets
import { CheckIcon, ChevronDown, Globe } from 'lucide-react';
import React, { forwardRef, useCallback, useEffect, useState } from 'react';
import { CircleFlag } from 'react-circle-flags';

// shadcn
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
// utils
import { cn } from '@/utils/Helpers';

// Country interface
export type Country = {
  alpha2: string;
  alpha3: string;
  countryCallingCodes: string[];
  currencies: string[];
  emoji?: string;
  ioc: string;
  languages: string[];
  name: string;
  status: string;
};

// Dropdown props
type CountryDropdownProps = {
  options?: Country[];
  onChange?: (country: Country) => void;
  defaultValue?: string;
  disabled?: boolean;
  placeholder?: string;
  slim?: boolean;
};

const defaultOptions = countries.all.filter(
  (country: Country) =>
    country.emoji && country.status !== 'deleted' && country.ioc !== 'PRK',
);

const CountryDropdownComponent = (
  {
    options = defaultOptions,
    onChange,
    defaultValue,
    disabled = false,
    placeholder = 'Select a country',
    slim = false,
    ...props
  }: CountryDropdownProps,
  ref: React.ForwardedRef<HTMLButtonElement>,
) => {
  const [open, setOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<Country | undefined>(
    undefined,
  );

  useEffect(() => {
    if (defaultValue) {
      const initialCountry = options.find(
        country => country.alpha3 === defaultValue,
      );
      if (initialCountry) {
        setSelectedCountry(initialCountry);
      } else {
        // Reset selected country if defaultValue is not found
        setSelectedCountry(undefined);
      }
    } else {
      // Reset selected country if defaultValue is undefined or null
      setSelectedCountry(undefined);
    }
  }, [defaultValue, options]);

  const handleSelect = useCallback(
    (country: Country) => {
      setSelectedCountry(country);
      onChange?.(country);
      setOpen(false);
    },
    [onChange],
  );

  const triggerClasses = cn(
    'flex h-11 w-full items-center justify-between whitespace-nowrap rounded-xl border border-border bg-background px-4 py-3 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 transition-all hover:border-primary/50 hover:shadow-md',
    slim === true && 'w-20',
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        ref={ref}
        className={triggerClasses}
        disabled={disabled}
        {...props}
      >
        {selectedCountry
          ? (
              <div className="flex grow items-center gap-3 overflow-hidden">
                <div className="inline-flex size-6 shrink-0 items-center justify-center overflow-hidden rounded-full">
                  <CircleFlag
                    countryCode={selectedCountry.alpha2.toLowerCase()}
                    height={24}
                  />
                </div>
                {slim === false && (
                  <span className="truncate font-medium">
                    {selectedCountry.name}
                  </span>
                )}
              </div>
            )
          : (
              <span className="text-muted-foreground">
                {slim === false
                  ? (
                      placeholder
                    )
                  : (
                      <Globe size={20} />
                    )}
              </span>
            )}
        <ChevronDown size={16} className="shrink-0 text-muted-foreground" />
      </PopoverTrigger>
      <PopoverContent
        collisionPadding={10}
        side="bottom"
        className="min-w-[--radix-popper-anchor-width] p-0"
      >
        <Command className="max-h-[300px] w-full">
          <CommandList>
            <div className="sticky top-0 z-10 border-b border-border bg-popover">
              <CommandInput
                placeholder="Search country..."
                className="h-12 border-0 px-4 focus:ring-0"
              />
            </div>
            <CommandEmpty className="py-6 text-center text-sm text-muted-foreground">
              No country found.
            </CommandEmpty>
            <CommandGroup>
              {options
                .filter(x => x.name)
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((option, key: number) => (
                  <CommandItem
                    className="flex w-full cursor-pointer items-center gap-3 px-4 py-3 transition-colors hover:bg-accent/50"
                    key={`country-${option.alpha2}-${key}`}
                    onSelect={() => handleSelect(option)}
                  >
                    <div className="inline-flex size-6 shrink-0 items-center justify-center overflow-hidden rounded-full">
                      <CircleFlag
                        countryCode={option.alpha2.toLowerCase()}
                        height={24}
                      />
                    </div>
                    <span className="flex-1 truncate font-medium">
                      {option.name}
                    </span>
                    <CheckIcon
                      className={cn(
                        'ml-auto size-4 shrink-0 text-primary',
                        option.name === selectedCountry?.name
                          ? 'opacity-100'
                          : 'opacity-0',
                      )}
                    />
                  </CommandItem>
                ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

CountryDropdownComponent.displayName = 'CountryDropdownComponent';

export const CountryDropdown = forwardRef(CountryDropdownComponent);
