
# 📘 ตารางงาน ม.4/2 (wc20-works)

## About
A responsive React + TypeScript web app that displays upcoming assignments for my Witcom 20 classmates  — pulling live data directly from **Google Sheets** using the Sheets API.

##  Tech Stack
- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Bun](https://bun.sh/)
- Google Sheets API (read-only)

## Setup & Development
### 1. Clone the project
```bash
git clone https://github.com/your-username/homework-dashboard.git
cd homework-dashboard
```
### 2. Install dependencies
```bash
bun install
```
### 3. Create .env file
```env
VITE_GOOGLE_SHEETS_API_KEY=your_google_sheets_api_key_here
```
Create your API key from: https://console.cloud.google.com/apis/credentials. Also ensure the Google Sheet is published to the web or set to Anyone with the link can view

### 4. Start development server
```bash
bun run dev
```
Open http://localhost:5173 in your browser.