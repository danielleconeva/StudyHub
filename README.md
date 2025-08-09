# **StudyHub**

**StudyHub** is a modern web application built with **Angular** that focuses on enhancing productivity and organization for students and self-learners. It offers a distraction-free study environment, intelligent task management, and tools to create and share structured study resources.  

---

## **Features**

- **Authentication & User Management** – Secure email/password login with Firebase Authentication, persistent sessions, Firestore-synced user profiles, and owner-based access control for tasks, study pages, and comments.  
- **My Study Pages** – Create and manage private study content, toggle visibility instantly, filter and search by subject/status/keywords, and safely edit or delete with confirmation prompts.  
- **Detailed Page View** – View rich HTML-formatted notes, track syllabus progress in real time, access linked resources, and participate in comment threads with live updates.  
- **Explore Catalog** – Browse public study pages, search and filter by subject or popularity/date, like pages with optimistic UI updates, and view author details and engagement metrics.  
- **Task Management** – Organize tasks by subject and priority, track progress through subtasks, add subtasks inline, and view completion percentages — all with owner-only editing and batch loading.  
- **Focus Room** – Use Pomodoro-style timers (Focus, Short Break, Long Break), play looped ambient sounds with volume control, receive daily motivational quotes, and control sessions with start, pause, and reset.  
- **Responsive UI** – Custom CSS with glassmorphism aesthetics, optimized for accessibility and smooth interaction across devices.  

---

## **Tech Stack**
- **Angular v20** – Standalone components, Signals for reactive state management, routing, and animations.  
- **Firebase** – Authentication and Firestore for real-time data persistence.  
- **RxJS** – Reactive data streams using operators like `map`, `tap`, and `switchMap`.  
- **Custom CSS** – Modern, responsive layout with glassmorphism effects.  
- **Font Awesome & SVG** – Iconography and scalable vector graphics for crisp, resolution-independent UI elements.  
- **Google Fonts (Inter)** – Clean and modern typography.  

---

## **Project Architecture**
- **Modular Feature Structure** – Auth, Tasks, Focus Room, Study Pages (Explore & My Pages).  
- **Routing** – Implemented using `provideRouter` with lazy-loaded modules.  
- **Composable UI** – Standalone components for reusable cards, task items, and study page items.  
- **Global Services** – Authentication, error handling, Firestore communication.  
- **Signal-First State Management** – Uses `signal`, `computed`, and `effect` for reactive UI updates directly tied to Firestore streams.  
- **Route Guards** – Enforces access control for public and private routes.  
- **Animations** – Angular animations for card transitions and interactive elements.  

---

## **Firebase Integration**
- **Authentication** – Secure user registration, login, and session management via Firebase Authentication.  
- **Database** – Firestore as the primary real-time NoSQL database for study pages, tasks, comments, likes, and user profiles.  
- **Configuration** – Firebase services initialized in `app.config.ts` using `provideFirebaseApp()` and related functions.  

---

## **Setup & Installation**
```bash
# 1. Clone the repository
git clone https://github.com/danielleconeva/StudyHub.git
cd StudyHub

# 2. Install dependencies
npm install

# 3. Run the development server
npm start

# 4. Open in browser
http://localhost:4200/
```

---

## **Usage Guide**
- **Register or Sign In** – Access personalized features and persistent data.  
- **Focus Room** – Start a study session with customizable timers and ambient soundscapes.  
- **Task Management** – Create and manage tasks with priorities, subtasks, and progress tracking.  
- **Study Pages** – Add, edit, and organize study notes; toggle public/private visibility.  
- **Explore** – Discover community-shared pages, leave comments, and like your favorites.  

---

## **License & Contributions**
This project was developed as part of a university assignment and is publicly available under an open license on GitHub.  
Contributions are welcome — fork the repository and submit a pull request for review.  
