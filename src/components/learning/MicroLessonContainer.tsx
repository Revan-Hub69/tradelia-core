// Temporary placeholder component
'use client';

import React from 'react';

import { Card } from '@/components/ui/card';

type MicroLessonContainerProps = {
  lesson: any;
  onComplete: () => void;
};

export const MicroLessonContainer: React.FC<MicroLessonContainerProps> = ({
  // lesson,
  // onComplete
}) => {
  return (
    <div className="mx-auto max-w-4xl p-6">
      <Card className="p-8 text-center">
        <h2 className="mb-4 text-2xl font-bold">Demo Lesson Placeholder</h2>
        <p className="mb-6 text-gray-600">
          This is a temporary placeholder. The new lesson system is available at:
        </p>
        <a
          href="/lesson-0"
          className="inline-block rounded-lg bg-blue-600 px-6 py-3 text-white transition-colors hover:bg-blue-700"
        >
          Vai alla Lezione 0: Cosa sono le Criptovalute 🚀
        </a>
      </Card>
    </div>
  );
};
