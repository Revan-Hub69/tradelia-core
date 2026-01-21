/**
 * @vitest-environment jsdom
 */

import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { BellIcon } from '../BellIcon';
import { LockIcon } from '../LockIcon';
import { MoreVerticalIcon } from '../MoreVerticalIcon';

describe('New Interface Icons', () => {
  describe('BellIcon', () => {
    it('should render with default props', () => {
      const { container } = render(<BellIcon />);
      const svg = container.querySelector('svg');

      expect(svg).toBeInTheDocument();
      expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
      expect(svg).toHaveAttribute('fill', 'none');
      expect(svg).toHaveAttribute('stroke', 'currentColor');
    });

    it('should render with custom size', () => {
      const { container } = render(<BellIcon size={24} />);
      const svg = container.querySelector('svg');

      expect(svg).toHaveAttribute('width', '24');
      expect(svg).toHaveAttribute('height', '24');
    });

    it('should have aria-hidden by default', () => {
      const { container } = render(<BellIcon />);
      const svg = container.querySelector('svg');

      expect(svg).toHaveAttribute('aria-hidden', 'true');
    });

    it('should render bell paths', () => {
      const { container } = render(<BellIcon />);
      const paths = container.querySelectorAll('path');

      expect(paths.length).toBeGreaterThanOrEqual(2); // Bell body + clapper
    });
  });

  describe('LockIcon', () => {
    it('should render with default props', () => {
      const { container } = render(<LockIcon />);
      const svg = container.querySelector('svg');

      expect(svg).toBeInTheDocument();
      expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
      expect(svg).toHaveAttribute('fill', 'none');
      expect(svg).toHaveAttribute('stroke', 'currentColor');
    });

    it('should render with custom size', () => {
      const { container } = render(<LockIcon size={16} />);
      const svg = container.querySelector('svg');

      expect(svg).toHaveAttribute('width', '16');
      expect(svg).toHaveAttribute('height', '16');
    });

    it('should have aria-hidden by default', () => {
      const { container } = render(<LockIcon />);
      const svg = container.querySelector('svg');

      expect(svg).toHaveAttribute('aria-hidden', 'true');
    });

    it('should render lock body and shackle', () => {
      const { container } = render(<LockIcon />);
      const rect = container.querySelector('rect');
      const path = container.querySelector('path');

      expect(rect).toBeInTheDocument(); // Lock body
      expect(path).toBeInTheDocument(); // Shackle
    });
  });

  describe('MoreVerticalIcon', () => {
    it('should render with default props', () => {
      const { container } = render(<MoreVerticalIcon />);
      const svg = container.querySelector('svg');

      expect(svg).toBeInTheDocument();
      expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
      expect(svg).toHaveAttribute('fill', 'none');
      expect(svg).toHaveAttribute('stroke', 'currentColor');
    });

    it('should render with custom size', () => {
      const { container } = render(<MoreVerticalIcon size={20} />);
      const svg = container.querySelector('svg');

      expect(svg).toHaveAttribute('width', '20');
      expect(svg).toHaveAttribute('height', '20');
    });

    it('should have aria-hidden by default', () => {
      const { container } = render(<MoreVerticalIcon />);
      const svg = container.querySelector('svg');

      expect(svg).toHaveAttribute('aria-hidden', 'true');
    });

    it('should render three dots', () => {
      const { container } = render(<MoreVerticalIcon />);
      const circles = container.querySelectorAll('circle');

      expect(circles).toHaveLength(3); // Three vertical dots
    });
  });

  describe('Icon States', () => {
    it('should apply active state', () => {
      const { container } = render(<BellIcon state="active" />);
      const svg = container.querySelector('svg');

      expect(svg).toHaveClass('scale-110');
    });

    it('should apply pressed state', () => {
      const { container } = render(<LockIcon state="pressed" />);
      const svg = container.querySelector('svg');

      expect(svg).toHaveClass('scale-95');
    });

    it('should apply disabled state', () => {
      const { container } = render(<MoreVerticalIcon state="disabled" />);
      const svg = container.querySelector('svg');

      expect(svg).toHaveClass('opacity-40');
    });
  });

  describe('Accessibility', () => {
    it('should allow custom aria-hidden', () => {
      const { container } = render(<BellIcon aria-hidden={false} />);
      const svg = container.querySelector('svg');

      expect(svg).toHaveAttribute('aria-hidden', 'false');
    });

    it('should support custom className', () => {
      const { container } = render(<LockIcon className="custom-class" />);
      const svg = container.querySelector('svg');

      expect(svg).toHaveClass('custom-class');
    });
  });
});
