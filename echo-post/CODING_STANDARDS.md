# Coding Standards & File Naming Conventions

## File Naming Convention

### Components
- **React Components**: PascalCase with descriptive names
  - `PostCard.tsx`, `UserProfile.tsx`, `CommentModal.tsx`
- **Component folders**: kebab-case for grouping
  - `src/components/posts/`, `src/components/modals/`

### Pages
- **Next.js pages**: kebab-case following Next.js conventions
  - `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`
- **Dynamic routes**: Use brackets `[id]`, `[slug]`

### Utilities & Hooks
- **Utilities**: camelCase with descriptive names
  - `api.ts`, `posts.ts`, `constants.ts`
- **Hooks**: camelCase starting with "use"
  - `useAuth.ts`, `usePostActions.ts`, `usePosts.ts`

### Types
- **Type files**: camelCase or descriptive names
  - `index.ts` (for main types), `api.ts`, `user.ts`

## Directory Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (api)/             # API routes
│   ├── (website)/         # Public pages
│   └── dashboard/         # Protected pages
├── components/            # React components
│   ├── ui/               # Generic UI components
│   ├── posts/            # Post-related components
│   ├── modals/           # Modal components
│   └── forms/            # Form components
├── hooks/                # Custom React hooks
├── lib/                  # External library configurations
├── types/                # TypeScript type definitions
├── utils/                # Utility functions
└── context/              # React contexts
```

## Component Structure

### Component File Template
```tsx
import React from 'react';
import { ComponentProps } from '@/types';

interface ComponentNameProps {
  // Props interface
}

export default function ComponentName({ 
  prop1, 
  prop2 
}: ComponentNameProps) {
  // Component logic
  
  return (
    // JSX
  );
}
```

### Custom Hook Template
```tsx
import { useState, useEffect } from 'react';
import { HookReturnType } from '@/types';

export const useHookName = (params: ParamType) => {
  // Hook logic
  
  return {
    // Return values
  };
};
```

## Import Organization

1. **React imports** first
2. **Third-party libraries**
3. **Internal components** (@ imports)
4. **Relative imports**
5. **Type-only imports** last

```tsx
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

import { useAuth } from '@/context/AuthContext';
import { Post, User } from '@/types';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

import './styles.css';

import type { ComponentProps } from './types';
```

## Naming Conventions

### Variables & Functions
- **camelCase** for variables and functions
- **Descriptive names** over short names
- **Boolean variables** start with `is`, `has`, `can`, `should`

```tsx
const isLoading = true;
const hasPermission = false;
const canEdit = user?.id === post.authorId;
const shouldShowModal = isOpen && !isLoading;

const handleSubmit = () => {};
const fetchUserData = async () => {};
```

### Constants
- **SCREAMING_SNAKE_CASE** for constants
- **PascalCase** for enum-like objects

```tsx
const MAX_RETRY_ATTEMPTS = 3;
const API_BASE_URL = 'https://api.example.com';

const PostStatus = {
  DRAFT: 'DRAFT',
  PUBLISHED: 'PUBLISHED',
} as const;
```

### Types & Interfaces
- **PascalCase** for interfaces and types
- **Descriptive names** with context

```tsx
interface User {
  id: string;
  name: string;
}

type PostStatus = 'DRAFT' | 'PUBLISHED';
type ApiResponse<T> = {
  data: T;
  success: boolean;
};
```

## Best Practices

### Component Organization
1. **Single Responsibility**: One component per file
2. **Small Components**: Break large components into smaller ones
3. **Reusable Components**: Extract common UI patterns
4. **Props Interface**: Always define props interface

### State Management
1. **Local State**: Use `useState` for component-specific state
2. **Shared State**: Use Context or custom hooks
3. **Server State**: Use data fetching hooks (React Query, SWR)

### Error Handling
1. **Consistent Error Messages**: Use standardized error handling
2. **User-Friendly Messages**: Show helpful error messages
3. **Fallback UI**: Provide error boundaries and fallback states

### Performance
1. **Lazy Loading**: Use dynamic imports for large components
2. **Memoization**: Use `useMemo` and `useCallback` appropriately
3. **Code Splitting**: Split code at route level