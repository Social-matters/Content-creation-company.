'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion } from 'motion/react';
import { useState, useTransition, type ReactNode } from 'react';
import { useForm, type FieldValues, type Path, type Resolver, type UseFormSetError } from 'react-hook-form';
import { submitLead } from '@/app/actions';
import {
  brandClassicSchema,
  brandSchema,
  celebritySchema,
  contactSchema,
  creatorClassicSchema,
  creatorSchema,
  earlyAccessSchema,
  loginSchema,
  modelShootSchema,
  type BrandFormInput,
  type ContactFormInput,
  type CreatorFormInput,
  type EarlyAccessFormInput,
  type LoginInput,
} from '@/lib/schemas';
import { leadContext } from '@/lib/lead-context';
import { useSiteVersion } from '@/lib/site-version';
import { brandNeeds, budgets, formCopyV2, priceUnits, talentTypes, timelines } from '@/content/v2/forms';
import { categories, followerTiers, formCopy, phonePrefix } from '@/content/forms';
import { Button } from '@/components/ui/Button';
import { Eyebrow } from '@/components/ui/Badge';
import type { IconName } from '@/components/ui/Icon';
import { uiEase } from '@/lib/motion';
import { ChipGroupField, ConsentField, Honeypot, SelectField, TextAreaField, TextField } from './Fields';
import { Success } from './Success';

const categoryOptions = categories.map((c) => ({ value: c, label: c }));
const tierOptions = followerTiers.map((t) => ({ value: t.value, label: t.label }));

type FormProps = { titleId: string; onDone?: () => void };
/** The enquiry forms on the Celebrities and Model Shoots pages: the brand form with one need pre-ticked. */
export type EnquiryKind = 'celebrity' | 'model-shoot';
const ENQUIRY = { celebrity: { schema: celebritySchema, need: 'celebrity' }, 'model-shoot': { schema: modelShootSchema, need: 'models' } } as const;

/** Every form shares one resolver type; the schema that actually runs is picked by `kind`. */
const resolve = <T extends FieldValues>(schema: object) => zodResolver(schema as never) as unknown as Resolver<T>;

function useSubmit<T extends FieldValues>(setError: UseFormSetError<T>) {
  const [done, setDone] = useState(false);
  const [failure, setFailure] = useState<string | null>(null);
  const [pending, start] = useTransition();
  // The form is never reset here, so whatever was typed stays put if sending fails.
  const submit = (values: T) =>
    start(async () => {
      setFailure(null);
      try {
        const res = await submitLead(values, leadContext());
        if (res.ok) return setDone(true);
        if (res.reason === 'invalid') for (const [k, msgs] of Object.entries(res.fieldErrors)) setError(k as Path<T>, { message: msgs[0] });
        else setFailure(res.reason === 'rate' ? formCopy.rateLimited : formCopy.error);
      } catch {
        setFailure(formCopy.error); // the request itself failed (offline, server down)
      }
    });
  return { done, failure, pending, submit };
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
          <Eyebrow tone="light">{eyebrow}</Eyebrow>
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

function SubmitRow({ pending, failure, label, icon = 'send', consent }: { pending: boolean; failure: string | null; label: string; icon?: IconName; consent: ReactNode }) {
  return (
    <div className="mt-3 flex flex-col gap-5 sm:col-span-2">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        {consent}
        <div className="shrink-0">
          <Button cta={{ label: pending ? formCopy.submitting : label }} type="submit" disabled={pending} icon={icon} magnetic={false} />
        </div>
      </div>
      {failure && (
        <p role="alert" className="rounded-2xl border-2 border-[#c2410c] bg-[#fff4ec] px-4 py-3 text-sm font-medium text-[#9a3412]">
          {failure}
        </p>
      )}
    </div>
  );
}

/** Brand application. Inside /v2 it also asks what they need, budget and timeline. */
export function BrandForm({ titleId, onDone, enquiry }: FormProps & { enquiry?: EnquiryKind }) {
  const c = formCopy.brand;
  const v2 = useSiteVersion().version === 'v2';
  const preset = v2 && enquiry ? ENQUIRY[enquiry] : null;
  const kind = !v2 ? 'brand-classic' : (enquiry ?? 'brand');
  const schema = !v2 ? brandClassicSchema : (preset?.schema ?? brandSchema);
  const { register, handleSubmit, setError, formState } = useForm<BrandFormInput>({
    resolver: resolve<BrandFormInput>(schema),
    defaultValues: { kind, consent: false, ...(preset ? { needs: [preset.need] } : {}) },
  });
  const { done, failure, pending, submit } = useSubmit(setError);
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
        {v2 && (
          <>
            <ChipGroupField className="sm:col-span-2" label={formCopyV2.brand.needs} options={brandNeeds} error={e.needs?.message} inputProps={register('needs')} />
            <SelectField label={formCopyV2.brand.budget} options={budgets} error={e.budget?.message} {...register('budget')} />
            <SelectField label={formCopyV2.brand.timeline} options={timelines} error={e.timeline?.message} {...register('timeline')} />
          </>
        )}
        <TextAreaField className="sm:col-span-2" label={c.fields.description} placeholder={c.placeholders.description} error={e.description?.message} {...register('description')} />
        <SubmitRow pending={pending} failure={failure} label={c.submit} consent={<ConsentField error={e.consent?.message} {...register('consent')} />} />
      </form>
    </Shell>
  );
}

