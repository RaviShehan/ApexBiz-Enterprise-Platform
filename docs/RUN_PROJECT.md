# ApexBiz Enterprise Platform - How to Run the Project

## 1. Open the Project

Open VS Code and open this folder:

C:\Users\ASUS\Desktop\ApexBiz enterprise project\apexbiz-enterprise-platform

## 2. Start PostgreSQL and pgAdmin

Run this from the main project folder:

docker compose -f infra/docker-compose.yml up -d

This starts:

- PostgreSQL database
- pgAdmin

## 3. Open pgAdmin

Open this URL in browser:

http://localhost:5050

Login:

Email: admin@apexbiz.com
Password: admin123

Database details:

Database: apexbiz_db
Username: apexbiz_user
Password: apexbiz_password

## 4. Start Backend

Open a terminal in the main project folder and run:

cd backend\apexbiz-api
npm run start:dev

Backend runs on:

http://localhost:3000

Test backend health:

http://localhost:3000/database/health

## 5. Start Frontend

Open another terminal in the main project folder and run:

cd frontend
npm run dev -- -p 3001

Frontend runs on:

http://localhost:3001

## 6. Login

Open:

http://localhost:3001

Use the admin account created during backend setup.

Example:

Username: rbcadmin
Password: Passw0rd!

## 7. Demo Flow

After login:

1. Open Overview
2. Open Products
3. Create a product
4. Update product price or stock
5. Open POS Sales
6. Create a POS sale
7. Open Inventory
8. Do stock in, stock out, or adjust stock
9. Open Accounting
10. Show accounting reports

## 8. Stop the Project

To stop frontend or backend:

Press Ctrl + C in the running terminal.

To stop Docker services:

docker compose -f infra/docker-compose.yml down

## 9. Common Problems

### Backend not working

Check if Docker Desktop is running.

Then run:

docker compose -f infra/docker-compose.yml up -d

Then start backend again:

cd backend\apexbiz-api
npm run start:dev

### Frontend not opening

Make sure frontend is running:

cd frontend
npm run dev -- -p 3001

### Database health not working

Check backend is running:

cd backend\apexbiz-api
npm run start:dev

Then open:

http://localhost:3000/database/health

### Port already in use

If port 3001 is already used, stop the old frontend terminal using Ctrl + C.

Then run again:

cd frontend
npm run dev -- -p 3001
