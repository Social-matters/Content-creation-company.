'use client';

import dynamic from 'next/dynamic';

/**
 * Below-the-fold chrome loaded after hydration: modal forms (react-hook-form, zod)
 * and the custom cursor aren't needed for first paint. Modal state lives in
 * UIProvider, so a click before this loads still opens the modal once it arrives.
 */
const ModalHost = dynamic(() => import('@/components/forms/ModalHost').then((m) => m.ModalHost), { ssr: false });
const Cursor = dynamic(() => import('@/components/ui/Cursor').then((m) => m.Cursor), { ssr: false });

export function LazyChrome() {
  return (
    <>
      <ModalHost />
      <Cursor />
    </>
  );
}
