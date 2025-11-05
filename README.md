# Sheikh Ammar bin Humaid Al Nuaimi - Royal Horology Collection

A luxury watch gallery website showcasing the prestigious timepiece collection of Sheikh Ammar bin Humaid Al Nuaimi, Crown Prince of Ajman. This project features a modern, bilingual (Arabic/English) web application with comprehensive content management, analytics, and media handling capabilities.

**Live Demo:** https://3000-i3h9wm761y73lsy1dwov3-766bcedb.manus-asia.computer/

**GitHub Repository:** https://github.com/OgSmiley1/sheikh-ammar-horology-gallery

---

## 🎯 Project Overview

This website serves as a digital showcase for one of the world's most exclusive luxury watch collections, featuring timepieces from renowned manufacturers including Patek Philippe, Richard Mille, F.P. Journe, Audemars Piguet, and Rolex. The platform combines elegant design with powerful administrative tools to manage and present this prestigious collection.

### Key Features

**Public-Facing Features:**
- **Cinematic Hero Slideshow:** Split-screen layout featuring Sheikh Ammar alongside detailed watch imagery with specifications
- **Bilingual Support:** Full Arabic (RTL) and English (LTR) language switching
- **Watch Collection Gallery:** Organized by brand with detailed specifications and high-resolution imagery
- **Responsive Design:** Optimized for desktop, tablet, and mobile devices
- **Accessibility:** WCAG-compliant with keyboard navigation, ARIA labels, and screen reader support

**Administrative Features:**
- **Content Management System (CMS):** Add, edit, and delete watches with bilingual content
- **Media Upload System:** S3-integrated image and video management with optimization
- **Analytics Dashboard:** Track visitor statistics, page views, and geographic data
- **Secure Authentication:** Protected admin panel with role-based access control

---

## 🏗️ Technical Architecture

### Stack

**Frontend:**
- React 19 with TypeScript
- Tailwind CSS 4 for styling
- Wouter for routing
- tRPC 11 for type-safe API calls
- Shadcn/ui component library

**Backend:**
- Express 4 server
- tRPC for API layer
- Drizzle ORM for database operations
- MySQL/TiDB database

**Infrastructure:**
- S3-compatible storage for media files
- Manus OAuth for authentication
- Vite 7 for build tooling

### Project Structure

```
sheikh-ammar-horology-gallery/
├── client/                    # Frontend React application
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/           # Page-level components
│   │   ├── contexts/        # React contexts
│   │   ├── hooks/           # Custom hooks
│   │   └── lib/             # Utilities and tRPC client
│   └── public/              # Static assets
├── server/                   # Backend Express + tRPC
│   ├── _core/               # Core server infrastructure
│   ├── db.ts                # Database queries
│   ├── routers.ts           # tRPC procedures
│   └── storage.ts           # S3 storage helpers
├── drizzle/                 # Database schema and migrations
├── shared/                  # Shared types and constants
├── scripts/                 # Utility scripts
└── docs/                    # Documentation and assets
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 22.x or higher
- pnpm 10.x or higher
- MySQL/TiDB database
- S3-compatible storage (optional, for media uploads)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/OgSmiley1/sheikh-ammar-horology-gallery.git
   cd sheikh-ammar-horology-gallery
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Set up environment variables:**
   
   The following environment variables are automatically injected by the Manus platform:
   - `DATABASE_URL` - MySQL/TiDB connection string
   - `JWT_SECRET` - Session cookie signing secret
   - `VITE_APP_ID` - Manus OAuth application ID
   - `OAUTH_SERVER_URL` - Manus OAuth backend base URL
   - `VITE_OAUTH_PORTAL_URL` - Manus login portal URL (frontend)
   - `OWNER_OPEN_ID`, `OWNER_NAME` - Owner's information
   - `VITE_APP_TITLE` - Application title
   - `VITE_APP_LOGO` - Logo image URL
   - `BUILT_IN_FORGE_API_URL` - Manus built-in APIs
   - `BUILT_IN_FORGE_API_KEY` - Bearer token for Manus APIs
   
   For local development outside Manus, create a `.env` file with these variables.

4. **Run database migrations:**
   ```bash
   pnpm db:push
   ```

5. **Seed the database (optional):**
   ```bash
   node seed-database.mjs
   ```

6. **Start the development server:**
   ```bash
   pnpm dev
   ```

   The application will be available at `http://localhost:3000`

