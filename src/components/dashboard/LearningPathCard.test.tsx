import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { LearningPathCard } from './LearningPathCard';
import type { LearningPath } from './types';

const mockPath: LearningPath = {
  id: 'test-path',
  title: 'Test Path',
  description: 'A test learning path',
  difficulty: 'beginner',
  isPremium: false,
  prerequisites: [],
  modules: [],
  estimatedDuration: 120,
  completionRate: 50,
  isLocked: false,
};

describe('LearningPathCard', () => {
  it('renders path information correctly', () => {
    const onPathClick = vi.fn();

    render(
      <LearningPathCard
        path={mockPath}
        progress={50}
        isLocked={false}
        isPremium={false}
        onPathClick={onPathClick}
      />,
    );

    expect(screen.getByText('Test Path')).toBeInTheDocument();
    expect(screen.getByText('A test learning path')).toBeInTheDocument();
    expect(screen.getByText('50%')).toBeInTheDocument();
    expect(screen.getByText('beginner')).toBeInTheDocument();
  });

  it('shows premium badge when path is premium', () => {
    const onPathClick = vi.fn();

    render(
      <LearningPathCard
        path={{ ...mockPath, isPremium: true }}
        progress={0}
        isLocked={false}
        isPremium={true}
        onPathClick={onPathClick}
      />,
    );

    expect(screen.getByText('Premium')).toBeInTheDocument();
  });

  it('shows lock overlay when path is locked', () => {
    const onPathClick = vi.fn();

    render(
      <LearningPathCard
        path={mockPath}
        progress={0}
        isLocked={true}
        isPremium={false}
        onPathClick={onPathClick}
      />,
    );

    expect(screen.getByText('Bloccato')).toBeInTheDocument();
  });

  it('shows completed badge when progress is 100%', () => {
    const onPathClick = vi.fn();

    render(
      <LearningPathCard
        path={mockPath}
        progress={100}
        isLocked={false}
        isPremium={false}
        onPathClick={onPathClick}
      />,
    );

    expect(screen.getByText('Completato')).toBeInTheDocument();
  });
});