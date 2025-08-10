# Cập nhật cấu trúc Trip Model - Thay đổi availableSeats thành array bookedSeats

## Các thay đổi chính:

### 1. Trip Model (trip_model.js)
- **Thêm trường mới `bookedSeats`**: Array chứa thông tin các ghế đã đặt
  ```javascript
  bookedSeats: {
    type: [{
      orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true
      },
      seatNumber: {
        type: String,
        required: false
      },
      bookedAt: {
        type: Date,
        default: Date.now
      }
    }],
    default: []
  }
  ```
- **Cập nhật `availableSeats`**: Vẫn giữ để tương thích, nhưng được tính toán từ `totalSeats - bookedSeats.length`

### 2. Trip Controller (trip_controller.js)
- **createTrip**: Khởi tạo `bookedSeats` là array rỗng
- **updateTrip**: Tự động tính lại `availableSeats` khi `totalSeats` thay đổi
- **getAllTrips**: Populate thông tin order trong `bookedSeats`
- **Thêm hàm mới**:
  - `getTripBookedSeats()`: Lấy thông tin chi tiết ghế đã đặt
  - `checkSeatAvailability()`: Kiểm tra tình trạng ghế trống

### 3. Order Controller (order_controller.js)
- **createOrder**: Thêm thông tin đặt ghế vào `bookedSeats` array
- **declineOrder**: Xóa thông tin khỏi `bookedSeats` array
- **verifyQRPayment**: Cập nhật xử lý khi thanh toán thất bại

### 4. Routes (trip_routes.js)
- **Thêm routes mới**:
  - `GET /trip/:tripId/booked-seats`: Lấy thông tin ghế đã đặt
  - `GET /trip/:tripId/seat-availability`: Kiểm tra tình trạng ghế

## Lợi ích của cấu trúc mới:

1. **Theo dõi chi tiết**: Có thể biết chính xác orderId nào đã đặt ghế nào
2. **Tính toàn vẹn dữ liệu**: Dễ dàng kiểm tra và đồng bộ dữ liệu
3. **Báo cáo chi tiết**: Có thể tạo báo cáo về việc đặt ghế theo thời gian
4. **Khôi phục dễ dàng**: Khi order bị hủy, có thể dễ dàng tìm và xóa khỏi array

## Cách chạy migration:

```bash
cd Trip_Service
node migrate_trip_model.js
```

## API Endpoints mới:

### Lấy thông tin ghế đã đặt
```
GET /api/trip/{tripId}/booked-seats
Response:
{
  "tripId": "...",
  "routeCode": "...",
  "totalSeats": 40,
  "availableSeats": 35,
  "bookedSeatsCount": 5,
  "bookedSeats": [
    {
      "orderId": "...",
      "seatNumber": "A1",
      "bookedAt": "2025-01-01T10:00:00.000Z",
      "orderId": {
        "fullName": "Nguyễn Văn A",
        "phone": "0123456789",
        "orderStatus": "confirmed"
      }
    }
  ]
}
```

### Kiểm tra tình trạng ghế
```
GET /api/trip/{tripId}/seat-availability
Response:
{
  "tripId": "...",
  "routeCode": "...",
  "totalSeats": 40,
  "availableSeats": 35,
  "bookedSeatsCount": 5,
  "bookedOrderIds": ["orderId1", "orderId2", ...],
  "canBook": true
}
```

## Tương thích ngược:

- Các API hiện tại vẫn hoạt động bình thường
- Trường `availableSeats` vẫn được trả về trong response
- Logic đặt/hủy ghế vẫn tương thích với client hiện tại
