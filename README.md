# Hotel Booking System

Full-stack hotel booking application built with React, Spring Boot, and MySQL.

## Features

### Hotel Owner
- Register/Login as Owner
- Create, Edit, Delete hotels (name, location, description, price, rooms, amenities, image)
- Dashboard showing all bookings across hotels with stats (total bookings, active bookings, revenue)

### Customer
- Register/Login as Customer
- Browse all available hotels
- Book a hotel (select check-in/check-out dates and number of rooms)
- View and cancel own bookings

## Tech Stack
- **Frontend**: React 18, React Router v6, Axios, Tailwind CSS
- **Backend**: Spring Boot 3.2, Spring Security, JWT, Spring Data JPA
- **Database**: MySQL 8

## Project Structure
```
Ansible-project/
├── hotel-booking-backend/     # Spring Boot API
├── hotel-booking-frontend/    # React App
└── schema.sql                 # MySQL schema
```

## Setup Instructions

### Prerequisites
- Java 17+
- Node.js 18+
- MySQL 8+
- Maven 3.8+

### 1. Database Setup
```sql
mysql -u root -p < schema.sql
```
Or run the SQL in MySQL Workbench.

### 2. Backend Setup
```bash
cd hotel-booking-backend

# Set environment variables for database connection
export DB_USERNAME=your_db_username
export DB_PASSWORD=your_db_password
export JWT_SECRET=your_jwt_secret_key_256_bits_minimum

mvn spring-boot:run
```
Backend runs on: http://localhost:8080

### 3. Frontend Setup
```bash
cd hotel-booking-frontend
npm install
npm start
```
Frontend runs on: http://localhost:3000

## API Endpoints

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | /api/auth/register | Public | Register user |
| POST | /api/auth/login | Public | Login |
| GET | /api/hotels/all | Public | Get all hotels |
| GET | /api/owner/hotels | OWNER | Get owner's hotels |
| POST | /api/owner/hotels | OWNER | Create hotel |
| PUT | /api/owner/hotels/{id} | OWNER | Update hotel |
| DELETE | /api/owner/hotels/{id} | OWNER | Delete hotel |
| POST | /api/bookings/hotel/{hotelId} | CUSTOMER | Book hotel |
| GET | /api/bookings/my | CUSTOMER | My bookings |
| GET | /api/bookings/owner | OWNER | All bookings for owner |
| PUT | /api/bookings/{id}/cancel | CUSTOMER | Cancel booking |
