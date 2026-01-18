# 💻 ArjunRajput.ai - VS Code Themed Portfolio

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-12-FF0055?style=for-the-badge&logo=framer)

**A unique developer portfolio designed to look and feel like Visual Studio Code**

[Live Demo](https://arjunrajput.ai) • [Report Bug](https://github.com/ArjunRajputGLA/Personal-Portfolio/issues) • [Request Feature](https://github.com/ArjunRajputGLA/Personal-Portfolio/issues)

</div>

---

## ✨ Features

### 🎨 VS Code Interface
- **Title Bar** - Functional menu with File, Edit, View options
- **Activity Bar** - Navigate between sections like VS Code's sidebar
- **Tab Bar** - Section tabs styled as editor tabs
- **Status Bar** - Dynamic information display at the bottom
- **Breadcrumb Navigation** - File path style navigation

### ⚡ Interactive Elements
- **Command Palette** (`Ctrl+P`) - Quick navigation and actions
- **Integrated Terminal** - Interactive terminal with custom commands
- **Settings Panel** - Customize themes, fonts, and preferences
- **Keyboard Shortcuts** (`F1`) - Full shortcut reference
- **Search Overlay** (`Ctrl+Shift+F`) - Search through portfolio content

### 🎮 Fun Extras
- **AI Chatbot** - Powered by Gemini API for interactive conversations
- **Matrix Easter Egg** - Konami code activated (↑↑↓↓←→←→BA)
- **Live Collaboration** - Simulated collaborative editing feature
- **Git Panel** - Source control styled sidebar
- **Extensions Panel** - Installable "extensions" showcase

### 📱 Responsive Design
- Fully responsive across all devices
- Mobile-friendly navigation
- Adaptive layout for different screen sizes

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ArjunRajputGLA/Personal-Portfolio.git
   cd Personal-Portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **Next.js 14** | React framework with App Router |
| **React 18** | UI component library |
| **TypeScript** | Type-safe JavaScript |
| **Tailwind CSS** | Utility-first styling |
| **Framer Motion** | Smooth animations |
| **Lucide React** | Beautiful icons |
| **Gemini API** | AI chatbot integration |

---

## 📁 Project Structure

```
src/
├── app/
│   ├── globals.css      # Global styles & CSS variables
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Main page component
├── components/
│   ├── layout/          # VS Code layout components
│   │   ├── ActivityBar.tsx
│   │   ├── Breadcrumb.tsx
│   │   ├── StatusBar.tsx
│   │   ├── TabBar.tsx
│   │   └── TitleBar.tsx
│   ├── sections/        # Portfolio sections
│   │   ├── AboutSection.tsx
│   │   ├── AchievementsSection.tsx
│   │   ├── ContactSection.tsx
│   │   ├── ExperienceSection.tsx
│   │   ├── GallerySection.tsx
│   │   ├── HeroSection.tsx
│   │   ├── ProjectsSection.tsx
│   │   └── SkillsSection.tsx
│   └── ui/              # Interactive UI components
│       ├── Chatbot.tsx
│       ├── CommandPalette.tsx
│       ├── Terminal.tsx
│       └── ...more
├── data/
│   └── resume-data.ts   # Portfolio content data
└── lib/
    └── gemini-api.ts    # AI integration
```

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl + P` | Open Command Palette |
| `Ctrl + Shift + F` | Open Search |
| `Ctrl + `` ` | Toggle Terminal |
| `Ctrl + ,` | Open Settings |
| `F1` | Show Keyboard Shortcuts |
| `Ctrl + B` | Toggle Sidebar |

---

## 🎨 Customization

### Themes
The portfolio supports both **Dark** and **Light** themes, switchable via:
- Settings panel
- Title bar theme toggle
- Command palette

### CSS Variables
Customize colors by modifying CSS variables in `globals.css`:

```css
:root {
  --vscode-bg: #1e1e1e;
  --vscode-sidebar: #252526;
  --vscode-accent: #007acc;
  /* ...more variables */
}
```

---

## 📦 Deployment

### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/ArjunRajputGLA/Personal-Portfolio)

### Manual Deployment

```bash
# Build for production
npm run build

# Start production server
npm start
```

---

## 🤝 Contributing

Contributions are welcome! Feel free to:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👨‍💻 Author

**Arjun Singh Rajput**

- 🎓 B.Tech Student at GLA University, Mathura
- 🏆 National Hackathon Winner - Pan IIT Alumni Imagine 2025
- 💻 700+ LeetCode Problems Solved

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/imstorm23203attherategmail/)
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/ArjunRajputGLA)
[![LeetCode](https://img.shields.io/badge/LeetCode-FFA116?style=for-the-badge&logo=leetcode&logoColor=black)](https://leetcode.com/u/arjun2k4/)

---

<div align="center">

**⭐ Star this repo if you found it helpful!**

Built with 💙 by Arjun Singh Rajput

</div>
