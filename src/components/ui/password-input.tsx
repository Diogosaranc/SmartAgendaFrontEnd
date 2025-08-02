'use client';

import * as React from 'react';

import { Input } from './input';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

function PasswordInput({ className, ...props }: React.ComponentProps<'input'>) {
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <div className='relative'>
      <Input
        className={cn('pr-10', className)}
        type={showPassword ? 'text' : 'password'}
        {...props}
      />
      <span className='absolute right-1 top-[7px] cursor-pointer select-none'>
        {showPassword ? (
          <EyeIcon onClick={() => setShowPassword(false)} />
        ) : (
          <EyeOffIcon onClick={() => setShowPassword(true)} />
        )}
      </span>
    </div>
  );
}

export { PasswordInput };
