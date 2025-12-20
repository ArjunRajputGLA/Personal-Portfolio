'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, 
  X, 
  Minus, 
  Maximize2, 
  Minimize2,
  Send, 
  Bot, 
  User,
  Briefcase,
  GraduationCap,
  Phone,
  Wrench,
  Trophy,
  FileText,
  Loader2,
  Sparkles,
  ArrowLeft,
  ChevronDown,
  RotateCcw
} from 'lucide-react';
import { askGemini, generateMessageId, Message } from '@/lib/gemini-api';

interface Position {
  x: number;
  y: number;
}

interface Size {
  width: number;
  height: number;
}

const quickActions = [
  { icon: Briefcase, label: 'Projects', question: "What projects has Arjun worked on?" },
  { icon: GraduationCap, label: 'Education', question: "Tell me about Arjun's education" },
  { icon: Phone, label: 'Contact', question: "How can I contact Arjun?" },
  { icon: Wrench, label: 'Skills', question: "What are Arjun's technical skills?" },
  { icon: Trophy, label: 'Achievements', question: "What are Arjun's key achievements?" },
  { icon: FileText, label: 'Experience', question: "Tell me about Arjun's work experience" },
];

const welcomeMessage: Message = {
  id: 'welcome',
  role: 'model',
  content: `Hi! 👋 I'm **Arjun.ai**, your AI assistant for exploring Arjun's portfolio.

I can answer questions about:
• His projects and technical work
• Skills and expertise
• Education and experience
• Achievements and certifications
• How to get in touch

What would you like to know?`,
  timestamp: new Date()
};

const DEFAULT_SIZE = { width: 420, height: 600 };
const MIN_SIZE = { width: 350, height: 400 };
const MAX_SIZE = { width: 800, height: 900 };

