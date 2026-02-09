---
feature: [feature-name]
version: 1.0.0
status: draft
created: [YYYY-MM-DD]
last_updated: [YYYY-MM-DD]
---

# Design: [Feature Name]

## Overview

[Brief description of the technical approach and architecture]

---

## Architecture

### System Context

[How this feature fits into the overall system]

```
[Diagram or description of system context]
```

### Component Architecture

[High-level component structure]

```
[Component diagram or description]
```

### Data Flow

[How data flows through the system]

```
[Data flow diagram or description]
```

---

## Application Entry Point

### CRITICAL: Entry Point Chain

**This section is MANDATORY for all UI features**

#### index.html (Project Root)
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>[App Name]</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

#### src/main.tsx (Application Entry)
```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

#### src/App.tsx (Root Component)
```typescript
import { [Component1] } from '@/components/[Component1]';
import { [Component2] } from '@/components/[Component2]';
import { useEffect } from 'react';
import { useStore } from '@/store';

export function App() {
  const [initAction] = useStore(state => state.[initAction]);
  
  // Initialize on mount
  useEffect(() => {
    [initAction]();
  }, [[initAction]]);
  
  return (
    <div className="app">
      <[Component1] />
      <[Component2] />
    </div>
  );
}

export default App;
```

### Component Hierarchy

[What renders what - complete tree]

```
App
├── [Component1]
│   ├── [SubComponent1]
│   └── [SubComponent2]
└── [Component2]
    ├── [SubComponent3]
    └── [SubComponent4]
```

### Initialization Logic

**On Application Mount**:
1. [Action 1]
2. [Action 2]
3. [Action 3]

**On Feature Mount**:
1. [Action 1]
2. [Action 2]

---

## Component Specifications

### Component 1: [ComponentName]

**Purpose**: [What this component does]

**Props**:
```typescript
interface [ComponentName]Props {
  [prop1]: [type]; // [description]
  [prop2]: [type]; // [description]
}
```

**State** (if local state needed):
```typescript
const [state1, setState1] = useState<[type]>([initial]);
```

**Store Integration**:
```typescript
const [action1] = useStore(state => state.[action1]);
const [state1] = useStore(state => state.[state1]);
```

**Rendering**:
```typescript
export function [ComponentName]({ [props] }: [ComponentName]Props) {
  // [Implementation notes]
  
  return (
    <div className="[component-name]">
      {/* [Structure] */}
    </div>
  );
}
```

**Styling**:
- File: `src/components/[ComponentName].css`
- Key classes: `.[component-name]`, `.[component-name]__element`

### Component 2: [ComponentName]

[Repeat structure above]

---

## Data Models

### Type Definitions

```typescript
// src/types/[domain].ts

export interface [Type1] {
  [field1]: [type]; // [description]
  [field2]: [type]; // [description]
}

export interface [Type2] {
  [field1]: [type]; // [description]
  [field2]: [type]; // [description]
}

export enum [EnumName] {
  [VALUE1] = '[value1]',
  [VALUE2] = '[value2]',
}
```

### Zod Schemas

```typescript
// src/schemas/[domain]-schema.ts

import { z } from 'zod';

export const [Type1]Schema = z.object({
  [field1]: z.[type](),
  [field2]: z.[type](),
});

export const [Type2]Schema = z.object({
  [field1]: z.[type](),
  [field2]: z.[type](),
});

// Infer types from schemas
export type [Type1] = z.infer<typeof [Type1]Schema>;
export type [Type2] = z.infer<typeof [Type2]Schema>;
```

---

## State Management

### Zustand Store

```typescript
// src/store/index.ts

import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

interface AppState {
  // State
  [state1]: [type] | null;
  [state2]: [type][];
  
  // Actions
  [action1]: ([params]) => void;
  [action2]: ([params]) => Promise<void>;
}

export const useStore = create<AppState>()(
  immer((set, get) => ({
    // Initial state
    [state1]: null,
    [state2]: [],
    
    // Actions
    [action1]: ([params]) => {
      set((draft) => {
        // Modify state
      });
      
      // Persist if needed
      const current = get().[state1];
      if (current) {
        persistenceAdapter.[saveMethod](current);
      }
    },
    
    [action2]: async ([params]) => {
      // Load from persistence
      const data = await persistenceAdapter.[loadMethod]();
      
      set({ [state1]: data });
    },
  }))
);
```

### State-to-Component Mapping

| Component | State Used | Actions Used |
|-----------|------------|--------------|
| [Component1] | [state1], [state2] | [action1] |
| [Component2] | [state1] | [action2] |

---

## Persistence Strategy

### IndexedDB Schema

```typescript
// src/persistence/schema.ts

export const DB_NAME = '[db-name]';
export const DB_VERSION = 1;

export const STORES = {
  [STORE1]: '[store1-name]',
  [STORE2]: '[store2-name]',
};

export interface [Store1Data] {
  id: string;
  [field1]: [type];
  [field2]: [type];
}
```

### Persistence Adapter

```typescript
// src/persistence/indexeddb-adapter.ts

export class IndexedDBAdapter {
  private db: IDBDatabase | null = null;
  
  async init(): Promise<void> {
    // Initialize database
  }
  
  async [saveMethod](data: [Type]): Promise<void> {
    // Save to IndexedDB
  }
  
  async [loadMethod](): Promise<[Type] | null> {
    // Load from IndexedDB
  }
}

