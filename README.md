# Spotify Backend

## Mô tả

Đây là backend của ứng dụng Spotify, được xây dựng bằng Node.js và Express.js. Backend cung cấp API RESTful hỗ trợ các chức năng như đăng nhập, tìm kiếm bài hát, quản lý playlist, và phát nhạc trực tuyến thông qua Spotify Web API.

## Công nghệ sử dụng

- **Node.js**: Nền tảng chạy JavaScript phía server.
- **Express.js**: Framework xây dựng RESTful API.
- **Spotify Web API**: Kết nối và lấy dữ liệu từ Spotify.
- **OAuth 2.0**: Đăng nhập và phân quyền người dùng thông qua Spotify.
- **Docker**: Đóng gói ứng dụng để triển khai linh hoạt.

## Cài đặt

### Yêu cầu

- Docker và Docker Compose được cài đặt trên hệ thống.
- Spotify Developer Account (để lấy Client ID và Client Secret).

### Hướng dẫn cài đặt

1. Clone repository:

   ```bash
   git clone https://github.com/Nam147159/Backend
   cd Backend
   ```

2. Cài đặt dependencies:

   ```bash
   npm install
   ```
   
3. Khởi động server:   

   ```bash
   npm start
   ```

3. Đảm bảo bạn đã có thông tin từ Spotify Developer Dashboard để điền các giá trị SPOTIFY_CLIENT_ID và SPOTIFY_CLIENT_SECRET.

### Chạy ứng dụng với Docker

1. Clone repository:

   ```bash
   git clone https://github.com/Nam147159/Backend
   cd Backend
   ```

2. Xây dựng và chạy container với Docker Compose:
   
   ```bash
   docker run --rm -d -p 5432:5432 -e "POSTGRES_USER=postgres" -e "POSTGRES_PASSWORD=N@mnguyen147159" -e "POSTGRES_DB=Spotify_Backend" --name spotify-postgres postgres:16.
   docker exec -it spotify-postgres psql --user postgres                                                                                   
   ```

   - Copy paste nội dung file Spotify.sql vào

3. Cài đặt dependencies:

   ```bash
   npm install
   ```
   
4. Khởi động server:   

   ```bash
   npm start
   ```

5. Kiểm tra ứng dụng: Truy cập http://localhost:2204 để kiểm tra API hoạt động.
