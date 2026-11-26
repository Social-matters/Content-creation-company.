'use client';

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

export type ModalId = 'campaign' | 'creator' | 'login';

type UIState = {
  modal: ModalId | null;
  openModal: (id: ModalId) => void;
  closeModal: () => void;
  /** True once the entrance sequence has finished (or was skipped). */
  entranceDone: boolean;
  markEntranceDone: () => void;
};

const UIContext = createContext<UIState | null>(null);

export function UIProvider({ children }: { children: ReactNode }) {
  const [modal, setModal] = useState<ModalId | null>(null);
  const [entranceDone, setEntranceDone] = useState(false);

  const openModal = useCallback((id: ModalId) => setModal(id), []);
  const closeModal = useCallback(() => setModal(null), []);
  const markEntranceDone = useCallback(() => setEntranceDone(true), []);

  const value = useMemo(
    () => ({ modal, openModal, closeModal, entranceDone, markEntranceDone }),
    [modal, openModal, closeModal, entranceDone, markEntranceDone],
  );
  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

export function useUI() {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error('useUI must be used inside <UIProvider>');
  return ctx;
}
