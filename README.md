# collabNotes

A real-time collaborative notes app — write and edit together, live.

## Live Demo
- **App:** [collabnotesdbd.vercel.app](https://collabnotesdbd.vercel.app)
- **API:** [collabnotes-94r1.onrender.com](https://collabnotes-94r1.onrender.com)

## What it does
collabNotes lets you create notes and collaborate on them in real time. Share a room code with anyone — they join, you both type, changes appear instantly on both screens.

## Features

**Authentication**
- Email & password register / login
- Google OAuth — one click sign in

**Notes**
- Create notes with a title
- Edit content in a clean minimal editor
- Delete notes you own
- All your notes in one dashboard

**Real-time Collaboration**
- Every note has a unique room code
- Share the code — anyone can join
- Changes sync live using WebSockets
- See how many users are online in the room

**More Features Comming Soon**

## Tech Stack

**Frontend** — React, Vite, Tailwind CSS, Socket.io Client, Axios, React Router

**Backend** — Node.js, Express, Socket.io, MongoDB, Mongoose, JWT, Passport.js, Google OAuth 2.0, bcryptjs

## Author
Built by [Deepak Sharma](https://www.linkedin.com/in/deepak-sharma-517279378/)