/** Creator application. Inside /v2 it's the influencer-network application: "I am a" plus a base rate. */
export function CreatorForm({ titleId, onDone }: FormProps) {
  const c = formCopy.creator;
  const v2c = formCopyV2.creator;
  const v2 = useSiteVersion().version === 'v2';
  const head = v2 ? { eyebrow: v2c.eyebrow, title: v2c.title, intro: v2c.intro } : c;
  const { register, handleSubmit, setError, formState } = useForm<CreatorFormInput>({
    resolver: resolve<CreatorFormInput>(v2 ? creatorSchema : creatorClassicSchema),
    defaultValues: { kind: v2 ? 'creator' : 'creator-classic', consent: false },
  });
  const { done, failure, pending, submit } = useSubmit(setError);
  const e = formState.errors;
  return (
    <Shell titleId={titleId} eyebrow={head.eyebrow} title={head.title} intro={head.intro} done={done} success={<Success {...c.success} onDone={onDone} />}>
      <form onSubmit={handleSubmit(submit)} noValidate className="relative mt-8 grid gap-5 sm:grid-cols-2">
        <input type="hidden" {...register('kind')} />
        <Honeypot {...register('website')} />
        {v2 && <ChipGroupField type="radio" className="sm:col-span-2" label={v2c.type} options={talentTypes} error={e.type?.message} inputProps={register('type')} />}
        <TextField label={c.fields.name} placeholder={c.placeholders.name} autoComplete="name" error={e.name?.message} {...register('name')} />
        <TextField label={c.fields.instagram} placeholder={c.placeholders.instagram} autoCapitalize="none" spellCheck={false} error={e.instagram?.message} {...register('instagram')} />
        <TextField label={c.fields.email} placeholder={c.placeholders.email} type="email" autoComplete="email" error={e.email?.message} {...register('email')} />
        <TextField label={c.fields.phone} placeholder={c.placeholders.phone} type="tel" inputMode="tel" autoComplete="tel-national" prefix={phonePrefix} error={e.phone?.message} {...register('phone')} />
        <SelectField label={c.fields.niche} options={categoryOptions} error={e.niche?.message} {...register('niche')} />
        <SelectField label={c.fields.tier} options={tierOptions} error={e.tier?.message} {...register('tier')} />
        <TextField label={c.fields.city} placeholder={c.placeholders.city} autoComplete="address-level2" error={e.city?.message} {...register('city')} />
        <TextField label={c.fields.languages} placeholder={c.placeholders.languages} error={e.languages?.message} {...register('languages')} />
        {v2 && (
          <>
            <TextField label={v2c.basePrice} placeholder={v2c.basePricePlaceholder} inputMode="numeric" prefix="₹" error={e.basePrice?.message} {...register('basePrice')} />
            <SelectField label={v2c.priceUnit} options={priceUnits} error={e.priceUnit?.message} {...register('priceUnit')} />
            <p className="-mt-2 text-sm text-ink/60 sm:col-span-2">{v2c.priceNote}</p>
          </>
        )}
        <TextAreaField className="sm:col-span-2" label={c.fields.description} placeholder={c.placeholders.description} error={e.description?.message} {...register('description')} />
        <SubmitRow pending={pending} failure={failure} label={v2 ? v2c.submit : c.submit} consent={<ConsentField error={e.consent?.message} {...register('consent')} />} />
      </form>
    </Shell>
  );
}

