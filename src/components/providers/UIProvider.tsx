'use client';

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { rememberUtm } from '@/lib/lead-context';

export type ModalId = 'campaign' | 'creator' | 'login';

type UIActions = {
  openModal: (id: ModalId) => void;
  closeModal: () => void;
  markEntranceDone: () => void;
};
type UIState = {
  modal: ModalId | null;
  /** True once the entrance sequence has finished (or was skipped). */
  entranceDone: boolean;
};

/**
 * Split in two so components that only trigger actions (every Button) never
 * re-render when state changes (e.g. when the entrance finishes).
 */
const ActionsContext = createContext<UIActions | null>(null);
const StateContext = createContext<UIState | null>(null);

export function UIProvider({ children }: { children: ReactNode }) {
  const [modal, setModal] = useState<ModalId | null>(null);
  const [entranceDone, setEntranceDone] = useState(false);
  useEffect(rememberUtm, []);

  const actions = useMemo<UIActions>(
    () => ({
      openModal: (id) => setModal(id),
      closeModal: () => setModal(null),
      markEntranceDone: () => setEntranceDone(true),
    }),
    [],
  );
  const state = useMemo(() => ({ modal, entranceDone }), [modal, entranceDone]);

  return (
    <ActionsContext.Provider value={actions}>
      <StateContext.Provider value={state}>{children}</StateContext.Provider>
    </ActionsContext.Provider>
  );
}

export function useUIActions() {
  const ctx = useContext(ActionsContext);
  if (!ctx) throw new Error('useUIActions must be used inside <UIProvider>');
  return ctx;
}

/** State + actions. Re-renders on state change; prefer useUIActions when you only need actions. */
export function useUI() {
  const state = useContext(StateContext);
  if (!state) throw new Error('useUI must be used inside <UIProvider>');
  return { ...state, ...useUIActions() };
}
