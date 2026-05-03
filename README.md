<p align="center">
  <img src="public/logo2.png" alt="AiMS Nation Logo" width="100" />
</p>

<h1 align="center">AiMS Nation | Next-Gen E-Learning Platform</h1>

<p align="center">
A premium, highly animated, AI-driven educational platform built with Next.js 16, React 19, and Tailwind CSS v4.
</p>

🔗 [View Live Project](https://aims-nation.vercel.app/)

---

## 🚀 Overview

AiMS Nation is an enterprise-grade EdTech platform designed to bridge the gap between students and modern technical education (Robotics, AI, Art).

The frontend architecture is built to handle complex business logic through strict Role-Based Access Control (RBAC), isolating experiences for Admins, Teachers, and Students. It features a seamless checkout flow, interactive dashboards, and an integrated AI Tutor powered by an industry-standard RAG (Retrieval-Augmented Generation) pipeline.

---

## ✨ Core Features

### 🤖 Context-Aware AI Tutor (RAG)

A floating AI assistant integrated via Google Gemini. The chatbot queries the backend vector database to answer user questions regarding course fees, schedules, and trends using strictly verified institutional data.

### 🔐 Edge-Protected Role Routing

Utilizes Next.js Edge Middleware (`proxy.ts`) and better-auth to securely route and restrict users to their dedicated workspaces (Admin, Teacher, Student).

### 🎓 Dynamic Dashboards

- **Admin**  
  Complete oversight over course creation, financial tracking, student management, and teacher recruitment/assignment.

- **Teacher**  
  Dedicated portal for uploading course materials and submitting weekly performance reports for enrolled students.

- **Student**  
  Secure enrollment flow, checkout gateway, invoice generation, and private access to course materials.

### ✨ Premium UI/UX Engineering

Built with Framer Motion and Shadcn UI to deliver a highly interactive, animated, and accessible user experience that feels like a top-tier SaaS product.

### 🌙 Theming

Full Light/Dark mode support using next-themes.

---

## 🛠️ Tech Stack

### Framework & Core

- Next.js (v16.2): App Router, Server Components, Edge Middleware
- React (v19): Concurrent rendering
- TypeScript: Strict type safety

### Styling & Animation

- Tailwind CSS (v4)
- Framer Motion
- Shadcn UI & Radix UI
- Lucide React & React Icons

### State, Auth & Forms

- Better-Auth
- React Hook Form + Zod
- Axios (with interceptors)

---

## 📂 Project Architecture

```plaintext
src/
├── app/
│   ├── (commonLayout)/          # Public routes (Home, About, Courses, Checkout)
│   ├── (dashboardLayout)/       # Protected dashboard routes
│   │   ├── admin/dashboard      # Admin workspace
│   │   ├── dashboard            # Student workspace
│   │   └── teacher              # Teacher workspace
│   ├── _actions/                # Server Actions
│   └── layout.tsx & page.tsx
├── components/
│   ├── home/                    # Landing sections
│   ├── shared/                  # Reusable UI
│   └── ui/                      # Shadcn primitives
├── hooks/                       # Custom hooks
├── lib/
│   ├── axios/                   # HTTP client
│   └── authUtils.ts             # Role logic
├── services/                    # API layers
├── types/                       # Global types
└── proxy.ts                     # Edge Middleware
```

## 💻 Getting Started (Local Development)

To run this project locally:

### Prerequisites

- Node.js (v20 or higher)
- npm or yarn

---

### 1. Clone the repository

```bash
git clone https://github.com/shamsssarar/frontend-aims_nation.git
cd frontend-aims_nation
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
```

### 3. Set up environment variables

Create a `.env` file in the root directory based on the provided `.env.example` and fill in the necessary values:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
```

Make sure to replace `your-google-client-id` with your actual Google OAuth client ID.

### 4. Run the development server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application in action.

## 🧑‍💻 Author

Shams Sarar |
Aspiring Full-Stack Developer | Passionate about building innovative web applications
[GitHub](https://github.com/shamsssarar)
