# Irnum · The Birthday Memoirs (October XXI)

A bespoke, high-luxury, interactive birthday exhibition and tribute website dedicated to **Irnum** for her birthday on **October 21**.

Crafted with high-end editorial aesthetics (obsidian & champagne gold), zero emojis, authentic heartfelt prose, and dynamic 3D interactions inspired by **21st.dev** and modern design engineering.

---

## Key Features & Architecture

1. **Date-Restricted Gatekeeper (October 21 Unlock Engine)**
   - Automatically remains locked with an animated countdown until **October 21, 2026, 00:00:00**.
   - Includes a **VIP / Creator Preview Bypass** (`Passcode: 2110` or the 1-click **"Instant Pass"** button) so you can review and test the entire site immediately before the celebration.
   - Cinematic dissolve & golden stardust celebration upon unlocking.

2. **Zero Emojis Standard & Authentic Tone**
   - No generic emojis or clichés.
   - Refined serif typography (*Cormorant Garamond*, *Cinzel*, *Plus Jakarta Sans*, *Space Mono*), hairline borders, and geometric SVG accents.
   - Thoughtful, mature, and sincere prose reflecting genuine respect and admiration for Irnum.

3. **3D Coverflow Memoirs (21st.dev Component)**
   - Interactive 3D perspective slider featuring highlighted portrait frames.
   - Full drag, touch-swipe, and keyboard arrow navigation.
   - Active card elevation (`scale(1.08)`), depth-of-field blur on side cards, and click-to-lightbox.

4. **Living Motion Cinema (All 9 Video Reels)**
   - Dedicated showcase for all 9 Snapchat video stories (`.mp4`).
   - Smooth video auto-preview on card hover.
   - Theater playback modal with full controls.

5. **Museum Bento Grid Archive (All 41 Curated Photos)**
   - Displays all 41 photographs from your `cocomo` archive in an architectural bento grid.
   - Dynamic 3D card tilt & spotlight radial glow following mouse coordinates.
   - Category filters: *All (41)*, *Portraits*, *Candid*, *Aesthetics*.

6. **The Sealed Archival Letter**
   - Confidential correspondence sealed with a digital monogram wax seal ("I").
   - Clicking the seal breaks it with a sound chime and unfolds the deep tribute letter.

7. **Generative Ambient Sound Engine**
   - Built with the Web Audio API (zero external MP3 dependencies that could break or fail to load).
   - Generates warm, celestial pentatonic ambient chords and tactile click haptics.
   - Toggle button with animated equalizer in the header.

8. **Digital Guestbook / Memory Capsule**
   - Allows leaving personal messages stored persistently in `localStorage`.

---

## Project Structure

```
happy-birthday-irnum/
├── index.html                  # Main application entry point
├── README.md                   # Project documentation & GitHub push guide
├── .gitignore                  # Git ignore rules
└── assets/
    ├── css/
    │   └── style.css           # Luxury styles, custom animations, keyframes
    ├── js/
    │   ├── app.js              # Main coordinator & canvas particle galaxy
    │   ├── audio.js            # Web Audio API ambient chord synthesizer
    │   ├── countdown.js        # Date lock & countdown controller
    │   ├── gallery-data.js     # Manifest of all 50 media files & reflections
    │   ├── slider.js           # 21st.dev 3D Coverflow carousel
    │   └── tilt.js             # Aceternity-style 3D tilt & spotlight glare
    └── media/
        ├── Snapchat-*.jpg      # 41 Curated Photographs
        └── Snapchat-*.mp4      # 09 Curated Video Stories
```

---

## How to Test Locally

1. Simply double-click `index.html` or open it with any modern browser (Chrome, Edge, Safari, Firefox).
2. Alternatively, run a lightweight local server from this directory:
   ```powershell
   npx serve .
   # or
   python -m http.server 8000
   ```
3. To bypass the countdown gate for testing, click **"Creator Preview Access"** and use code `2110` or click **"Instant Pass"**.

---

## How to Push to GitHub & Launch GitHub Pages

You can host this site for free on GitHub Pages in under 2 minutes:

1. **Initialize Git and Commit**:
   ```bash
   cd "C:\Users\AA COMPUTER\.gemini\antigravity\scratch\happy-birthday-irnum"
   git init
   git add .
   git commit -m "feat: Initial release of Irnum's Birthday Memoirs website"
   ```

2. **Create a GitHub Repository**:
   - Go to [github.com/new](https://github.com/new).
   - Name the repository (e.g. `happy-birthday-irnum` or `irnum-xxi`).
   - Leave it Public and click **Create repository**.

3. **Link Remote and Push**:
   ```bash
   git branch -M main
   git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/happy-birthday-irnum.git
   git push -u origin main
   ```

4. **Enable GitHub Pages**:
   - Go to your repository on GitHub.
   - Click **Settings** -> **Pages** (in the left sidebar).
   - Under **Build and deployment > Branch**, select `main` and `/ (root)`, then click **Save**.
   - Within 60 seconds, GitHub will give you a live URL:
     `https://<YOUR_GITHUB_USERNAME>.github.io/happy-birthday-irnum/`
   - Share this link with Irnum on October 21!
