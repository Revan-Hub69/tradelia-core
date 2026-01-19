'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/libs/supabase/client';

type LessonCompletionData = {
  lessonId: string;
  pathId?: string;
  xpEarned: number;
  approachesUsed?: string[];
  quizScore?: number;
  timeSpent?: number;
  badges?: Array<{
    id: string;
    name: string;
    description: string;
    icon: string;
    rarity: string;
  }>;
};

export const useLessonCompletion = () => {
  const [isCompleting, setIsCompleting] = useState(false);
  const router = useRouter();

  const completeLesson = async (data: LessonCompletionData) => {
    setIsCompleting(true);
    
    try {
      // Check if user is authenticated
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        // Store completion data in localStorage for later sync
        const pendingCompletion = {
          ...data,
          completedAt: new Date().toISOString(),
        };
        localStorage.setItem(`pending-completion-${data.lessonId}`, JSON.stringify(pendingCompletion));
        
        // Redirect to auth with lesson completion context
        router.push(`/auth?lesson=${data.lessonId}&xp=${data.xpEarned}`);
        return;
      }
      
      // User is authenticated - save to database
      const response = await fetch('/api/lessons/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to complete lesson');
      }
      
      const result = await response.json();
      
      // Show success message or redirect to dashboard
      router.push('/dashboard?lesson=completed');
      
      return result;
    } catch (error) {
      console.error('Error completing lesson:', error);
      throw error;
    } finally {
      setIsCompleting(false);
    }
  };

  const syncPendingCompletions = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return;
    
    // Find all pending completions in localStorage
    const pendingKeys = Object.keys(localStorage).filter(key => 
      key.startsWith('pending-completion-')
    );
    
    for (const key of pendingKeys) {
      try {
        const pendingData = JSON.parse(localStorage.getItem(key) || '{}');
        
        // Complete the lesson
        await fetch('/api/lessons/complete', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(pendingData),
        });
        
        // Remove from localStorage after successful sync
        localStorage.removeItem(key);
      } catch (error) {
        console.error('Error syncing pending completion:', error);
      }
    }
  };

  return {
    completeLesson,
    syncPendingCompletions,
    isCompleting,
  };
};