/**
 * Telemetry Events Interface (Stub Implementation)
 *
 * This is a no-op implementation that allows instrumenting events throughout
 * the codebase without implementing actual tracking infrastructure.
 *
 * In development, events are logged to console for debugging.
 * In production, events are silently ignored (no-op).
 *
 * Future: Replace with real tracking service (e.g., PostHog, Mixpanel, etc.)
 *
 * @example
 * ```typescript
 * import { track, TELEMETRY_EVENTS } from '@/lib/telemetry/events';
 *
 * // Track a settings save
 * track(TELEMETRY_EVENTS.SETTINGS_SAVED, {
 *   duration: 150,
 *   settingsChanged: ['appearance.theme', 'appearance.fontSize']
 * });
 * ```
 */

/**
 * Telemetry event names
 *
 * Organized by category for easy discovery and maintenance.
 */
export const TELEMETRY_EVENTS = {
  // Settings events
  SETTINGS_SAVED: 'settings.saved',
  SETTINGS_SAVE_FAILED: 'settings.save_failed',
  SETTINGS_LOADED: 'settings.loaded',
  SETTINGS_LOAD_FAILED: 'settings.load_failed',
  SETTINGS_RESET: 'settings.reset',
  SETTINGS_MIGRATED: 'settings.migrated',
  SETTINGS_MIGRATION_FAILED: 'settings.migration_failed',

  // Interaction events
  LONG_PRESS_TRIGGERED: 'interaction.long_press_triggered',
  LONG_PRESS_CANCELLED: 'interaction.long_press_cancelled',
  LONG_PRESS_MOVEMENT_EXCEEDED: 'interaction.long_press_movement_exceeded',

  // UI events
  CONTEXT_MENU_OPENED: 'ui.context_menu_opened',
  CONTEXT_MENU_CLOSED: 'ui.context_menu_closed',
  CONTEXT_MENU_ACTION: 'ui.context_menu_action',
  TOOLTIP_SHOWN: 'ui.tooltip_shown',
  COACHMARK_SHOWN: 'ui.coachmark_shown',
  COACHMARK_DISMISSED: 'ui.coachmark_dismissed',

  // Theme events
  THEME_CHANGED: 'theme.changed',
  THEME_SCHEDULE_ENABLED: 'theme.schedule_enabled',
  THEME_AUTO_SWITCHED: 'theme.auto_switched',

  // Language events
  LANGUAGE_CHANGED: 'language.changed',
  TRANSLATION_FALLBACK: 'language.translation_fallback',

  // Accessibility events
  MOTION_PREFERENCE_CHANGED: 'a11y.motion_preference_changed',
  CONTRAST_PREFERENCE_CHANGED: 'a11y.contrast_preference_changed',
  FONT_SIZE_CHANGED: 'a11y.font_size_changed',
  DENSITY_CHANGED: 'a11y.density_changed',
  KEYBOARD_SHORTCUT_USED: 'a11y.keyboard_shortcut_used',
  KEYBOARD_SHORTCUT_CONFLICT: 'a11y.keyboard_shortcut_conflict',

  // Policy events
  POLICY_LOCK_ENFORCED: 'policy.lock_enforced',
  POLICY_LOCK_ATTEMPTED: 'policy.lock_attempted',
  POLICY_LOADED: 'policy.loaded',

  // Performance events
  SETTINGS_SYNC_DURATION: 'performance.settings_sync_duration',
  SETTINGS_LOAD_DURATION: 'performance.settings_load_duration',
  LONG_PRESS_TRIGGER_DURATION: 'performance.long_press_trigger_duration',

  // Error events
  ERROR_BOUNDARY_TRIGGERED: 'error.boundary_triggered',
  NETWORK_ERROR: 'error.network',
  VALIDATION_ERROR: 'error.validation',
} as const;

/**
 * Telemetry event type (union of all event names)
 */
export type TelemetryEvent = typeof TELEMETRY_EVENTS[keyof typeof TELEMETRY_EVENTS];

/**
 * Telemetry event payload
 *
 * Generic object that can contain any event-specific data.
 */
