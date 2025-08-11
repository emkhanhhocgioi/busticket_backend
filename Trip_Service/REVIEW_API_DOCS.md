# Review API Documentation

## Overview
API này cung cấp các chức năng CRUD (Create, Read, Update, Delete) cho hệ thống đánh giá (review) của ứng dụng booking xe bus.

## Base URL
```
/api/reviews
```

## Authentication
- Một số endpoints yêu cầu authentication thông qua JWT token
- Token có thể được gửi qua:
  - Cookie: `authToken`
  - Header: `Authorization: Bearer <token>`

## Endpoints

### 1. Tạo Review Mới
**POST** `/create`

**Authentication:** Required

**Body:**
```json
{
  "userId": "ObjectId",
  "routeId": "ObjectId", 
  "rating": 1-5,
  "comment": "string",
  "images": ["url1", "url2"] // optional, max 10
}
```

**Response:**
```json
{
  "success": true,
  "message": "Tạo review thành công",
  "data": {
    "_id": "ObjectId",
    "userId": "ObjectId",
    "routeId": "ObjectId",
    "rating": 5,
    "comment": "Dịch vụ rất tốt",
    "images": [],
    "timeCreate": "2025-08-11T...",
    "isActive": true,
    "isApproved": true
  }
}
```

### 2. Lấy Tất Cả Reviews
**GET** `/all`

**Query Parameters:**
- `page`: số trang (default: 1)
- `limit`: số items per page (default: 10)
- `routeId`: filter theo route
- `userId`: filter theo user
- `rating`: filter theo rating
- `isActive`: filter theo trạng thái active (default: true)

**Response:**
```json
{
  "success": true,
  "message": "Lấy danh sách review thành công",
  "data": {
    "reviews": [...],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalReviews": 50,
      "limit": 10
    }
  }
}
```

### 3. Lấy Review Theo ID
**GET** `/:id`

**Response:**
```json
{
  "success": true,
  "message": "Lấy thông tin review thành công",
  "data": {
    "_id": "ObjectId",
    "userId": {
      "_id": "ObjectId",
      "name": "User Name",
      "email": "user@email.com"
    },
    "routeId": {
      "_id": "ObjectId",
      "departure": "Hà Nội",
      "destination": "Sài Gòn"
    },
    "rating": 5,
    "comment": "Dịch vụ tốt",
    "images": [],
    "timeCreate": "2025-08-11T..."
  }
}
```

### 4. Lấy Reviews Theo Route
**GET** `/route/:routeId`

**Query Parameters:**
- `page`: số trang (default: 1)
- `limit`: số items per page (default: 10)
- `rating`: filter theo rating

**Response:**
```json
{
  "success": true,
  "message": "Lấy reviews theo route thành công",
  "data": {
    "reviews": [...],
    "statistics": {
      "averageRating": 4.5,
      "totalReviews": 25
    },
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalReviews": 25,
      "limit": 10
    }
  }
}
```

### 5. Cập Nhật Review
**PUT** `/update/:id`

**Authentication:** Required (chỉ owner)

**Body:**
```json
{
  "rating": 4,
  "comment": "Updated comment",
  "images": ["new_url1", "new_url2"]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Cập nhật review thành công",
  "data": {
    // updated review object
  }
}
```

### 6. Xóa Review (Soft Delete)
**DELETE** `/delete/:id`

**Authentication:** Required (chỉ owner)

**Response:**
```json
{
  "success": true,
  "message": "Xóa review thành công",
  "data": {
    // review object with isActive: false
  }
}
```

### 7. Xóa Review Vĩnh Viễn
**DELETE** `/hard-delete/:id`

**Authentication:** Required (Admin only)

**Response:**
```json
{
  "success": true,
  "message": "Xóa review vĩnh viễn thành công"
}
```

### 8. Approve/Disapprove Review
**PATCH** `/approve/:id`

**Authentication:** Required (Admin only)

**Body:**
```json
{
  "isApproved": true // hoặc false
}
```

**Response:**
```json
{
  "success": true,
  "message": "Approve review thành công",
  "data": {
    // updated review object
  }
}
```

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Thiếu thông tin bắt buộc: userId, routeId, rating, comment"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Access denied. No token provided."
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Bạn không có quyền sửa review này"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Không tìm thấy review"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Lỗi server khi tạo review",
  "error": "Error details..."
}
```

## Upload Images
- Sử dụng multipart/form-data khi upload ảnh
- Field name: `images`
- Tối đa 10 ảnh per request
- Kích thước tối đa: 5MB per file
- Chỉ chấp nhận file ảnh (image/*)

## Business Rules
1. Mỗi user chỉ được review 1 lần cho 1 route
2. Rating phải là số nguyên từ 1-5
3. Comment không được để trống
4. Tối đa 10 ảnh per review
5. User chỉ có thể sửa/xóa review của chính mình
6. Admin có thể approve/disapprove và xóa vĩnh viễn review
7. Chỉ hiển thị review đã approved cho public APIs

## Notes
- Sử dụng soft delete (isActive: false) thay vì xóa vĩnh viễn
- Tất cả responses đều có format chuẩn với success, message, data
- Hỗ trợ pagination cho list APIs
- Populate thông tin user và route trong responses
