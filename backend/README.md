# Product Management Backend API

## Overview

A RESTful API for managing products, categories, and subcategories with advanced search, filtering, and pagination capabilities.

## Tech Stack

- Node.js
- Express.js
- MongoDB (Mongoose ODM)
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
Content-Type: application/json

{
  "name": "iPhone 15 Pro",
  "description": "Latest Apple smartphone with advanced features",
  "price": 999.99,
  "images": ["url1", "url2", "url3"],
  "categoryId": "category_object_id",
  "subcategoryId": "subcategory_object_id",
  "stock": 100
}
```

#### Update product

```
PUT /api/products/:id
Content-Type: application/json

{
  "name": "Updated Product Name",
  "description": "Updated description",
  "price": 1099.99,
  "images": ["url1", "url2"],
  "categoryId": "category_object_id",
  "subcategoryId": "subcategory_object_id",
  "stock": 50,
  "isActive": true
}
```

#### Delete product

```
DELETE /api/products/:id
```

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
