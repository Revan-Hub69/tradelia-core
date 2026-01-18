'use client';

import { MicroLessonContainer } from '@/components/learning/MicroLessonContainer';
import { microLesson0Wallet } from '@/data/lessons/microLesson0Wallet';

export default function LessonDemoPage() {
  return (
    <MicroLessonContainer 
      lesson={microLesson0Wallet}
      onComplete={() => {
        console.log('Micro-lesson completed!');
      }}
    />
  );
}