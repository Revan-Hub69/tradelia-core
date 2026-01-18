import { render, screen, cleanup, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as fc from 'fast-check';
import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';

import { DashboardHeader } from './DashboardHeader';
import type { DashboardHeaderProps } from './types';

// Generators for property-based testing
const userGenerator = () => fc.record({
  id: fc.string({ minLength: 1 }),
  email: fc.emailAddress(),
  name: fc.option(fc.string({ minLength: 1 })),
  avatar: fc.option(fc.webUrl()),
  subscription: fc.constantFrom('free', 'premium'),
  subscriptionExpiry: fc.option(fc.date()),
});

const dashboardHeaderPropsGenerator = () => fc.record({
  user: userGenerator(),
  currentStreak: fc.integer({ min: 0, max: 365 }),
  totalXP: fc.integer({ min: 0, max: 100000 }),
  onSettingsClick: fc.constant(vi.fn()),
  showGamification: fc.option(fc.boolean()),
});

describe('DashboardHeader Unit Tests', () => {
  const mockUser = {
    id: '1',
    email: 'test@example.com',
    name: 'Test User',
    subscription: 'free' as const,
  };

  const defaultProps = {
    user: mockUser,
    currentStreak: 5,
    totalXP: 250,
    onSettingsClick: vi.fn(),
    showGamification: true,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  describe('User Menu Interactions - Requirement 4.2', () => {
    it('should open user menu when clicked', async () => {
      const user = userEvent.setup();
      render(<DashboardHeader {...defaultProps} />);

      // Find the user menu trigger button
      const userMenuButton = screen.getByRole('button', { 
        name: /menu utente per test user/i 
      });
      expect(userMenuButton).toBeInTheDocument();

      // Click the user menu button
      await user.click(userMenuButton);

      // Verify dropdown menu items are visible
      await waitFor(() => {
        expect(screen.getByText('Profilo')).toBeInTheDocument();
        expect(screen.getByText('Impostazioni')).toBeInTheDocument();
        expect(screen.getByText('Esci')).toBeInTheDocument();
      });
    });

    it('should call onSettingsClick when settings menu item is clicked', async () => {
      const user = userEvent.setup();
      const mockOnSettingsClick = vi.fn();
      
      render(<DashboardHeader {...defaultProps} onSettingsClick={mockOnSettingsClick} />);

      // Open user menu
      const userMenuButton = screen.getByRole('button', { 
        name: /menu utente per test user/i 
      });
      await user.click(userMenuButton);

      // Click settings menu item
      const settingsItem = await screen.findByText('Impostazioni');
      await user.click(settingsItem);

      // Verify onSettingsClick was called
      expect(mockOnSettingsClick).toHaveBeenCalledTimes(1);
    });

    it('should display user info in dropdown menu', async () => {
      const user = userEvent.setup();
      render(<DashboardHeader {...defaultProps} />);

      // Open user menu
      const userMenuButton = screen.getByRole('button', { 
        name: /menu utente per test user/i 
      });
      await user.click(userMenuButton);

      // Verify user info is displayed - use more specific selectors
      await waitFor(() => {
        // Look for the user name in the dropdown specifically
        const dropdownUserName = screen.getAllByText('Test User').find(el => 
          el.className.includes('text-sm font-medium') && !el.className.includes('hidden')
        );
        expect(dropdownUserName).toBeInTheDocument();
        expect(screen.getByText('test@example.com')).toBeInTheDocument();
      });
    });

    it('should show premium badge for premium users', async () => {
      const user = userEvent.setup();
      const premiumUser = { ...mockUser, subscription: 'premium' as const };
      
      render(<DashboardHeader {...defaultProps} user={premiumUser} />);

      // Check for premium badge in header
      expect(screen.getByText('Premium')).toBeInTheDocument();

      // Open user menu to check premium status in dropdown
      const userMenuButton = screen.getByRole('button', { 
        name: /menu utente per test user/i 
      });
      await user.click(userMenuButton);

      // Verify premium status in dropdown
      await waitFor(() => {
        expect(screen.getByText('Premium attivo')).toBeInTheDocument();
      });
    });

    it('should display user initial when name is available', () => {
      render(<DashboardHeader {...defaultProps} />);
      
      // Should show 'T' for 'Test User'
      expect(screen.getByText('T')).toBeInTheDocument();
    });

    it('should display email initial when name is not available', () => {
      const userWithoutName = { ...mockUser, name: undefined };
      render(<DashboardHeader {...defaultProps} user={userWithoutName} />);
      
      // Should show 'test' (first part of email before @) for 'test@example.com'
      expect(screen.getByText('test')).toBeInTheDocument();
    });
  });

  describe('Responsive Breakpoints - Requirement 4.2', () => {
    // Mock window.matchMedia for responsive testing
    const mockMatchMedia = (matches: boolean) => {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation((query) => ({
          matches,
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        })),
      });
    };

    it('should show desktop gamification layout on large screens', () => {
      mockMatchMedia(true); // Simulate large screen
      
      render(<DashboardHeader {...defaultProps} />);

      // Desktop gamification should be visible (hidden lg:flex)
      const desktopStreak = screen.getByText('5 giorni');
      expect(desktopStreak).toBeInTheDocument();
      
      // XP should be visible on desktop - use getAllByText to handle multiple instances
      const xpElements = screen.getAllByText('250');
      expect(xpElements.length).toBeGreaterThan(0);
      expect(screen.getByText('XP')).toBeInTheDocument();
    });

    it('should adapt gamification display for mobile screens', () => {
      render(<DashboardHeader {...defaultProps} />);

      // Mobile gamification elements should be present
      // The component uses CSS classes to show/hide elements based on screen size
      const streakElements = screen.getAllByText('5');
      expect(streakElements.length).toBeGreaterThan(0);
    });

    it('should hide username on mobile screens', () => {
      render(<DashboardHeader {...defaultProps} />);

      // Username should have hidden md:inline class for mobile hiding
      const usernameElement = screen.getByText('Test User');
      expect(usernameElement).toHaveClass('hidden', 'md:inline');
    });

    it('should show navigation label only on desktop', () => {
      render(<DashboardHeader {...defaultProps} />);

      // Dashboard navigation label should be hidden on mobile
      const dashboardLabel = screen.getByText('Dashboard');
      expect(dashboardLabel.parentElement).toHaveClass('hidden', 'md:block');
    });

    it('should adapt premium badge visibility for mobile', () => {
      const premiumUser = { ...mockUser, subscription: 'premium' as const };
      render(<DashboardHeader {...defaultProps} user={premiumUser} />);

      // Premium badge should be hidden on small screens - check the actual premium badge element
      const premiumBadge = screen.getByText('Premium');
      expect(premiumBadge).toBeInTheDocument();
      
      // The premium badge container should have the responsive classes
      const premiumBadgeContainer = premiumBadge.closest('div');
      expect(premiumBadgeContainer).toHaveClass('hidden', 'sm:flex');
    });

    it('should maintain accessibility on all screen sizes', () => {
      render(<DashboardHeader {...defaultProps} />);

      // User menu should always be accessible
      const userMenuButton = screen.getByRole('button', { 
        name: /menu utente per test user/i 
      });
      expect(userMenuButton).toBeInTheDocument();

      // Streak should have proper aria-label
      const streakIcon = screen.getByRole('img', { name: /streak fire/i });
      expect(streakIcon).toBeInTheDocument();

      // XP should have proper aria-label
      const xpIcon = screen.getByRole('img', { name: /experience points/i });
      expect(xpIcon).toBeInTheDocument();
    });
  });
});

