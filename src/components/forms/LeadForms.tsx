'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion } from 'motion/react';
import { useState, useTransition, type ReactNode } from 'react';
import { useForm, type FieldValues, type Path, type UseFormSetError } from 'react-hook-form';
import { submitLead } from '@/app/actions';
import { brandLeadSchema, creatorLeadSchema, loginSchema, type BrandLeadInput, type CreatorLeadInput, type LoginInput } from '@/lib/schemas';
import { categories, followerTiers, formCopy, phonePrefix } from '@/content/forms';
import { Button } from '@/components/ui/Button';
import { Eyebrow } from '@/components/ui/Badge';
import { uiEase } from '@/lib/motion';
import { Honeypot, SelectField, TextAreaField, TextField } from './Fields';
import { Success } from './Success';

const categoryOptions = categories.map((c) => ({ value: c, label: c }));
const tierOptions = followerTiers.map((t) => ({ value: t.value, label: t.label }));

type FormProps = { titleId: string; onDone?: () => void };

function useSubmit<T extends FieldValues>(setError: UseFormSetError<T>) {
  const [done, setDone] = useState(false);
  const [failed, setFailed] = useState(false);
  const [pending, start] = useTransition();
  const submit = (values: T) =>
    start(async () => {
      setFailed(false);
      const res = await submitLead(values);
      if (res.ok) return setDone(true);
      if (res.fieldErrors) {
        for (const [k, msgs] of Object.entries(res.fieldErrors)) setError(k as Path<T>, { message: msgs[0] });
      } else setFailed(true);
    });
  return { done, failed, pending, submit };
}

