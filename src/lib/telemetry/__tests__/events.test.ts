import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  identify,
  reset,
  startTiming,
  TELEMETRY_EVENTS,
  type TelemetryEvent,
  track,
  trackError,
  trackTiming,
} from '../events';

describe('Telemetry Events', () => {
  let consoleDebugSpy: ReturnType<typeof vi.spyOn>;
  let originalNodeEnv: string | undefined;

  const setNodeEnv = (value: string | undefined) => {
    Object.defineProperty(process.env, 'NODE_ENV', {
      value,
      configurable: true,
    });
  };

  beforeEach(() => {
    consoleDebugSpy = vi.spyOn(console, 'debug').mockImplementation(() => {});
    originalNodeEnv = process.env.NODE_ENV;
  });

  afterEach(() => {
    consoleDebugSpy.mockRestore();
    setNodeEnv(originalNodeEnv);
  });

  describe('TELEMETRY_EVENTS', () => {
    it('should have all required event categories', () => {
      expect(TELEMETRY_EVENTS).toHaveProperty('SETTINGS_SAVED');
      expect(TELEMETRY_EVENTS).toHaveProperty('LONG_PRESS_TRIGGERED');
      expect(TELEMETRY_EVENTS).toHaveProperty('CONTEXT_MENU_OPENED');
      expect(TELEMETRY_EVENTS).toHaveProperty('THEME_CHANGED');
      expect(TELEMETRY_EVENTS).toHaveProperty('LANGUAGE_CHANGED');
      expect(TELEMETRY_EVENTS).toHaveProperty('POLICY_LOCK_ENFORCED');
    });

    it('should have consistent naming convention', () => {
      const events = Object.values(TELEMETRY_EVENTS);

      for (const event of events) {
        // All events should follow category.action format
        expect(event).toMatch(/^[a-z0-9_]+\.[a-z0-9_]+$/);
      }
    });

    it('should have unique event names', () => {
      const events = Object.values(TELEMETRY_EVENTS);
      const uniqueEvents = new Set(events);

      expect(uniqueEvents.size).toBe(events.length);
    });
  });

  describe('track()', () => {
    it('should be a no-op in production', () => {
      setNodeEnv('production');

      track(TELEMETRY_EVENTS.SETTINGS_SAVED, { test: 'data' });

      expect(consoleDebugSpy).not.toHaveBeenCalled();
    });

    it('should log in development', () => {
      setNodeEnv('development');

      track(TELEMETRY_EVENTS.SETTINGS_SAVED, { test: 'data' });

      expect(consoleDebugSpy).toHaveBeenCalledWith(
        '[Telemetry]',
        TELEMETRY_EVENTS.SETTINGS_SAVED,
        { test: 'data' },
      );
    });

    it('should work without payload', () => {
      setNodeEnv('development');

      track(TELEMETRY_EVENTS.SETTINGS_SAVED);

      expect(consoleDebugSpy).toHaveBeenCalledWith(
        '[Telemetry]',
        TELEMETRY_EVENTS.SETTINGS_SAVED,
        undefined,
      );
    });

    it('should accept any event from TELEMETRY_EVENTS', () => {
      setNodeEnv('development');

      const events: TelemetryEvent[] = [
        TELEMETRY_EVENTS.SETTINGS_SAVED,
        TELEMETRY_EVENTS.LONG_PRESS_TRIGGERED,
        TELEMETRY_EVENTS.CONTEXT_MENU_OPENED,
      ];

      for (const event of events) {
        track(event);
      }

      expect(consoleDebugSpy).toHaveBeenCalledTimes(events.length);
    });
  });

  describe('trackTiming()', () => {
    it('should track timing with duration', () => {
      setNodeEnv('development');

      trackTiming(TELEMETRY_EVENTS.SETTINGS_SYNC_DURATION, 150);

      expect(consoleDebugSpy).toHaveBeenCalledWith(
        '[Telemetry]',
        TELEMETRY_EVENTS.SETTINGS_SYNC_DURATION,
        { duration: 150, durationMs: 150 },
      );
    });

    it('should merge additional payload', () => {
      setNodeEnv('development');

      trackTiming(TELEMETRY_EVENTS.SETTINGS_SYNC_DURATION, 150, {
        retryCount: 2,
        success: true,
      });

      expect(consoleDebugSpy).toHaveBeenCalledWith(
        '[Telemetry]',
        TELEMETRY_EVENTS.SETTINGS_SYNC_DURATION,
        {
          retryCount: 2,
          success: true,
          duration: 150,
          durationMs: 150,
        },
      );
    });
  });

  describe('trackError()', () => {
    it('should track error with Error object', () => {
      setNodeEnv('development');

      const error = new Error('Test error');
      trackError(TELEMETRY_EVENTS.SETTINGS_SAVE_FAILED, error);

      expect(consoleDebugSpy).toHaveBeenCalledWith(
        '[Telemetry]',
        TELEMETRY_EVENTS.SETTINGS_SAVE_FAILED,
        expect.objectContaining({
          error: 'Test error',
          errorStack: expect.any(String),
        }),
      );
    });

    it('should track error with string message', () => {
      setNodeEnv('development');

      trackError(TELEMETRY_EVENTS.SETTINGS_SAVE_FAILED, 'Custom error message');

      expect(consoleDebugSpy).toHaveBeenCalledWith(
        '[Telemetry]',
        TELEMETRY_EVENTS.SETTINGS_SAVE_FAILED,
        {
          error: 'Custom error message',
          errorStack: undefined,
        },
      );
    });

    it('should merge additional payload', () => {
      setNodeEnv('development');

      const error = new Error('Test error');
      trackError(TELEMETRY_EVENTS.SETTINGS_SAVE_FAILED, error, {
        retryCount: 3,
        userId: '123',
      });

      expect(consoleDebugSpy).toHaveBeenCalledWith(
        '[Telemetry]',
        TELEMETRY_EVENTS.SETTINGS_SAVE_FAILED,
        expect.objectContaining({
          error: 'Test error',
          errorStack: expect.any(String),
          retryCount: 3,
          userId: '123',
        }),
      );
    });
  });

  describe('startTiming()', () => {
    it('should track duration when end function is called', () => {
      setNodeEnv('development');

      const endTiming = startTiming(TELEMETRY_EVENTS.SETTINGS_SYNC_DURATION);

      // Simulate some work
      const start = Date.now();
      while (Date.now() - start < 10) {
        // Wait ~10ms
      }

      endTiming();

      expect(consoleDebugSpy).toHaveBeenCalledWith(
        '[Telemetry]',
        TELEMETRY_EVENTS.SETTINGS_SYNC_DURATION,
        expect.objectContaining({
          duration: expect.any(Number),
          durationMs: expect.any(Number),
        }),
      );

      const call = consoleDebugSpy.mock.calls[0];
      if (!call) {
        throw new Error('Expected telemetry timing log call.');
      }
      const payload = call[2] as { duration: number };

      expect(payload.duration).toBeGreaterThanOrEqual(10);
    });

    it('should merge additional payload', () => {
      setNodeEnv('development');

      const endTiming = startTiming(TELEMETRY_EVENTS.SETTINGS_SYNC_DURATION, {
        operation: 'save',
      });

      endTiming();

      expect(consoleDebugSpy).toHaveBeenCalledWith(
        '[Telemetry]',
        TELEMETRY_EVENTS.SETTINGS_SYNC_DURATION,
        expect.objectContaining({
          operation: 'save',
          duration: expect.any(Number),
          durationMs: expect.any(Number),
        }),
      );
    });
  });

  describe('identify()', () => {
    it('should be a no-op in production', () => {
      setNodeEnv('production');

      identify('user-123', { email: 'test@example.com' });

      expect(consoleDebugSpy).not.toHaveBeenCalled();
    });

    it('should log in development', () => {
      setNodeEnv('development');

      identify('user-123', { email: 'test@example.com' });

      expect(consoleDebugSpy).toHaveBeenCalledWith(
        '[Telemetry] Identify:',
        'user-123',
        { email: 'test@example.com' },
      );
    });

    it('should work without traits', () => {
      setNodeEnv('development');

      identify('user-123');

      expect(consoleDebugSpy).toHaveBeenCalledWith(
        '[Telemetry] Identify:',
        'user-123',
        undefined,
      );
    });
  });

  describe('reset()', () => {
    it('should be a no-op in production', () => {
      setNodeEnv('production');

      reset();

      expect(consoleDebugSpy).not.toHaveBeenCalled();
    });

    it('should log in development', () => {
      setNodeEnv('development');

      reset();

      expect(consoleDebugSpy).toHaveBeenCalledWith('[Telemetry] Reset');
    });
  });

  describe('Integration', () => {
    it('should support typical usage patterns', () => {
      setNodeEnv('development');

      // Track a simple event
      track(TELEMETRY_EVENTS.SETTINGS_LOADED);

      // Track with timing
      const endTiming = startTiming(TELEMETRY_EVENTS.SETTINGS_SYNC_DURATION);
      // ... do work ...
      endTiming();

      // Track an error
      try {
        throw new Error('Test error');
      } catch (error) {
        trackError(TELEMETRY_EVENTS.SETTINGS_SAVE_FAILED, error as Error);
      }

      // Identify user
      identify('user-123', { plan: 'pro' });

      expect(consoleDebugSpy).toHaveBeenCalledTimes(4);
    });
  });
});
