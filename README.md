# Smart URL Shortener Platform 🚀

A production-ready, full-stack URL shortening platform built with Java Spring Boot and React.js. Features an intelligent AI-powered metadata scraper, built-in spam detection, real-time analytics, and dynamic QR code generation.

## 🌟 Key Features

*   **Intelligent URL Shortening:** Automatically scrapes metadata (Title, Description) from target URLs to categorize links (e.g., Technology, Education, Entertainment).
*   **AI Spam Detection:** Built-in heuristic engine that actively blocks suspicious URLs, high-risk domains (`.xyz`), and phishing attempts before they enter the database.
*   **Advanced Analytics:** Track total clicks, unique devices, global countries, and view traffic timelines using beautifully rendered interactive charts (Recharts).
*   **Custom Aliases:** Create branded, memorable links instead of random character strings (e.g., `domain.com/my-brand`).
*   **Instant QR Codes:** Generate and download custom SVG QR codes on the fly for physical marketing.
*   **Modern UI/UX:** Built with React, Tailwind CSS, ShadCN, and Framer Motion for buttery-smooth animations and glassmorphism design. Fully supports Light and Dark modes.

## 🛠️ Tech Stack

**Backend:**
*   Java 8
*   Spring Boot 2.7.x
*   Spring Data JPA (Hibernate)
*   MySQL 8.0
*   Jsoup (HTML Parsing & Metadata Extraction)

**Frontend:**
*   React.js 18
*   Vite
*   Tailwind CSS
*   Framer Motion
*   Recharts (Data Visualization)
*   Lucide React (Icons)

## 🚀 Getting Started

### Prerequisites
*   Java 8 installed
*   Node.js (v18+)
*   MySQL Server running locally

### 1. Database Setup
1. Open your MySQL client.
2. Create a database named `quicklink`:
   ```sql
   CREATE DATABASE quicklink;
   ```
3. Update the `backend/src/main/resources/application.properties` with your MySQL credentials (username and password).

### 2. Run the Backend (Spring Boot)
Open a terminal in the `backend` directory and run:
```bash
mvn clean spring-boot:run
```
The server will start on `http://localhost:8080`. Hibernate will automatically generate the required database tables.

### 3. Run the Frontend (React)
Open a new terminal in the `frontend` directory and run:
```bash
npm install
npm run dev
```
The client will start on `http://localhost:5173`.

## 📜 License
This project is licensed under the MIT License.
