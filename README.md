# 🎯 3D Chess Strategy Trainer

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/Three.js-3D-green?style=for-the-badge&logo=three.js" alt="Three.js" />
  <img src="https://img.shields.io/badge/TypeScript-blue?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge" alt="License" />
</p>

<p align="center">
  <strong>An immersive 3D chess training platform with AI-powered analysis, blunder detection, and real-time evaluation.</strong>
</p>

<p align="center">
  Developed by <a href="https://github.com/shivanshsaxena"><strong>Shivansh Saxena</strong></a>
</p>

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🎮 **3D Interactive Board** | Immersive 3D chessboard with realistic pieces, smooth animations, and rotatable camera |
| 🤖 **AI-Powered Analysis** | Stockfish engine integration with real-time position evaluation |
| ⚠️ **Blunder Detection** | Automatic detection of mistakes with instant feedback |
| 🎯 **Candidate Moves** | Visual arrows showing the top engine suggestions |
| 📊 **Evaluation Bar** | Chess.com-style evaluation visualization |
| 🎨 **Glassmorphism UI** | Modern, premium dark theme interface |

---

## 🚀 Tech Stack

- **Frontend**: React 19, Next.js 16, TypeScript
- **3D Graphics**: Three.js, React Three Fiber, Drei
- **Chess Engine**: Stockfish.js, chess.js
- **State Management**: Zustand
- **Styling**: Tailwind CSS, Framer Motion
- **UI Components**: shadcn/ui

---

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+ or Bun
- npm, yarn, or bun

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/chess-trainer.git

# Navigate to the project
cd chess-trainer

# Install dependencies
bun install
# or
npm install

# Run the development server
bun run dev
# or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
/src
  /components
    /chess/           → 3D chess components (Board, Pieces, UI)
    /sections/        → Page sections (Home, About)
    /ui/              → Reusable UI components
  /hooks/             → Custom React hooks
  /store/             → Zustand state management
  /lib/               → Utility functions and helpers
  /app/               → Next.js App Router pages
```

---

## 🎮 How to Play

1. **Select a piece** by clicking on it
2. **Move** by clicking on a highlighted legal square
3. **Rotate** the board by dragging
4. **Zoom** with scroll wheel
5. Use the **right panel** for game controls and analysis

### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `←` `→` | Navigate move history |
| `U` | Undo last move |
| `F` | Flip board |
| `R` | Reset game |
| `Esc` | Deselect piece |

---

## 📜 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

### Copyright Notice

```
Copyright (c) 2024 Shivansh Saxena
```

**Attribution Required**: If you use, modify, or distribute this code, you must include the original copyright notice and attribution to **Shivansh Saxena**.

---

## 👤 Author

<div align="center">

### **Shivansh Saxena**

*Full-Stack Developer | 3D Web Enthusiast*

</div>

---

## ⭐ Show Your Support

If you found this project helpful or impressive, please consider:

- ⭐ **Starring** this repository
- 🍴 **Forking** it for your own projects (with attribution)
- 📢 **Sharing** it with others

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📧 Contact

For questions or collaboration opportunities, feel free to reach out!

---

<p align="center">
  Made with ❤️ by <strong>Shivansh Saxena</strong>
</p>
