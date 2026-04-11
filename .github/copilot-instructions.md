# React 19 Microfrontend Architecture - Copilot Instructions

## Project Overview

This project implements a modern microfrontend architecture using React 19 with Module Federation. Each microfrontend operates as an independent, self-contained application that can be developed, tested, and deployed separately while seamlessly integrating into a host application.

## Tech Stack

### Core Technologies

- **React 19**: Latest React version with improved performance and new features
- **TypeScript 5.x**: For type safety and better developer experience
- **Vite/Rspack**: Modern build tool for fast development and optimized production builds
- **Module Federation**: For runtime microfrontend integration

### State Management

- **Redux Toolkit (RTK)**: Primary state management solution
- **RTK Query**: For API calls and server state management
- **Zustand**: Lightweight alternative for local/shared state when needed

### Styling

- **Tailwind CSS**: Utility-first CSS framework
- **CSS Modules**: For component-scoped styles when needed
- **shadcn/ui**: Pre-built accessible UI components

### Routing

- **React Router v6**: For client-side routing within each microfrontend
- **Shared routing context**: For cross-microfrontend navigation

### Code Quality & Testing

- **ESLint**: Code linting with React 19 rules
- **Prettier**: Code formatting
- **Vitest**: Unit testing framework
- **React Testing Library**: Component testing
- **Playwright**: E2E testing
- **Husky**: Git hooks for pre-commit checks

### Additional Tools

- **TanStack Query (React Query)**: Alternative/complement to RTK Query
- **React Hook Form**: Form management
- **Zod**: Schema validation
- **Axios**: HTTP client
- **Day.js**: Date manipulation

## Architecture Principles

### 1. Microfrontend Structure

```
microfrontend-architecture/
├── packages/
│   ├── host/                    # Container/Shell application
│   ├── mfe-header/             # Header microfrontend
│   ├── mfe-dashboard/          # Dashboard microfrontend
│   ├── mfe-products/           # Products microfrontend
│   ├── mfe-users/              # Users microfrontend
│   └── shared/                 # Shared utilities and components
│       ├── ui-components/      # Common UI components
│       ├── utils/              # Shared utilities
│       ├── types/              # Shared TypeScript types
│       └── state/              # Shared state/stores
├── .github/
└── package.json                # Root package.json for monorepo
```

### 2. Module Federation Configuration

Each microfrontend should:

- **Expose**: Components/modules that other apps can consume
- **Share**: Dependencies like React, React-DOM, Redux to avoid duplication
- **Define remotes**: Reference other microfrontends

Example Vite/Rspack Module Federation config:

```typescript
// vite.config.ts or rspack.config.ts
federation({
  name: "mfe_dashboard",
  filename: "remoteEntry.js",
  exposes: {
    "./Dashboard": "./src/Dashboard",
    "./DashboardRoutes": "./src/routes",
  },
  shared: {
    react: { singleton: true, requiredVersion: "^19.0.0" },
    "react-dom": { singleton: true, requiredVersion: "^19.0.0" },
    "react-router-dom": { singleton: true },
    redux: { singleton: true },
    "@reduxjs/toolkit": { singleton: true },
  },
});
```

### 3. Code Organization Within Each Microfrontend

```
mfe-dashboard/
├── src/
│   ├── components/          # Feature-specific components
│   │   ├── ui/             # Local UI components
│   │   └── features/       # Business logic components
│   ├── hooks/              # Custom React hooks
│   ├── store/              # Redux store configuration
│   │   ├── slices/         # Redux Toolkit slices
│   │   └── api/            # RTK Query API definitions
│   ├── services/           # API services
│   ├── utils/              # Utility functions
│   ├── types/              # TypeScript type definitions
│   ├── routes/             # Route definitions
│   ├── pages/              # Page components
│   ├── assets/             # Static assets
│   ├── App.tsx             # Root component
│   ├── bootstrap.tsx       # Async bootstrap for Module Federation
│   └── index.tsx           # Entry point
├── public/
├── tests/
├── vite.config.ts          # Vite configuration
├── tailwind.config.js      # Tailwind configuration
├── tsconfig.json           # TypeScript configuration
└── package.json
```

