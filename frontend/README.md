# Product Management System - Frontend

A modern, full-featured product management application built with React, TypeScript, and Tailwind CSS. This application provides a comprehensive interface for browsing products and managing inventory with categories and subcategories.

## Features

### Product Catalog (Main Page)

- **Product Grid Display** - Responsive grid layout (1-4 columns based on screen size)
- **Advanced Search** - Real-time search with 500ms debounce across product name, description, category, and subcategory
- **Smart Filtering** - Dynamic category and subcategory filters with automatic updates
- **Pagination Controls** - Navigate through products with customizable items per page (10, 20, 50, 100)
- **Product Details Modal** - View full product information with image carousel, category badges, and pricing
- **Image Slider** - Multi-image support with thumbnail navigation on product cards
- **Empty States** - Informative messages when no products match filters
- **Dark Mode Support** - Seamless light/dark theme switching

### Dashboard (Admin Panel)

- **Tab-Based Navigation** - Separate tabs for Products, Categories, and Subcategories
- **CRUD Operations** - Create, Read, Update, Delete functionality for all entities
- **Modal Forms** - Clean popup forms for adding and editing items
- **Image Upload** - Direct file upload with preview for product images (stored on Cloudinary)
- **Confirmation Dialogs** - Safe delete operations with custom confirm alerts
- **Toast Notifications** - Real-time success/error feedback
- **Data Tables** - Organized display with action buttons (Edit/Delete)
- **Relationship Management** - Category-Subcategory-Product hierarchy validation

## Technologies Used

- **[Vite](https://vitejs.dev/)** - Fast build tool and dev server
- **[React 18.3.1](https://react.dev/)** - UI library
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[HeroUI v2](https://heroui.com)** - UI component library
- **[Tailwind CSS 4.1.11](https://tailwindcss.com)** - Utility-first CSS framework
- **[React Router DOM 6.23.0](https://reactrouter.com/)** - Client-side routing
- **[React Icons 5.5.0](https://react-icons.github.io/react-icons/)** - Icon library
- **[React Hot Toast 2.6.0](https://react-hot-toast.com/)** - Toast notifications
- **[React Confirm Alert](https://www.npmjs.com/package/react-confirm-alert)** - Confirmation dialogs
- **[Framer Motion](https://www.framer.com/motion/)** - Animation library

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── ProductCard.tsx          # Product card with image slider
│   │   ├── ProductDetailsModal.tsx  # Full product details popup
│   │   ├── ProductModal.tsx         # Add/Edit product form
│   │   ├── CategoryModal.tsx        # Add/Edit category form
│   │   ├── SubcategoryModal.tsx     # Add/Edit subcategory form
│   │   ├── SearchBar.tsx            # Debounced search input
│   │   ├── FilterDropdowns.tsx      # Category/Subcategory filters
│   │   ├── Pagination.tsx           # Page navigation
│   │   └── navbar.tsx               # App navigation bar
│   ├── pages/
│   │   ├── products.tsx             # Main product catalog page
│   │   └── dashboard.tsx            # Admin management dashboard
│   ├── services/
│   │   └── api.ts                   # Backend API integration
│   ├── types/
│   │   └── index.ts                 # TypeScript type definitions
│   └── layouts/
│       └── default.tsx              # Main layout wrapper
└── index.html
```

## API Integration

The application connects to a backend API with the following endpoints:

- **Products**: `GET/POST /products`, `GET/PUT/DELETE /products/:id`
- **Categories**: `GET/POST /categories`, `GET/PUT/DELETE /categories/:id`
- **Subcategories**: `GET/POST /subcategories`, `GET/PUT/DELETE /subcategories/:id`

Features include:

- **Pagination & Filtering** - Server-side pagination with search and category filters
- **File Upload** - Multipart form data for product images
- **Data Transformation** - Converts MongoDB `_id` to frontend `id` format
- **Error Handling** - Graceful error messages and fallback states

## Installation

Clone the repository:

```bash
git clone https://github.com/iCodeLakshay/product-management-application.git
cd product-management-application/frontend
```

Install dependencies:

```bash
npm install
```

## Environment Setup

Create a `.env` file in the frontend root directory:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

This URL should point to your backend API server.

## Development

Run the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Build for Production

Build the project:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Key Features Implementation

### Search with Debounce

- 500ms delay before triggering API call
- Prevents excessive server requests while typing
- Resets to page 1 on new search

### Dynamic Filtering

- Subcategories automatically filter based on selected category
- Clear filters button when any filter is active
- Maintains filter state across page navigation

### Image Management

- Upload multiple images per product
- Image preview before upload
- Edit mode shows existing images
- Cloudinary integration for cloud storage
- Auto-optimized images (1000px width, auto quality/format)

### Responsive Design

- Mobile-first approach
- Adaptive grid columns (1-4 based on viewport)
- Touch-friendly buttons and navigation
- Collapsible filters on mobile

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

Licensed under the [MIT license](https://github.com/heroui-inc/vite-template/blob/main/LICENSE).
