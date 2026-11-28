'use client';

import { forwardRef, useId, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react';
import type { UseFormRegisterReturn } from 'react-hook-form';
import { cn } from '@/lib/cn';
import { formCopy } from '@/content/forms';

const control =
  'w-full rounded-2xl border-2 border-black bg-white px-4 py-3.5 text-[1rem] text-ink placeholder:text-stone-dark/80 outline-none transition-[box-shadow,transform] duration-200 focus:-translate-x-0.5 focus:-translate-y-0.5 focus:shadow-[4px_4px_0_0_var(--ccc-orange)] aria-[invalid=true]:border-[#c2410c]';

type FieldShell = { label: string; error?: string; className?: string; children: (id: string, describedBy?: string) => ReactNode };

function Field({ label, error, className, children }: FieldShell) {
  const id = useId();
  const errId = `${id}-err`;
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <label htmlFor={id} className="font-mono text-[0.72rem] font-semibold uppercase tracking-[0.1em] text-ink">
        {label}
      </label>
      {children(id, error ? errId : undefined)}
      {error && (
        <p id={errId} role="alert" className="text-[0.85rem] font-medium text-[#c2410c]">
          {error}
        </p>
      )}
    </div>
  );
}

type Common = { label: string; error?: string; className?: string };

export const TextField = forwardRef<HTMLInputElement, Common & InputHTMLAttributes<HTMLInputElement> & { prefix?: string }>(
  function TextField({ label, error, className, prefix, ...props }, ref) {
    return (
      <Field label={label} error={error} className={className}>
        {(id, describedBy) =>
          prefix ? (
            <div className="flex">
              <span className="grid place-items-center rounded-l-2xl border-2 border-r-0 border-black bg-cream-2 px-3.5 font-mono text-sm">{prefix}</span>
              <input ref={ref} id={id} aria-invalid={!!error} aria-describedby={describedBy} className={cn(control, 'rounded-l-none')} {...props} />
            </div>
          ) : (
            <input ref={ref} id={id} aria-invalid={!!error} aria-describedby={describedBy} className={control} {...props} />
          )
        }
      </Field>
    );
  },
);

export const SelectField = forwardRef<HTMLSelectElement, Common & SelectHTMLAttributes<HTMLSelectElement> & { options: readonly { value: string; label: string }[] }>(
  function SelectField({ label, error, className, options, ...props }, ref) {
    return (
      <Field label={label} error={error} className={className}>
        {(id, describedBy) => (
          <div className="relative">
            <select ref={ref} id={id} aria-invalid={!!error} aria-describedby={describedBy} className={cn(control, 'appearance-none pr-10')} defaultValue="" {...props}>
              <option value="" disabled>
                {formCopy.select}
              </option>
              {options.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <svg aria-hidden viewBox="0 0 24 24" className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="m6 9 6 6 6-6" />
            </svg>
          </div>
        )}
      </Field>
    );
  },
);

export const TextAreaField = forwardRef<HTMLTextAreaElement, Common & TextareaHTMLAttributes<HTMLTextAreaElement>>(function TextAreaField({ label, error, className, ...props }, ref) {
  return (
    <Field label={label} error={error} className={className}>
      {(id, describedBy) => <textarea ref={ref} id={id} rows={4} aria-invalid={!!error} aria-describedby={describedBy} className={cn(control, 'resize-y')} {...props} />}
    </Field>
  );
});

/** Off-screen honeypot. Bots fill it; people never see it. */
export const Honeypot = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(function Honeypot(props, ref) {
  return (
    <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <label>
        {formCopy.honeypot}
        <input ref={ref} type="text" tabIndex={-1} autoComplete="off" {...props} />
      </label>
    </div>
  );
});

/** Pill checkboxes (multi-select) or radios (single) for react-hook-form; pass `register(name)` as `inputProps`. */
export function ChipGroupField({
  label,
  error,
  className,
  options,
  inputProps,
  type = 'checkbox',
}: Common & { options: readonly { value: string; label: string }[]; inputProps: UseFormRegisterReturn; type?: 'checkbox' | 'radio' }) {
  const id = useId();
  const errId = `${id}-err`;
  return (
    <fieldset className={cn('flex flex-col gap-3', className)} aria-describedby={error ? errId : undefined} aria-invalid={!!error}>
      <legend className="mb-3 font-mono text-[0.72rem] font-semibold uppercase tracking-[0.1em] text-ink">{label}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <label key={o.value} className="cursor-pointer">
            <input type={type} value={o.value} className="peer sr-only" {...inputProps} />
            <span className="inline-flex items-center rounded-full border-2 border-black bg-white px-4 py-2 text-[0.92rem] font-semibold transition-[background-color,box-shadow,transform] duration-200 hover:bg-cream-2 peer-checked:bg-orange peer-focus-visible:-translate-y-0.5 peer-focus-visible:shadow-[4px_4px_0_0_var(--ccc-orange)]">
              {o.label}
            </span>
          </label>
        ))}
      </div>
      {error && (
        <p id={errId} role="alert" className="text-[0.85rem] font-medium text-[#c2410c]">
          {error}
        </p>
      )}
    </fieldset>
  );
}
