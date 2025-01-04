# Spotify Backend

## Mô tả

Đây là backend của ứng dụng Spotify, được xây dựng bằng Node.js và Express.js. Backend cung cấp API RESTful hỗ trợ các chức năng như đăng nhập, tìm kiếm bài hát, quản lý playlist, và phát nhạc trực tuyến thông qua Spotify Web API.

## Công nghệ sử dụng

- **Node.js**: Nền tảng chạy JavaScript phía server.
- **Express.js**: Framework xây dựng RESTful API.
- **Spotify Web API**: Kết nối và lấy dữ liệu từ Spotify.
- **JSON Web Token (JWT)**: Xác thực và quản lý phiên đăng nhập.
- **OAuth 2.0**: Đăng nhập và phân quyền người dùng thông qua Spotify.
- **Docker**: Đóng gói ứng dụng để triển khai linh hoạt.

## Cài đặt

### Yêu cầu

- Docker và Docker Compose được cài đặt trên hệ thống.
- Spotify Developer Account (để lấy Client ID và Client Secret).

### Cấu hình môi trường

1. Tạo file `.env` trong thư mục gốc:
   ```plaintext
   PORT=3000
   SPOTIFY_CLIENT_ID=your_spotify_client_id
   SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
   REDIRECT_URI=http://localhost:3000/callback
   JWT_SECRET=your_jwt_secret
   ```
2. Đảm bảo bạn đã có thông tin từ Spotify Developer Dashboard để điền các giá trị SPOTIFY_CLIENT_ID và SPOTIFY_CLIENT_SECRET.

### Chạy ứng dụng với Docker

1. Clone repository:

   ```bash
   git clone https://github.com/Nam147159/Backend
   cd Backend
   ```

2. Xây dựng và chạy container với Docker Compose:

   ```bash
   docker compose -f .\compose.yaml up --build
   ```

3. Kiểm tra ứng dụng: Truy cập http://localhost:2204 để kiểm tra API hoạt động.
