'use client';

import { useEffect } from 'react';

import type { AssetId } from '../data/assets';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { BottomSheet } from '../layout/BottomSheet';
import { Drawer } from '../layout/Drawer';
import { CollapsibleWizard } from './CollapsibleWizard';

type SimulatorShellProps = {
  isOpen: boolean;
  onCloseAction: () => void;
  assetId: AssetId | null;
};

export function SimulatorShell({ isOpen, onCloseAction, assetId }: SimulatorShellProps) {
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const content = assetId ? (
    <CollapsibleWizard assetId={assetId} onCloseAction={onCloseAction} />
  ) : null;

  if (isDesktop) {
    return (
      <Drawer isOpen={isOpen} onClose={onCloseAction} width="560px">
        {content}
      </Drawer>
    );
  }

  return (
    <BottomSheet isOpen={isOpen} onClose={onCloseAction}>
      {content}
    </BottomSheet>
  );
}
