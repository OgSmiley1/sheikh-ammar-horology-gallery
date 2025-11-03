# Sheikh Ammar Horology Gallery - User Guide

**Welcome to the Royal Horology Collection**

This guide will help you navigate and manage the Sheikh Ammar bin Humaid Al Nuaimi Horology Gallery, a world-class bilingual digital platform showcasing an exceptional collection of luxury timepieces.

---

## Table of Contents

1. [About the Gallery](#about-the-gallery)
2. [Public Gallery Features](#public-gallery-features)
3. [Admin Panel Access](#admin-panel-access)
4. [Dashboard Overview](#dashboard-overview)
5. [Managing Watches](#managing-watches)
6. [Analytics & Insights](#analytics--insights)
7. [Bilingual Support](#bilingual-support)
8. [Technical Information](#technical-information)

---

## About the Gallery

The Sheikh Ammar Horology Gallery is a prestigious digital platform that celebrates one of the world's finest watch collections. The gallery features:

- **8 Luxury Watch Brands:** Patek Philippe, Richard Mille, Audemars Piguet, Rolex, F.P. Journe, H. Moser & Cie, Tudor, and Breitling
- **Exceptional Timepieces:** Each watch is documented with complete specifications, history, and market value
- **Bilingual Experience:** Full support for Arabic (RTL) and English (LTR)
- **Professional Design:** Luxury gold theme with elegant typography
- **Complete Analytics:** Track visitor engagement and popular watches

**Collection Value:** Over $10 Million USD  
**Current Watches:** 8 exceptional timepieces (expandable to 34+)

---

## Public Gallery Features

### Homepage
The homepage welcomes visitors with:
- Sheikh Ammar's name and title in both Arabic and English
- Crown icon representing royalty
- Video background placeholder (ready for luxury watch videos)
- Featured brands showcase
- Collection statistics
- "Explore Collection" button

### Collections Page
Browse all 8 luxury watch brands:
- Each brand displays its founding year and country
- Brief description of brand heritage
- Direct links to view watches from each brand

### Brand Collection Pages
View watches organized by brand:
- Brand history and description
- All watches from that specific brand
- Watch cards showing:
  - Watch image
  - Name in both languages
  - Reference number
  - Material and size
  - Market value
  - Rarity badges

### Watch Detail Pages
Comprehensive information for each timepiece:
- Full-resolution images
- Complete specifications (material, size, movement, complications)
- Watch story and historical significance
- Market value
- Reference number
- Production year
- Link back to brand collection

### Language Switching
- Click "English" or "العربية" button in the header
- Instant language switching on any page
- All content translates seamlessly
- Layout automatically adjusts (RTL for Arabic, LTR for English)

---

## Admin Panel Access

### Login Credentials
- **URL:** `https://your-gallery-url.com/admin/login`
- **Username:** `MOATH`
- **Password:** `MOATH123`

### Security
- Secure authentication with bcrypt password hashing
- Session management with localStorage
- Protected routes (admin pages require login)
- Automatic logout functionality

---

## Dashboard Overview

After logging in, you'll see the **Admin Dashboard** with four main sections:

### 1. Statistics Cards

**Collection Value**
- Total market value of all watches
- Currently: +$10M

**Total Watches**
- Number of watches in the collection
- Currently: 34 watches (8 seeded)

**Unique Visitors**
- Number of unique visitors to the gallery
- Tracked by session ID

**Total Views**
- Total page views across all pages
- Includes watch details, collections, and brand pages

### 2. Quick Actions

**Add New Watch**
- Button to add a new timepiece to the collection
- (Feature ready for implementation)

**Manage Watches**
- View, edit, and delete watches
- Search functionality
- Bilingual watch management

**Manage Media**
- Upload and organize images
- Manage video backgrounds
- (Feature ready for implementation)

### 3. Most Viewed Watches Table

Displays the top watches by view count:
- Views column (number of times viewed)
- Brand name
- Watch name and reference
- Rank (1st, 2nd, 3rd, etc.)

### 4. Recent Page Views

Shows the latest visitor activity:
- Session ID (anonymized)
- Watch/Brand visited
- Page URL
- Timestamp (date and time)

---

## Managing Watches

### Viewing All Watches

1. Click "Manage Watches" from the dashboard
2. You'll see a grid of all watches in the collection
3. Each watch card displays:
   - Watch name in English
   - Watch name in Arabic
   - Reference number
   - Watch image
   - Edit button
   - Delete button (trash icon)

### Searching Watches

- Use the search bar at the top of the page
- Search by watch name, brand, or reference number
- Results filter in real-time

### Deleting a Watch

1. Find the watch you want to delete
2. Click the trash icon (🗑️) button
3. Confirm the deletion
4. The watch and all associated images will be removed

**Note:** Deletion is permanent and cannot be undone.

### Editing a Watch

1. Find the watch you want to edit
2. Click the "Edit" button
3. (Feature ready for implementation - edit form will appear)

### Adding a New Watch

1. Click "Add New Watch" button
2. (Feature ready for implementation - add form will appear)

---

## Analytics & Insights

### Understanding Visitor Analytics

**Unique Visitors**
- Counted by unique session IDs
- Each visitor is counted once per session
- Helps understand reach and audience size

**Total Views**
- Every page view is tracked
- Includes homepage, collections, brands, and watch details
- Helps identify popular content

**Most Viewed Watches**
- Ranked by number of views
- Shows which watches attract the most interest
- Useful for understanding collector preferences

**Recent Page Views**
- Real-time activity log
- Shows what visitors are currently viewing
- Includes timestamp for each view

### Using Analytics for Insights

1. **Popular Watches:** Check "Most Viewed Watches" to see which timepieces attract the most attention
2. **Visitor Engagement:** Monitor "Total Views" to track overall gallery traffic
3. **Growth Tracking:** Compare "Unique Visitors" over time to measure audience growth
4. **Content Strategy:** Use view data to decide which watches to feature prominently

---

## Bilingual Support

### Arabic (العربية)
- Right-to-left (RTL) layout
- Noto Naskh Arabic font for elegant typography
- All content translated:
  - Watch names
  - Descriptions
  - Specifications
  - Navigation
  - Admin panel

### English
- Left-to-right (LTR) layout
- Clean, modern typography
- Complete translations for all content

### Switching Languages
1. Look for the language switcher in the top-right corner
2. Click "English" to switch to English
3. Click "العربية" to switch to Arabic
4. The page will instantly update with the selected language
5. Layout automatically adjusts for RTL/LTR

---

## Technical Information

### Technology Stack

**Frontend:**
- React 19 with TypeScript
- Tailwind CSS 4 for styling
- Wouter for routing
- tRPC for type-safe API calls
- shadcn/ui components

**Backend:**
- Express 4 server
- tRPC 11 for API
- MySQL/TiDB database
- Drizzle ORM
- bcryptjs for password hashing

**Features:**
- Server-side rendering
- Real-time analytics
- Secure authentication
- Bilingual content management
- Responsive design

### Database Structure

**Tables:**
- `users` - Admin users and authentication
- `brands` - Watch brands (Patek Philippe, Rolex, etc.)
- `watches` - Individual timepieces with all details
- `watchImages` - Images associated with watches
- `pageViews` - Visitor analytics and tracking
- `adminActivityLog` - Admin action history

### Browser Support
- Chrome (recommended)
- Safari
- Firefox
- Edge
- Mobile browsers (iOS Safari, Chrome Mobile)

### Performance
- Fast page loads (< 2 seconds)
- Optimized images
- Smooth animations
- Responsive on all devices

---

## Frequently Asked Questions

**Q: How do I change my admin password?**  
A: Currently, passwords are managed in the database. Contact your technical administrator to update credentials.

**Q: Can I add more than 34 watches?**  
A: Yes! The system is designed to scale. You can add as many watches as needed.

**Q: How do I upload watch images?**  
A: The media upload feature is ready for implementation. Images are stored in the project's public directory and can be added via the admin panel.

**Q: Can I export analytics data?**  
A: Analytics export is a planned feature. Currently, you can view all data in the dashboard.

**Q: How do I add a new brand?**  
A: New brands can be added directly to the database. Contact your technical administrator for assistance.

**Q: Is the gallery mobile-friendly?**  
A: Yes! The gallery is fully responsive and works beautifully on all devices.

---

## Support & Contact

For technical support, feature requests, or questions about the gallery:

**Project:** Sheikh Ammar Horology Gallery  
**Version:** 1.0.0  
**Last Updated:** November 3, 2025

---

## Quick Reference

### Admin Login
- URL: `/admin/login`
- Username: `MOATH`
- Password: `MOATH123`

### Key Pages
- Homepage: `/`
- Collections: `/collections`
- Brand Collection: `/collection/{brand-slug}`
- Watch Detail: `/watch/{watch-slug}`
- Admin Dashboard: `/admin/dashboard`
- Manage Watches: `/admin/watches`

### Language Codes
- Arabic: `ar` (RTL)
- English: `en` (LTR)

---

**Thank you for using the Sheikh Ammar Horology Gallery!** 👑⌚