export type TelemetryPayload = Record<string, unknown>;

/**
 * Track a telemetry event
 *
 * This is a no-op implementation that logs events in development
 * and silently ignores them in production.
 *
 * @param event - Event name (use TELEMETRY_EVENTS constants)
 * @param payload - Optional event-specific data
 *
 * @example
 * ```typescript
 * track(TELEMETRY_EVENTS.SETTINGS_SAVED, {
 *   duration: 150,
 *   settingsChanged: ['appearance.theme']
 * });
 * ```
 */
export function track(event: TelemetryEvent, payload?: TelemetryPayload): void {
  // No-op in production
  if (process.env.NODE_ENV === 'production') {
    return;
  }

  // Log in development for debugging
  if (process.env.NODE_ENV === 'development') {
    console.debug('[Telemetry]', event, payload);
  }

  // Future: Send to analytics service
  // Example:
  // analytics.track(event, {
  //   ...payload,
  //   timestamp: Date.now(),
  //   userId: getCurrentUserId(),
  //   sessionId: getSessionId(),
  // });
}

/**
 * Track a timing event
 *
 * Convenience function for tracking performance metrics.
 *
 * @param event - Event name (use TELEMETRY_EVENTS constants)
 * @param duration - Duration in milliseconds
 * @param payload - Optional additional data
 *
 * @example
 * ```typescript
 * const start = Date.now();
 * await saveSettings();
 * trackTiming(TELEMETRY_EVENTS.SETTINGS_SYNC_DURATION, Date.now() - start);
 * ```
 */
export function trackTiming(
  event: TelemetryEvent,
  duration: number,
  payload?: TelemetryPayload,
): void {
  track(event, {
    ...payload,
    duration,
    durationMs: duration,
  });
}

/**
 * Track an error event
 *
 * Convenience function for tracking errors with consistent structure.
 *
 * @param event - Event name (use TELEMETRY_EVENTS constants)
 * @param error - Error object or message
 * @param payload - Optional additional data
 *
 * @example
 * ```typescript
 * try {
 *   await saveSettings();
 * } catch (error) {
 *   trackError(TELEMETRY_EVENTS.SETTINGS_SAVE_FAILED, error, {
 *     retryCount: 3
 *   });
 * }
 * ```
 */
export function trackError(
  event: TelemetryEvent,
  error: Error | string,
  payload?: TelemetryPayload,
): void {
  const errorMessage = error instanceof Error ? error.message : error;
  const errorStack = error instanceof Error ? error.stack : undefined;

  track(event, {
    ...payload,
    error: errorMessage,
    errorStack,
  });
}

/**
 * Create a timing tracker
 *
 * Returns a function that tracks the duration when called.
 * Useful for tracking async operations.
 *
 * @param event - Event name (use TELEMETRY_EVENTS constants)
 * @param payload - Optional additional data
 * @returns Function to call when operation completes
 *
 * @example
 * ```typescript
 * const endTiming = startTiming(TELEMETRY_EVENTS.SETTINGS_SYNC_DURATION);
 * await saveSettings();
 * endTiming(); // Tracks duration automatically
 * ```
 */
export function startTiming(
  event: TelemetryEvent,
  payload?: TelemetryPayload,
): () => void {
  const startTime = Date.now();

  return () => {
    const duration = Date.now() - startTime;
    trackTiming(event, duration, payload);
  };
}

/**
 * Identify a user (for future implementation)
 *
 * This is a no-op stub for now.
 *
 * @param userId - User ID
 * @param traits - Optional user traits
 */
export function identify(userId: string, traits?: Record<string, unknown>): void {
  if (process.env.NODE_ENV === 'development') {
    console.debug('[Telemetry] Identify:', userId, traits);
  }

  // Future: Send to analytics service
  // analytics.identify(userId, traits);
}

/**
 * Reset telemetry (for future implementation)
 *
 * This is a no-op stub for now.
 * Useful for clearing user data on logout.
 */
export function reset(): void {
  if (process.env.NODE_ENV === 'development') {
    console.debug('[Telemetry] Reset');
  }

  // Future: Clear analytics data
  // analytics.reset();
}