## Coding Standards & Best Practices

### React 19 Specific Guidelines

1. **Use New React 19 Features**
   - Leverage `use()` hook for promises and context
   - Utilize Server Components when applicable
   - Use Actions for form submissions
   - Implement `useOptimistic` for optimistic UI updates
   - Use `useFormStatus` for form state management

2. **Component Patterns**

   ```typescript
   // Prefer arrow function components with TypeScript
   interface DashboardProps {
     userId: string;
     onUpdate?: () => void;
   }

   export const Dashboard: FC<DashboardProps> = ({ userId, onUpdate }) => {
     // Component logic
     return <div>...</div>;
   };
   ```

3. **Use React.memo() Wisely**
   ```typescript
   export const ExpensiveComponent = memo<ComponentProps>(({ data }) => {
     // Only re-renders when data changes
     return <div>{data}</div>;
   }, (prevProps, nextProps) => {
     // Custom comparison if needed
     return prevProps.data.id === nextProps.data.id;
   });
   ```

### State Management Guidelines

1. **Redux Toolkit Slices**

   ```typescript
   // store/slices/userSlice.ts
   import { createSlice, PayloadAction } from "@reduxjs/toolkit";

   interface UserState {
     currentUser: User | null;
     isAuthenticated: boolean;
   }

   const initialState: UserState = {
     currentUser: null,
     isAuthenticated: false,
   };

   export const userSlice = createSlice({
     name: "user",
     initialState,
     reducers: {
       setUser: (state, action: PayloadAction<User>) => {
         state.currentUser = action.payload;
         state.isAuthenticated = true;
       },
       clearUser: (state) => {
         state.currentUser = null;
         state.isAuthenticated = false;
       },
     },
   });

   export const { setUser, clearUser } = userSlice.actions;
   export default userSlice.reducer;
   ```

2. **RTK Query API**

   ```typescript
   // store/api/productsApi.ts
   import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

   export const productsApi = createApi({
     reducerPath: "productsApi",
     baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
     tagTypes: ["Product"],
     endpoints: (builder) => ({
       getProducts: builder.query<Product[], void>({
         query: () => "products",
         providesTags: ["Product"],
       }),
       addProduct: builder.mutation<Product, Partial<Product>>({
         query: (body) => ({
           url: "products",
           method: "POST",
           body,
         }),
         invalidatesTags: ["Product"],
       }),
     }),
   });

   export const { useGetProductsQuery, useAddProductMutation } = productsApi;
   ```

### Tailwind CSS Guidelines

1. **Use Tailwind Utilities First**

   ```tsx
   // Good
   <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
     Click Me
   </button>

   // Use @apply only for repeated patterns
   // In CSS file:
   .btn-primary {
     @apply px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors;
   }
   ```

2. **Theme Configuration**

   ```javascript
   // tailwind.config.js
   export default {
     content: ["./src/**/*.{js,jsx,ts,tsx}"],
     theme: {
       extend: {
         colors: {
           primary: {
             50: "#eff6ff",
             500: "#3b82f6",
             900: "#1e3a8a",
           },
         },
       },
     },
     plugins: [],
   };
   ```

3. **Responsive Design**
   ```tsx
   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
     {/* Content */}
   </div>
   ```

### TypeScript Best Practices

1. **Strict Type Safety**

   ```typescript
   // tsconfig.json
   {
     "compilerOptions": {
       "strict": true,
       "noUncheckedIndexedAccess": true,
       "noImplicitAny": true,
       "strictNullChecks": true
     }
   }
   ```

2. **Type Definitions**

   ```typescript
   // types/index.ts
   export interface User {
     id: string;
     name: string;
     email: string;
     role: "admin" | "user" | "guest";
   }

   export type ApiResponse<T> = {
     data: T;
     status: number;
     message?: string;
   };
   ```

