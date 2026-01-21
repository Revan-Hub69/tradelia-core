/**
 * Browser API Type Definitions
 * Enterprise-grade TypeScript interfaces for modern browser APIs
 */

// Navigator Memory API
type NavigatorMemory = {
  readonly memory?: {
    readonly jsHeapSizeLimit: number;
    readonly totalJSHeapSize: number;
    readonly usedJSHeapSize: number;
  };
};

// Navigator Battery API
type NavigatorBattery = {
  getBattery: () => Promise<BatteryManager>;
};

type BatteryManager = {
  readonly charging: boolean;
  readonly chargingTime: number;
  readonly dischargingTime: number;
  readonly level: number;
  onchargingchange: ((this: BatteryManager, ev: Event) => any) | null;
  onchargingtimechange: ((this: BatteryManager, ev: Event) => any) | null;
  ondischargingtimechange: ((this: BatteryManager, ev: Event) => any) | null;
  onlevelchange: ((this: BatteryManager, ev: Event) => any) | null;
} & EventTarget;

// Navigator Connection API
type NavigatorConnection = {
  readonly connection?: NetworkInformation;
};

type NetworkInformation = {
  readonly downlink: number;
  readonly downlinkMax: number;
  readonly effectiveType: 'slow-2g' | '2g' | '3g' | '4g';
  readonly rtt: number;
  readonly saveData: boolean;
  readonly type: ConnectionType;
  onchange: ((this: NetworkInformation, ev: Event) => any) | null;
} & EventTarget;

type ConnectionType =
  | 'bluetooth'
  | 'cellular'
  | 'ethernet'
  | 'none'
  | 'wifi'
  | 'wimax'
  | 'other'
  | 'unknown';

// View Transitions API
type DocumentViewTransition = {
  startViewTransition: (callback?: () => void | Promise<void>) => ViewTransition;
};

type ViewTransition = {
  readonly finished: Promise<void>;
  readonly ready: Promise<void>;
  readonly updateCallbackDone: Promise<void>;
  skipTransition: () => void;
};

// CSS Style Extensions for WebKit
type CSSStyleDeclaration = {
  webkitUserSelect?: string;
  webkitTouchCallout?: string;
};

// Google Analytics
declare global {
  interface Window {
    gtag?: (
      command: 'config' | 'event' | 'exception',
      targetId: string,
      config?: {
        description?: string;
        fatal?: boolean;
        [key: string]: any;
      }
    ) => void;
  }

  interface Navigator extends NavigatorMemory, NavigatorBattery, NavigatorConnection {}
  interface Document extends DocumentViewTransition {}
}

export {};
