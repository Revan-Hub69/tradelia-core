'use client';

import { countries } from 'country-data-list';
import { CheckIcon, ChevronDown, Globe, Search } from 'lucide-react';
import React, { forwardRef, useCallback, useEffect, useState } from 'react';
import { CircleFlag } from 'react-circle-flags';

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
type CleanCountryDropdownProps = {
  options?: Country[];
  onChange?: (country: Country) => void;
  defaultValue?: string;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
};

const defaultOptions = countries.all.filter(
  (country: Country) =>
    country.emoji
    && country.status !== 'deleted'
    && country.ioc !== 'PRK'
    && country.name,
);

/**
 * Clean Country Dropdown - MINIMAL MODERN DESIGN
 *
 * FIXED ALL ISSUES:
 * ✅ Clean neutral colors (gray/slate only)
 * ✅ No green/accent colors anywhere
 * ✅ Perfect flag alignment
 * ✅ Minimal hover effects
 * ✅ Professional appearance
 */
const CleanCountryDropdownComponent = (
  {
    options = defaultOptions,
    onChange,
    defaultValue,
    disabled = false,
    placeholder = 'Select a country',
    className,
    ...props
  }: CleanCountryDropdownProps,
  ref: React.ForwardedRef<HTMLButtonElement>,
) => {
  const [open, setOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<Country | undefined>(undefined);

  useEffect(() => {
    if (defaultValue) {
      const initialCountry = options.find(
        country => country.alpha3 === defaultValue || country.alpha2 === defaultValue,
      );
      setSelectedCountry(initialCountry);
    } else {
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

  // Sort countries alphabetically
  const sortedOptions = options
    .filter(x => x.name)
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        ref={ref}
        className={cn(
          // Clean minimal design
          'flex h-11 w-full items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm transition-colors',
          // Subtle focus
          'focus:outline-none focus:ring-1 focus:ring-slate-400 focus:border-slate-400',
          // Minimal hover
          'hover:border-slate-300',
          // Disabled
          'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-slate-50',
          className,
        )}
        disabled={disabled}
        {...props}
      >
        {selectedCountry
          ? (
              <div className="flex items-center gap-2 overflow-hidden">
                <CircleFlag
                  countryCode={selectedCountry.alpha2.toLowerCase()}
                  height={18}
                  width={18}
                  className="shrink-0"
                />
                <span className="truncate font-medium text-slate-900">
                  {selectedCountry.name}
                </span>
              </div>
            )
          : (
              <div className="flex items-center gap-2 text-slate-500">
                <Globe size={18} className="shrink-0" />
                <span>{placeholder}</span>
              </div>
            )}

        <ChevronDown
          size={14}
          className={cn(
            'shrink-0 text-slate-400 transition-transform',
            open && 'rotate-180',
          )}
        />
      </PopoverTrigger>

      <PopoverContent
        className="w-[--radix-popper-anchor-width] border-slate-200 p-0"
        sideOffset={2}
      >
        <Command>
          <div className="border-b border-slate-100 px-3 py-2">
            <div className="flex items-center gap-2">
              <Search size={14} className="text-slate-400" />
              <CommandInput
                placeholder="Search..."
                className="h-8 border-0 bg-transparent p-0 text-sm placeholder:text-slate-400 focus:ring-0"
              />
            </div>
          </div>

          <CommandList className="max-h-[200px]">
            <CommandEmpty className="py-4 text-center text-sm text-slate-500">
              No country found.
            </CommandEmpty>

            <CommandGroup>
              {sortedOptions.map(option => (
                <CommandItem
                  key={option.alpha2}
                  className="flex cursor-pointer items-center gap-2 px-3 py-2 text-sm hover:bg-slate-50 data-[selected]:bg-slate-100"
                  onSelect={() => handleSelect(option)}
                >
                  <CircleFlag
                    countryCode={option.alpha2.toLowerCase()}
                    height={18}
                    width={18}
                    className="shrink-0"
                  />
                  <span className="flex-1 truncate font-medium text-slate-900">
                    {option.name}
                  </span>
                  {option.name === selectedCountry?.name && (
                    <CheckIcon className="size-4 text-slate-600" />
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

CleanCountryDropdownComponent.displayName = 'CleanCountryDropdown';

export const CleanCountryDropdown = forwardRef(CleanCountryDropdownComponent);