export const persistenceAdapter = new IndexedDBAdapter();
```

### Persistence Integration Points

**When to persist**:
- After [action1] (state change)
- After [action2] (state change)

**When to load**:
- On application mount
- On [specific event]

**Error handling**:
- Private browsing mode: [fallback strategy]
- Corrupted data: [recovery strategy]
- Storage full: [cleanup strategy]

---

## Integration Points

### Third-Party Libraries

**[Library1]** (e.g., ReactFlow):
- Purpose: [What it's used for]
- Integration: [How it connects to our code]
- Configuration: [Key settings]

```typescript
// Example integration
import { [Component] } from '[library]';
import '[library]/dist/style.css';

export function [OurComponent]() {
  const [storeState] = useStore(state => state.[storeState]);
  
  // Convert our state to library format
  const [libraryData] = useMemo(() => {
    return [storeState].map([conversion]);
  }, [[storeState]]);
  
  return (
    <[Component]
      [prop]={[libraryData]}
      [callback]={[handler]}
    />
  );
}
```

### State Management Wiring

**Component → Store**:
```typescript
// In component
import { useStore } from '@/store';

const [action] = useStore(state => state.[action]);
const [data] = useStore(state => state.[data]);
```

**Store → Persistence**:
```typescript
// In store action
import { persistenceAdapter } from '@/persistence';

[action]: ([params]) => {
  set((draft) => {
    // Modify state
  });
  
  // Persist
  const current = get().[state];
  if (current) {
    persistenceAdapter.[saveMethod](current);
  }
}
```

---

## Correctness Properties

### Property 1: [Property Name]

**Type**: [Invariant/Round-trip/Idempotent/Metamorphic/Boundary]

**Description**: [What must always be true]

**Validates**: Requirements [X.Y]

**Test Strategy**:
```typescript
// Feature: [feature-name], Property 1: [Property Name]
// Validates: Requirements [X.Y] - [Description]
test.prop([[generators]], { numRuns: 100 })(
  'Property 1: [Property Name]',
  ([inputs]) => {
    // Test implementation
  }
);
```

### Property 2: [Property Name]

[Repeat structure above]

---

## Performance Targets

### Response Time
- [Action 1]: < [X]ms
- [Action 2]: < [X]ms

### Throughput
- [Operation]: [X] per second
- [Operation]: [X] per second

### Resource Usage
- Memory: < [X]MB
- CPU: < [X]%
- Storage: < [X]MB

### Scalability Limits
- Max [entities]: [X]
- Max [operations]: [X]
- Max [concurrent users]: [X]

### Performance Testing Strategy
- Load testing: [approach]
- Stress testing: [approach]
- Profiling: [tools and methods]

---

## Security Considerations

### Input Validation
- All user input validated with Zod schemas
- Sanitization: [approach]
- Injection prevention: [approach]

### Data Privacy
- PII handling: [approach]
- Data encryption: [if applicable]
- Access control: [approach]

### Authentication/Authorization
- [If applicable]

### Vulnerability Assessment
- Known risks: [list]
- Mitigation strategies: [list]

---

## Browser Compatibility

### Supported Browsers
- Chrome/Edge: [version]+
- Firefox: [version]+
- Safari: [version]+

### Browser-Specific Handling

**IndexedDB Private Browsing**:
```typescript
// Detect and handle gracefully
async init(): Promise<void> {
  try {
    const testDB = indexedDB.open('__test__');
    testDB.onerror = () => {
      this.isAvailable = false;
      // Fallback to in-memory mode
    };
  } catch (error) {
    // Handle error
  }
}
```

**Web Audio API**:
```typescript
// Initialize on user gesture
<button onClick={async () => {
  await audioEngine.init(); // First user interaction
}}>
  Start Audio
</button>
```

### Graceful Degradation
- Private browsing: [fallback behavior]
- Unsupported features: [fallback behavior]

---

## Error Handling

### Error Boundaries
```typescript
// src/components/ErrorBoundary.tsx
export class ErrorBoundary extends React.Component {
  // Implementation
}
```

### Error States
- Loading errors: [UI state]
- Validation errors: [UI state]
- Persistence errors: [UI state]

### User-Facing Error Messages
- [Error type]: "[User-friendly message]"
- [Error type]: "[User-friendly message]"

---

## Testing Strategy

### Property-Based Tests
- [Property 1]: [Test approach]
- [Property 2]: [Test approach]

### Unit Tests
- [Component 1]: [Test cases]
- [Store action 1]: [Test cases]

### Integration Tests
- [Flow 1]: [Test approach]
- [Flow 2]: [Test approach]

### Browser Validation
- Manual testing protocol: [checklist]
- Cross-browser testing: [approach]

---

## Deployment Considerations

### Build Configuration
- [Configuration details]

### Environment Variables
- [Variable 1]: [Purpose]
- [Variable 2]: [Purpose]

### Migration Strategy
- [If applicable]

---

## Monitoring and Observability

### Metrics to Track
- [Metric 1]: [How measured]
- [Metric 2]: [How measured]

### Logging
- [What to log]
- [Log levels]

### Alerting
- [Alert 1]: [Threshold and action]
- [Alert 2]: [Threshold and action]

---

## Future Considerations

### Potential Enhancements
- [Enhancement 1]
- [Enhancement 2]

### Technical Debt
- [Known debt 1]
- [Known debt 2]

### Scalability Path
- [How to scale beyond current limits]

---

## Approval

### Technical Sign-off

- [ ] **Engineering Lead**: [Name] - [Date]
  - Architecture validated
  - Performance targets achievable
  - Security measures adequate

- [ ] **System Architect**: [Name] - [Date] (if applicable)
  - System integration validated
  - Scalability confirmed

- [ ] **UX Designer**: [Name] - [Date]
  - Component hierarchy validated
  - User flows confirmed

---

## Notes

[Any additional notes, context, or considerations]

---

## Changelog

### [1.0.0] - [YYYY-MM-DD]
- Initial design document created