---

## 📖 Usage

### Admin Access

**Default Admin Credentials:**
- Username: `MOATH`
- Password: `MOATH123`

**Admin Panel URL:** `/admin`

### Content Management

1. **Adding a New Watch:**
   - Navigate to Admin Panel → Add New Watch
   - Fill in bilingual fields (Arabic + English)
   - Upload images (studio shot, wrist shot, detail shot)
   - Assign to brand collection
   - Set specifications (movement, case, diameter, year, price, rarity)
   - Publish

2. **Managing Media:**
   - Navigate to Admin Panel → Media Library
   - Upload images (automatically optimized)
   - Categorize media (studio, wrist, detail)
   - Assign to watches

3. **Viewing Analytics:**
   - Navigate to Admin Panel → Analytics Dashboard
   - View visitor statistics
   - Track page views
   - Analyze geographic data

---

## 🎨 Hero Slideshow Implementation

The hero slideshow features a sophisticated two-variant design that adapts to different screen sizes:

**Mobile Layout (<1024px):**
- Content band positioned below images
- Clean stacking layout with 2-3 column specification grid
- No overlay to maintain readability
- Touch swipe gestures for navigation

**Desktop Layout (≥1024px):**
- Glass morphism overlay at bottom-center
- Semi-transparent background with backdrop blur
- 6-column specification grid
- Gold border accent (#D4AF37)
- Proper z-index layering (content z-10, navigation z-20)

**Accessibility Features:**
- Descriptive alt text on all images
- ARIA labels on navigation controls
- Keyboard navigation (←/→ arrows, Space to pause)
- Visible focus rings for keyboard users
- `prefers-reduced-motion` support

**Performance Optimizations:**
- Lazy loading with `loading="lazy"`
- Async image decoding
- Next slide preloading
- Optimized auto-rotation (7 seconds)

---

## 📊 Project Status

**Completion:** 85%

**Completed Features:**
- ✅ Database schema and migrations
- ✅ Bilingual content structure
- ✅ Homepage with video background
- ✅ Brand collection pages
- ✅ Individual watch detail pages
- ✅ Admin authentication
- ✅ Analytics dashboard
- ✅ Content Management System
- ✅ Media upload system
- ✅ Database seeding
- ✅ Comprehensive testing
- ✅ Hero slideshow refinement (Phases 1-5)

**In Progress:**
- 🚧 Hero slideshow refinement (Phases 6-7)
  - Mobile screenshots
  - Lighthouse audits
  - Micro-animations and polish
- 🚧 Final deployment documentation

**See [REMAINING_WORK.md](./REMAINING_WORK.md) for detailed breakdown of remaining tasks.**

---

## 📝 Documentation

- **[CHANGELOG.md](./CHANGELOG.md)** - Project history and version changes
- **[REMAINING_WORK.md](./REMAINING_WORK.md)** - Detailed breakdown of remaining tasks
- **[TESTING_REPORT.md](./TESTING_REPORT.md)** - Comprehensive testing documentation
- **[todo.md](./todo.md)** - Development task tracker
- **[userGuide.md](./userGuide.md)** - Admin user guide

---

## 🤝 Contributing

This is a private project for Sheikh Ammar bin Humaid Al Nuaimi. Contributions are not currently accepted.

---

## 📄 License

This project is proprietary and confidential. All rights reserved.

---

## 🙏 Acknowledgments

**Developed by:** Manus AI Agent  
**Project Owner:** Sheikh Ammar bin Humaid Al Nuaimi, Crown Prince of Ajman  
**Development Platform:** Manus (https://manus.im)

**Technologies:**
- React, TypeScript, Tailwind CSS
- Express, tRPC, Drizzle ORM
- Vite, Shadcn/ui
- S3 Storage, MySQL/TiDB

---

## 📞 Support

For technical support or inquiries, please contact the project administrator.

**Last Updated:** November 5, 2025  
**Version:** 0.1.0  
**Checkpoint:** 0fb6ebd5