export default function Chatbot() {
  // Window state
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [size, setSize] = useState<Size>(DEFAULT_SIZE);
  const [isMobile, setIsMobile] = useState(false);
  
  // Drag state
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<Position>({ x: 0, y: 0 });
  
  // Resize state
  const [isResizing, setIsResizing] = useState(false);
  const [resizeStart, setResizeStart] = useState<{ x: number; y: number; width: number; height: number }>({ x: 0, y: 0, width: 0, height: 0 });
  
  // Chat state
  const [messages, setMessages] = useState<Message[]>([welcomeMessage]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPulse, setShowPulse] = useState(true);
  
  // Scroll state
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [scrollShadows, setScrollShadows] = useState({ top: false, bottom: false });
  const [unreadCount, setUnreadCount] = useState(0);
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  
  // Refs
  const chatbotRef = useRef<HTMLDivElement>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const scrollAnchorRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const headerClickCount = useRef(0);
  const headerClickTimer = useRef<NodeJS.Timeout | null>(null);

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Constrain position to viewport bounds
  const constrainToBounds = useCallback((pos: Position, windowSize: Size): Position => {
    if (typeof window === 'undefined') return pos;
    
    const minVisibleWidth = 100;
    const headerHeight = 40;
    
    return {
      x: Math.max(
        -windowSize.width + minVisibleWidth,
        Math.min(pos.x, window.innerWidth - minVisibleWidth)
      ),
      y: Math.max(
        0,
        Math.min(pos.y, window.innerHeight - headerHeight)
      )
    };
  }, []);

  // Initialize position on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Try to load saved state
      const saved = localStorage.getItem('chatbot-state');
      if (saved) {
        try {
          const state = JSON.parse(saved);
          const validatedPosition = constrainToBounds(state.position, state.size);
          setPosition(validatedPosition);
          setSize(state.size);
        } catch {
          // Default position: bottom-right corner
          setPosition({
            x: window.innerWidth - DEFAULT_SIZE.width - 20,
            y: window.innerHeight - DEFAULT_SIZE.height - 100
          });
        }
      } else {
        setPosition({
          x: window.innerWidth - DEFAULT_SIZE.width - 20,
          y: window.innerHeight - DEFAULT_SIZE.height - 100
        });
      }
    }
  }, [constrainToBounds]);

  // Snap to edges
  const snapToEdge = useCallback((pos: Position): Position => {
    if (typeof window === 'undefined') return pos;
    
    const snapThreshold = 20;
    let { x, y } = pos;
    
    if (x < snapThreshold) x = 0;
    if (x > window.innerWidth - size.width - snapThreshold) {
      x = window.innerWidth - size.width;
    }
    if (y < snapThreshold) y = 0;
    if (y > window.innerHeight - size.height - snapThreshold) {
      y = window.innerHeight - size.height;
    }
    
    return { x, y };
  }, [size]);

  // Save state to localStorage
  useEffect(() => {
    if (!isMaximized && !isMinimized && isOpen) {
      localStorage.setItem('chatbot-state', JSON.stringify({
        position,
        size,
        timestamp: Date.now()
      }));
    }
  }, [position, size, isMaximized, isMinimized, isOpen]);

  // Handle window resize
  useEffect(() => {
    const handleWindowResize = () => {
      setPosition(prev => constrainToBounds(prev, size));
    };
    
    window.addEventListener('resize', handleWindowResize);
    return () => window.removeEventListener('resize', handleWindowResize);
  }, [size, constrainToBounds]);

  // Dragging handlers
  const handleDragStart = useCallback((e: React.MouseEvent) => {
    if (isMaximized || isMobile) return;
    e.preventDefault();
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  }, [isMaximized, isMobile, position]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;
      
      const constrained = constrainToBounds({ x: newX, y: newY }, size);
      const snapped = snapToEdge(constrained);
      
      setPosition(snapped);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragStart, size, constrainToBounds, snapToEdge]);

  // Resize handlers
  const handleResizeStart = useCallback((e: React.MouseEvent) => {
    if (isMaximized || isMobile) return;
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: size.width,
      height: size.height
    });
  }, [isMaximized, isMobile, size]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      
      let newWidth = resizeStart.width + (e.clientX - resizeStart.x);
      let newHeight = resizeStart.height + (e.clientY - resizeStart.y);
      
      // Apply constraints
      newWidth = Math.max(MIN_SIZE.width, Math.min(newWidth, MAX_SIZE.width));
      newHeight = Math.max(MIN_SIZE.height, Math.min(newHeight, MAX_SIZE.height));
      
      // Don&apos;t exceed viewport
      if (typeof window !== 'undefined') {
        if (position.x + newWidth > window.innerWidth) {
          newWidth = window.innerWidth - position.x;
        }
        if (position.y + newHeight > window.innerHeight) {
          newHeight = window.innerHeight - position.y;
        }
      }
      
      setSize({ width: newWidth, height: newHeight });
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
  }, [isResizing, resizeStart, position]);

  const handleToggleMaximize = useCallback(() => {
    setIsMaximized(prev => !prev);
  }, []);

  // Double-click to maximize
  const handleHeaderClick = useCallback(() => {
    headerClickCount.current++;
    
    if (headerClickCount.current === 1) {
      headerClickTimer.current = setTimeout(() => {
        headerClickCount.current = 0;
      }, 300);
    } else if (headerClickCount.current === 2) {
      if (headerClickTimer.current) clearTimeout(headerClickTimer.current);
      headerClickCount.current = 0;
      handleToggleMaximize();
    }
  }, [handleToggleMaximize]);

  const handleMinimize = useCallback(() => {
    setIsMinimized(true);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setIsMinimized(false);
    setIsMaximized(false);
  }, []);

  // Scroll handling
  const updateScrollState = useCallback(() => {
    const container = chatScrollRef.current;
    if (!container) return;
    
    const { scrollTop, scrollHeight, clientHeight } = container;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
    
    setShowScrollButton(!isNearBottom);
    setScrollShadows({
      top: scrollTop > 10,
      bottom: scrollHeight - scrollTop - clientHeight > 10
    });
    
    if (isNearBottom) {
      setUnreadCount(0);
      setIsUserScrolling(false);
    } else {
      setIsUserScrolling(true);
    }
  }, []);

  // Auto-scroll on new messages
  useEffect(() => {
    if (!isUserScrolling) {
      scrollAnchorRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else if (messages.length > 0 && messages[messages.length - 1].role === 'model') {
      setUnreadCount(prev => prev + 1);
    }
  }, [messages, isUserScrolling]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen, isMinimized]);

  // Hide pulse after first open
  useEffect(() => {
    if (isOpen) setShowPulse(false);
  }, [isOpen]);

  // Send message
  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMessage: Message = {
      id: generateMessageId(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setIsUserScrolling(false);

    // Reset textarea height
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
    }

    try {
      const history = messages.filter(m => m.id !== 'welcome');
      const response = await askGemini(content, history);
      
      const botMessage: Message = {
        id: generateMessageId(),
        role: 'model',
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch {
      const errorMessage: Message = {
        id: generateMessageId(),
        role: 'model',
        content: "I'm having trouble connecting right now. Please try again or contact Arjun directly at imstorm23203@gmail.com",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      
      // Shake animation on error
      chatbotRef.current?.animate([
        { transform: 'translateX(0)' },
        { transform: 'translateX(-10px)' },
        { transform: 'translateX(10px)' },
        { transform: 'translateX(-10px)' },
        { transform: 'translateX(0)' }
      ], { duration: 300, easing: 'ease-in-out' });
    } finally {
      setIsLoading(false);
    }
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputValue);
    }
  };

  const handleQuickAction = (question: string) => {
    sendMessage(question);
  };

  const scrollToBottom = () => {
    scrollAnchorRef.current?.scrollIntoView({ behavior: 'smooth' });
    setUnreadCount(0);
    setIsUserScrolling(false);
  };

  const resetChat = () => {
    setMessages([welcomeMessage]);
    setUnreadCount(0);
  };

  // Format message content
  const formatMessage = (content: string) => {
    return content.split('\n').map((line, i) => {
      // Bold text
      let formattedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-[var(--vscode-text)]">$1</strong>');
      
      // Bullet points
      if (line.trim().startsWith('•') || line.trim().startsWith('-')) {
        return (
          <div key={i} className="flex gap-2 ml-2">
            <span className="text-[var(--vscode-accent)] flex-shrink-0">•</span>
            <span className="break-all" dangerouslySetInnerHTML={{ __html: formattedLine.replace(/^[•-]\s*/, '') }} />
          </div>
        );
      }
      
      // Links
      const linkRegex = /\[(.*?)\]\((.*?)\)/g;
      formattedLine = formattedLine.replace(linkRegex, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-[var(--vscode-accent)] hover:underline break-all">$1</a>');
      
      return formattedLine ? (
        <p key={i} dangerouslySetInnerHTML={{ __html: formattedLine }} className="mb-1 break-words" style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }} />
      ) : (
        <br key={i} />
      );
    });
  };

  // Get window styles
  const getWindowStyles = (): React.CSSProperties => {
    if (isMaximized) {
      return {
        position: 'fixed',
        top: '20px',
        left: '20px',
        width: 'calc(100vw - 40px)',
        height: 'calc(100vh - 40px)',
        zIndex: 9999,
      };
    }
    
    if (isMobile) {
      return {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        height: '100%',
        zIndex: 9999,
      };
    }
    
    return {
      position: 'fixed',
      left: `${position.x}px`,
      top: `${position.y}px`,
      width: `${size.width}px`,
      height: `${size.height}px`,
      zIndex: 9999,
    };
  };

  return (
    <>
      {/* Floating Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-24 right-4 z-50 flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-[var(--vscode-accent)] to-blue-600 text-white rounded-full shadow-lg hover:shadow-xl transition-shadow group"
            aria-label="Open chat with Arjun AI"
          >
            {showPulse && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-ping" />
            )}
            <MessageCircle size={20} />
            <span className="font-medium">Ask Arjun AI</span>
            <Sparkles size={16} className="opacity-70 group-hover:opacity-100 transition-opacity" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Minimized State */}
      <AnimatePresence>
        {isOpen && isMinimized && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={() => setIsMinimized(false)}
            className="fixed bottom-24 right-4 z-50 flex items-center gap-3 px-4 py-3 bg-[var(--vscode-sidebar)] border border-[var(--vscode-border)] rounded-lg shadow-xl hover:border-[var(--vscode-accent)] transition-all cursor-pointer"
            aria-label="Restore Arjun AI chat"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--vscode-accent)] to-blue-600 flex items-center justify-center">
              <Bot size={16} className="text-white" />
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-[var(--vscode-text)]">Arjun.ai</p>
              <p className="text-[10px] text-[var(--vscode-text-muted)]">Click to restore</p>
            </div>
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && !isMinimized && (
          <motion.div
            ref={chatbotRef}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            style={{
              ...getWindowStyles(),
              opacity: isDragging ? 0.95 : 1,
              boxShadow: isDragging 
                ? '0 20px 60px rgba(0,0,0,0.5)' 
                : '0 8px 32px rgba(0,0,0,0.4)',
            }}
            className="bg-[var(--vscode-bg)] border border-[var(--vscode-border)] rounded-lg flex flex-col overflow-hidden"
          >
            {/* Header - Draggable */}
            <div
              onMouseDown={handleDragStart}
              onClick={handleHeaderClick}
              className={`flex items-center justify-between px-3 py-2.5 bg-[var(--vscode-sidebar)] border-b border-[var(--vscode-sidebar-border)] select-none ${
                isMaximized || isMobile ? 'cursor-default' : 'cursor-grab'
              } ${isDragging ? 'cursor-grabbing' : ''}`}
            >
              <div className="flex items-center gap-3">
                {isMobile && (
                  <button
                    onClick={(e) => { e.stopPropagation(); handleClose(); }}
                    className="p-1.5 hover:bg-[var(--vscode-line-highlight)] rounded transition-colors"
                    title="Go back"
                    aria-label="Close chat"
                  >
                    <ArrowLeft size={18} className="text-[var(--vscode-text)]" />
                  </button>
                )}
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[var(--vscode-accent)] to-blue-600 flex items-center justify-center">
                  <Bot size={14} className="text-white" />
                </div>
                <div>
                  <h3 className="font-medium text-sm text-[var(--vscode-text)]">Arjun.ai - Resume Assistant</h3>
                  <p className="text-[10px] text-green-500 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    Online
                  </p>
                </div>
              </div>
              
              {!isMobile && (
                <div className="flex items-center gap-1">
                  {/* Reset Chat */}
                  <button
                    onClick={(e) => { e.stopPropagation(); resetChat(); }}
                    className="p-1.5 hover:bg-[var(--vscode-line-highlight)] rounded text-[var(--vscode-text-muted)] hover:text-[var(--vscode-text)] transition-colors"
                    title="Reset chat"
                    aria-label="Reset chat"
                  >
                    <RotateCcw size={14} />
                  </button>
                  
                  {/* Minimize */}
                  <button
                    onClick={(e) => { e.stopPropagation(); handleMinimize(); }}
                    className="p-1.5 hover:bg-[var(--vscode-line-highlight)] rounded text-[var(--vscode-text-muted)] hover:text-[var(--vscode-text)] transition-colors"
                    title="Minimize"
                    aria-label="Minimize chat"
                  >
                    <Minus size={14} />
                  </button>
                  
                  {/* Maximize/Restore */}
                  <button
                    onClick={(e) => { e.stopPropagation(); handleToggleMaximize(); }}
                    className="p-1.5 hover:bg-[var(--vscode-line-highlight)] rounded text-[var(--vscode-text-muted)] hover:text-[var(--vscode-text)] transition-colors"
                    title={isMaximized ? "Restore" : "Maximize"}
                    aria-label={isMaximized ? "Restore window" : "Maximize window"}
                  >
                    {isMaximized ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                  </button>
                  
                  {/* Close */}
                  <button
                    onClick={(e) => { e.stopPropagation(); handleClose(); }}
                    className="p-1.5 hover:bg-red-500/20 rounded text-[var(--vscode-text-muted)] hover:text-red-400 transition-colors"
                    title="Close"
                    aria-label="Close chat"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
            </div>

            {/* Chat Messages Area with Scroll Shadows */}
            <div className="relative flex-1 overflow-hidden">
              {/* Top shadow */}
              {scrollShadows.top && (
                <div className="absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-black/30 to-transparent pointer-events-none z-10" />
              )}
              
              {/* Messages container */}
              <div
                ref={chatScrollRef}
                onScroll={updateScrollState}
                className="h-full overflow-y-auto overflow-x-hidden p-4 space-y-4 chatbot-scroll"
              >
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
                  >
                    {/* Avatar */}
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      message.role === 'user' 
                        ? 'bg-[var(--vscode-accent)]' 
                        : 'bg-gradient-to-br from-[var(--vscode-accent)] to-blue-600'
                    }`}>
                      {message.role === 'user' ? (
                        <User size={16} className="text-white" />
                      ) : (
                        <Bot size={16} className="text-white" />
                      )}
                    </div>

                    {/* Message Bubble */}
                    <div className={`max-w-[80%] min-w-0 ${message.role === 'user' ? 'text-right' : ''}`}>
                      <span className="text-[10px] text-[var(--vscode-text-muted)] mb-1 block">
                        {message.role === 'user' ? 'You' : 'Arjun.ai'}
                      </span>
                      <div className={`rounded-lg px-4 py-3 text-sm leading-relaxed break-words overflow-hidden ${
                        message.role === 'user'
                          ? 'bg-[var(--vscode-accent)] text-white rounded-br-sm'
                          : 'bg-[var(--vscode-sidebar)] text-[var(--vscode-text)] border border-[var(--vscode-border)] rounded-bl-sm'
                      }`}>
                        {formatMessage(message.content)}
                      </div>
                    </div>
                  </motion.div>
                ))}

                {/* Typing Indicator */}
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-3"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--vscode-accent)] to-blue-600 flex items-center justify-center">
                      <Bot size={16} className="text-white" />
                    </div>
                    <div className="bg-[var(--vscode-sidebar)] border border-[var(--vscode-border)] rounded-lg rounded-bl-sm px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-[var(--vscode-text-muted)] text-sm">Thinking</span>
                        <Loader2 size={14} className="animate-spin text-[var(--vscode-accent)]" />
                      </div>
                    </div>
                  </motion.div>
                )}

                <div ref={scrollAnchorRef} />
              </div>
              
              {/* Bottom shadow */}
              {scrollShadows.bottom && (
                <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-black/30 to-transparent pointer-events-none z-10" />
              )}

              {/* Scroll to bottom button */}
              <AnimatePresence>
                {showScrollButton && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    onClick={scrollToBottom}
                    className="absolute bottom-4 right-4 w-10 h-10 bg-[var(--vscode-accent)] rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform z-20"
                    title="Scroll to bottom"
                    aria-label="Scroll to bottom"
                  >
                    <ChevronDown size={20} />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-[10px] flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            {/* Quick Actions */}
            <div className="px-3 py-2 border-t border-[var(--vscode-border)] bg-[var(--vscode-sidebar)]">
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickAction(action.question)}
                    disabled={isLoading}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-[var(--vscode-bg)] border border-[var(--vscode-border)] rounded-full hover:border-[var(--vscode-accent)] hover:text-[var(--vscode-accent)] transition-colors whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <action.icon size={12} />
                    {action.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Area */}
            <form onSubmit={handleSubmit} className="p-3 border-t border-[var(--vscode-border)] bg-[var(--vscode-sidebar)]">
              <div className="flex gap-2 items-end">
                <textarea
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask me anything about Arjun..."
                  disabled={isLoading}
                  rows={1}
                  className="flex-1 px-4 py-2.5 bg-[var(--vscode-bg)] border border-[var(--vscode-border)] rounded-lg text-sm text-[var(--vscode-text)] placeholder-[var(--vscode-text-muted)] focus:outline-none focus:border-[var(--vscode-accent)] disabled:opacity-50 resize-none transition-colors"
                  style={{ maxHeight: '120px' }}
                  onInput={(e) => {
                    const target = e.target as HTMLTextAreaElement;
                    target.style.height = 'auto';
                    target.style.height = Math.min(target.scrollHeight, 120) + 'px';
                  }}
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim() || isLoading}
                  className={`px-4 py-2.5 rounded-lg font-medium text-sm flex items-center gap-2 transition-all ${
                    inputValue.trim() && !isLoading
                      ? 'bg-[var(--vscode-accent)] text-white hover:opacity-90'
                      : 'bg-[var(--vscode-border)] text-[var(--vscode-text-muted)] cursor-not-allowed'
                  }`}
                  title="Send message"
                  aria-label="Send message"
                >
                  {isLoading ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Send size={18} />
                  )}
                </button>
              </div>
            </form>

            {/* Footer */}
            <div className="px-3 py-2 border-t border-[var(--vscode-border)] bg-[var(--vscode-sidebar)] flex items-center justify-center text-[10px] text-[var(--vscode-text-muted)]">
              <span className="flex items-center gap-1">
                <Sparkles size={10} />
                Powered by Google Gemini AI
              </span>
            </div>

            {/* Resize Handle */}
            {!isMaximized && !isMobile && (
              <div
                onMouseDown={handleResizeStart}
                className="absolute bottom-0 right-0 w-5 h-5 cursor-nwse-resize group"
                title="Resize"
              >
                <svg 
                  width="20" 
                  height="20" 
                  viewBox="0 0 20 20" 
                  className="absolute bottom-0 right-0"
                >
                  <path 
                    d="M20,0 L20,20 L0,20 Z" 
                    className="fill-[var(--vscode-accent)]/20 group-hover:fill-[var(--vscode-accent)]/40 transition-colors" 
                  />
                  <line x1="14" y1="20" x2="20" y2="14" className="stroke-[var(--vscode-text-muted)] group-hover:stroke-[var(--vscode-accent)]" strokeWidth="1" />
                  <line x1="17" y1="20" x2="20" y2="17" className="stroke-[var(--vscode-text-muted)] group-hover:stroke-[var(--vscode-accent)]" strokeWidth="1" />
                </svg>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom Scrollbar Styles */}
      <style jsx global>{`
        .chatbot-scroll::-webkit-scrollbar {
          width: 10px;
        }
        .chatbot-scroll::-webkit-scrollbar-track {
          background: var(--vscode-bg);
        }
        .chatbot-scroll::-webkit-scrollbar-thumb {
          background: var(--vscode-scrollbar);
          border-radius: 5px;
          border: 2px solid var(--vscode-bg);
        }
        .chatbot-scroll::-webkit-scrollbar-thumb:hover {
          background: var(--vscode-scrollbar-hover);
        }
        .chatbot-scroll {
          scrollbar-width: thin;
          scrollbar-color: var(--vscode-scrollbar) var(--vscode-bg);
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </>
  );
}
