'use client';

import { Suspense } from 'react';
import { SimulatoreHeader } from '@/components/simulatore/SimulatoreHeader';
import { SimulatoreShell } from '@/components/simulatore/SimulatoreShell';
import { SimulatoreSkeleton } from '@/components/simulatore/SimulatoreSkeleton';

export default function SimulatorePage() {
  return (
    <>
      <SimulatoreHeader />
      <main className="sim-main" id="sim-main">
        <Suspense fallback={<SimulatoreSkeleton />}>
          <SimulatoreShell />
        </Suspense>
      </main>
    </>
  );
}
