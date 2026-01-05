'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Terminal as TerminalIcon, 
  Minus, 
  Square, 
  X, 
  ChevronUp, 
  Copy, 
  Check, 
  HelpCircle,
  Lightbulb,
  BookOpen,
  Sparkles,
  MousePointer
} from 'lucide-react';

interface TerminalProps {
  isOpen: boolean;
  onToggle: () => void;
  onNavigate?: (section: string) => void;
  onThemeToggle?: () => void;
  onNotification?: (message: string, type: 'info' | 'success' | 'warning' | 'error') => void;
  onMatrixActivate?: () => void;
}

interface TerminalLine {
  id: number;
  type: 'input' | 'output' | 'error' | 'success' | 'info' | 'ascii' | 'matrix' | 'tutorial';
  content: string;
  timestamp?: Date;
  clickable?: boolean;
  command?: string;
}

interface ContactFormState {
  active: boolean;
  step: 'name' | 'email' | 'message' | 'confirm' | 'done';
  name: string;
  email: string;
  message: string;
}

// Tutorial step interface
interface TutorialStep {
  id: number;
  title: string;
  description: string;
  expectedCommand?: string;
  alternateCommands?: string[];
  hint: string;
  successMessage: string;
}

// Tutorial steps
const tutorialSteps: TutorialStep[] = [
  {
    id: 1,
    title: "Introduction",
    description: "Welcome! This terminal lets you explore Arjun's portfolio using text commands.",
    hint: "Just read and press Enter or type 'next'",
    successMessage: "Great! Let's learn your first command!"
  },
  {
    id: 2,
    title: "Your First Command - whoami",
    description: "Type 'whoami' to learn about Arjun.",
    expectedCommand: "whoami",
    hint: "Type: whoami",
    successMessage: "Perfect! You learned about Arjun! 🎉"
  },
  {
    id: 3,
    title: "List Projects - ls",
    description: "Type 'ls projects' to see all projects.",
    expectedCommand: "ls projects",
    alternateCommands: ["ls projects/"],
    hint: "Type: ls projects",
    successMessage: "Excellent! You can see all the projects! 📁"
  },
  {
    id: 4,
    title: "View Details - cat",
    description: "Type 'cat agentix' to see project details.",
    expectedCommand: "cat agentix",
    alternateCommands: ["cat projects/agentix"],
    hint: "Type: cat agentix",
    successMessage: "Great! Now you know how to view details! 🔍"
  },
  {
    id: 5,
    title: "Get Help - help",
    description: "Type 'help' to see all available commands!",
    expectedCommand: "help",
    hint: "Type: help",
    successMessage: "🎉 Congratulations! Tutorial complete!"
  }
];

// Fuzzy match function for command suggestions
function fuzzyMatch(str: string, pattern: string): number {
  if (pattern.length === 0) return 0;
  if (str.length === 0) return -1;
  
  str = str.toLowerCase();
  pattern = pattern.toLowerCase();
  
  let score = 0;
  let patternIdx = 0;
  let consecutiveBonus = 0;
  
  for (let i = 0; i < str.length && patternIdx < pattern.length; i++) {
    if (str[i] === pattern[patternIdx]) {
      score += 1 + consecutiveBonus;
      consecutiveBonus += 2;
      patternIdx++;
    } else {
      consecutiveBonus = 0;
    }
  }
  
  return patternIdx === pattern.length ? score : -1;
}

// Find similar commands
function findSimilarCommands(input: string, commands: string[]): string[] {
  const results: { cmd: string; score: number }[] = [];
  
  for (const cmd of commands) {
    const score = fuzzyMatch(cmd, input);
    if (score > 0) {
      results.push({ cmd, score });
    }
  }
  
  // Also check for simple typos (Levenshtein distance <= 2)
  for (const cmd of commands) {
    if (!results.find(r => r.cmd === cmd)) {
      const distance = levenshteinDistance(input.toLowerCase(), cmd.toLowerCase());
      if (distance <= 2 && distance > 0) {
        results.push({ cmd, score: 10 - distance });
      }
    }
  }
  
  return results
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(r => r.cmd);
}

// Levenshtein distance for typo detection
function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];
  
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b[i - 1] === a[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  
  return matrix[b.length][a.length];
}

const programmingJokes = [
  "Why do programmers prefer dark mode? Because light attracts bugs! 🐛",
  "A SQL query walks into a bar, walks up to two tables and asks... 'Can I join you?' 🍺",
  "Why do Java developers wear glasses? Because they can't C#! 👓",
  "There are only 10 types of people: those who understand binary and those who don't. 🔢",
  "Why did the developer go broke? Because he used up all his cache! 💸",
  "A programmer's wife tells him: 'Go to the store and buy a loaf of bread. If they have eggs, buy a dozen.' He returns with 12 loaves. 🍞",
  "!false - It's funny because it's true. 😄",
  "Why do programmers hate nature? It has too many bugs and no documentation. 🌲",
];

const motivationalQuotes = [
  '"The only way to do great work is to love what you do." - Steve Jobs',
  '"Innovation distinguishes between a leader and a follower." - Steve Jobs',
  '"Stay hungry, stay foolish." - Steve Jobs',
  '"Code is like humor. When you have to explain it, it\'s bad." - Cory House',
  '"First, solve the problem. Then, write the code." - John Johnson',
  '"The best error message is the one that never shows up." - Thomas Fuchs',
  '"Simplicity is the soul of efficiency." - Austin Freeman',
];

const projects = {
  'no-code-backend': {
    name: 'NO CODE BACKEND',
    description: 'AI-assisted visual platform to design, validate, and export production-ready backend systems with drag-and-drop workflows',
    tech: ['AI', 'Visual Programming', 'Backend Development'],
    status: 'Active'
  },
  agentix: {
    name: 'AGENTIX',
    description: 'Real-time AI agent comparison platform with live performance metrics',
    tech: ['AI Agents', 'Real-time Analytics', 'Full-Stack'],
    status: 'Live',
    achievement: '🏆 National Hackathon Winner - Pan IIT Alumni Imagine 2025',
    link: 'https://agentix-ai.vercel.app/'
  },
  'gla-canteen': {
    name: 'GLA Canteen Application',
    description: 'Full-stack application to order, receive, and manage food items in university canteen',
    tech: ['React.js', 'Node.js', 'MongoDB'],
    status: 'Active'
  },
  'jarvis-arena': {
    name: 'J.A.R.V.I.S Arena',
    description: 'Robust gaming website and playground providing amazing user experience',
    tech: ['JavaScript', 'React.js', 'Gaming'],
    status: 'Active'
  },
  'article-analyser': {
    name: 'Article Analyser',
    description: 'Intel UNNATI Programme 2024 project for analyzing articles using NLP',
    tech: ['NLP', 'Python', 'Gemini API', 'Streamlit'],
    status: 'Completed',
    certification: 'Intel UNNATI Programme 2024',
    link: 'https://article-analyzer-via-gemini-weshallworkwithease.streamlit.app/'
  },
  'smart-classroom': {
    name: 'Smart AI Classroom',
    description: 'Intel UNNATI Programme 2025 project for AI-powered classroom management',
    tech: ['AI/ML', 'Computer Vision', 'Educational Technology'],
    status: 'Active',
    certification: 'Intel UNNATI Programme 2025'
  },
  'fluxor': {
    name: 'FLUXOR - AI File Manager',
    description: 'Application to manage system files efficiently using AI',
    tech: ['Electron.js', 'AI', 'File System APIs'],
    status: 'Active'
  },
  'portfolio': {
    name: 'VS Code Portfolio',
    description: 'This very portfolio you\'re exploring!',
    tech: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
    status: 'Live'
  }
};

const skills = {
  languages: ['Python', 'Java', 'JavaScript', 'TypeScript', 'HTML', 'CSS', 'SQL'],
  frameworks: ['React.js', 'Next.js', 'Tailwind CSS', 'Node.js', 'Electron.js'],
  tools: ['Git', 'VS Code', 'REST APIs', 'MongoDB'],
  ai_ml: ['PyTorch', 'Scikit-Learn', 'NLP', 'Deep Learning', 'Machine Learning', 'Computer Vision']
};

