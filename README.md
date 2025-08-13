# **StudyHub**

**StudyHub** is a modern web application built with **Angular** that focuses on enhancing productivity and organization for students and self-learners. It offers a distraction-free study environment, intelligent task management, and tools to create and share structured study resources.  

**Live Demo:**  
🔗 **[https://studyhub-6b7d9.web.app](https://studyhub-6b7d9.web.app)**  

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

# 3. Run the development server (local environment)
npm start

# 4. Open in browser
http://localhost:4200/
```
> For production deployment, the application is hosted on **Firebase Hosting**. See the live version in the Usage Guide below.

---

## **Usage Guide**
The application is live and accessible at:  
🔗 **[https://studyhub-6b7d9.web.app](https://studyhub-6b7d9.web.app)**  

For a full demonstration of the platform’s features, you can log in with the following test account:  
- **Email:** `alice@abv.bg`  
- **Password:** `123456`  

Alternatively, you may register a new account directly within the application to explore the features with your own profile.  

**Core usage workflow:**  
1. **Sign In / Register** – Authenticate to unlock personalized features and persistent data.  
2. **Focus Room** – Initiate a study session with customizable timers and ambient audio.  
3. **Task Management** – Create, prioritize, and track tasks with real-time progress updates.  
4. **Study Pages** – Add, edit, and manage your notes; toggle public/private visibility as needed.  
5. **Explore Catalog** – Browse public resources, apply filters, like pages, and join comment discussions.  

---

## **License**
This project was developed as part of a university assignment and is publicly available on GitHub for demonstration purposes.
