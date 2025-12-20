'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ChevronUp, ChevronDown, CaseSensitive, Regex } from 'lucide-react';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SearchResult {
  text: string;
  element: HTMLElement;
  index: number;
}

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [useRegex, setUseRegex] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const highlightsRef = useRef<HTMLElement[]>([]);

  // Clear previous highlights
  const clearHighlights = useCallback(() => {
    highlightsRef.current.forEach(el => {
      if (el.parentNode) {
        const parent = el.parentNode;
        parent.replaceChild(document.createTextNode(el.textContent || ''), el);
        (parent as HTMLElement).normalize();
      }
    });
    highlightsRef.current = [];
  }, []);

  // Search in page
  const performSearch = useCallback(() => {
    clearHighlights();
    
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const searchResults: SearchResult[] = [];
    const mainContent = document.querySelector('main');
    if (!mainContent) return;

    const walker = document.createTreeWalker(
      mainContent,
      NodeFilter.SHOW_TEXT,
      null
    );

    let searchPattern: RegExp;
    try {
      if (useRegex) {
        searchPattern = new RegExp(query, caseSensitive ? 'g' : 'gi');
      } else {
        const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        searchPattern = new RegExp(escapedQuery, caseSensitive ? 'g' : 'gi');
      }
    } catch {
      // Invalid regex, skip
      return;
    }

    let node;
    let index = 0;
    while ((node = walker.nextNode())) {
      const text = node.textContent || '';
      if (searchPattern.test(text)) {
        const parent = node.parentElement;
        if (parent && !parent.closest('.search-overlay') && !parent.closest('script') && !parent.closest('style')) {
          searchPattern.lastIndex = 0; // Reset regex
          let match;
          while ((match = searchPattern.exec(text)) !== null) {
            searchResults.push({
              text: match[0],
              element: parent,
              index: index++,
            });
          }
        }
      }
    }

    setResults(searchResults);
    if (searchResults.length > 0) {
      setCurrentIndex(0);
      scrollToResult(searchResults[0]);
    }
  }, [query, caseSensitive, useRegex, clearHighlights]);

  // Scroll to result
  const scrollToResult = (result: SearchResult) => {
    result.element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // Highlight the element temporarily
    result.element.style.backgroundColor = 'rgba(255, 255, 0, 0.3)';
    result.element.style.outline = '2px solid var(--vscode-accent)';
    result.element.style.outlineOffset = '2px';
    
    setTimeout(() => {
      result.element.style.backgroundColor = '';
      result.element.style.outline = '';
      result.element.style.outlineOffset = '';
    }, 2000);
  };

  // Navigate results
  const goToNext = () => {
    if (results.length === 0) return;
    const nextIndex = (currentIndex + 1) % results.length;
    setCurrentIndex(nextIndex);
    scrollToResult(results[nextIndex]);
  };

  const goToPrev = () => {
    if (results.length === 0) return;
    const prevIndex = currentIndex === 0 ? results.length - 1 : currentIndex - 1;
    setCurrentIndex(prevIndex);
    scrollToResult(results[prevIndex]);
  };

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isOpen]);

  // Search on query change
  useEffect(() => {
    const timer = setTimeout(performSearch, 300);
    return () => clearTimeout(timer);
  }, [performSearch]);

  // Cleanup on close
  useEffect(() => {
    if (!isOpen) {
      clearHighlights();
      setQuery('');
      setResults([]);
    }
  }, [isOpen, clearHighlights]);

  // Keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (e.shiftKey) {
        goToPrev();
      } else {
        goToNext();
      }
    } else if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'F3') {
      e.preventDefault();
      if (e.shiftKey) {
        goToPrev();
      } else {
        goToNext();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed top-12 right-4 z-50 search-overlay"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
      >
        <div className="bg-[var(--vscode-sidebar)] border border-[var(--vscode-border)] rounded-lg shadow-xl overflow-hidden w-80">
          {/* Search Input */}
          <div className="flex items-center gap-2 p-2 border-b border-[var(--vscode-sidebar-border)]">
            <Search size={16} className="text-[var(--vscode-text-muted)]" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Find in page..."
              className="flex-1 bg-transparent outline-none text-sm text-[var(--vscode-text)] placeholder:text-[var(--vscode-text-muted)]"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="p-1 hover:bg-[var(--vscode-line-highlight)] rounded"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Options & Navigation */}
          <div className="flex items-center justify-between p-2 bg-[var(--vscode-bg)]">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCaseSensitive(!caseSensitive)}
                className={`p-1.5 rounded transition-colors ${
                  caseSensitive 
                    ? 'bg-[var(--vscode-accent)] text-white' 
                    : 'hover:bg-[var(--vscode-line-highlight)] text-[var(--vscode-text-muted)]'
                }`}
                title="Match Case"
              >
                <CaseSensitive size={14} />
              </button>
              <button
                onClick={() => setUseRegex(!useRegex)}
                className={`p-1.5 rounded transition-colors ${
                  useRegex 
                    ? 'bg-[var(--vscode-accent)] text-white' 
                    : 'hover:bg-[var(--vscode-line-highlight)] text-[var(--vscode-text-muted)]'
                }`}
                title="Use Regular Expression"
              >
                <Regex size={14} />
              </button>
            </div>

            <div className="flex items-center gap-2">
              {results.length > 0 && (
                <span className="text-xs text-[var(--vscode-text-muted)]">
                  {currentIndex + 1} of {results.length}
                </span>
              )}
              {results.length === 0 && query && (
                <span className="text-xs text-red-400">
                  No results
                </span>
              )}
              <div className="flex items-center gap-0.5">
                <button
                  onClick={goToPrev}
                  disabled={results.length === 0}
                  className="p-1.5 hover:bg-[var(--vscode-line-highlight)] rounded disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Previous (Shift+Enter)"
                >
                  <ChevronUp size={14} />
                </button>
                <button
                  onClick={goToNext}
                  disabled={results.length === 0}
                  className="p-1.5 hover:bg-[var(--vscode-line-highlight)] rounded disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Next (Enter)"
                >
                  <ChevronDown size={14} />
                </button>
                <button
                  onClick={onClose}
                  className="p-1.5 hover:bg-[var(--vscode-line-highlight)] rounded"
                  title="Close (Esc)"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
