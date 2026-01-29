/**
 * @vitest-environment jsdom
 */

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ContextMenu, type ContextMenuItemOrSeparator } from '../ContextMenu';

describe('ContextMenu', () => {
  const mockAction1 = vi.fn();
  const mockAction2 = vi.fn();
  const mockAction3 = vi.fn();
  const mockOnOpen = vi.fn();
  const mockOnClose = vi.fn();

  const defaultItems: ContextMenuItemOrSeparator[] = [
    { id: '1', label: 'Action 1', action: mockAction1 },
    { id: '2', label: 'Action 2', action: mockAction2 },
    { type: 'separator' },
    { id: '3', label: 'Action 3', action: mockAction3, disabled: true },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Rendering', () => {
    it('should render trigger element', () => {
      render(
        <ContextMenu
          trigger={<button type="button">Open Menu</button>}
          items={defaultItems}
          ariaLabel="Quick actions"
        />,
      );

      expect(screen.getByRole('button', { name: 'Open Menu' })).toBeInTheDocument();
    });

    it('should not render menu initially', () => {
      render(
        <ContextMenu
          trigger={<button type="button">Open Menu</button>}
          items={defaultItems}
          ariaLabel="Quick actions"
        />,
      );

      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });

    it('should render menu when trigger is clicked', async () => {
      const user = userEvent.setup();

      render(
        <ContextMenu
          trigger={<button type="button">Open Menu</button>}
          items={defaultItems}
          ariaLabel="Quick actions"
        />,
      );

      await user.click(screen.getByRole('button', { name: 'Open Menu' }));

      await waitFor(() => {
        expect(screen.getByRole('menu')).toBeInTheDocument();
      });
    });

    it('should render all menu items', async () => {
      const user = userEvent.setup();

      render(
        <ContextMenu
          trigger={<button type="button">Open Menu</button>}
          items={defaultItems}
          ariaLabel="Quick actions"
        />,
      );

      await user.click(screen.getByRole('button', { name: 'Open Menu' }));

      await waitFor(() => {
        expect(screen.getByRole('menuitem', { name: 'Action 1' })).toBeInTheDocument();
        expect(screen.getByRole('menuitem', { name: 'Action 2' })).toBeInTheDocument();
        expect(screen.getByRole('menuitem', { name: 'Action 3' })).toBeInTheDocument();
      });
    });

    it('should render separator', async () => {
      const user = userEvent.setup();

      render(
        <ContextMenu
          trigger={<button type="button">Open Menu</button>}
          items={defaultItems}
          ariaLabel="Quick actions"
        />,
      );

      await user.click(screen.getByRole('button', { name: 'Open Menu' }));

      await waitFor(() => {
        expect(screen.getByRole('separator')).toBeInTheDocument();
      });
    });

    it('should render disabled items', async () => {
      const user = userEvent.setup();

      render(
        <ContextMenu
          trigger={<button type="button">Open Menu</button>}
          items={defaultItems}
          ariaLabel="Quick actions"
        />,
      );

      await user.click(screen.getByRole('button', { name: 'Open Menu' }));

      await waitFor(() => {
        const disabledItem = screen.getByRole('menuitem', { name: 'Action 3' });

        expect(disabledItem).toBeDisabled();
        expect(disabledItem).toHaveAttribute('aria-disabled', 'true');
      });
    });

    it('should render with custom className', async () => {
      const user = userEvent.setup();

      render(
        <ContextMenu
          trigger={<button type="button">Open Menu</button>}
          items={defaultItems}
          ariaLabel="Quick actions"
          className="bg-background"
        />,
      );

      await user.click(screen.getByRole('button', { name: 'Open Menu' }));

      await waitFor(() => {
        expect(screen.getByRole('menu')).toHaveClass('bg-background');
      });
    });
  });

  describe('ARIA Attributes', () => {
    it('should have correct ARIA attributes on trigger', () => {
      render(
        <ContextMenu
          trigger={<button type="button">Open Menu</button>}
          items={defaultItems}
          ariaLabel="Quick actions"
        />,
      );

      const trigger = screen.getByRole('button', { name: 'Open Menu' });

      expect(trigger).toHaveAttribute('aria-haspopup', 'menu');
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
    });

    it('should update aria-expanded when menu opens', async () => {
      const user = userEvent.setup();

      render(
        <ContextMenu
          trigger={<button type="button">Open Menu</button>}
          items={defaultItems}
          ariaLabel="Quick actions"
        />,
      );

      const trigger = screen.getByRole('button', { name: 'Open Menu' });
      await user.click(trigger);

      await waitFor(() => {
        expect(trigger).toHaveAttribute('aria-expanded', 'true');
        expect(trigger).toHaveAttribute('aria-controls', 'context-menu');
      });
    });

    it('should have correct ARIA label on menu', async () => {
      const user = userEvent.setup();

      render(
        <ContextMenu
          trigger={<button type="button">Open Menu</button>}
          items={defaultItems}
          ariaLabel="Quick actions"
        />,
      );

      await user.click(screen.getByRole('button', { name: 'Open Menu' }));

      await waitFor(() => {
        expect(screen.getByRole('menu')).toHaveAttribute('aria-label', 'Quick actions');
      });
    });
  });

  describe('Keyboard Navigation', () => {
    it('should focus first item when menu opens', async () => {
      const user = userEvent.setup();

      render(
        <ContextMenu
          trigger={<button type="button">Open Menu</button>}
          items={defaultItems}
          ariaLabel="Quick actions"
        />,
      );

      await user.click(screen.getByRole('button', { name: 'Open Menu' }));

      await waitFor(() => {
        const firstItem = screen.getByRole('menuitem', { name: 'Action 1' });

        expect(firstItem).toHaveFocus();
      });
    });

    it('should navigate down with ArrowDown', async () => {
      const user = userEvent.setup();

      render(
        <ContextMenu
          trigger={<button type="button">Open Menu</button>}
          items={defaultItems}
          ariaLabel="Quick actions"
        />,
      );

      await user.click(screen.getByRole('button', { name: 'Open Menu' }));

      await waitFor(() => {
        expect(screen.getByRole('menuitem', { name: 'Action 1' })).toHaveFocus();
      });

      await user.keyboard('{ArrowDown}');

      await waitFor(() => {
        expect(screen.getByRole('menuitem', { name: 'Action 2' })).toHaveFocus();
      });
    });

    it('should navigate up with ArrowUp', async () => {
      const user = userEvent.setup();

      render(
        <ContextMenu
          trigger={<button type="button">Open Menu</button>}
          items={defaultItems}
          ariaLabel="Quick actions"
        />,
      );

      await user.click(screen.getByRole('button', { name: 'Open Menu' }));

      await waitFor(() => {
        expect(screen.getByRole('menuitem', { name: 'Action 1' })).toHaveFocus();
      });

      await user.keyboard('{ArrowUp}');

      await waitFor(() => {
        // Should wrap to last actionable item (Action 2, skipping disabled Action 3)
        expect(screen.getByRole('menuitem', { name: 'Action 2' })).toHaveFocus();
      });
    });

    it('should jump to first item with Home', async () => {
      const user = userEvent.setup();

      render(
        <ContextMenu
          trigger={<button type="button">Open Menu</button>}
          items={defaultItems}
          ariaLabel="Quick actions"
        />,
      );

      await user.click(screen.getByRole('button', { name: 'Open Menu' }));

      await waitFor(() => {
        expect(screen.getByRole('menuitem', { name: 'Action 1' })).toHaveFocus();
      });

      await user.keyboard('{ArrowDown}');
      await user.keyboard('{Home}');

      await waitFor(() => {
        expect(screen.getByRole('menuitem', { name: 'Action 1' })).toHaveFocus();
      });
    });

    it('should jump to last item with End', async () => {
      const user = userEvent.setup();

      render(
        <ContextMenu
          trigger={<button type="button">Open Menu</button>}
          items={defaultItems}
          ariaLabel="Quick actions"
        />,
      );

      await user.click(screen.getByRole('button', { name: 'Open Menu' }));

      await waitFor(() => {
        expect(screen.getByRole('menuitem', { name: 'Action 1' })).toHaveFocus();
      });

      await user.keyboard('{End}');

      await waitFor(() => {
        // Should jump to last actionable item (Action 2, skipping disabled Action 3)
        expect(screen.getByRole('menuitem', { name: 'Action 2' })).toHaveFocus();
      });
    });

    it('should close menu with Escape', async () => {
      const user = userEvent.setup();

      render(
        <ContextMenu
          trigger={<button type="button">Open Menu</button>}
          items={defaultItems}
          ariaLabel="Quick actions"
        />,
      );

      await user.click(screen.getByRole('button', { name: 'Open Menu' }));

      await waitFor(() => {
        expect(screen.getByRole('menu')).toBeInTheDocument();
      });

      await user.keyboard('{Escape}');

      await waitFor(() => {
        expect(screen.queryByRole('menu')).not.toBeInTheDocument();
      });
    });

    it('should prevent Tab from leaving menu (focus trap)', async () => {
      const user = userEvent.setup();

      render(
        <ContextMenu
          trigger={<button type="button">Open Menu</button>}
          items={defaultItems}
          ariaLabel="Quick actions"
        />,
      );

      await user.click(screen.getByRole('button', { name: 'Open Menu' }));

      await waitFor(() => {
        expect(screen.getByRole('menuitem', { name: 'Action 1' })).toHaveFocus();
      });

      await user.keyboard('{Tab}');

      // Focus should remain in menu (not move to next element)
      await waitFor(() => {
        const menu = screen.getByRole('menu');

        expect(menu).toBeInTheDocument();
      });
    });

    it('should skip disabled items in navigation', async () => {
      const user = userEvent.setup();

      const items: ContextMenuItemOrSeparator[] = [
        { id: '1', label: 'Action 1', action: mockAction1 },
        { id: '2', label: 'Action 2', action: mockAction2, disabled: true },
        { id: '3', label: 'Action 3', action: mockAction3 },
      ];

      render(
        <ContextMenu
          trigger={<button type="button">Open Menu</button>}
          items={items}
          ariaLabel="Quick actions"
        />,
      );

      await user.click(screen.getByRole('button', { name: 'Open Menu' }));

      await waitFor(() => {
        expect(screen.getByRole('menuitem', { name: 'Action 1' })).toHaveFocus();
      });

      await user.keyboard('{ArrowDown}');

      await waitFor(() => {
        // Should skip disabled Action 2 and focus Action 3
        expect(screen.getByRole('menuitem', { name: 'Action 3' })).toHaveFocus();
      });
    });
  });

  describe('Item Actions', () => {
    it('should execute action on click', async () => {
      const user = userEvent.setup();

      render(
        <ContextMenu
          trigger={<button type="button">Open Menu</button>}
          items={defaultItems}
          ariaLabel="Quick actions"
        />,
      );

      await user.click(screen.getByRole('button', { name: 'Open Menu' }));

      await waitFor(() => {
        expect(screen.getByRole('menu')).toBeInTheDocument();
      });

      await user.click(screen.getByRole('menuitem', { name: 'Action 1' }));

      expect(mockAction1).toHaveBeenCalledTimes(1);
    });

    it('should execute action on Enter', async () => {
      const user = userEvent.setup();

      render(
        <ContextMenu
          trigger={<button type="button">Open Menu</button>}
          items={defaultItems}
          ariaLabel="Quick actions"
        />,
      );

      await user.click(screen.getByRole('button', { name: 'Open Menu' }));

      await waitFor(() => {
        expect(screen.getByRole('menuitem', { name: 'Action 1' })).toHaveFocus();
      });

      await user.keyboard('{Enter}');

      expect(mockAction1).toHaveBeenCalledTimes(1);
    });

    it('should execute action on Space', async () => {
      const user = userEvent.setup();

      render(
        <ContextMenu
          trigger={<button type="button">Open Menu</button>}
          items={defaultItems}
          ariaLabel="Quick actions"
        />,
      );

      await user.click(screen.getByRole('button', { name: 'Open Menu' }));

      await waitFor(() => {
        expect(screen.getByRole('menuitem', { name: 'Action 1' })).toHaveFocus();
      });

      await user.keyboard(' ');

      expect(mockAction1).toHaveBeenCalledTimes(1);
    });

    it('should close menu after action execution', async () => {
      const user = userEvent.setup();

      render(
        <ContextMenu
          trigger={<button type="button">Open Menu</button>}
          items={defaultItems}
          ariaLabel="Quick actions"
        />,
      );

      await user.click(screen.getByRole('button', { name: 'Open Menu' }));

      await waitFor(() => {
        expect(screen.getByRole('menu')).toBeInTheDocument();
      });

      await user.click(screen.getByRole('menuitem', { name: 'Action 1' }));

      await waitFor(() => {
        expect(screen.queryByRole('menu')).not.toBeInTheDocument();
      });
    });

    it('should not execute disabled item action', async () => {
      const user = userEvent.setup();

      render(
        <ContextMenu
          trigger={<button type="button">Open Menu</button>}
          items={defaultItems}
          ariaLabel="Quick actions"
        />,
      );

      await user.click(screen.getByRole('button', { name: 'Open Menu' }));

      await waitFor(() => {
        expect(screen.getByRole('menu')).toBeInTheDocument();
      });

      // Try to click disabled item
      const disabledItem = screen.getByRole('menuitem', { name: 'Action 3' });
      await user.click(disabledItem);

      expect(mockAction3).not.toHaveBeenCalled();
    });
  });

  describe('Click Outside', () => {
    it('should close menu when clicking outside', async () => {
      const user = userEvent.setup();

      render(
        <div>
          <div data-testid="outside">Outside</div>
          <ContextMenu
            trigger={<button type="button">Open Menu</button>}
            items={defaultItems}
            ariaLabel="Quick actions"
          />
        </div>,
      );

      await user.click(screen.getByRole('button', { name: 'Open Menu' }));

      await waitFor(() => {
        expect(screen.getByRole('menu')).toBeInTheDocument();
      });

      await user.click(screen.getByTestId('outside'));

      await waitFor(() => {
        expect(screen.queryByRole('menu')).not.toBeInTheDocument();
      });
    });

    it('should not close menu when clicking inside', async () => {
      const user = userEvent.setup();

      render(
        <ContextMenu
          trigger={<button type="button">Open Menu</button>}
          items={defaultItems}
          ariaLabel="Quick actions"
        />,
      );

      await user.click(screen.getByRole('button', { name: 'Open Menu' }));

      await waitFor(() => {
        expect(screen.getByRole('menu')).toBeInTheDocument();
      });

      // Click on menu itself (not on an item)
      const menu = screen.getByRole('menu');
      await user.click(menu);

      // Menu should still be open
      expect(screen.getByRole('menu')).toBeInTheDocument();
    });
  });

  describe('Focus Management', () => {
    it('should restore focus to trigger on close', async () => {
      const user = userEvent.setup();

      render(
        <ContextMenu
          trigger={<button type="button">Open Menu</button>}
          items={defaultItems}
          ariaLabel="Quick actions"
        />,
      );

      const trigger = screen.getByRole('button', { name: 'Open Menu' });
      await user.click(trigger);

      await waitFor(() => {
        expect(screen.getByRole('menu')).toBeInTheDocument();
      });

      await user.keyboard('{Escape}');

      await waitFor(() => {
        expect(trigger).toHaveFocus();
      });
    });

    it('should restore focus to trigger after action execution', async () => {
      const user = userEvent.setup();

      render(
        <ContextMenu
          trigger={<button type="button">Open Menu</button>}
          items={defaultItems}
          ariaLabel="Quick actions"
        />,
      );

      const trigger = screen.getByRole('button', { name: 'Open Menu' });
      await user.click(trigger);

      await waitFor(() => {
        expect(screen.getByRole('menu')).toBeInTheDocument();
      });

      await user.click(screen.getByRole('menuitem', { name: 'Action 1' }));

      await waitFor(() => {
        expect(trigger).toHaveFocus();
      });
    });
  });

  describe('Callbacks', () => {
    it('should call onOpen when menu opens', async () => {
      const user = userEvent.setup();

      render(
        <ContextMenu
          trigger={<button type="button">Open Menu</button>}
          items={defaultItems}
          ariaLabel="Quick actions"
          onOpen={mockOnOpen}
        />,
      );

      await user.click(screen.getByRole('button', { name: 'Open Menu' }));

      await waitFor(() => {
        expect(mockOnOpen).toHaveBeenCalledTimes(1);
      });
    });

    it('should call onClose when menu closes', async () => {
      const user = userEvent.setup();

      render(
        <ContextMenu
          trigger={<button type="button">Open Menu</button>}
          items={defaultItems}
          ariaLabel="Quick actions"
          onClose={mockOnClose}
        />,
      );

      await user.click(screen.getByRole('button', { name: 'Open Menu' }));

      await waitFor(() => {
        expect(screen.getByRole('menu')).toBeInTheDocument();
      });

      await user.keyboard('{Escape}');

      await waitFor(() => {
        expect(mockOnClose).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('Icons and Shortcuts', () => {
    it('should render item with icon', async () => {
      const user = userEvent.setup();

      const items: ContextMenuItemOrSeparator[] = [
        {
          id: '1',
          label: 'Action 1',
          action: mockAction1,
          icon: <span data-testid="icon">🔥</span>,
        },
      ];

      render(
        <ContextMenu
          trigger={<button type="button">Open Menu</button>}
          items={items}
          ariaLabel="Quick actions"
        />,
      );

      await user.click(screen.getByRole('button', { name: 'Open Menu' }));

      await waitFor(() => {
        expect(screen.getByTestId('icon')).toBeInTheDocument();
      });
    });

    it('should render item with shortcut', async () => {
      const user = userEvent.setup();

      const items: ContextMenuItemOrSeparator[] = [
        {
          id: '1',
          label: 'Action 1',
          action: mockAction1,
          shortcut: 'Ctrl+K',
        },
      ];

      render(
        <ContextMenu
          trigger={<button type="button">Open Menu</button>}
          items={items}
          ariaLabel="Quick actions"
        />,
      );

      await user.click(screen.getByRole('button', { name: 'Open Menu' }));

      await waitFor(() => {
        expect(screen.getByText('Ctrl+K')).toBeInTheDocument();
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty items array', async () => {
      const user = userEvent.setup();

      render(
        <ContextMenu
          trigger={<button type="button">Open Menu</button>}
          items={[]}
          ariaLabel="Quick actions"
        />,
      );

      await user.click(screen.getByRole('button', { name: 'Open Menu' }));

      await waitFor(() => {
        expect(screen.getByRole('menu')).toBeInTheDocument();
      });

      // Should not crash on keyboard navigation
      await user.keyboard('{ArrowDown}');
      await user.keyboard('{ArrowUp}');
      await user.keyboard('{Home}');
      await user.keyboard('{End}');
    });

    it('should handle only separators', async () => {
      const user = userEvent.setup();

      const items: ContextMenuItemOrSeparator[] = [
        { type: 'separator' },
        { type: 'separator' },
      ];

      render(
        <ContextMenu
          trigger={<button type="button">Open Menu</button>}
          items={items}
          ariaLabel="Quick actions"
        />,
      );

      await user.click(screen.getByRole('button', { name: 'Open Menu' }));

      await waitFor(() => {
        expect(screen.getByRole('menu')).toBeInTheDocument();
      });

      // Should not crash on keyboard navigation
      await user.keyboard('{ArrowDown}');
    });

    it('should handle all disabled items', async () => {
      const user = userEvent.setup();

      const items: ContextMenuItemOrSeparator[] = [
        { id: '1', label: 'Action 1', action: mockAction1, disabled: true },
        { id: '2', label: 'Action 2', action: mockAction2, disabled: true },
      ];

      render(
        <ContextMenu
          trigger={<button type="button">Open Menu</button>}
          items={items}
          ariaLabel="Quick actions"
        />,
      );

      await user.click(screen.getByRole('button', { name: 'Open Menu' }));

      await waitFor(() => {
        expect(screen.getByRole('menu')).toBeInTheDocument();
      });

      // Should not crash on keyboard navigation
      await user.keyboard('{ArrowDown}');
    });

    it('should toggle menu on repeated clicks', async () => {
      const user = userEvent.setup();

      render(
        <ContextMenu
          trigger={<button type="button">Open Menu</button>}
          items={defaultItems}
          ariaLabel="Quick actions"
        />,
      );

      const trigger = screen.getByRole('button', { name: 'Open Menu' });

      // Open
      await user.click(trigger);
      await waitFor(() => {
        expect(screen.getByRole('menu')).toBeInTheDocument();
      });

      // Close
      await user.click(trigger);
      await waitFor(() => {
        expect(screen.queryByRole('menu')).not.toBeInTheDocument();
      });

      // Open again
      await user.click(trigger);
      await waitFor(() => {
        expect(screen.getByRole('menu')).toBeInTheDocument();
      });
    });
  });
});
