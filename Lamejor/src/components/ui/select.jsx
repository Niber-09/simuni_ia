
import { cn } from '@/lib/utils';
import * as SelectPrimitive from '@radix-ui/react-dropdown-menu';
import { Check, ChevronDown } from 'lucide-react';
import React from 'react';

const Select = React.forwardRef(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Root {...props}>
    <SelectPrimitive.Trigger
      ref={ref}
      className={cn(
        'flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
    >
      {children}
      <ChevronDown className="h-4 w-4 opacity-50" />
    </SelectPrimitive.Trigger>
  </SelectPrimitive.Root>
));
Select.displayName = 'Select';

const SelectContent = React.forwardRef(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Content
    ref={ref}
    className={cn(
      'relative z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md',
      className
    )}
    {...props}
  >
    {children}
  </SelectPrimitive.Content>
));
SelectContent.displayName = 'SelectContent';

const SelectItem = React.forwardRef(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      'relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <Check className="h-4 w-4" />
    </span>
    {children}
  </SelectPrimitive.Item>
));
SelectItem.displayName = 'SelectItem';

export { Select, SelectContent, SelectItem };