export function ContactForm({ titleId, onDone }: FormProps) {
  const c = formCopyV2.contact;
  const { register, handleSubmit, setError, formState } = useForm<ContactFormInput>({ resolver: resolve<ContactFormInput>(contactSchema), defaultValues: { kind: 'contact', consent: false } });
  const { done, failure, pending, submit } = useSubmit(setError);
  const e = formState.errors;
  return (
    <Shell titleId={titleId} eyebrow={c.eyebrow} title={c.title} intro={c.intro} done={done} success={<Success {...c.success} onDone={onDone} />}>
      <form onSubmit={handleSubmit(submit)} noValidate className="relative mt-8 grid gap-5 sm:grid-cols-2">
        <input type="hidden" {...register('kind')} />
        <Honeypot {...register('website')} />
        <TextField label={c.fields.name} placeholder={c.placeholders.name} autoComplete="name" error={e.name?.message} {...register('name')} />
        <TextField label={c.fields.email} placeholder={c.placeholders.email} type="email" autoComplete="email" error={e.email?.message} {...register('email')} />
        <TextAreaField className="sm:col-span-2" label={c.fields.message} placeholder={c.placeholders.message} error={e.message?.message} {...register('message')} />
        <SubmitRow pending={pending} failure={failure} label={c.submit} consent={<ConsentField error={e.consent?.message} {...register('consent')} />} />
      </form>
    </Shell>
  );
}

export function EarlyAccessForm({ titleId }: FormProps) {
  const c = formCopyV2.earlyAccess;
  const { register, handleSubmit, setError, formState } = useForm<EarlyAccessFormInput>({ resolver: resolve<EarlyAccessFormInput>(earlyAccessSchema), defaultValues: { kind: 'early-access', consent: false } });
  const { done, failure, pending, submit } = useSubmit(setError);
  const e = formState.errors;
  return (
    <Shell titleId={titleId} eyebrow={c.eyebrow} title={c.title} intro={c.intro} done={done} success={<Success {...c.success} />}>
      <form onSubmit={handleSubmit(submit)} noValidate className="relative mt-6 grid gap-5 sm:grid-cols-2">
        <input type="hidden" {...register('kind')} />
        <Honeypot {...register('website')} />
        <TextField className="sm:col-span-2" label={c.email} placeholder={c.placeholder} type="email" autoComplete="email" error={e.email?.message} {...register('email')} />
        <SubmitRow pending={pending} failure={failure} label={c.submit} icon="mail" consent={<ConsentField error={e.consent?.message} {...register('consent')} />} />
      </form>
    </Shell>
  );
}

/** UI only until the dashboards exist: checks the address in the browser and sends nothing. */
export function LoginForm({ titleId, onDone }: FormProps) {
  const c = formCopy.login;
  const [done, setDone] = useState(false);
  const { register, handleSubmit, formState } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });
  return (
    <Shell titleId={titleId} eyebrow={c.eyebrow} title={c.title} intro={c.intro} done={done} success={<Success {...c.success} onDone={onDone} />}>
      <form onSubmit={handleSubmit(() => setDone(true))} noValidate className="relative mt-8 grid gap-5">
        <TextField label={c.email} placeholder={c.placeholder} type="email" autoComplete="email" error={formState.errors.email?.message} {...register('email')} />
        <div className="flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-ink/60">{c.note}</p>
          <Button cta={{ label: c.submit }} type="submit" magnetic={false} />
        </div>
      </form>
    </Shell>
  );
}