3. **Generic Components**

   ```typescript
   interface ListProps<T> {
     items: T[];
     renderItem: (item: T) => ReactNode;
     keyExtractor: (item: T) => string;
   }

   export function List<T>({ items, renderItem, keyExtractor }: ListProps<T>) {
     return (
       <ul>
         {items.map((item) => (
           <li key={keyExtractor(item)}>{renderItem(item)}</li>
         ))}
       </ul>
     );
   }
   ```

### Microfrontend Communication

1. **Shared State via Redux**

   ```typescript
   // In host app - expose store
   export const store = configureStore({
     reducer: {
       shared: sharedReducer,
     },
   });

   // In microfrontend - consume store
   import { store } from "host/store";
   ```

2. **Custom Events for Loose Coupling**

   ```typescript
   // Emit event from one microfrontend
   window.dispatchEvent(
     new CustomEvent("user-updated", { detail: { userId: "123" } }),
   );

   // Listen in another microfrontend
   useEffect(() => {
     const handleUserUpdate = (e: CustomEvent) => {
       console.log("User updated:", e.detail);
     };
     window.addEventListener("user-updated", handleUserUpdate);
     return () => window.removeEventListener("user-updated", handleUserUpdate);
   }, []);
   ```

3. **Shared Hook Pattern**

   ```typescript
   // packages/shared/hooks/useSharedAuth.ts
   export const useSharedAuth = () => {
     const dispatch = useDispatch();
     const user = useSelector((state) => state.auth.user);

     const login = useCallback(
       async (credentials) => {
         const result = await authService.login(credentials);
         dispatch(setUser(result));
       },
       [dispatch],
     );

     return { user, login };
   };
   ```

### Performance Optimization

1. **Code Splitting**

   ```typescript
   // Lazy load routes
   const Dashboard = lazy(() => import('./pages/Dashboard'));

   <Suspense fallback={<LoadingSpinner />}>
     <Routes>
       <Route path="/dashboard" element={<Dashboard />} />
     </Routes>
   </Suspense>
   ```

2. **Memoization**

   ```typescript
   // Memoize expensive calculations
   const expensiveValue = useMemo(() => {
     return computeExpensiveValue(data);
   }, [data]);

   // Memoize callbacks
   const handleClick = useCallback(() => {
     doSomething(id);
   }, [id]);
   ```

3. **Bundle Size Optimization**
   - Use dynamic imports for large dependencies
   - Configure Module Federation to share common dependencies
   - Use appropriate chunk splitting strategies

### Error Handling

1. **Error Boundaries**

   ```typescript
   // components/ErrorBoundary.tsx
   export class ErrorBoundary extends Component<Props, State> {
     state = { hasError: false };

     static getDerivedStateFromError(error: Error) {
       return { hasError: true };
     }

     componentDidCatch(error: Error, errorInfo: ErrorInfo) {
       console.error('Error:', error, errorInfo);
       // Log to error reporting service
     }

     render() {
       if (this.state.hasError) {
         return <ErrorFallback />;
       }
       return this.props.children;
     }
   }
   ```

2. **API Error Handling**

   ```typescript
   const { data, error, isLoading } = useGetProductsQuery();

   if (isLoading) return <LoadingSpinner />;
   if (error) return <ErrorMessage error={error} />;
   return <ProductList products={data} />;
   ```

### Testing Standards

1. **Component Tests**

   ```typescript
   import { render, screen } from '@testing-library/react';
   import { Dashboard } from './Dashboard';

   describe('Dashboard', () => {
     it('renders user name', () => {
       render(<Dashboard user={{ name: 'John' }} />);
       expect(screen.getByText('John')).toBeInTheDocument();
     });
   });
   ```

2. **Redux Tests**

   ```typescript
   import { configureStore } from "@reduxjs/toolkit";
   import userReducer, { setUser } from "./userSlice";

   describe("userSlice", () => {
     it("should set user", () => {
       const store = configureStore({ reducer: { user: userReducer } });
       store.dispatch(setUser({ id: "1", name: "John" }));
       expect(store.getState().user.currentUser?.name).toBe("John");
     });
   });
   ```

### Accessibility (a11y)

