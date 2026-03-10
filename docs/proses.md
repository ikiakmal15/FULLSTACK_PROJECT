# Setup Project Sistem Penyewaan Lapangan

## 1. Clone Repository

git clone https://github.com/nama-repo/FULLSTACK_PROJECT.git

## 2. Masuk ke Folder Project

cd FULLSTACK_PROJECT

## 3. Setup Backend Laravel

cd backend

Install dependency:

composer install

Copy file environment:

cp .env.example .env

Generate key:

php artisan key:generate

## 4. Setup Database

Buat database di MySQL dengan nama:

lapangan_rental_db

Kemudian konfigurasi file .env:

DB_DATABASE=lapangan_rental_db
DB_USERNAME=root
DB_PASSWORD=

## 5. Jalankan Migration

php artisan migrate

## 6. Jalankan Server Laravel

php artisan serve

Server akan berjalan di:

http://127.0.0.1:8000

## 7. Setup Frontend React

cd ../frontend

Install dependency:

npm install

Jalankan project:

npm run dev

Frontend akan berjalan di:

http://localhost:5173