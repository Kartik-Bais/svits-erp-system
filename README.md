# SVITS College ERP System

Welcome to the **SVITS College Management System**, an AI-powered, enterprise-grade ERP built to manage Academics, Campus Services, and Administrative tasks perfectly.

This repository is a monorepo containing both the robust **Node.js Backend** and the **React + Vite Frontend**.

---

## System Architecture

### 1. Frontend (`/svits-erp`)
A blazing-fast Single Page Application built with **React** and **Vite**.
- **Role-Based Portals**: Dedicated, secure interfaces for Students, Faculty, Admins, and Parents.
- **Modern UI/UX**: Custom CSS architecture with dark/light mode tokens, smooth micro-animations, and a responsive design.
- **State Management**: React Context API (`AuthContext`) and robust routing via `react-router-dom`.

### 2. Backend (`/server`)
An enterprise-grade RESTful API built with **Node.js**, **Express**, and **MongoDB**.
- **Core ERP Modules**: Course Registration, Attendance Tracking, Grading, Timetables.
- **Campus Services**: Library Management, Transport Routes, Hostel Allocation, Canteen Ordering.
- **Enterprise Capabilities**: Activity Audit Logs, Dashboard Analytics, Redis Queues (BullMQ) for background jobs like SMTP emails.
- **Security**: Hardened with Helmet, XSS-Clean, Express Mongo Sanitize, and stateless JWT Authentication.
- **Campus Assistant (AI)**: Google Gemini integration for document parsing, NLP schedule queries, and chat assistance.

---

## Quick Start Guide

### Prerequisites
- Node.js (v18+)
- MongoDB (v6+) or MongoDB Atlas
- Redis (v7+) (For backend background queues)

### 1. Booting the Backend
```bash
cd server
npm install --legacy-peer-deps

# Create your .env file and fill in your DB/Cloudinary/Gemini keys
cp .env.example .env

# Start the development server
npm run dev
```
> **API Documentation**: Once running, visit `http://localhost:5000/api-docs` to view the interactive Swagger interface.

### 2. Booting the Frontend
Open a new terminal window:
```bash
cd svits-erp
npm install

# Start the Vite dev server
npm run dev
```
> **Access the App**: Visit `http://localhost:5173` to view the UI and log in.

---

## Docker Deployment (Production)

The backend is fully containerized and ready for production orchestration.
```bash
cd server
docker-compose up -d --build
```
This instantly spins up the Node API, MongoDB, and Redis in isolated containers on a shared network.

---

## Advanced Documentation

Detailed documentation for the backend infrastructure can be found in the `server/docs/` directory:
- [Architecture Guide](./server/docs/ARCHITECTURE.md)
- [Database Schema & ER Diagrams](./server/docs/DATABASE.md)
- [Deployment Guide](./server/docs/DEPLOYMENT.md)

---

### Project Developed for Sri Vaishnavi Institute of Technology and Science (SVITS)

### Project by Kartik Bais 