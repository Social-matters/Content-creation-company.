'use client';

import { useState } from 'react';
import { useUI, type ModalId } from '@/components/providers/UIProvider';
import { Modal } from '@/components/ui/Modal';
import { nav } from '@/content/site';
import { BrandForm, CreatorForm } from './LeadForms';

/** Renders whichever modal is open; keeps the last one mounted while it animates out. */
export function ModalHost() {
  const { modal, closeModal } = useUI();
  const [shown, setShown] = useState<ModalId | null>(modal);
  if (modal && modal !== shown) setShown(modal);

  return (
    <Modal open={modal !== null} onClose={closeModal} labelledBy={`modal-${shown}`} closeLabel={nav.close}>
      {shown === 'campaign' && <BrandForm titleId="modal-campaign" onDone={closeModal} />}
      {shown === 'creator' && <CreatorForm titleId="modal-creator" onDone={closeModal} />}
    </Modal>
  );
}