const socialLinks = {
  github: 'https://github.com/ArjunRajputGLA',
  linkedin: 'https://www.linkedin.com/in/imstorm23203attherategmail/',
  leetcode: 'https://leetcode.com/u/CodeXI/',
  email: 'imstorm23203@gmail.com'
};

export default function Terminal({ isOpen, onToggle, onNavigate, onThemeToggle, onNotification, onMatrixActivate }: TerminalProps) {
  const [lines, setLines] = useState<TerminalLine[]>([
    { id: 0, type: 'info', content: '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' },
    { id: 1, type: 'info', content: '  Welcome to ArjunRajput.ai Terminal v1.0.0' },
    { id: 2, type: 'info', content: '  Type "help" to see available commands' },
    { id: 3, type: 'info', content: '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' },
    { id: 4, type: 'output', content: '' },
  ]);
  const [currentInput, setCurrentInput] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [terminalHeight, setTerminalHeight] = useState(250);
  const [isResizing, setIsResizing] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [contactForm, setContactForm] = useState<ContactFormState>({
    active: false,
    step: 'name',
    name: '',
    email: '',
    message: ''
  });
  const [matrixActive, setMatrixActive] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState(0);
  
  // Pre-generate random values for matrix rain effect (using useState to avoid impure render)
  const [matrixRainData] = useState(() => 
    [...Array(50)].map(() => ({
      left: Math.random() * 100,
      duration: 2 + Math.random() * 3,
      delay: Math.random() * 2,
      char: String.fromCharCode(0x30A0 + Math.random() * 96)
    }))
  );
  
  // Tutorial state
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [tutorialActive, setTutorialActive] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);
  const [showQuickRef, setShowQuickRef] = useState(false);
  const [commandCount, setCommandCount] = useState(0);
  const [showHintBubble, setShowHintBubble] = useState(false);
  const [hintBubbleMessage, setHintBubbleMessage] = useState('');
  const [hasCompletedTutorial, setHasCompletedTutorial] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const lineIdRef = useRef(5);

  const allCommands = [
    'help', 'clear', 'home', 'about', 'skills', 'skills-network', 'network', 'visualize-skills', 'projects', 'experience', 
    'achievements', 'gallery', 'games', 'playground', 'play', 'contact', 'whoami', 'ls', 'cat', 'status',
    'social', 'resume', 'hire', 'collaborate', 'email', 'theme', 'sidebar',
    'minimap', 'stats', 'lighthouse', 'history', 'sudo', 'hack-nasa', 
    'matrix', 'joke', 'quote', 'konami', 'neofetch', 'cowsay', 'fortune',
    'tutorial', '?'
  ];

  // Check for first-time user on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && isOpen) {
      const tutorialCompleted = localStorage.getItem('terminal-tutorial-completed');
      const tutorialSkipped = localStorage.getItem('terminal-tutorial-skipped');
      
      if (tutorialSkipped !== 'true' && tutorialCompleted !== 'true') {
        // First time - show welcome modal after a short delay
        const timer = setTimeout(() => {
          setShowWelcomeModal(true);
        }, 800);
        return () => clearTimeout(timer);
      }
    }
  }, [isOpen]);

  // Read localStorage value for tutorial completion on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setHasCompletedTutorial(localStorage.getItem('terminal-tutorial-completed') === 'true');
    }
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [lines]);

  // Focus input when terminal opens
  useEffect(() => {
    if (isOpen && inputRef.current && !isMinimized) {
      inputRef.current.focus();
    }
  }, [isOpen, isMinimized]);

  // Compute autocomplete suggestions as derived state
  const suggestions = useMemo(() => {
    if (currentInput && !contactForm.active) {
      const matches = allCommands.filter(cmd => 
        cmd.toLowerCase().startsWith(currentInput.toLowerCase())
      );
      return matches.slice(0, 5);
    }
    return [];
  }, [currentInput, contactForm.active, allCommands]);

  const addLine = useCallback((type: TerminalLine['type'], content: string, clickable?: boolean, command?: string) => {
    const newLine: TerminalLine = {
      id: lineIdRef.current++,
      type,
      content,
      timestamp: new Date(),
      clickable,
      command
    };
    setLines(prev => [...prev, newLine]);
  }, []);

  // Tutorial functions
  const showContextualHint = useCallback((message: string) => {
    setHintBubbleMessage(message);
    setShowHintBubble(true);
    setTimeout(() => setShowHintBubble(false), 5000);
  }, []);

  const startTutorial = useCallback(() => {
    setShowWelcomeModal(false);
    setTutorialActive(true);
    setTutorialStep(2); // Start at step 2 (whoami) since welcome modal covers intro
    localStorage.setItem('terminal-tutorial-started', 'true');
    
    // Show first actual command step (whoami)
    const step = tutorialSteps[1]; // Step 2 - whoami
    addLine('info', '');
    addLine('tutorial', '╔═══════════════════════════════════════════════════════════╗');
    addLine('tutorial', `║  🎓 TUTORIAL - Step 1/4: ${step.title.padEnd(33)}║`);
    addLine('tutorial', '║                                                           ║');
    addLine('tutorial', '║  This terminal lets you explore the portfolio using       ║');
    addLine('tutorial', '║  simple text commands - like having a conversation!       ║');
    addLine('tutorial', '║                                                           ║');
    addLine('tutorial', `║  💡 ${step.hint.padEnd(54)}║`);
    addLine('tutorial', '╚═══════════════════════════════════════════════════════════╝');
    addLine('info', '');
  }, [addLine]);

  const skipTutorial = useCallback(() => {
    setShowWelcomeModal(false);
    setTutorialActive(false);
    setTutorialStep(0);
    localStorage.setItem('terminal-tutorial-skipped', 'true');
    
    addLine('info', '');
    addLine('info', '💡 Tutorial skipped. Type "help" for commands or "tutorial" to restart.');
    addLine('info', '');
    
    // Show a hint after skipping
    setTimeout(() => {
      showContextualHint('Type "help" to see all available commands!');
    }, 2000);
  }, [addLine, showContextualHint]);

  const advanceTutorial = useCallback(() => {
    const nextStep = tutorialStep + 1;
    
    // We have 5 steps total (1-5), but we start at step 2, so we show as 1-4 to user
    // When nextStep > 5, tutorial is complete
    if (nextStep > tutorialSteps.length) {
      // Tutorial complete!
      setTutorialActive(false);
      setHasCompletedTutorial(true);
      localStorage.setItem('terminal-tutorial-completed', 'true');
      setShowCompletionModal(true);
      
      if (onNotification) {
        onNotification('🎉 Tutorial completed! You\'re a terminal pro now!', 'success');
      }
      return;
    }
    
    setTutorialStep(nextStep);
    const step = tutorialSteps[nextStep - 1];
    const displayStep = nextStep - 1; // Show as 1-4 instead of 2-5
    const totalDisplaySteps = tutorialSteps.length - 1; // 4 steps shown to user
    
    addLine('info', '');
    addLine('tutorial', `╔═══════════════════════════════════════════════════════════╗`);
    addLine('tutorial', `║  🎓 TUTORIAL - Step ${displayStep}/${totalDisplaySteps}: ${step.title.padEnd(36)}║`);
    addLine('tutorial', `║                                                           ║`);
    addLine('tutorial', `║  ${step.description.padEnd(57)}║`);
    addLine('tutorial', `║                                                           ║`);
    addLine('tutorial', `║  💡 ${step.hint.padEnd(54)}║`);
    addLine('tutorial', `╚═══════════════════════════════════════════════════════════╝`);
    addLine('info', '');
  }, [tutorialStep, addLine, onNotification]);

  const validateTutorialCommand = useCallback((cmd: string): boolean => {
    if (!tutorialActive || tutorialStep === 0) return true;
    
    const step = tutorialSteps[tutorialStep - 1];
    if (!step.expectedCommand) return true;
    
    const normalized = cmd.trim().toLowerCase();
    const expected = step.expectedCommand.toLowerCase();
    const alternates = step.alternateCommands?.map(c => c.toLowerCase()) || [];
    
    return normalized === expected || alternates.includes(normalized);
  }, [tutorialActive, tutorialStep]);

  const resetTutorial = useCallback(() => {
    localStorage.removeItem('terminal-tutorial-completed');
    localStorage.removeItem('terminal-tutorial-skipped');
    localStorage.removeItem('terminal-tutorial-started');
    setHasCompletedTutorial(false);
    setTutorialActive(false);
    setTutorialStep(0);
    setShowWelcomeModal(true);
  }, []);

  const handleNavigate = (section: string) => {
    if (onNavigate) {
      onNavigate(section);
      addLine('success', `✓ Navigating to ${section} section...`);
    }
  };

  const handleContactFormInput = useCallback((input: string) => {
    switch (contactForm.step) {
      case 'name':
        setContactForm(prev => ({ ...prev, name: input, step: 'email' }));
        addLine('input', `> ${input}`);
        addLine('output', 'Enter your email:');
        break;
      case 'email':
        if (input.includes('@')) {
          setContactForm(prev => ({ ...prev, email: input, step: 'message' }));
          addLine('input', `> ${input}`);
          addLine('output', 'Enter your message:');
        } else {
          addLine('error', 'Please enter a valid email address:');
        }
        break;
      case 'message':
        setContactForm(prev => ({ ...prev, message: input, step: 'confirm' }));
        addLine('input', `> ${input}`);
        addLine('output', 'Send message? (y/n):');
        break;
      case 'confirm':
        if (input.toLowerCase() === 'y' || input.toLowerCase() === 'yes') {
          addLine('input', `> ${input}`);
          addLine('info', '');
          addLine('success', '✓ Message sent successfully!');
          addLine('success', '📬 You\'ll hear back within 24 hours.');
          addLine('info', '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
          addLine('info', '');
          if (onNotification) {
            onNotification('Message sent successfully! 📬', 'success');
          }
        } else {
          addLine('input', `> ${input}`);
          addLine('info', 'Message cancelled.');
        }
        setContactForm({ active: false, step: 'name', name: '', email: '', message: '' });
        break;
    }
  }, [contactForm.step, addLine, onNotification]);

  const processCommand = useCallback(async (cmd: string) => {
    const trimmedCmd = cmd.trim().toLowerCase();
    const parts = trimmedCmd.split(' ');
    const command = parts[0];
    const args = parts.slice(1);

    // Handle contact form mode
    if (contactForm.active) {
      handleContactFormInput(cmd.trim());
      return;
    }

    // Add command to history
    if (cmd.trim()) {
      setCommandHistory(prev => [...prev, cmd.trim()]);
      setHistoryIndex(-1);
      setCommandCount(prev => prev + 1);
    }

    // Add input line
    addLine('input', `arjun@portfolio:~$ ${cmd}`);

    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 200));
    setIsProcessing(false);

    // Check if in tutorial mode and validate command
    let tutorialCommandValid = false;
    if (tutorialActive && tutorialStep > 0) {
      const step = tutorialSteps[tutorialStep - 1];
      if (step.expectedCommand) {
        if (validateTutorialCommand(trimmedCmd)) {
          // Mark as valid - we'll show success AFTER command executes
          tutorialCommandValid = true;
        } else if (trimmedCmd && trimmedCmd !== 'skip' && trimmedCmd !== 'exit' && trimmedCmd !== 'help') {
          // Wrong command during tutorial
          addLine('error', `❌ Not quite! ${step.hint}`);
          addLine('info', '💡 Type "skip" to skip this step or "exit" to exit tutorial');
          return;
        }
      }
    }

    // Helper function to handle tutorial advancement after command
    const handleTutorialAdvancement = () => {
      if (tutorialCommandValid) {
        const step = tutorialSteps[tutorialStep - 1];
        setTimeout(() => {
          addLine('info', '');
          addLine('success', `✅ ${step.successMessage}`);
          setTimeout(() => advanceTutorial(), 800);
        }, 500);
      }
    };

    // Process commands
    switch (command) {
      case 'help':
        // Check for category number
        const helpCategory = args[0];
        if (helpCategory === '1' || helpCategory === 'navigation') {
          addLine('info', '');
          addLine('info', '🧭 NAVIGATION COMMANDS');
          addLine('info', '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
          addLine('output', '  home          - Jump to the hero section');
          addLine('output', '  about         - Learn about Arjun');
          addLine('output', '  skills        - View technical skills');
          addLine('output', '  network       - 🧠 Skills Neural Network (NEW!)');
          addLine('output', '  projects      - Browse all projects');
          addLine('output', '  experience    - See work experience');
          addLine('output', '  achievements  - View awards & accomplishments');
          addLine('output', '  gallery       - Photo gallery');
          addLine('output', '  games         - 🎮 Games Playground');
          addLine('output', '  contact       - Get in touch');
          addLine('info', '');
          addLine('info', '💡 Just type the section name and press Enter!');
        } else if (helpCategory === '2' || helpCategory === 'info') {
          addLine('info', '');
          addLine('info', '📋 INFORMATION COMMANDS');
          addLine('info', '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
          addLine('output', '  whoami          - Brief intro about Arjun');
          addLine('output', '  ls              - List directory contents');
          addLine('output', '  ls projects     - List all projects');
          addLine('output', '  cat <project>   - View project details');
          addLine('output', '  skills --list   - Display all technical skills');
          addLine('output', '  social --links  - Show social media links');
          addLine('output', '  status          - Current availability');
          addLine('output', '  stats           - Portfolio statistics');
          addLine('output', '  lighthouse      - Performance metrics');
          addLine('info', '');
          addLine('info', '💡 Example: cat agentix');
        } else if (helpCategory === '3' || helpCategory === 'contact') {
          addLine('info', '');
          addLine('info', '💬 CONTACT & INTERACTIVE');
          addLine('info', '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
          addLine('output', '  contact --message  - Open interactive contact form');
          addLine('output', '  email "message"    - Quick email (in quotes)');
          addLine('output', '  hire               - Hiring information');
          addLine('output', '  collaborate        - Collaboration opportunities');
          addLine('output', '  resume --download  - Download resume (PDF)');
          addLine('info', '');
          addLine('info', '💡 Try: contact --message');
        } else if (helpCategory === '4' || helpCategory === 'system') {
          addLine('info', '');
          addLine('info', '⚙️ SYSTEM COMMANDS');
          addLine('info', '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
          addLine('output', '  clear          - Clear terminal screen');
          addLine('output', '  theme --toggle - Switch light/dark theme');
          addLine('output', '  history        - View command history');
          addLine('output', '  exit / quit    - Close terminal');
          addLine('info', '');
          addLine('info', '⌨️ KEYBOARD SHORTCUTS:');
          addLine('output', '  ↑ / ↓          - Navigate command history');
          addLine('output', '  Tab            - Autocomplete command');
          addLine('output', '  Ctrl+L         - Clear terminal');
          addLine('output', '  Ctrl+C         - Cancel current input');
          addLine('output', '  ?              - Toggle quick reference panel');
        } else if (helpCategory === '5' || helpCategory === 'fun') {
          addLine('info', '');
          addLine('info', '🎮 FUN COMMANDS (Easter Eggs!)');
          addLine('info', '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
          addLine('output', '  games / play    - 🎮 Open Games Playground (NEW!)');
          addLine('output', '  joke            - Get a programming joke');
          addLine('output', '  quote           - Inspirational quote');
          addLine('output', '  fortune         - Tell your fortune');
          addLine('output', '  cowsay <text>   - ASCII cow says your text');
          addLine('output', '  neofetch        - System information');
          addLine('output', '  matrix          - Enter the Matrix');
          addLine('output', '  konami          - Try the famous code');
          addLine('output', '  sudo make-coffee- Essential command');
          addLine('output', '  hack-nasa       - Don\'t actually do this');
          addLine('info', '');
          addLine('info', '🕹️ Have fun exploring!');
        } else if (helpCategory === '6' || helpCategory === 'tutorial') {
          addLine('info', '');
          addLine('info', '🎓 TUTORIAL & HELP');
          addLine('info', '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
          addLine('output', '  tutorial        - Start interactive tutorial');
          addLine('output', '  tutorial --quick- Quick 3-command tutorial');
          addLine('output', '  tutorial --reset- Reset tutorial progress');
          addLine('output', '  help            - Show this help menu');
          addLine('output', '  help 1-6        - Show specific category');
          addLine('output', '  ?               - Toggle quick reference panel');
          addLine('info', '');
          addLine('info', '💡 New here? Try: tutorial');
        } else {
          // Main help menu
          addLine('info', '');
          addLine('info', '📚 TERMINAL HELP - ArjunRajput.ai');
          addLine('info', '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
          addLine('info', '');
          addLine('success', '  Type "help <number>" for detailed commands:');
          addLine('info', '');
          addLine('output', '  help 1  │ 🧭 Navigation   - Move between sections');
          addLine('output', '  help 2  │ 📋 Information  - View projects, skills, etc.');
          addLine('output', '  help 3  │ 💬 Contact      - Get in touch, hire, collaborate');
          addLine('output', '  help 4  │ ⚙️  System       - Theme, clear, shortcuts');
          addLine('output', '  help 5  │ 🎮 Fun          - Easter eggs & entertainment');
          addLine('output', '  help 6  │ 🎓 Tutorial     - Learn how to use terminal');
          addLine('info', '');
          addLine('info', '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
          addLine('info', '');
          addLine('output', '  🚀 QUICK START:');
          addLine('tutorial', '    whoami        - Learn about Arjun', true, 'whoami');
          addLine('tutorial', '    ls projects   - See all projects', true, 'ls projects');
          addLine('tutorial', '    cat agentix   - View a project', true, 'cat agentix');
          addLine('info', '');
          addLine('info', '  💡 Tips: Press Tab to autocomplete, ↑↓ for history');
          addLine('info', '  💡 New here? Type "tutorial" for a guided tour!');
          addLine('info', '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
          handleTutorialAdvancement();
        }
        break;

      case 'tutorial':
        if (args[0] === '--quick') {
          addLine('info', '');
          addLine('tutorial', '⚡ QUICK TUTORIAL (3 Essential Commands)');
          addLine('info', '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
          addLine('output', '  1. whoami       - See who built this portfolio');
          addLine('output', '  2. ls projects  - List all projects');
          addLine('output', '  3. help         - See all commands');
          addLine('info', '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
          addLine('info', '💡 Try these commands now!');
          addLine('info', '');
        } else if (args[0] === '--reset') {
          resetTutorial();
          addLine('success', '✓ Tutorial progress reset. Starting fresh...');
        } else if (args[0] === '--skip' || args[0] === 'skip') {
          if (tutorialActive) {
            advanceTutorial();
          } else {
            addLine('info', 'No active tutorial to skip.');
          }
        } else {
          // Start full tutorial
          if (tutorialActive) {
            addLine('info', 'Tutorial already active! Type "exit" to quit or continue with the commands.');
          } else {
            startTutorial();
          }
        }
        break;

      case 'skip':
        if (tutorialActive) {
          advanceTutorial();
        } else {
          addLine('error', 'Nothing to skip. Type "help" for commands.');
        }
        break;

      case '?':
        // Toggle quick reference panel
        setShowQuickRef(prev => !prev);
        addLine('info', showQuickRef ? '📖 Quick reference closed' : '📖 Quick reference opened');
        break;

      case 'next':
        if (tutorialActive && tutorialStep === 1) {
          advanceTutorial();
        } else {
          addLine('error', `bash: next: command not found`);
        }
        break;

      case 'clear':
        setLines([]);
        break;

      case 'home':
      case 'about':
      case 'skills':
      case 'projects':
      case 'experience':
      case 'achievements':
      case 'gallery':
      case 'games':
      case 'contact':
        handleNavigate(command);
        break;

      case 'skills-network':
      case 'network':
      case 'visualize-skills':
        addLine('info', '');
        addLine('ascii', ' ╔═══════════════════════════════════════╗');
        addLine('ascii', ' ║    🧠 SKILLS NEURAL NETWORK 🧠       ║');
        addLine('ascii', ' ╚═══════════════════════════════════════╝');
        addLine('info', '');
        addLine('success', '📊 Interactive Skill Visualization Activated!');
        addLine('output', '');
        addLine('output', '   Features:');
        addLine('output', '   • Force-directed graph of 23+ skills');
        addLine('output', '   • Interactive hover & click details');
        addLine('output', '   • Filter by category or project');
        addLine('output', '   • Timeline animation (2021-2025)');
        addLine('output', '   • Real-time statistics panel');
        addLine('info', '');
        addLine('info', '💡 Tip: Click nodes to see connected projects!');
        addLine('info', '');
        handleNavigate('skills-network');
        break;

      case 'playground':
      case 'play':
        addLine('info', '');
        addLine('ascii', ' ╔═══════════════════════════════════════╗');
        addLine('ascii', ' ║    🎮 GAMES PLAYGROUND ACTIVATED! 🎮   ║');
        addLine('ascii', ' ╚═══════════════════════════════════════╝');
        addLine('info', '');
        addLine('success', '🕹️  9 Brain-Training Games Available:');
        addLine('output', '   • 2048        - Slide & merge numbers');
        addLine('output', '   • Sudoku      - Classic 9x9 puzzles');
        addLine('output', '   • Memory      - Match the cards');
        addLine('output', '   • Snake       - Classic arcade fun');
        addLine('output', '   • Minesweeper - Find the mines');
        addLine('output', '   • Math        - Quick calculations');
        addLine('output', '   • Sequence    - Pattern recognition');
        addLine('output', '   • Simon Says  - Memory patterns');
        addLine('output', '   • Color Match - Stroop effect');
        addLine('info', '');
        addLine('info', '🎯 Earn achievements & track your high scores!');
        addLine('info', '');
        handleNavigate('games');
        break;

      case 'whoami':
        addLine('info', '');
        addLine('ascii', '    _          _             ____        _             _   ');
        addLine('ascii', '   / \\   _ __ (_)_   _ _ __ |  _ \\ __ _ (_)_ __  _   _| |_ ');
        addLine('ascii', '  / _ \\ | \'__|| | | | | \'_ \\| |_) / _` || | \'_ \\| | | | __|');
        addLine('ascii', ' / ___ \\| |   | | |_| | | | |  _ < (_| || | |_) | |_| | |_ ');
        addLine('ascii', '/_/   \\_\\_|  _/ |\\__,_|_| |_|_| \\_\\__,_|/ | .__/ \\__,_|\\__|');
        addLine('ascii', '            |__/                      |__/|_|              ');
        addLine('info', '');
        addLine('success', '👨‍💻 Arjun Singh Rajput');
        addLine('output', '   B.Tech Student | AI Innovator | Full-Stack Developer');
        addLine('info', '');
        addLine('output', '🎓 GLA University, Mathura (Expected April 2027)');
        addLine('output', '🏆 National Hackathon Winner - Pan IIT Alumni Imagine 2025');
        addLine('output', '💻 700+ LeetCode Problems Solved');
        addLine('output', '📍 Mathura, India');
        addLine('output', '🚀 Creator of AGENTIX - AI Agent Comparison Platform');
        addLine('info', '');
        addLine('info', '   "Transforming ideas into intelligent systems"');
        addLine('info', '');
        handleTutorialAdvancement();
        break;

      case 'ls':
        if (args[0] === 'projects' || args[0] === 'projects/') {
          addLine('info', '');
          addLine('output', '📁 projects/');
          addLine('output', '├── 🚀 agentix/           [FEATURED] AI Agent Comparison Platform');
          addLine('output', '├── 💻 no-code-backend/   AI Visual Backend Builder');
          addLine('output', '├── 🍕 gla-canteen/       University Food Ordering App');
          addLine('output', '├── 🎮 jarvis-arena/      Gaming Website & Playground');
          addLine('output', '├── 📝 article-analyser/  Intel UNNATI NLP Project');
          addLine('output', '├── 🎓 smart-classroom/   AI-Powered EdTech Solution');
          addLine('output', '├── 📂 fluxor/            AI File Manager');
          addLine('output', '└── 💼 portfolio/         This VS Code Portfolio');
          addLine('info', '');
          addLine('info', 'Use "cat <project-name>" for details');
          addLine('info', '');
          handleTutorialAdvancement();
        } else if (args[0]) {
          addLine('error', `ls: cannot access '${args[0]}': No such file or directory`);
        } else {
          addLine('output', '📁 src/');
          addLine('output', '├── index.tsx       (Home)');
          addLine('output', '├── about.md        (About)');
          addLine('output', '├── skills.json     (Skills)');
          addLine('output', '├── skills-network.tsx (Skills Network) 🧠 NEW!');
          addLine('output', '├── projects/       (Projects)');
          addLine('output', '├── experience.log  (Experience)');
          addLine('output', '├── achievements.yaml (Achievements)');
          addLine('output', '├── games/          (Games Playground) 🎮');
          addLine('output', '├── contact.tsx     (Contact)');
          addLine('output', '└── media/          (Gallery)');
        }
        break;

      case 'cat':
        const projectName = args.join('-').replace('projects/', '');
        const project = projects[projectName as keyof typeof projects];
        if (project) {
          addLine('info', '');
          addLine('success', `📦 ${project.name}`);
          addLine('info', '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
          addLine('output', `📝 ${project.description}`);
          addLine('output', `🛠️  Tech: ${project.tech.join(', ')}`);
          addLine('output', `📊 Status: ${project.status}`);
          if ('users' in project) addLine('output', `👥 Users: ${project.users}`);
          if ('accuracy' in project) addLine('output', `🎯 Accuracy: ${project.accuracy}`);
          if ('link' in project) addLine('info', `🔗 ${project.link}`);
          addLine('info', '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
          addLine('info', '');
          handleTutorialAdvancement();
        } else if (args[0]) {
          addLine('error', `cat: ${args[0]}: No such file or directory`);
          addLine('info', 'Available: agentix, malware-detection, article-analyser, legal-assistant, speech-to-text, portfolio, autonomous-agent');
        } else {
          addLine('error', 'Usage: cat <project-name>');
        }
        break;

      case 'skills':
        if (args[0] === '--list' || !args[0]) {
          addLine('info', '');
          addLine('success', '🎯 Technical Skills');
          addLine('info', '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
          addLine('output', `💻 Languages:  ${skills.languages.join(' • ')}`);
          addLine('output', `🔧 Frameworks: ${skills.frameworks.join(' • ')}`);
          addLine('output', `🛠️  Tools:      ${skills.tools.join(' • ')}`);
          addLine('output', `🤖 AI/ML:      ${skills.ai_ml.join(' • ')}`);
          addLine('info', '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
          addLine('info', '');
          addLine('info', '💡 Try "network" for interactive skills visualization!');
          addLine('info', '');
        } else if (args[0] === '--network') {
          handleNavigate('skills-network');
        }
        break;

      case 'social':
        if (args[0] === '--links' || !args[0]) {
          addLine('info', '');
          addLine('success', '🌐 Social Links');
          addLine('info', '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
          addLine('output', `🐙 GitHub:    ${socialLinks.github}`);
          addLine('output', `💼 LinkedIn:  ${socialLinks.linkedin}`);
          addLine('output', `💻 LeetCode:  ${socialLinks.leetcode}`);
          addLine('output', `📧 Email:     ${socialLinks.email}`);
          addLine('info', '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
          addLine('info', '');
        }
        break;

      case 'status':
        addLine('info', '');
        addLine('success', '🟢 AVAILABLE FOR OPPORTUNITIES');
        addLine('info', '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        addLine('output', '💼 Open to: Full-time, Contract, Freelance');
        addLine('output', '🌍 Location: Remote / India');
        addLine('output', '⏰ Response time: Usually within 24 hours');
        addLine('output', '📅 Availability: Immediate');
        addLine('info', '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        addLine('info', 'Use "contact --message" to get in touch!');
        addLine('info', '');
        break;

      case 'stats':
        addLine('info', '');
        addLine('success', '📊 Portfolio Statistics');
        addLine('info', '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        addLine('output', '📦 Projects:        7');
        addLine('output', '🏆 Achievements:    15+');
        addLine('output', '⚡ LeetCode:        500+ problems');
        addLine('output', '📜 Certifications:  10+');
        addLine('output', '👥 Users Impacted:  1,200+');
        addLine('output', '☕ Coffee Consumed: ∞');
        addLine('info', '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        addLine('info', '');
        break;

      case 'lighthouse':
        addLine('info', '');
        addLine('success', '⚡ Lighthouse Performance Report');
        addLine('info', '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        addLine('output', '🟢 Performance:    98/100');
        addLine('output', '🟢 Accessibility:  100/100');
        addLine('output', '🟢 Best Practices: 100/100');
        addLine('output', '🟢 SEO:            100/100');
        addLine('info', '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        addLine('success', '✨ All metrics looking great!');
        addLine('info', '');
        break;

      case 'resume':
        if (args[0] === '--download' || !args[0]) {
          addLine('info', '');
          addLine('success', '📄 Resume Download');
          addLine('output', 'Preparing download...');
          setTimeout(() => {
            // Trigger actual download
            const link = document.createElement('a');
            link.href = '/Arjun Resume.pdf';
            link.download = 'Arjun_Singh_Rajput_Resume.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            addLine('success', '✓ Resume downloaded successfully!');
            if (onNotification) {
              onNotification('Resume download started!', 'success');
            }
          }, 500);
        }
        break;

      case 'hire':
        addLine('info', '');
        addLine('success', '💼 Hiring Information');
        addLine('info', '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        addLine('output', '✨ Looking for an AI/ML Engineer or Full-Stack Developer?');
        addLine('output', '');
        addLine('output', '🎯 What I bring:');
        addLine('output', '   • 3+ years of development experience');
        addLine('output', '   • Expertise in AI/ML and LLMs');
        addLine('output', '   • Strong problem-solving skills');
        addLine('output', '   • National hackathon winner');
        addLine('output', '   • Fast learner and team player');
        addLine('output', '');
        addLine('output', '📧 Contact: arjun@arjunrajput.ai');
        addLine('info', '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        addLine('info', 'Use "contact --message" to start a conversation!');
        addLine('info', '');
        break;

      case 'collaborate':
        addLine('info', '');
        addLine('success', '🤝 Collaboration Options');
        addLine('info', '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        addLine('output', '🚀 Open to collaborating on:');
        addLine('output', '   • Open source AI/ML projects');
        addLine('output', '   • Hackathons and competitions');
        addLine('output', '   • Research projects');
        addLine('output', '   • Startup ventures');
        addLine('output', '   • Technical writing');
        addLine('output', '');
        addLine('output', '📧 Reach out: arjun@arjunrajput.ai');
        addLine('info', '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        addLine('info', '');
        break;

      case 'contact':
        if (args[0] === '--message') {
          addLine('info', '');
          addLine('success', '📧 Terminal Contact Form');
          addLine('info', '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
          addLine('output', 'Enter your name:');
          setContactForm({ active: true, step: 'name', name: '', email: '', message: '' });
        } else {
          handleNavigate('contact');
        }
        break;

      case 'email':
        const emailMessage = args.join(' ').replace(/"/g, '');
        if (emailMessage) {
          addLine('info', '');
          addLine('output', `📧 Sending message: "${emailMessage}"`);
          setTimeout(() => {
            addLine('success', '✓ Message queued! (Demo mode - use contact form for real messages)');
          }, 500);
        } else {
          addLine('error', 'Usage: email "Your message here"');
        }
        break;

      case 'theme':
        if (args[0] === '--toggle' || !args[0]) {
          if (onThemeToggle) {
            onThemeToggle();
            addLine('success', '✓ Theme toggled!');
          } else {
            addLine('info', 'Theme toggle not available in this context');
          }
        }
        break;

      case 'sidebar':
        if (args[0] === '--toggle' || !args[0]) {
          addLine('info', 'Use Ctrl+B to toggle sidebar');
        }
        break;

      case 'minimap':
        if (args[0] === '--toggle' || !args[0]) {
          addLine('info', 'Minimap feature: Click the minimap on the right to navigate');
        }
        break;

      case 'history':
        addLine('info', '');
        addLine('success', '📜 Command History');
        addLine('info', '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        if (commandHistory.length === 0) {
          addLine('output', '  (empty)');
        } else {
          commandHistory.slice(-10).forEach((cmd, idx) => {
            addLine('output', `  ${idx + 1}. ${cmd}`);
          });
        }
        addLine('info', '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        addLine('info', '');
        break;

      case 'joke':
        const randomJoke = programmingJokes[Math.floor(Math.random() * programmingJokes.length)];
        addLine('info', '');
        addLine('success', '😄 Programming Joke:');
        addLine('output', `   ${randomJoke}`);
        addLine('info', '');
        break;

      case 'quote':
        const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
        addLine('info', '');
        addLine('success', '💡 Quote of the moment:');
        addLine('output', `   ${randomQuote}`);
        addLine('info', '');
        break;

      case 'fortune':
        const fortunes = [
          'A great opportunity will come your way soon. Be ready! 🌟',
          'Your next project will be your biggest success yet. 🚀',
          'Someone is impressed by your portfolio right now. 👀',
          'The bug you\'re looking for is on line 42. Always. 🐛',
          'Coffee levels are optimal for maximum productivity. ☕',
        ];
        const fortune = fortunes[Math.floor(Math.random() * fortunes.length)];
        addLine('info', '');
        addLine('success', '🔮 Your fortune:');
        addLine('output', `   ${fortune}`);
        addLine('info', '');
        break;

      case 'cowsay':
        const message = args.join(' ') || 'Moo! Hire Arjun!';
        addLine('info', '');
        addLine('ascii', ' ' + '_'.repeat(message.length + 2));
        addLine('ascii', `< ${message} >`);
        addLine('ascii', ' ' + '-'.repeat(message.length + 2));
        addLine('ascii', '        \\   ^__^');
        addLine('ascii', '         \\  (oo)\\_______');
        addLine('ascii', '            (__)\\       )\\/\\');
        addLine('ascii', '                ||----w |');
        addLine('ascii', '                ||     ||');
        addLine('info', '');
        break;

      case 'neofetch':
        addLine('info', '');
        addLine('ascii', '       _,met$$$$$gg.');
        addLine('ascii', '    ,g$$$$$$$$$$$$$$$P.');
        addLine('ascii', '  ,g$$P"     """Y$$.".        arjun@portfolio');
        addLine('ascii', ' ,$$P\'              `$$$.     ----------------');
        addLine('ascii', '\',$$P       ,ggs.     `$$b:   OS: ArjunOS x64');
        addLine('ascii', '`d$$\'     ,$P"\'   .    $$$    Host: Portfolio v1.0');
        addLine('ascii', ' $$P      d$\'     ,    $$P    Kernel: Next.js 14');
        addLine('ascii', ' $$:      $$.   -    ,d$$\'    Uptime: Always Online');
        addLine('ascii', ' $$;      Y$b._   _,d$P\'      Shell: ArjunShell');
        addLine('ascii', ' Y$$.    `.`"Y$$$$P"\'         Theme: VS Code Dark+');
        addLine('ascii', ' `$$b      "-.__              Terminal: ArjunTerm');
        addLine('ascii', '  `Y$$                        CPU: Coffee Powered');
        addLine('ascii', '   `Y$$.                      Memory: ∞ Ideas');
        addLine('ascii', '     `$$b.                    GPU: Imagination RTX');
        addLine('ascii', '       `Y$$b.');
        addLine('ascii', '          `"Y$b._');
        addLine('ascii', '              `"""');
        addLine('info', '');
        break;

      case 'matrix':
        addLine('success', '🟢 Entering the Matrix...');
        if (onMatrixActivate) {
          onMatrixActivate();
        } else {
          setMatrixActive(true);
          setTimeout(() => {
            setMatrixActive(false);
            addLine('info', '🔴 Exited the Matrix. Welcome back to reality.');
          }, 5000);
        }
        if (onNotification) {
          onNotification('🎮 Achievement Unlocked: Matrix Explorer!', 'success');
        }
        break;

      case 'konami':
        addLine('info', '');
        addLine('success', '🎮 KONAMI CODE ACTIVATED!');
        addLine('ascii', '  ⬆️ ⬆️ ⬇️ ⬇️ ⬅️ ➡️ ⬅️ ➡️ 🅱️ 🅰️');
        addLine('info', '');
        addLine('success', '🎉 Achievement Unlocked: Konami Master!');
        addLine('output', '   You found the secret code!');
        addLine('output', '   +30 lives added to your career!');
        addLine('info', '');
        if (onNotification) {
          onNotification('🎮 Achievement Unlocked: Konami Master!', 'success');
        }
        break;

      case 'sudo':
        if (args.join(' ') === 'make-coffee' || args.join('-') === 'make-coffee') {
          addLine('info', '');
          addLine('output', '☕ Brewing coffee...');
          setTimeout(() => {
            addLine('success', '   ╔═══════════════════════╗');
            addLine('success', '   ║  ~~~~~~  ☕  ~~~~~~   ║');
            addLine('success', '   ║   Coffee is ready!    ║');
            addLine('success', '   ╚═══════════════════════╝');
          }, 1000);
        } else if (args[0]) {
          addLine('error', `[sudo] password for arjun: `);
          setTimeout(() => {
            addLine('error', 'Sorry, user arjun is not in the sudoers file.');
            addLine('error', 'This incident will be reported. 😈');
          }, 500);
        } else {
          addLine('error', 'usage: sudo <command>');
        }
        break;

      case 'hack-nasa':
        addLine('info', '');
        addLine('error', '🚨 ALERT: Unauthorized access attempt detected!');
        addLine('output', '');
        addLine('output', '   Connecting to NASA mainframe...');
        setTimeout(() => {
          addLine('output', '   Bypassing firewall... [FAILED]');
          addLine('output', '   Attempting backdoor... [DENIED]');
          addLine('output', '   Trying social engineering... [NICE TRY]');
          addLine('error', '');
          addLine('error', '   🛑 Just kidding! I\'m a good developer.');
          addLine('error', '   👀 FBI has been notified... of your curiosity!');
          addLine('error', '   ');
          addLine('success', '   💡 Pro tip: Use your powers for good!');
        }, 1500);
        break;

      case 'exit':
      case 'quit':
        if (tutorialActive) {
          setTutorialActive(false);
          setTutorialStep(0);
          addLine('info', '👋 Exited tutorial. Type "tutorial" to restart anytime!');
        } else {
          addLine('output', 'Goodbye! 👋');
          setTimeout(() => onToggle(), 500);
        }
        break;

      case '':
        // Empty command, just show new prompt
        break;

      default:
        // Check for similar commands (typo correction)
        const similarCommands = findSimilarCommands(command, allCommands);
        
        if (similarCommands.length > 0) {
          addLine('error', `bash: ${command}: command not found`);
          addLine('info', `💡 Did you mean: ${similarCommands.join(', ')}?`);
        } else {
          addLine('error', `bash: ${command}: command not found`);
          addLine('info', 'Type "help" to see available commands');
        }
        
        // Show hint for first-time users
        if (commandCount < 3 && !hasCompletedTutorial) {
          showContextualHint('💡 Tip: Type "tutorial" for a guided tour!');
        }
    }
  }, [addLine, contactForm.active, commandHistory, handleNavigate, onThemeToggle, onToggle, onNotification, tutorialActive, tutorialStep, validateTutorialCommand, advanceTutorial, commandCount, hasCompletedTutorial, showContextualHint, allCommands, showQuickRef, startTutorial, resetTutorial, onMatrixActivate, handleContactFormInput]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      processCommand(currentInput);
      setCurrentInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (suggestions.length > 0) {
        setSelectedSuggestion(prev => Math.max(0, prev - 1));
      } else if (commandHistory.length > 0) {
        const newIndex = historyIndex < commandHistory.length - 1 ? historyIndex + 1 : historyIndex;
        setHistoryIndex(newIndex);
        setCurrentInput(commandHistory[commandHistory.length - 1 - newIndex] || '');
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (suggestions.length > 0) {
        setSelectedSuggestion(prev => Math.min(suggestions.length - 1, prev + 1));
      } else if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setCurrentInput(commandHistory[commandHistory.length - 1 - newIndex] || '');
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setCurrentInput('');
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      if (suggestions.length > 0) {
        setCurrentInput(suggestions[selectedSuggestion]);
      }
    } else if (e.key === 'Escape') {
      if (contactForm.active) {
        setContactForm({ active: false, step: 'name', name: '', email: '', message: '' });
        addLine('info', 'Contact form cancelled.');
      }
    } else if (e.ctrlKey && e.key === 'l') {
      e.preventDefault();
      setLines([]);
    } else if (e.ctrlKey && e.key === 'c') {
      e.preventDefault();
      if (contactForm.active) {
        setContactForm({ active: false, step: 'name', name: '', email: '', message: '' });
        addLine('info', '^C');
      } else {
        setCurrentInput('');
        addLine('info', '^C');
      }
    }
  };

  const copyToClipboard = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setIsResizing(true);
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isResizing) {
        const newHeight = window.innerHeight - e.clientY - 22; // 22 for status bar
        setTerminalHeight(Math.max(150, Math.min(600, newHeight)));
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  const getLineColor = (type: TerminalLine['type']) => {
    switch (type) {
      case 'input': return 'text-[var(--vscode-text)]';
      case 'output': return 'text-[var(--vscode-text-muted)]';
      case 'error': return 'text-red-400';
      case 'success': return 'text-green-400';
      case 'info': return 'text-[var(--vscode-accent)]';
      case 'ascii': return 'text-[var(--vscode-accent)]';
      case 'matrix': return 'text-green-500';
      case 'tutorial': return 'text-yellow-400';
      default: return 'text-[var(--vscode-text)]';
    }
  };

  // Execute clickable command
  const executeClickableCommand = (command: string) => {
    setCurrentInput(command);
    processCommand(command);
    setCurrentInput('');
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Welcome Tutorial Modal */}
      <AnimatePresence>
        {showWelcomeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm"
            onClick={() => setShowWelcomeModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-[#252526] border border-[#569cd6] rounded-lg shadow-2xl max-w-lg w-full mx-4 overflow-hidden"
            >
              {/* Top gradient */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#569cd6] via-[#4ec9b0] to-[#569cd6]" />
              
              {/* Close button */}
              <button
                onClick={() => setShowWelcomeModal(false)}
                className="absolute top-3 right-3 p-1 text-[#808080] hover:text-[#d4d4d4] hover:bg-[#3e3e3e] rounded transition-colors"
                title="Close welcome dialog"
              >
                <X size={18} />
              </button>

              <div className="p-8 text-center">
                {/* Animated wave emoji */}
                <motion.div 
                  className="text-5xl mb-4"
                  animate={{ rotate: [0, 14, -8, 14, -4, 10, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
                >
                  👋
                </motion.div>
                
                <h2 className="text-2xl font-bold text-[#d4d4d4] mb-2">
                  Welcome to Arjun&apos;s Terminal!
                </h2>
                
                <p className="text-[#808080] mb-6 leading-relaxed">
                  This portfolio features an <span className="text-[#4ec9b0]">interactive terminal</span> where
                  you can explore my work using simple text commands.
                </p>

                <div className="bg-[#1e1e1e] rounded-lg p-4 mb-6 border border-[#3e3e3e]">
                  <p className="text-[#d4d4d4] text-sm">
                    Would you like a quick tutorial? <span className="text-[#808080]">(~30 sec)</span>
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={startTutorial}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-[#569cd6] text-white rounded-lg font-medium hover:bg-[#4a8bc7] transition-colors"
                  >
                    <Sparkles size={18} className="animate-pulse" />
                    Yes, show me!
                  </motion.button>
                  
                  <button
                    onClick={skipTutorial}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-[#3e3e3e] text-[#d4d4d4] rounded-lg font-medium hover:bg-[#4e4e4e] transition-colors"
                  >
                    Skip, I&apos;ll explore
                  </button>
                </div>

                <div className="mt-6 flex items-center justify-center gap-2 text-[#808080] text-sm">
                  <Lightbulb size={14} className="text-yellow-500" />
                  <span>Tip: Type <code className="text-[#ce9178]">&apos;help&apos;</code> anytime for assistance</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tutorial Completion Modal */}
      <AnimatePresence>
        {showCompletionModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#252526] border border-[#4ec9b0] rounded-lg shadow-2xl max-w-lg w-full mx-4 overflow-hidden"
            >
              <div className="p-8 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', damping: 10, stiffness: 200, delay: 0.2 }}
                  className="text-6xl mb-4"
                >
                  🎉
                </motion.div>
                
                <h2 className="text-2xl font-bold text-[#4ec9b0] mb-2">
                  Congratulations! You did it!
                </h2>
                
                <p className="text-[#808080] mb-6">
                  You&apos;ve mastered the terminal basics.
                  Now explore Arjun&apos;s portfolio on your own!
                </p>

                <div className="bg-[#1e1e1e] rounded-lg p-4 mb-6 border border-[#3e3e3e] text-left">
                  <p className="text-[#d4d4d4] text-sm mb-3">Commands to try next:</p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <code className="text-[#ce9178]">achievements</code>
                      <span className="text-[#808080]">View accomplishments</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <code className="text-[#ce9178]">contact --message</code>
                      <span className="text-[#808080]">Send a message</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <code className="text-[#ce9178]">joke</code>
                      <span className="text-[#808080]">Get a programming joke</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <code className="text-[#ce9178]">matrix</code>
                      <span className="text-[#808080]">Enter the Matrix 🕶️</span>
                    </div>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowCompletionModal(false)}
                  className="flex items-center justify-center gap-2 px-8 py-3 bg-[#4ec9b0] text-[#1e1e1e] rounded-lg font-bold hover:bg-[#3db8a0] transition-colors mx-auto"
                >
                  🚀 Start Exploring!
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Reference Panel */}
      <AnimatePresence>
        {showQuickRef && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="fixed right-4 bottom-[280px] z-[60] w-72"
          >
            <div className="bg-[#252526] border border-[#569cd6] rounded-lg shadow-xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 bg-[#1e1e1e] border-b border-[#3e3e3e]">
                <div className="flex items-center gap-2">
                  <BookOpen size={16} className="text-[#569cd6]" />
                  <span className="text-[#d4d4d4] font-medium text-sm">Quick Reference</span>
                </div>
                <button onClick={() => setShowQuickRef(false)} className="text-[#808080] hover:text-[#d4d4d4]" title="Close quick reference">
                  <X size={16} />
                </button>
              </div>

              <div className="p-4 space-y-4 text-sm max-h-[300px] overflow-auto">
                <div>
                  <h4 className="text-[#4ec9b0] font-medium mb-2">🚀 QUICK START</h4>
                  <div className="space-y-1 text-[#808080]">
                    <div><code className="text-[#ce9178]">whoami</code> - About Arjun</div>
                    <div><code className="text-[#ce9178]">ls projects</code> - All projects</div>
                    <div><code className="text-[#ce9178]">help</code> - Full guide</div>
                  </div>
                </div>

                <div>
                  <h4 className="text-[#4ec9b0] font-medium mb-2">📍 NAVIGATION</h4>
                  <div className="text-[#808080] text-xs">
                    <code className="text-[#ce9178]">home | about | projects | skills | contact</code>
                  </div>
                </div>

                <div>
                  <h4 className="text-[#4ec9b0] font-medium mb-2">⌨️ SHORTCUTS</h4>
                  <div className="space-y-1 text-[#808080]">
                    <div><kbd className="px-1 bg-[#3e3e3e] rounded text-xs">Tab</kbd> Autocomplete</div>
                    <div><kbd className="px-1 bg-[#3e3e3e] rounded text-xs">↑↓</kbd> History</div>
                    <div><kbd className="px-1 bg-[#3e3e3e] rounded text-xs">Ctrl+L</kbd> Clear</div>
                  </div>
                </div>
              </div>

              <div className="px-4 py-2 bg-[#1e1e1e] border-t border-[#3e3e3e] text-center">
                <p className="text-[#808080] text-xs">
                  Type <code className="text-[#ce9178]">?</code> to toggle
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contextual Hint Bubble */}
      <AnimatePresence>
        {showHintBubble && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="fixed bottom-[280px] left-1/2 -translate-x-1/2 z-[60]"
          >
            <div className="bg-[#252526] border border-[#569cd6] rounded-lg shadow-lg px-4 py-3 flex items-center gap-3">
              <Lightbulb size={18} className="text-yellow-500 flex-shrink-0" />
              <p className="text-[#d4d4d4] text-sm">{hintBubbleMessage}</p>
              <button 
                onClick={() => setShowHintBubble(false)}
                className="text-[#808080] hover:text-[#d4d4d4] flex-shrink-0"
                title="Dismiss hint"
              >
                <X size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tutorial Progress Indicator */}
      {tutorialActive && tutorialStep > 1 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-[260px] left-4 z-[60] bg-[#252526] border border-[#569cd6] rounded-lg px-3 py-2 shadow-lg"
        >
          <div className="flex items-center gap-2 text-sm">
            <span className="text-[#569cd6]">🎓 Tutorial</span>
            <div className="flex gap-1">
              {/* Show 4 dots for steps 2-5 (displayed as 1-4 to user) */}
              {[2, 3, 4, 5].map((stepNum) => (
                <div
                  key={stepNum}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    stepNum < tutorialStep ? 'bg-[#4ec9b0]' : 
                    stepNum === tutorialStep ? 'bg-[#569cd6] animate-pulse' : 'bg-[#3e3e3e]'
                  }`}
                />
              ))}
            </div>
            <span className="text-[#808080] text-xs">{tutorialStep - 1}/4</span>
          </div>
        </motion.div>
      )}

      {/* Help Button (for users who skipped tutorial) */}
      {!tutorialActive && !hasCompletedTutorial && commandCount > 0 && commandCount < 5 && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed bottom-[260px] right-4 z-[60] bg-[#569cd6] text-white rounded-full p-2 shadow-lg hover:bg-[#4a8bc7] transition-colors"
          onClick={() => setShowWelcomeModal(true)}
          title="Need help? Start tutorial"
        >
          <HelpCircle size={20} />
        </motion.button>
      )}

      {/* Main Terminal */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        className="fixed bottom-[22px] left-0 right-0 z-40 bg-[var(--vscode-sidebar)] border-t border-[var(--vscode-border)]"
        style={{ height: isMinimized ? 35 : isMaximized ? 'calc(100vh - 52px)' : terminalHeight }}
      >
        {/* Matrix Rain Effect */}
        {matrixActive && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none z-50">
            {matrixRainData.map((data, i) => (
              <motion.div
                key={i}
                className="absolute text-green-500 font-mono text-sm"
                style={{ left: `${data.left}%` }}
                initial={{ y: -20, opacity: 1 }}
                animate={{ y: '100vh', opacity: [1, 1, 0] }}
                transition={{ 
                  duration: data.duration, 
                  repeat: Infinity, 
                  delay: data.delay 
                }}
              >
                {data.char}
              </motion.div>
            ))}
          </div>
        )}

        {/* Resize Handle */}
        <div
          className="absolute top-0 left-0 right-0 h-1 cursor-ns-resize hover:bg-[var(--vscode-accent)] transition-colors"
          onMouseDown={handleMouseDown}
        />

        {/* Terminal Header */}
        <div className="flex items-center justify-between px-4 h-[35px] bg-[var(--vscode-titlebar)] border-b border-[var(--vscode-border)]">
          <div className="flex items-center gap-2">
            <TerminalIcon size={14} className="text-[var(--vscode-text-muted)]" />
            <span className="text-xs text-[var(--vscode-text-muted)]">TERMINAL</span>
            <span className="text-xs text-[var(--vscode-text-muted)]">—</span>
            <span className="text-xs text-[var(--vscode-accent)]">bash</span>
            <span className="text-xs text-[var(--vscode-text-muted)]">—</span>
            <span className="text-xs text-[var(--vscode-success)]">ArjunRajput.ai</span>
            <span className="text-xs text-green-400">✓</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1 hover:bg-[var(--vscode-line-highlight)] rounded"
              title={isMinimized ? "Restore" : "Minimize"}
            >
              {isMinimized ? <ChevronUp size={14} /> : <Minus size={14} />}
            </button>
            <button
              onClick={() => setIsMaximized(!isMaximized)}
              className="p-1 hover:bg-[var(--vscode-line-highlight)] rounded"
              title={isMaximized ? "Restore" : "Maximize"}
            >
              <Square size={12} />
            </button>
            <button
              onClick={onToggle}
              className="p-1 hover:bg-red-600 rounded"
              title="Close Terminal"
            >
              <X size={14} />
            </button>
          </div>
        </div>

        {/* Terminal Content */}
        {!isMinimized && (
          <div 
            ref={terminalRef}
            className="h-[calc(100%-35px)] overflow-auto p-4 font-mono text-sm"
            onClick={() => inputRef.current?.focus()}
          >
            {/* Output Lines */}
            {lines.map((line) => (
              <div 
                key={line.id} 
                className={`${getLineColor(line.type)} whitespace-pre-wrap break-words group flex items-start gap-2`}
              >
                {line.clickable && line.command ? (
                  <button
                    onClick={() => executeClickableCommand(line.command!)}
                    className="flex-1 text-left hover:bg-[var(--vscode-line-highlight)] px-1 -mx-1 rounded transition-colors cursor-pointer flex items-center gap-2"
                  >
                    <MousePointer size={12} className="text-[#808080] opacity-0 group-hover:opacity-100" />
                    <span>{line.content}</span>
                  </button>
                ) : (
                  <span className="flex-1">{line.content}</span>
                )}
                {line.content && line.type !== 'input' && !line.clickable && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      copyToClipboard(line.content, line.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-[var(--vscode-line-highlight)] rounded"
                    title="Copy"
                  >
                    {copiedIndex === line.id ? (
                      <Check size={12} className="text-green-400" />
                    ) : (
                      <Copy size={12} className="text-[var(--vscode-text-muted)]" />
                    )}
                  </button>
                )}
              </div>
            ))}

            {/* Processing Indicator */}
            {isProcessing && (
              <div className="text-[var(--vscode-text-muted)] animate-pulse">
                Processing...
              </div>
            )}

            {/* Input Line */}
            <div className="flex items-center relative">
              <span className="text-green-400">arjun@portfolio</span>
              <span className="text-[var(--vscode-text-muted)]">:</span>
              <span className="text-[var(--vscode-accent)]">~</span>
              <span className="text-[var(--vscode-text-muted)]">$ </span>
              <input
                ref={inputRef}
                type="text"
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-transparent outline-none text-[var(--vscode-text)] caret-[var(--vscode-accent)]"
                autoComplete="off"
                spellCheck="false"
                aria-label="Terminal input"
                placeholder={contactForm.active ? '' : 'Type a command...'}
              />
            </div>

            {/* Autocomplete Suggestions */}
            {suggestions.length > 0 && (
              <div className="absolute bg-[var(--vscode-sidebar)] border border-[var(--vscode-border)] rounded mt-1 shadow-lg z-10">
                {suggestions.map((suggestion, index) => (
                  <div
                    key={suggestion}
                    className={`px-3 py-1 text-sm cursor-pointer ${
                      index === selectedSuggestion 
                        ? 'bg-[var(--vscode-selection)] text-[var(--vscode-text)]' 
                        : 'text-[var(--vscode-text-muted)] hover:bg-[var(--vscode-line-highlight)]'
                    }`}
                    onClick={() => {
                      setCurrentInput(suggestion);
                      inputRef.current?.focus();
                    }}
                  >
                    {suggestion}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </motion.div>
    </>
  );
}
