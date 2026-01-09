import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

// ---- Mocks (keep tests focused on sidebar behaviour) ----
vi.mock('next/navigation', () => ({
  usePathname: () => '/en/dashboard',
  useParams: () => ({ locale: 'en' }),
}))

vi.mock('next-intl', () => ({
  useTranslations:
    () =>
    (key: string) =>
      key,
}))

vi.mock('@/src/processes/dashboard-auth', () => ({
  useDashboardAuth: () => ({
    state: { isGuestMode: true, profile: null },
    actions: { signOut: vi.fn() },
  }),
}))

vi.mock('@/components/Logo', () => ({
  default: () => <div data-testid="logo" />,
}))

vi.mock('@/components/ui/ThemeToggle', () => ({
  ThemeToggle: () => <button type="button">Theme</button>,
}))

vi.mock('@/components/ui/LanguageToggle', () => ({
  LanguageToggle: () => <button type="button">Lang</button>,
}))

vi.mock('@/components/icons/TradeliaIcons', () => {
  const Icon = (props: any) => <svg aria-hidden="true" {...props} />
  return {
    UserIcon: Icon,
    ChartIcon: Icon,
    SettingsIcon: Icon,
    ShieldIcon: Icon,
    BookIcon: Icon,
    LogOutIcon: Icon,
    DiamondIcon: Icon,
  }
})

import { DashboardSidebar } from '../DashboardSidebar'

describe('DashboardSidebar (overlay behaviour)', () => {
  it('does not render when closed', () => {
    render(<DashboardSidebar isOpen={false} onClose={() => {}} />)
    expect(screen.queryByTestId('sidebar-panel')).toBeNull()
    expect(screen.queryByTestId('sidebar-backdrop')).toBeNull()
  })

  it('renders when open and closes via close button', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(<DashboardSidebar isOpen={true} onClose={onClose} />)

    const close = await screen.findByTestId('sidebar-close')
    await user.click(close)
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('closes on click outside (backdrop)', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(<DashboardSidebar isOpen={true} onClose={onClose} />)

    // Radix fires pointer-down-outside when interacting with the overlay.
    const backdrop = await screen.findByTestId('sidebar-backdrop')
    await user.click(backdrop)
    expect(onClose).toHaveBeenCalledTimes(1)
  })
})
