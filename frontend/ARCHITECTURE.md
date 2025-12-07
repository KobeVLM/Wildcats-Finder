# Wildcats Finder - Frontend Architecture

## 📁 Folder Structure

```
frontend/
├── public/                 # Static assets
├── src/
│   ├── components/        # Reusable components
│   │   ├── common/       # Shared UI components (ItemCard, Navigation, etc.)
│   │   ├── layout/       # Layout components (Navbar, Footer, etc.)
│   │   └── forms/        # Form components (ReportForm, ClaimDialog, etc.)
│   ├── pages/            # Page components (one per route)
│   │   ├── Home/         # Home page
│   │   ├── Login/        # Login page
│   │   ├── Signup/       # Signup page
│   │   ├── Search/       # Search page
│   │   ├── Profile/      # Profile page
│   │   ├── ReportItem/   # Report item page
│   │   ├── Claims/       # Claims management page
│   │   └── Admin/        # Admin pages
│   ├── services/         # API services and business logic
│   ├── hooks/            # Custom React hooks
│   ├── utils/            # Utility functions
│   ├── theme/            # MUI theme configuration
│   ├── App.js            # Main app component with routing
│   └── index.js          # Entry point
```

## 🎨 Design System

### Color Palette
- **Primary**: `#800020` (Maroon - CIT-U brand color)
- **Secondary**: `#FFD700` (Gold)
- **Error**: `#dc2626` (Red for lost items)
- **Success**: `#16a34a` (Green for found items)

### Typography
- Using MUI default typography with custom theme overrides
- Font family: System fonts for optimal performance

## 🧩 Component Architecture

### Pages (Route Components)
- **Public Routes**: Index, Login, Signup
- **Protected Routes**: Home, Search, Profile, ReportItem, Claims, Admin

### Reusable Components
1. **Navigation** - Top navigation bar with role-based menu
2. **ItemCard** - Display lost/found items
3. **ReportForm** - Form for reporting lost/found items
4. **ClaimDialog** - Modal for claiming items
5. **ProtectedRoute** - HOC for route protection

## 🔄 State Management

### Current Approach: Component State + Props
- Using React's built-in `useState` and `useEffect`
- Props drilling for shared state
- Context API for auth state (future enhancement)

### Future Considerations:
- **Redux Toolkit** or **Zustand** for global state
- **React Query** for server state management

## 🛣️ Routing Structure

```
/ (Index)                    - Landing page
/login                       - Login page
/signup                      - Signup page
/home                        - Main dashboard (Protected)
/search                      - Advanced search (Protected)
/report-item                 - Report lost/found items (Protected)
/claims                      - Manage claims (Protected)
/profile                     - User profile (Protected)
/admin                       - Admin dashboard (Protected, Admin only)
/admin/users                 - User management (Protected, Admin only)
```

## 🔐 Authentication Flow

1. User logs in via `/login`
2. Token stored in localStorage
3. ProtectedRoute checks for valid token
4. Redirect to `/login` if not authenticated
5. Navbar shows user-specific options based on role

## 📦 Key Dependencies

- **react**: ^19.2.0
- **react-router-dom**: ^7.10.0
- **@mui/material**: ^7.3.4
- **@emotion/react**: ^11.14.0
- **@emotion/styled**: ^11.14.1
- **lucide-react**: Icon library
- **sonner**: Toast notifications

## 🎯 Best Practices

### Component Organization
- One component per file
- Use functional components with hooks
- Keep components small and focused
- Extract reusable logic into custom hooks

### File Naming
- Components: PascalCase (e.g., `ItemCard.js`)
- Utilities: camelCase (e.g., `formatDate.js`)
- Pages: PascalCase with folder structure

### Code Style
- Use JSX (not TSX) for React 19 compatibility
- PropTypes for type checking (or migrate to TypeScript later)
- Consistent formatting with Prettier
- ESLint for code quality

## 🚀 Performance Optimization

- Lazy loading for routes
- Image optimization
- Memoization for expensive computations
- Virtual scrolling for long lists (future)

## 🧪 Testing Strategy

- Unit tests for utilities and hooks
- Component tests with React Testing Library
- Integration tests for critical flows
- E2E tests with Cypress (future)

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints: xs (0px), sm (600px), md (900px), lg (1200px), xl (1536px)
- MUI Grid system for layouts
- Responsive navigation (drawer on mobile)

## 🔄 Data Flow

```
User Action → Component → Service → API → Backend
                ↓                           ↓
            Local State ← ← ← ← ← ← Response
```

## 🎨 Styling Approach

- **MUI's sx prop** for component-level styling
- **Theme customization** for global styles
- **Emotion** for CSS-in-JS
- Avoid inline styles except for dynamic values

## 🔮 Future Enhancements

1. **Real-time updates** with WebSockets
2. **Push notifications** for matches
3. **Image upload** to cloud storage
4. **Advanced filtering** with faceted search
5. **Analytics dashboard** for admins
6. **Mobile app** with React Native
