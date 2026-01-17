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
type ModernCountryDropdownProps = {
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
 * Modern Country Dropdown - 2024 Best Practices
 *
 * RESEARCH-BASED FEATURES:
 * ✅ Clean visual hierarchy with proper spacing
 * ✅ Consistent flag sizing (20px) for readability
 * ✅ Search functionality for 195+ countries
 * ✅ Keyboard navigation support
 * ✅ Proper focus states and accessibility
 * ✅ Brand-consistent colors (primary blue, not green)
 * ✅ Mobile-optimized touch targets (44px+)
 * ✅ Clear visual feedback for selection
 */
const ModernCountryDropdownComponent = (
  {
    options = defaultOptions,
    onChange,
    defaultValue,
    disabled = false,
    placeholder = 'Select a country',
    className,
    ...props
  }: ModernCountryDropdownProps,
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

  // Sort countries alphabetically for better UX
  const sortedOptions = options
    .filter(x => x.name)
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        ref={ref}
        className={cn(
          // Base styles
          'flex h-11 w-full items-center justify-between rounded-xl border border-border bg-background px-4 py-3 text-sm shadow-sm transition-all',
          // Focus states
          'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
          // Hover states - brand consistent
          'hover:border-primary/50 hover:shadow-md',
          // Disabled states
          'disabled:cursor-not-allowed disabled:opacity-50',
          // Text handling
          'whitespace-nowrap [&>span]:line-clamp-1',
          className,
        )}
        disabled={disabled}
        {...props}
      >
        {selectedCountry
          ? (
              <div className="flex w-full items-center gap-3 overflow-hidden">
                {/* Flag container - fixed size for consistency */}
                <div className="flex size-5 shrink-0 items-center justify-center overflow-hidden rounded-full">
                  <CircleFlag
                    countryCode={selectedCountry.alpha2.toLowerCase()}
                    height={20}
                    width={20}
                  />
                </div>
                {/* Country name - proper truncation */}
                <span className="min-w-0 flex-1 truncate text-left font-medium">
                  {selectedCountry.name}
                </span>
              </div>
            )
          : (
              <div className="flex items-center gap-3 text-muted-foreground">
                <Globe size={20} className="shrink-0" />
                <span>{placeholder}</span>
              </div>
            )}

        <ChevronDown
          size={16}
          className={cn(
            'ml-2 shrink-0 text-muted-foreground transition-transform',
            open && 'rotate-180',
          )}
        />
      </PopoverTrigger>

      <PopoverContent
        collisionPadding={10}
        side="bottom"
        className="w-[--radix-popper-anchor-width] p-0"
        sideOffset={4}
      >
        <Command className="max-h-[300px] w-full">
          <CommandList>
            {/* Sticky search header */}
            <div className="sticky top-0 z-10 border-b border-border bg-popover">
              <div className="flex items-center gap-2 px-3 py-2">
                <Search size={16} className="shrink-0 text-muted-foreground" />
                <CommandInput
                  placeholder="Search countries..."
                  className="h-8 border-0 bg-transparent p-0 text-sm focus:ring-0"
                />
              </div>
            </div>

            <CommandEmpty className="py-6 text-center text-sm text-muted-foreground">
              No country found.
            </CommandEmpty>

            <CommandGroup>
              {sortedOptions.map(option => (
                <CommandItem
                  key={option.alpha2}
                  className={cn(
                    'flex w-full cursor-pointer items-center gap-3 px-4 py-3 transition-colors',
                    // Brand-consistent hover (primary blue, not green)
                    'hover:bg-primary/5 hover:text-primary',
                    'data-[selected]:bg-primary/10',
                    // Proper touch target for mobile
                    'min-h-[44px]',
                  )}
                  onSelect={() => handleSelect(option)}
                >
                  {/* Flag container - consistent sizing */}
                  <div className="flex size-5 shrink-0 items-center justify-center overflow-hidden rounded-full">
                    <CircleFlag
                      countryCode={option.alpha2.toLowerCase()}
                      height={20}
                      width={20}
                    />
                  </div>

                  {/* Country name - proper layout */}
                  <span className="min-w-0 flex-1 truncate text-left font-medium">
                    {option.name}
                  </span>

                  {/* Check icon for selected state */}
                  <CheckIcon
                    className={cn(
                      'ml-auto size-4 shrink-0 text-primary transition-opacity',
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

ModernCountryDropdownComponent.displayName = 'ModernCountryDropdown';

export const ModernCountryDropdown = forwardRef(ModernCountryDropdownComponent);
