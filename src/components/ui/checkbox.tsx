'use client'

import { cn } from '@/utilities/ui'
import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import { Check } from 'lucide-react'
import * as React from 'react'

const Checkbox: React.FC<
  {
    ref?: React.Ref<HTMLButtonElement>
  } & React.ComponentProps<typeof CheckboxPrimitive.Root>
> = ({ className, ref, ...props }) => (
  <CheckboxPrimitive.Root
    className={cn(
      'peer h-4 w-4 shrink-0 rounded border border-gray-300 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terra-green focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-terra-green data-[state=checked]:text-white data-[state=checked]:border-terra-green',
      className,
    )}
    ref={ref}
    {...props}
  >
    <CheckboxPrimitive.Indicator className={cn('flex items-center justify-center text-current')}>
      <Check className="h-4 w-4" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
)

export { Checkbox }