function Shell({ titleId, eyebrow, title, intro, done, success, children }: { titleId: string; eyebrow: string; title: string; intro: string; done: boolean; success: ReactNode; children: ReactNode }) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      {done ? (
        <motion.div key="done" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {success}
        </motion.div>
      ) : (
        <motion.div key="form" exit={{ opacity: 0, y: -16, transition: { duration: 0.3, ease: uiEase } }} className="px-6 pb-8 pt-10 sm:px-10 sm:pb-10">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h2 id={titleId} className="mt-3 font-display text-d4">
            {title}
          </h2>
          <p className="mt-3 max-w-lg text-ink/75">{intro}</p>
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Footer({ pending, failed, label }: { pending: boolean; failed: boolean; label: string }) {
  return (
    <div className="mt-8 flex flex-col gap-4 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-ink/60">{formCopy.privacy}</p>
      <Button cta={{ label: pending ? formCopy.submitting : label }} type="submit" disabled={pending} icon="send" magnetic={false} />
      {failed && (
        <p role="alert" className="text-sm font-medium text-[#c2410c] sm:order-first sm:basis-full">
          {formCopy.error}
        </p>
      )}
    </div>
  );
}

export function BrandForm({ titleId, onDone }: FormProps) {
  const c = formCopy.brand;
  const { register, handleSubmit, setError, formState } = useForm<BrandLeadInput>({ resolver: zodResolver(brandLeadSchema), defaultValues: { kind: 'brand' } });
  const { done, failed, pending, submit } = useSubmit(setError);
  const e = formState.errors;
  return (
    <Shell titleId={titleId} eyebrow={c.eyebrow} title={c.title} intro={c.intro} done={done} success={<Success {...c.success} onDone={onDone} />}>
      <form onSubmit={handleSubmit(submit)} noValidate className="relative mt-8 grid gap-5 sm:grid-cols-2">
        <input type="hidden" {...register('kind')} />
        <Honeypot {...register('website')} />
        <TextField label={c.fields.name} placeholder={c.placeholders.name} autoComplete="name" error={e.name?.message} {...register('name')} />
        <TextField label={c.fields.brand} placeholder={c.placeholders.brand} autoComplete="organization" error={e.brand?.message} {...register('brand')} />
        <TextField label={c.fields.email} placeholder={c.placeholders.email} type="email" autoComplete="email" error={e.email?.message} {...register('email')} />
        <TextField label={c.fields.phone} placeholder={c.placeholders.phone} type="tel" inputMode="tel" autoComplete="tel-national" prefix={phonePrefix} error={e.phone?.message} {...register('phone')} />
        <SelectField label={c.fields.category} options={categoryOptions} error={e.category?.message} {...register('category')} />
        <TextField label={c.fields.city} placeholder={c.placeholders.city} autoComplete="address-level2" error={e.city?.message} {...register('city')} />
        <TextAreaField className="sm:col-span-2" label={c.fields.description} placeholder={c.placeholders.description} error={e.description?.message} {...register('description')} />
        <Footer pending={pending} failed={failed} label={c.submit} />
      </form>
    </Shell>
  );
}

export function CreatorForm({ titleId, onDone }: FormProps) {
  const c = formCopy.creator;
  const { register, handleSubmit, setError, formState } = useForm<CreatorLeadInput>({ resolver: zodResolver(creatorLeadSchema), defaultValues: { kind: 'creator' } });
  const { done, failed, pending, submit } = useSubmit(setError);
  const e = formState.errors;
  return (
    <Shell titleId={titleId} eyebrow={c.eyebrow} title={c.title} intro={c.intro} done={done} success={<Success {...c.success} onDone={onDone} />}>
      <form onSubmit={handleSubmit(submit)} noValidate className="relative mt-8 grid gap-5 sm:grid-cols-2">
        <input type="hidden" {...register('kind')} />
        <Honeypot {...register('website')} />
        <TextField label={c.fields.name} placeholder={c.placeholders.name} autoComplete="name" error={e.name?.message} {...register('name')} />
        <TextField label={c.fields.instagram} placeholder={c.placeholders.instagram} autoCapitalize="none" spellCheck={false} error={e.instagram?.message} {...register('instagram')} />
        <TextField label={c.fields.email} placeholder={c.placeholders.email} type="email" autoComplete="email" error={e.email?.message} {...register('email')} />
        <TextField label={c.fields.phone} placeholder={c.placeholders.phone} type="tel" inputMode="tel" autoComplete="tel-national" prefix={phonePrefix} error={e.phone?.message} {...register('phone')} />
        <SelectField label={c.fields.niche} options={categoryOptions} error={e.niche?.message} {...register('niche')} />
        <SelectField label={c.fields.tier} options={tierOptions} error={e.tier?.message} {...register('tier')} />
        <TextField label={c.fields.city} placeholder={c.placeholders.city} autoComplete="address-level2" error={e.city?.message} {...register('city')} />
        <TextField label={c.fields.languages} placeholder={c.placeholders.languages} error={e.languages?.message} {...register('languages')} />
        <TextAreaField className="sm:col-span-2" label={c.fields.description} placeholder={c.placeholders.description} error={e.description?.message} {...register('description')} />
        <Footer pending={pending} failed={failed} label={c.submit} />
      </form>
    </Shell>
  );
}

export function LoginForm({ titleId, onDone }: FormProps) {
  const c = formCopy.login;
  const { register, handleSubmit, setError, formState } = useForm<LoginInput>({ resolver: zodResolver(loginSchema), defaultValues: { kind: 'login' } });
  const { done, failed, pending, submit } = useSubmit(setError);
  return (
    <Shell titleId={titleId} eyebrow={c.eyebrow} title={c.title} intro={c.intro} done={done} success={<Success {...c.success} onDone={onDone} />}>
      <form onSubmit={handleSubmit(submit)} noValidate className="relative mt-8 grid gap-5">
        <input type="hidden" {...register('kind')} />
        <Honeypot {...register('website')} />
        <TextField label={c.email} placeholder={c.placeholder} type="email" autoComplete="email" error={formState.errors.email?.message} {...register('email')} />
        <div className="flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-ink/60">{c.note}</p>
          <Button cta={{ label: pending ? formCopy.submitting : c.submit }} type="submit" disabled={pending} icon="mail" magnetic={false} />
        </div>
        {failed && (
          <p role="alert" className="text-sm font-medium text-[#c2410c]">
            {formCopy.error}
          </p>
        )}
      </form>
    </Shell>
  );
}
