# Product Management Backend API

## Overview

A RESTful API for managing products, categories, and subcategories with advanced search, filtering, and pagination capabilities.

## Tech Stack

- Node.js
- Express.js
- MongoDB (Mongoose ODM)
- Cloudinary (Image storage & optimization)
- Multer + Multer-Storage-Cloudinary (File upload)
- CORS enabled
- Morgan (logging)

## Environment Variables

Create a `.env` file in the backend directory:

```
MONGO_URI=mongodb+srv://lakshaysaxena2217_db_user:r9ho1aVlLy7m3FO8@tech-mantra-project.ikatf1n.mongodb.net/
CLOUDINARY_CLOUD_NAME=dpp1iakkl
CLOUDINARY_API_KEY=496415512484646
CLOUDINARY_API_SECRET=NVL-8PHoD8HVxLY1ie4uKBElORU
```

## Installation

```bash
cd backend
npm install
```

## Running the Server

### Development mode (with auto-reload)

```bash
npm run dev
```

### Production mode

```bash
npm start
```

Server runs on: `http://localhost:5000`

---

## API Endpoints

### Categories

#### Get all categories

```
GET /api/categories
```

Response:

```json
{
  "success": true,
  "count": 5,
  "data": [...]
}
```

#### Get category by ID

```
GET /api/categories/:id
```

#### Create category

```
POST /api/categories
Content-Type: application/json

{
  "name": "Electronics",
  "description": "Electronic items and gadgets"
}
```

#### Update category

```
PUT /api/categories/:id
Content-Type: application/json

{
  "name": "Updated Name",
  "description": "Updated description",
  "isActive": true
}
```

#### Delete category

```
DELETE /api/categories/:id
```

---

### Subcategories

#### Get all subcategories

```
GET /api/subcategories
GET /api/subcategories?categoryId=<category_id>
```

#### Get subcategory by ID

```
GET /api/subcategories/:id
```

#### Create subcategory

```
POST /api/subcategories
Content-Type: application/json

{
  "name": "Smartphones",
  "description": "Mobile phones and accessories",
  "categoryId": "category_object_id"
}
```

#### Update subcategory

```
PUT /api/subcategories/:id
Content-Type: application/json

{
  "name": "Updated Name",
  "description": "Updated description",
  "categoryId": "category_object_id",
  "isActive": true
}
```

#### Delete subcategory

```
DELETE /api/subcategories/:id
```

---

### Products

#### Get all products (with pagination, search, and filters)

```
GET /api/products
GET /api/products?page=1&limit=50
GET /api/products?search=laptop
GET /api/products?categoryId=<category_id>
GET /api/products?subcategoryId=<subcategory_id>
GET /api/products?page=2&limit=50&search=phone&categoryId=<id>
```

Query Parameters:

- `page` (default: 1) - Page number
- `limit` (default: 50) - Items per page
- `search` - Search across product name, description, category name, and subcategory name
- `categoryId` - Filter by category
- `subcategoryId` - Filter by subcategory

Response:

```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "currentPage": 1,
    "totalPages": 3,
    "totalItems": 150,
    "itemsPerPage": 50
  }
}
```

#### Get product by ID

```
GET /api/products/:id
```

#### Create product

```
POST /api/products
Content-Type: multipart/form-data

FormData:
- name: "iPhone 15 Pro"
- description: "Latest Apple smartphone with advanced features"
- price: 999.99
- images: [File, File, File] (up to 10 image files)
- categoryId: "category_object_id"
- subcategoryId: "subcategory_object_id"
- stock: 100
```

**Image Upload Features:**

- Supports multiple image uploads (up to 10 files)
- Direct upload to Cloudinary with automatic optimization
- Image compression: Reduces file size by ~83% (e.g., 285 KB → 48.11 KB)
- Automatic format conversion to WebP for better performance
- Fixed width: 1000px with auto height to maintain aspect ratio
- Quality: Auto-optimized for web delivery

#### Update product

```
PUT /api/products/:id
Content-Type: multipart/form-data

FormData:
- name: "Updated Product Name"
- description: "Updated description"
- price: 1099.99
- images: [File, File] (optional new image files)
- categoryId: "category_object_id"
- subcategoryId: "subcategory_object_id"
- stock: 50
- isActive: true
- keepExistingImages: true/false (whether to keep existing images)
```

**Update Behavior:**

- If `keepExistingImages` is `true` and new images are uploaded, they are added to existing images
- If `keepExistingImages` is `false` or not specified, old images are replaced with new ones
- Old images are automatically deleted from Cloudinary when replaced

#### Delete product

```
DELETE /api/products/:id
```

**Note:** All product images are automatically deleted from Cloudinary when a product is removed.

---

## Data Models

### Category

```javascript
{
  name: String (required, unique),
  description: String,
  isActive: Boolean (default: true),
  timestamps: true
}
```

### Subcategory

```javascript
{
  name: String (required),
  description: String,
  categoryId: ObjectId (required, ref: 'Category'),
  isActive: Boolean (default: true),
  timestamps: true
}
```

### Product

```javascript
{
  name: String (required),
  description: String (required),
  price: Number (required, min: 0),
  images: [String],
  categoryId: ObjectId (required, ref: 'Category'),
  subcategoryId: ObjectId (required, ref: 'Subcategory'),
  stock: Number (default: 0, min: 0),
  isActive: Boolean (default: true),
  timestamps: true
}
```

---

## Features

✅ CRUD operations for Categories, Subcategories, and Products  
✅ Advanced search across multiple fields  
✅ Filter by category and subcategory  
✅ Backend-powered pagination  
✅ Populated references in responses  
✅ Input validation  
✅ Error handling  
✅ Clean MVC architecture  
✅ RESTful API design  
✅ **Cloudinary Image Optimization** - Automatic image compression (83% size reduction)  
✅ **Multi-image Upload** - Support for up to 10 images per product  
✅ **Auto Format Conversion** - WebP format for optimal web performance  
✅ **Optimized API Performance** - Fast image delivery with CDN caching

---

## Error Responses

All error responses follow this format:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```

Common HTTP Status Codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `404` - Not Found
- `500` - Server Error
