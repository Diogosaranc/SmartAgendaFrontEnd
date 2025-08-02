# Smart Agenda Frontend - Agent Guide

## Commands
- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm start` - Start production server
- No test command defined (add with `npm test` or specific test runner)

## Architecture
- **Framework**: Next.js 15 with App Router and TypeScript
- **UI**: shadcn/ui components with Radix UI primitives and Tailwind CSS v4
- **Structure**: `src/app/` (App Router pages), `src/components/` (shared components), `src/lib/` (utilities), `src/hooks/` (custom hooks)
- **Routing**: App Router with `(logged-in)` and `(logged-out)` route groups for auth-based layouts

## Code Style
- **Imports**: Use `@/` alias for src imports (e.g., `@/components/ui/button`)
- **Components**: PascalCase files and components, prefer named exports
- **Styling**: Use `cn()` utility from `@/lib/utils` for conditional classes
- **Icons**: Lucide React icon library
- **Forms**: React Hook Form with Zod validation
- **Themes**: next-themes for dark/light mode support
- **Config**: ESLint with Next.js rules, strict TypeScript settings
