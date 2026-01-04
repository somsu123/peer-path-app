# PeerPath – Anonymous Student Decision Sanctuary

PeerPath is an anonymous, AI-assisted platform designed for college students to seek academic and career advice from verified seniors and alumni. It cuts through the noise of casual chat groups by providing structured mentorship and AI-powered clarity.

## 🚀 Deploying to Netlify (Easy Guide)

### 1. Push to GitHub
Upload all the project files (including `index.html`, `index.tsx`, `netlify.toml`, etc.) to a new GitHub repository.

### 2. Connect to Netlify
1.  Log in to [Netlify](https://www.netlify.com/).
2.  Click **"Add new site"** > **"Import an existing project"**.
3.  Choose **GitHub** and select your repository.
4.  **Build Settings**: Netlify should automatically detect the `publish` directory as `.` from the `netlify.toml`. You can leave the "Build command" empty.

### 3. Add Gemini API Key
This is the most important step for the AI features to work:
1.  In the Netlify site dashboard, go to **Site Configuration** > **Environment variables**.
2.  Click **"Add a variable"**.
3.  Key: `API_KEY`
4.  Value: `[Your Google Gemini API Key]` (Get one at [ai.google.dev](https://ai.google.dev/))
5.  Trigger a new deploy or click "Deploy site" again to apply the changes.

---

## 💡 Hackathon Pitch

**Problem**: Student advice on campus is fragmented. WhatsApp groups are noisy, judgment is a barrier to asking "stupid" questions, and valuable senior wisdom is lost in scroll-back.

**Solution**: PeerPath provides a **Structured Sanctuary**.
- **AI Co-pilot**: Uses Gemini to turn messy student queries into clear, actionable questions with baseline paths.
- **Anonymity**: Students ask freely without fear of being judged by peers or professors.
- **Structured Mentorship**: Instead of simple messages, mentors provide Pros/Cons and 30-day action plans.
- **AI Synthesis**: Automatically summarizes long threads of advice into a "Consensus" vs "Conflict" view.

## 🛠️ Tech Stack
- **Frontend**: React + Tailwind CSS
- **AI**: Google Gemini (Flash & Pro models)
- **State/Storage**: MockDB (Ready for easy Firestore migration)
- **Deployment**: Netlify

---
*Built with ❤️ for the Campus Community.*
