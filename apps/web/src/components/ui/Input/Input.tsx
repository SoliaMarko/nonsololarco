'use client';

import { ChangeEventHandler, ForwardedRef, InputHTMLAttributes, forwardRef } from 'react';

import { cn } from '@/src/lib/ui/utils/cn';

export interface IInputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'value' | 'onChange' | 'defaultValue'
> {
  error?: string;
  hint?: string;
  label?: string;
  name: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  value: string;
  wrapperClassName?: string;
}

function Input(
  {
    className,
    disabled,
    error,
    hint,
    label,
    name,
    onChange,
    placeholder,
    type = 'text',
    value,
    wrapperClassName,
    ...rest
  }: IInputProps,
  ref: ForwardedRef<HTMLInputElement>,
) {
  const errorId = error ? `${name}-error` : undefined;
  const hintId = hint ? `${name}-hint` : undefined;
  const describedBy = [errorId, hintId].filter(Boolean).join(' ') || undefined;

  return (
    <div className={cn('flex w-[20rem] flex-col items-start gap-0.5', wrapperClassName)}>
      {label ? (
        <label
          className={cn('text-fg-secondary flex items-center text-lg font-medium')}
          htmlFor={name}
        >
          {label}
        </label>
      ) : null}
      <div
        className={cn(
          'bg-card border-edge relative flex cursor-text flex-row items-center self-stretch rounded-md border-2 border-solid',
          error && !disabled
            ? 'border-danger focus-within:border-emerald-main shadow-[0_0_0_2px_rgba(217,64,64,0.12)] focus-within:shadow-[0_0_0_2px_rgba(42,122,88,0.12)]'
            : 'focus-within:border-emerald-main focus-within:shadow-[0_0_0_2px_rgba(42,122,88,0.12)]',
          { 'cursor-not-allowed opacity-40': disabled },
        )}
      >
        <input
          aria-describedby={describedBy}
          aria-invalid={error && !disabled ? true : undefined}
          className={cn(
            'text-fg-primary font-size-label plb-2 pli-3 h-14 flex-auto self-stretch overflow-hidden bg-transparent text-xl outline-none',
            'placeholder:text-fg-disabled',
            { 'cursor-not-allowed': disabled },
            className,
          )}
          disabled={disabled}
          id={name}
          name={name}
          onChange={onChange}
          placeholder={placeholder}
          ref={ref}
          type={type}
          value={value}
          {...rest}
        />
      </div>
      {error ? (
        <span className="text-danger" id={errorId}>
          {error}
        </span>
      ) : null}
      {hint ? (
        <span className="text-fg-secondary" id={hintId}>
          {hint}
        </span>
      ) : null}
    </div>
  );
}

export default forwardRef<HTMLInputElement, IInputProps>(Input);
