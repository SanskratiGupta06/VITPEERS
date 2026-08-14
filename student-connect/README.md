# VITPEERS — Connect. Collaborate. Grow Together.

A LinkedIn-style networking platform built specifically for VIT students
across all four campuses (Bhopal, Vellore, Chennai, Amravati). Find and
connect with seniors and peers based on campus, branch, and year — then
message, call, or schedule a call, all inside the app.

## Features
- Signup restricted to official VIT college email addresses
- Login always requires a password (no persistent auto-login — session
  clears when the browser is closed)
- Structured student profiles: campus, branch, year, specialization,
  description/bio, interests, skills
- Profile picture upload (auto-resized/compressed client-side)
- Social links: LinkedIn, GitHub, Instagram, Telegram
- **Private phone numbers** — your number is hidden by default; other users
  must send a request, and it's only revealed if you approve it
- Discover/search students with filters
- Send, accept, and reject connection requests
- **In-app messaging** — a full chat interface between accepted connections
- **Voice & video calls** — instant calls via Jitsi Meet (no signup needed
  for either party), plus a **schedule a call** flow that requires the
  other person to accept before a room is created
- Notification system with unread badge count
- Fully responsive, custom-designed, colorful UI (not a default template)
- Backend test suite covering email validation logic

## Tech Stack
- **Frontend:** React (Vite) + Tailwind CSS + React Router + lucide-react icons
- **Backend:** Node.js + Express + JWT auth
- **Database:** MongoDB (Atlas)
- **Calls:** Jitsi Meet (free, no API key required, rooms generated per pair of users)

---

## 1. Run it locally

### Prerequisites
- [Node.js](https://nodejs.org) (v18 or higher)
- A free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) account

### Step 1 — Get a MongoDB connection string
1. Sign up at MongoDB Atlas, create a free (M0) cluster.
2. Under **Database Access**, create a database user with a simple
   alphanumeric password (avoid `@ # % /` — they break the connection URL).
3. Under **Network Access**, click **Add IP Address** → **Allow access from anywhere**.
4. Click **Connect** → **Drivers**, copy the connection string.

### Step 2 — Backend setup
```bash
cd backend
npm install
cp .env.example .env
```
Fill in `.env`:
```
PORT=5000
MONGO_URI=your_mongodb_connection_string_here
JWT_SECRET=any_long_random_string_here
CLIENT_URL=http://localhost:5173
```
Run it:
```bash
npm run dev
```
You should see `Connected to MongoDB` and `Server running on port 5000`.

### Run backend tests
```bash
npm test
```

### Step 3 — Frontend setup
Open a **new terminal**:
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```
Open the printed URL (usually `http://localhost:5173`). Sign up with a
college email ending in `vitstudent.ac.in`, `vitbhopal.ac.in`, `vit.ac.in`,
or `vitap.ac.in` (edit the list in `backend/utils/validators.js` to add more).

---

## 2. How the key features work

### Phone number privacy
A user's phone number is never included in the Discover/search results.
On someone's profile, other users see "Phone number is private" with a
**Request number** button. The profile owner gets a notification and can
Allow or Deny from their own profile page — only then does the number appear.

### Changing your email
From **Edit Profile**, click **Change email**, enter the new VIT email —
a 6-digit code is sent to that new address. Nothing changes until the code is
confirmed, so no one can take over an account by typing in someone else's
email by mistake or on purpose.

### Clubs & Positions
Also from **Edit Profile**, add any number of club/team/position entries
(e.g. "Startup Club · Events Team · Head"). They show as clean cards on your
public profile.

### Interactive campus section
On the homepage, tapping a campus card (Vellore / Chennai / VIT-AP / Bhopal)
expands a details panel with real, verified facts about that campus
(founding year, focus areas) — no fabricated statistics.

### Messaging
Messaging is only available between **accepted connections** — this keeps
the chat spam-free. Open a connection's profile or the Connections page and
tap the message icon.

### Calls
- **Instant voice/video call**: click the phone or video icon in a chat —
  this opens a Jitsi Meet room in a new tab. Both people need to click their
  respective buttons to join the same room.
- **Schedule a call**: propose a date/time from the chat header. The other
  person accepts or declines from the **Calls** page in the navbar. Once
  accepted, a **Join call** button appears for both people.

---

## Troubleshooting

### "Signup failed. Please try again." with no other detail
This generic message only appears when the browser couldn't reach the
backend at all (not a validation error — those show a specific reason).
Check:
1. Is the backend terminal still running (`npm run dev` in `backend/`)?
2. Does `frontend/.env`'s `VITE_API_URL` point to the right backend URL?
3. Look at the **backend terminal** — errors are now logged there with
   `console.error`, so the real cause (bad Mongo connection, validation
   error, etc.) will show up even if the browser message is generic.

### Forgot-password email never arrives
The backend logs `✉️ Reset email accepted by SMTP server for <email>` when
your mail server successfully accepts the message — if you see that line but
the email still doesn't show up:
1. **Check spam/junk folder first** — college mail servers are often
   aggressive about filtering mail from personal Gmail SMTP relays. This is
   the most common cause.
2. For local testing without waiting on email: the backend also logs
   `🔑 Password reset code for <email>: <code>` directly in your terminal —
   use that code to test the flow end-to-end.
3. If you don't see the "accepted by SMTP server" line at all, or see an
   error instead, your `EMAIL_HOST` / `EMAIL_USER` / `EMAIL_PASS` in
   `backend/.env` aren't set correctly. See the Gmail App Password steps in
   `.env.example`.

---

## 3. Push to GitHub

```bash
cd VITPEERS
git init
git add .
git commit -m "Initial commit: VITPEERS platform"
```
Create an empty repo at [github.com/new](https://github.com/new), then:
```bash
git remote add origin https://github.com/YOUR_USERNAME/vitmate.git
git branch -M main
git push -u origin main
```

---

## 4. Deploy — get your live link

### Backend on Render
1. [render.com](https://render.com) → sign up with GitHub → **New +** → **Web Service**.
2. Root directory: `backend` · Build: `npm install` · Start: `npm start`.
3. Add environment variables: `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL`
   (update `CLIENT_URL` once you have the Vercel URL from the next step).

### Frontend on Vercel
1. [vercel.com](https://vercel.com) → sign up with GitHub → **Add New** → **Project**.
2. Root directory: `frontend` (Vite auto-detected).
3. Environment variable: `VITE_API_URL` = `https://your-backend.onrender.com/api`.
4. Deploy — you'll get a live link like `https://vitmate.vercel.app`.

Then go back to Render and update `CLIENT_URL` to your real Vercel URL, and
redeploy the backend so CORS allows requests from your live frontend.

---

## 5. What to put on your resume / GitHub
- **Live demo:** your Vercel link
- **GitHub repo:** make it public
- Add a screenshot or short GIF to this README
- Talk about the technical decisions in interviews: college-email-restricted
  signup, request-based phone number privacy, connection-gated messaging,
  Jitsi-based calling with a scheduling/approval flow, JWT auth
