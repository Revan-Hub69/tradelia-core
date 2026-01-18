// Temporary placeholder component
'use client';

import React from 'react';
import { Card } from '@/components/ui/card';

interface MicroLessonContainerProps {
  lesson: any;
  onComplete: () => void;
}

export const MicroLessonContainer: React.FC<MicroLessonContainerProps> = ({ 
  // lesson, 
  // onComplete 
}) => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Demo Lesson Placeholder</h2>
        <p className="text-gray-600 mb-6">
          This is a temporary placeholder. The new lesson system is available at:
        </p>
        <a 
          href="/lesson-0" 
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Vai alla Lezione 0: Cosa sono le Criptovalute 🚀
        </a>
      </Card>
    </div>
  );
};