1. **Semantic HTML**

   ```tsx
   <nav aria-label="Main navigation">
     <ul>
       <li>
         <a href="/dashboard">Dashboard</a>
       </li>
     </ul>
   </nav>
   ```

2. **ARIA Attributes**

   ```tsx
   <button
     aria-label="Close dialog"
     aria-pressed={isPressed}
     onClick={handleClose}
   >
     <CloseIcon />
   </button>
   ```

3. **Keyboard Navigation**
   - Ensure all interactive elements are keyboard accessible
   - Implement proper focus management
   - Test with screen readers

## File Naming Conventions

- **Components**: PascalCase (`UserProfile.tsx`)
- **Hooks**: camelCase with 'use' prefix (`useAuth.ts`)
- **Utils**: camelCase (`formatDate.ts`)
- **Types**: PascalCase (`User.ts`, `types.ts`)
- **Constants**: UPPER_SNAKE_CASE (`API_ENDPOINTS.ts`)
- **CSS Modules**: Component name + `.module.css` (`UserProfile.module.css`)

## Git Workflow

1. **Branch Naming**
   - `feature/feature-name`
   - `bugfix/bug-description`
   - `hotfix/critical-fix`
   - `refactor/refactor-description`

2. **Commit Messages** (Conventional Commits)

   ```
   feat(dashboard): add user analytics chart
   fix(products): resolve infinite scroll issue
   refactor(shared): extract common button component
   docs(readme): update setup instructions
   test(users): add unit tests for user service
   ```

3. **PR Guidelines**
   - Write descriptive PR titles and descriptions
   - Link related issues
   - Ensure all tests pass
   - Request appropriate reviewers
   - Keep PRs focused and reasonably sized

## Environment Configuration

```typescript
// .env.example
VITE_API_BASE_URL=http://localhost:3000/api
VITE_MFE_DASHBOARD_URL=http://localhost:3001
VITE_MFE_PRODUCTS_URL=http://localhost:3002
VITE_MFE_USERS_URL=http://localhost:3003
```

## Documentation Requirements

1. **Component Documentation**

   ```typescript
   /**
    * UserProfile displays user information and allows editing
    *
    * @param user - The user object to display
    * @param onEdit - Callback when user clicks edit
    * @example
    * <UserProfile user={currentUser} onEdit={handleEdit} />
    */
   export const UserProfile: FC<UserProfileProps> = ({ user, onEdit }) => {
     // ...
   };
   ```

2. **README for Each Microfrontend**
   - Purpose and features
   - Setup instructions
   - Available scripts
   - Exposed modules
   - Dependencies

## Security Best Practices

1. **Environment Variables**
   - Never commit secrets to git
   - Use `.env` files (gitignored)
   - Validate environment variables at runtime

2. **API Security**
   - Implement proper authentication/authorization
   - Use HTTPS in production
   - Sanitize user inputs
   - Implement CSRF protection

3. **Dependency Management**
   - Regular dependency updates
   - Security audit with `npm audit`
   - Use only trusted packages

## Performance Metrics to Monitor

- **First Contentful Paint (FCP)**: < 1.8s
- **Largest Contentful Paint (LCP)**: < 2.5s
- **Time to Interactive (TTI)**: < 3.8s
- **Cumulative Layout Shift (CLS)**: < 0.1
- **Bundle Size**: Keep individual MFE bundles < 200KB (gzipped)

## Progressive Enhancement

- Implement loading states for all async operations
- Provide fallback UI for error states
- Support offline functionality where appropriate
- Implement skeleton screens for better perceived performance

## When to Ask for Clarification

- Uncertain about which microfrontend should own a feature
- Need to introduce a new shared dependency
- Considering breaking changes to exposed modules
- Unsure about state management strategy for a feature
- Need to modify shared types or interfaces

## Continuous Improvement

- Regularly review and update dependencies
- Monitor bundle sizes and performance metrics
- Conduct code reviews focusing on maintainability
- Refactor when patterns emerge across microfrontends
- Update this guide as the project evolves

---

**Note**: This is the initial setup guide. As the project progresses, update this document with learned patterns, common pitfalls, and project-specific conventions.
