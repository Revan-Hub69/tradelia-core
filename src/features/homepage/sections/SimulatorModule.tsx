'use client';

import { motion } from 'framer-motion';
import { SimulatorLauncher } from '@/features/simulator-v2/ui/SimulatorLauncher';
import { Section } from '@/features/landing/Section';

export const SimulatorModule = () => {
  return (
    <Section className="py-20 lg:py-28">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6 }}
      >
        <SimulatorLauncher />
      </motion.div>
    </Section>
  );
};