describe('DashboardHeader Property Tests', () => {
  afterEach(() => {
    cleanup();
  });

  describe('Property 5: Gamification Visibility', () => {
    it('should always display gamification elements when showGamification is true', () => {
      // Feature: dashboard-modular-learning-system, Property 5: Gamification Visibility
      fc.assert(fc.property(
        dashboardHeaderPropsGenerator(),
        (props: DashboardHeaderProps) => {
          // Clean up before each property test iteration
          cleanup();
          
          // Force showGamification to true for this property test
          const testProps = { ...props, showGamification: true };
          
          const { container } = render(<DashboardHeader {...testProps} />);
          
          // Property: Current streak should always be visible in header
          const streakText = `${testProps.currentStreak} giorni`;
          const streakElements = screen.getAllByText(streakText);
          expect(streakElements.length).toBeGreaterThan(0);
          
          // Property: XP should always be visible when gamification is shown
          const xpRegex = new RegExp(`${testProps.totalXP}.*XP`, 'i');
          expect(container.textContent).toMatch(xpRegex);
          
          // Property: Fire emoji (streak indicator) should be present
          const fireEmoji = screen.getByRole('img', { name: /streak fire/i });
          expect(fireEmoji).toBeInTheDocument();
          
          // Property: Star emoji (XP indicator) should be present
          const starEmoji = screen.getByRole('img', { name: /experience points/i });
          expect(starEmoji).toBeInTheDocument();
        }
      ), { numRuns: 20 });
    });

    it('should hide gamification elements when showGamification is false', () => {
      // Feature: dashboard-modular-learning-system, Property 5: Gamification Visibility
      fc.assert(fc.property(
        dashboardHeaderPropsGenerator(),
        (props: DashboardHeaderProps) => {
          // Clean up before each property test iteration
          cleanup();
          
          // Force showGamification to false for this property test
          const testProps = { ...props, showGamification: false };
          
          render(<DashboardHeader {...testProps} />);
          
          // Property: Streak should not be visible when gamification is disabled
          const streakText = `${testProps.currentStreak} giorni`;
          const streakElement = screen.queryByText(streakText);
          expect(streakElement).not.toBeInTheDocument();
          
          // Property: XP should not be visible when gamification is disabled
          const xpText = screen.queryByText(new RegExp(`${testProps.totalXP}.*XP`, 'i'));
          expect(xpText).not.toBeInTheDocument();
          
          // Property: Fire emoji should not be present when gamification is disabled
          const fireEmoji = screen.queryByRole('img', { name: /streak fire/i });
          expect(fireEmoji).not.toBeInTheDocument();
        }
      ), { numRuns: 20 });
    });

    it('should display gamification elements on both desktop and mobile when enabled', () => {
      // Feature: dashboard-modular-learning-system, Property 5: Gamification Visibility
      fc.assert(fc.property(
        dashboardHeaderPropsGenerator(),
        (props: DashboardHeaderProps) => {
          // Clean up before each property test iteration
          cleanup();
          
          // Force showGamification to true for this property test
          const testProps = { ...props, showGamification: true };
          
          const { container } = render(<DashboardHeader {...testProps} />);
          
          // Property: Streak should be visible (either desktop or mobile version)
          const streakText = `${testProps.currentStreak} giorni`;
          expect(container.textContent).toContain(streakText);
          
          // Property: At least one streak display should be present
          expect(container.textContent).toContain(`${testProps.currentStreak}`);
          
          // Property: Fire emoji should be present for streak indication
          const fireEmoji = screen.getByRole('img', { name: /streak fire/i });
          expect(fireEmoji).toBeInTheDocument();
        }
      ), { numRuns: 20 });
    });

    it('should always display user menu regardless of gamification setting', () => {
      // Feature: dashboard-modular-learning-system, Property 5: Gamification Visibility
      fc.assert(fc.property(
        dashboardHeaderPropsGenerator(),
        (props: DashboardHeaderProps) => {
          // Clean up before each property test iteration
          cleanup();
          
          render(<DashboardHeader {...props} />);
          
          // Property: User menu should always be present regardless of gamification setting
          // Use a more specific selector to avoid multiple matches
          const userMenuButtons = screen.getAllByRole('button');
          const userMenuButton = userMenuButtons.find(button => 
            button.getAttribute('aria-label')?.includes('Menu utente per')
          );
          expect(userMenuButton).toBeDefined();
          
          // Property: User avatar/initial should always be visible
          const userInitial = props.user.name?.charAt(0).toUpperCase() || props.user.email.charAt(0).toUpperCase();
          const avatarElements = screen.getAllByText(userInitial);
          expect(avatarElements.length).toBeGreaterThan(0);
        }
      ), { numRuns: 20 });
    });
  });
});