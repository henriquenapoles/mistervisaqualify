# Overview

This is a US immigration form application that provides a gamified, multi-step wizard for users to assess their eligibility for various US visa categories. The application collects user information through an interactive questionnaire, calculates eligibility scores based on responses, and provides personalized visa recommendations. The system is designed as a lead generation tool for an immigration consultancy, with automatic webhook integration for customer relationship management.

The application features a modern, responsive interface with patriotic American theming, animated progress indicators, and smooth transitions between form steps. It processes user responses to determine compatibility with different visa categories including EB-5 investor visas, work-based visas (H1B, L1), student visas, and family-based immigration options.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern component patterns
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: React hooks for local state, TanStack Query for server state management
- **UI Components**: Radix UI primitives with shadcn/ui design system for consistent, accessible components
- **Styling**: Tailwind CSS with custom CSS variables for theming and responsive design
- **Animations**: Framer Motion for smooth transitions and interactive animations
- **Build Tool**: Vite for fast development and optimized production builds

## Backend Architecture
- **Runtime**: Node.js with Express.js framework for API endpoints
- **Language**: TypeScript for full-stack type safety
- **API Design**: RESTful endpoints with JSON responses
- **Data Validation**: Zod schemas for runtime type checking and validation
- **Storage**: In-memory storage implementation with interface for future database integration
- **Session Management**: Express session handling with connect-pg-simple for PostgreSQL session store

## Data Storage Solutions
- **Database ORM**: Drizzle ORM configured for PostgreSQL with type-safe queries
- **Connection**: Neon Database serverless PostgreSQL for scalable cloud storage
- **Schema Management**: Drizzle Kit for database migrations and schema management
- **Data Models**: Structured schemas for users and leads with comprehensive form data storage
- **Session Storage**: PostgreSQL-backed session store for user authentication

## External Dependencies
- **Database**: Neon Database serverless PostgreSQL for production data storage
- **Webhook Integration**: Automated lead submission to CRM system (n8n webhook endpoint)
- **Font Loading**: Google Fonts integration for typography (Inter, DM Sans, Fira Code, Geist Mono)
- **Icon System**: Font Awesome icons for visual elements and progress indicators
- **Image Assets**: Unsplash integration for patriotic imagery and visual appeal

The architecture supports a scalable lead generation system with real-time form validation, automated scoring algorithms, and seamless CRM integration for immigration consultancy workflows.