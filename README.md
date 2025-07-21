# 🐾 Zoo Simulation

An interactive **predator–prey sandbox** built with **React + TypeScript + Vite**.  
Spawn herds, flocks, packs—and watch them roam, hunt, and reproduce in real‑time on an HTML `<canvas>`.

---

## 📸 Demo

<img src="docs/screenshot.gif" alt="Zoo Simulation in action" width="650"/>

*(gif optional – record with ScreenToGif or `peek` and drop it under `/docs`.)*

---

## Table of Contents
1. [Key Features](#key-features)  
2. [Species & Behaviours](#species--behaviours)  
3. [Getting Started](#getting-started)  
4. [Available Scripts](#available-scripts)  
5. [Simulation Rules](#simulation-rules)  
6. [Project Structure](#project-structure)  
7. [Customisation Guide](#customisation-guide)  
8. [Contributing](#contributing)  
9. [License](#license)

---

## 🔥 Key Features
| ★ | Description |
|---|-------------|
| **Live physics** | 33 fps update loop (`setInterval ≈ 30 ms`) draws every frame on a `<canvas>` |
| **Seven species** | Sheep, cows, chickens, roosters, wolves, lions, hunters |
| **Dynamic spawning** | Tune male / female / neutral counts before each run |
| **Reproduction** | Opposite‑sex pairs of the same species can create offspring |
| **Predation** | Wolves, lions, and hunters eliminate prey within range |
| **Tailwind UI** | Responsive controls & real‑time population stats |

---

## 🦁 Species & Behaviours

| Species | Emoji | Color | Speed | Can Reproduce? | Predates | Is Prey for |
|---------|-------|-------|-------|----------------|----------|-------------|
| Sheep   | 🟢 | `#b5e48c` | **2** | ✔︎ | — | Wolves • Lions |
| Cow     | 🟡 | `#ffd166` | **2** | ✔︎ | — | Lions |
| Chicken | ⚪ | `#f8f9fa` | **1** | ✖︎ | — | Wolves |
| Rooster | 🔴 | `#ff006e` | **1** | ✖︎ | — | Wolves |
| Wolf    | ⚫ | `#6d6875` | **3** | ✔︎ | Sheep • Chicken • Rooster | Hunter |
| Lion    | 🟠 | `#ffb703` | **4** | ✔︎ | Sheep • Cow | Hunter |
| Hunter  | 🔵 | `#023047` | **1** | ✖︎ | *Everything* | — |

> **Note** – neutral (`Y`) animals cannot reproduce. Only 👆 the *bold* speed values appear in `src/ZooSimulation.tsx`.

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js ≥ 18**  
- **npm** (bundled) or **pnpm / yarn** if preferred

### 2. Installation
```bash
git clone https://github.com/<your‑org>/zoo-simulation.git
cd zoo-simulation/zoo-sim
npm install

3. Run locally
npm run dev         # 🔥 Vite dev‑server on http://localhost:5173

4. Production build
npm run build       # Type‑check + minified assets under dist/
npm run preview     # Serve the build locally

📜 Available Scripts (package.json)
| Command           | Purpose                                   |
| ----------------- | ----------------------------------------- |
| `npm run dev`     | Launch Vite with hot‑module reload        |
| `npm run build`   | Type‑check (`tsc -b`) ➜ production bundle |
| `npm run preview` | Static preview of `/dist`                 |
| `npm run lint`    | ESLint checks (`eslint .`)                |

⚙️ Simulation Rules
| Process          | Implementation details                                                                                                                                                                           |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Movement**     | Each step an animal moves `speed` pixels in a random vector; positions are clamped to a 500 × 500 board (`GENISLIK`, `YUKSEKLIK`).                                                               |
| **Predation**    | <br>• **Wolf** – removes nearby sheep / chickens / roosters within **4 px**.<br>• **Lion** – removes sheep / cows within **5 px**.<br>• **Hunter** – removes *any* other entity within **8 px**. |
| **Reproduction** | Opposite‑sex pairs of the same species (sheep, cow, wolf, lion) within **3 px** spawn one offspring with random sex.                                                                             |
| **Step cap**     | Simulation halts automatically after **1000 steps** (`ADIM_SINIRI`).                                                                                                                             |
| **Frame rate**   | Fixed interval ≈ 33 fps (`setInterval(..., 30)`).                                                                                                                                                |
🗂 Project Structure
zoo-simulation/
└─ zoo-sim/
   ├─ public/              # Static assets (favicon, vite.svg …)
   ├─ src/
   │  ├─ ZooSimulation.tsx # 💡 Core simulation logic & UI
   │  ├─ App.tsx
   │  ├─ main.tsx
   │  ├─ App.css / index.css
   │  └─ vite-env.d.ts
   ├─ package.json
   ├─ tsconfig.json
   ├─ vite.config.ts
   └─ README.md            # ← you are here

🎛️ Customisation Guide
| Want to…                   | Do this                                                                                                                         |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| **Change board size**      | Update `GENISLIK`, `YUKSEKLIK` in `ZooSimulation.tsx`.                                                                          |
| **Add a new species**      | 1) Extend `Tur` union & constants (`RENKLER`, `RENK_EMOJISI`, `HIZ`).<br>2) Patch `avlanmayiIsle`, `uremeyiIsle`, and UI lists. |
| **Modify speeds / ranges** | Edit the `HIZ` table or distance checks (`uzaklik()` calls).                                                                    |
| **Style the UI**           | Tailwind classes live directly in JSX; global rules in `index.css`.                                                             |
| **Persist stats**          | Lift `hayvanlar` into Context or send to an API on each frame.                                                                  |
🤝 Contributing
Fork the repo and create a feature branch

Commit your changes (git commit -m "feat: add penguins 🐧")

Push to your fork and open a Pull Request

Please run npm run lint & ensure npm run build passes before submitting.
