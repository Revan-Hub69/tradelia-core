# Tradelia 2026 - Modular Architecture

## Overview

L'architettura modulare di Tradelia 2026 segue i principi di **Feature-Sliced Design** con layer separation rigorosa per garantire scalabilità, manutenibilità e testabilità enterprise.

## Layer Architecture

```
src/
├── shared/     # Utilities, configurations, UI primitives
├── entities/   # Business domain entities  
├── features/   # Feature-specific logic
├── widgets/    # Composite UI components
├── processes/  # Business process orchestration
└── server/     # Server-side logic
```

## Layer Rules & Dependencies

### 1. Shared Layer (`src/shared/`)
- **Purpose**: Utilities, configurations, UI primitives
- **Can import**: Nothing (lowest layer)
- **Can be imported by**: All other layers
- **Contains**: Constants, formatters, validation, theme provider, base UI components

### 2. Entities Layer (`src/entities/`)
- **Purpose**: Business domain entities and types
- **Can import**: `shared/`
- **Can be imported by**: `features/`, `widgets/`, `processes/`
- **Contains**: User, Card, Navigation types and basic services

### 3. Features Layer (`src/features/`)
- **Purpose**: Feature-specific business logic
- **Can import**: `shared/`, `entities/`
- **Can be imported by**: `widgets/`, `processes/`
- **Contains**: Sidebar state, locale switcher, widget reordering, command palette

### 4. Widgets Layer (`src/widgets/`)
- **Purpose**: Composite UI components
- **Can import**: `shared/`, `entities/`, `features/`
- **Can be imported by**: `processes/`, app pages
- **Contains**: Dashboard shell, grid, header, sidebar, card grid widgets

### 5. Processes Layer (`src/processes/`)
- **Purpose**: Business process orchestration
- **Can import**: `shared/`, `entities/`, `features/`, `widgets/`
- **Can be imported by**: App pages, API routes
- **Contains**: Authentication, dashboard init, data sync, onboarding flows

### 6. Server Layer (`src/server/`)
- **Purpose**: Server-side logic
- **Can import**: `shared/`, `entities/` (types only)
- **Cannot import**: Client-side code, translations, React components
- **Contains**: API handlers, database services, external service integrations

## Import Boundaries Enforcement

ESLint rules enforce these boundaries automatically:

```javascript
// ❌ FORBIDDEN - Shared cannot import from upper layers
import { User } from '../entities/user/types'; // in shared/

// ❌ FORBIDDEN - Entities cannot import features
import { useSidebarStore } from '../features/sidebar-state/store'; // in entities/

// ❌ FORBIDDEN - Server cannot import client translations
import { useTranslations } from 'next-intl'; // in server/

// ✅ ALLOWED - Features can import entities and shared
import { User } from '../../entities/user/types'; // in features/
import { TRADELIA_CONSTANTS } from '../../shared/lib/constants'; // in features/
```

## Barrel Exports

Each layer provides a main `index.ts` barrel export:

```typescript
// Import from layer root
import { User, Card } from '@/entities';
import { useSidebarStore } from '@/features';
import { DashboardShell } from '@/widgets';
import { AuthenticationFlow } from '@/processes';
```

## Path Aliases

Configured in `tsconfig.json`:

```json
{
  "paths": {
    "@/shared/*": ["./src/shared/*"],
    "@/entities/*": ["./src/entities/*"],
    "@/features/*": ["./src/features/*"],
    "@/widgets/*": ["./src/widgets/*"],
    "@/processes/*": ["./src/processes/*"],
    "@/server/*": ["./src/server/*"]
  }
}
```

## Quality Assurance

### ESLint Boundaries
- Import restrictions enforced automatically
- Circular dependency detection
- Layer violation prevention

### TypeScript Strict Mode
- All layers use strict TypeScript
- Type-only imports where appropriate
- Proper type exports in barrel files

### Testing Strategy
- Unit tests per layer
- Integration tests for cross-layer interactions
- Architecture tests to verify boundaries

## Best Practices

### 1. Layer Separation
- Keep layers focused on their specific purpose
- Avoid mixing concerns across layers
- Use dependency injection for cross-layer communication

### 2. Type Safety
- Export types from appropriate layers
- Use type-only imports when possible
- Maintain strict TypeScript configuration

### 3. Barrel Exports
- Always use barrel exports for public APIs
- Keep internal implementation details private
- Document exported interfaces clearly

### 4. Server-Side Code
- Server layer must not import client code
- Use type-only imports for shared types
- Maintain clear API boundaries

## Migration Guide

When adding new functionality:

1. **Identify the appropriate layer** based on the functionality's purpose
2. **Create types first** in the entities layer if needed
3. **Implement business logic** in the features layer
4. **Create UI components** in the widgets layer if needed
5. **Orchestrate complex flows** in the processes layer
6. **Add server logic** in the server layer for API/database operations

## Monitoring & Validation

The architecture is validated through:

- **ESLint rules**: Prevent boundary violations
- **TypeScript compiler**: Ensure type safety
- **Bundle analysis**: Monitor layer dependencies
- **CI/CD checks**: Automated architecture validation

This modular architecture ensures Tradelia 2026 remains maintainable and scalable as it grows, following enterprise-grade patterns used by companies like Google, Apple, and Microsoft.