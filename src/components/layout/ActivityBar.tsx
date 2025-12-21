'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  User, 
  Puzzle, 
  FolderOpen, 
  GitBranch, 
  Trophy, 
  Image, 
  Mail,
  Search,
  Settings,
  ChevronRight,
  ChevronDown,
  FileCode,
  FileJson,
  FileText,
  File,
  Folder,
  PanelLeftClose,
  PanelLeft
} from 'lucide-react';

interface ActivityBarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onGitClick?: () => void;
  onExtensionsClick?: () => void;
  onSettingsClick?: () => void;
}

const sections = [
  { id: 'home', icon: Home, label: 'Explorer', tooltip: 'Home (Explorer)' },
  { id: 'about', icon: User, label: 'Account', tooltip: 'About (Account)' },
  { id: 'skills', icon: Puzzle, label: 'Extensions', tooltip: 'Skills (Extensions)' },
  { id: 'projects', icon: FolderOpen, label: 'Files', tooltip: 'Projects (Files)' },
  { id: 'experience', icon: GitBranch, label: 'Source Control', tooltip: 'Experience (Timeline)' },
  { id: 'achievements', icon: Trophy, label: 'Achievements', tooltip: 'Achievements' },
  { id: 'gallery', icon: Image, label: 'Gallery', tooltip: 'Gallery (Media)' },
  { id: 'contact', icon: Mail, label: 'Mail', tooltip: 'Contact (Mail)' },
];

// File explorer structure
const explorerFiles = [
  {
    name: 'src',
    type: 'folder',
    expanded: true,
    children: [
      { name: 'index.tsx', type: 'file', icon: FileCode, section: 'home' },
      { name: 'about.md', type: 'file', icon: FileText, section: 'about' },
      { name: 'skills.json', type: 'file', icon: FileJson, section: 'skills' },
      { 
        name: 'projects', 
        type: 'folder', 
        section: 'projects',
        children: [
          { name: 'No-Code-Backend.exe', type: 'file', icon: FileCode, section: 'projects' },
          { name: 'Agentix.tsx', type: 'file', icon: FileCode, section: 'projects' },
          { name: 'GLA_Campus_Application.tsx', type: 'file', icon: FileCode, section: 'projects' },
          { name: 'Smart_AI_Classroom.tsx', type: 'file', icon: FileCode, section: 'projects' },
          { name: 'FLUXOR.exe', type: 'file', icon: FileCode, section: 'projects' },
          { name: 'Article-Analyser.py', type: 'file', icon: FileCode, section: 'projects' },
          { name: 'J.A.R.V.I.S_Arena.java', type: 'file', icon: FileCode, section: 'projects' }
        ]
      },
      { name: 'experience.log', type: 'file', icon: File, section: 'experience' },
      { name: 'achievements.yaml', type: 'file', icon: FileText, section: 'achievements' },
      { name: 'contact.tsx', type: 'file', icon: FileCode, section: 'contact' },
    ]
  },
  {
    name: 'media',
    type: 'folder',
    expanded: false,
    children: [
      { name: 'journey', type: 'folder', section: 'gallery', children: [] },
      { name: 'photos', type: 'folder', section: 'gallery', children: [] },
      { name: 'certificates', type: 'folder', section: 'gallery', children: [] },
    ]
  },
  {
    name: 'README.md',
    type: 'file',
    icon: FileText,
    section: 'home'
  },
  {
    name: 'package.json',
    type: 'file',
    icon: FileJson,
    section: 'home'
  },
];

interface FileItemProps {
  item: typeof explorerFiles[0];
  depth: number;
  activeSection: string;
  onSectionChange: (section: string) => void;
}

function FileItem({ item, depth, activeSection, onSectionChange }: FileItemProps) {
  const [expanded, setExpanded] = useState(item.expanded || false);
  const isActive = item.section === activeSection;
  const Icon = item.icon || (item.type === 'folder' ? Folder : File);
  
  return (
    <div>
      <button
        onClick={() => {
          if (item.type === 'folder') {
            setExpanded(!expanded);
          }
          if (item.section) {
            onSectionChange(item.section);
          }
        }}
        className={`
          w-full flex items-center gap-1 py-1 px-2 text-xs
          hover:bg-[var(--vscode-line-highlight)] transition-colors
          ${isActive ? 'bg-[var(--vscode-line-highlight)] text-[var(--vscode-accent)]' : 'text-[var(--vscode-text)]'}
        `}
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
      >
        {item.type === 'folder' ? (
          expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />
        ) : (
          <span className="w-[14px]" />
        )}
        <Icon size={14} className={item.type === 'folder' ? 'text-yellow-500' : 'text-[var(--vscode-accent)]'} />
        <span className="truncate">{item.name}</span>
      </button>
      
      <AnimatePresence>
        {item.type === 'folder' && expanded && item.children && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {item.children.map((child, index) => (
              <FileItem
                key={index}
                item={child as typeof explorerFiles[0]}
                depth={depth + 1}
                activeSection={activeSection}
                onSectionChange={onSectionChange}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ActivityBar({ 
  activeSection, 
  onSectionChange, 
  isCollapsed, 
  onToggleCollapse,
  onGitClick, 
  onExtensionsClick, 
  onSettingsClick 
}: ActivityBarProps) {
  const [explorerExpanded, setExplorerExpanded] = useState(true);
  const [outlineExpanded, setOutlineExpanded] = useState(true);

  return (
    <>
      {/* Activity Bar (Icon Strip) - Always 48px */}
      <aside 
        className={`
          fixed left-0 top-[30px] bottom-[22px] w-[48px]
          bg-[var(--vscode-sidebar)] 
          border-r border-[var(--vscode-sidebar-border)]
          flex flex-col
          z-40
          hidden md:flex
        `}
      >
        {/* Search Icon - Top */}
        <button
          className="p-3 hover:bg-[var(--vscode-line-highlight)] transition-colors flex items-center justify-center"
          title="Search (Ctrl+P)"
          aria-label="Search"
        >
          <Search size={24} className="text-[var(--vscode-text-muted)]" />
        </button>

        {/* Section Icons */}
        <nav className="flex-1 py-2">
          {sections.map((section) => {
            const Icon = section.icon;
            const isActive = activeSection === section.id;
            
            return (
              <button
                key={section.id}
                onClick={() => onSectionChange(section.id)}
                className={`
                  w-full p-3 
                  flex items-center justify-center
                  transition-colors relative group
                  ${isActive 
                    ? 'text-white bg-[var(--vscode-line-highlight)]' 
                    : 'text-[var(--vscode-text-muted)] hover:text-white hover:bg-[var(--vscode-line-highlight)]'
                  }
                `}
                title={section.tooltip}
                aria-label={section.label}
              >
                {/* Active Indicator */}
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-[var(--vscode-accent)]" />
                )}
                
                <Icon size={24} />
                
                {/* Tooltip */}
                <div className="absolute left-full ml-2 px-2 py-1 bg-[var(--vscode-sidebar)] border border-[var(--vscode-border)] rounded text-xs whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 text-[var(--vscode-text)]">
                  {section.tooltip}
                </div>
              </button>
            );
          })}
        </nav>

        {/* Bottom Icons */}
        <div className="border-t border-[var(--vscode-sidebar-border)] py-2">
          <button
            onClick={onGitClick}
            className="w-full p-3 flex items-center justify-center text-[var(--vscode-text-muted)] hover:text-white hover:bg-[var(--vscode-line-highlight)] transition-colors relative group"
            title="Source Control (Ctrl+Shift+G)"
            aria-label="Source Control"
          >
            <GitBranch size={24} />
            <span className="absolute top-1 right-1 w-4 h-4 bg-[var(--vscode-accent)] rounded-full flex items-center justify-center text-[10px] font-bold text-white">
              3
            </span>
            <div className="absolute left-full ml-2 px-2 py-1 bg-[var(--vscode-sidebar)] border border-[var(--vscode-border)] rounded text-xs whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 text-[var(--vscode-text)]">
              Source Control
            </div>
          </button>

          <button
            onClick={onExtensionsClick}
            className="w-full p-3 flex items-center justify-center text-[var(--vscode-text-muted)] hover:text-white hover:bg-[var(--vscode-line-highlight)] transition-colors relative group"
            title="Extensions (Ctrl+Shift+X)"
            aria-label="Extensions"
          >
            <Puzzle size={24} />
            <span className="absolute top-1 right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center text-[10px] font-bold text-white">
              8
            </span>
            <div className="absolute left-full ml-2 px-2 py-1 bg-[var(--vscode-sidebar)] border border-[var(--vscode-border)] rounded text-xs whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 text-[var(--vscode-text)]">
              Extensions
            </div>
          </button>

          <button
            onClick={onSettingsClick}
            className="w-full p-3 flex items-center justify-center text-[var(--vscode-text-muted)] hover:text-white hover:bg-[var(--vscode-line-highlight)] transition-colors relative group"
            title="Settings (Ctrl+,)"
            aria-label="Settings"
          >
            <Settings size={24} />
            <div className="absolute left-full ml-2 px-2 py-1 bg-[var(--vscode-sidebar)] border border-[var(--vscode-border)] rounded text-xs whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 text-[var(--vscode-text)]">
              Settings
            </div>
          </button>
        </div>
      </aside>

      {/* Explorer Panel (Collapsible) */}
      <AnimatePresence>
        {!isCollapsed && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 250, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className={`
              fixed left-[48px] top-[30px] bottom-[22px]
              bg-[var(--vscode-sidebar)] 
              border-r border-[var(--vscode-sidebar-border)]
              flex flex-col overflow-hidden
              z-30
              hidden md:flex
            `}
          >
            {/* Explorer Header */}
            <div className="flex items-center justify-between px-4 py-2 text-[11px] uppercase tracking-wider text-[var(--vscode-text-muted)] border-b border-[var(--vscode-sidebar-border)]">
              <span>Explorer</span>
              <button
                onClick={onToggleCollapse}
                className="p-1 hover:bg-[var(--vscode-line-highlight)] rounded transition-colors"
                title="Collapse Sidebar (Ctrl+B)"
                aria-label="Collapse Sidebar"
              >
                <PanelLeftClose size={14} />
              </button>
            </div>

            {/* Project Section */}
            <div className="flex-1 overflow-y-auto">
              {/* Portfolio Header */}
              <button
                onClick={() => setExplorerExpanded(!explorerExpanded)}
                className="w-full flex items-center gap-1 px-2 py-1.5 text-[11px] uppercase tracking-wider font-semibold text-[var(--vscode-text)] hover:bg-[var(--vscode-line-highlight)] transition-colors"
              >
                {explorerExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                <span>ARJUN-PORTFOLIO</span>
              </button>

              <AnimatePresence>
                {explorerExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    {explorerFiles.map((item, index) => (
                      <FileItem
                        key={index}
                        item={item}
                        depth={0}
                        activeSection={activeSection}
                        onSectionChange={onSectionChange}
                      />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Outline Section */}
              <button
                onClick={() => setOutlineExpanded(!outlineExpanded)}
                className="w-full flex items-center gap-1 px-2 py-1.5 text-[11px] uppercase tracking-wider font-semibold text-[var(--vscode-text)] hover:bg-[var(--vscode-line-highlight)] transition-colors mt-2 border-t border-[var(--vscode-sidebar-border)]"
              >
                {outlineExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                <span>OUTLINE</span>
              </button>

              <AnimatePresence>
                {outlineExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden px-4 py-2"
                  >
                    {sections.map((section) => (
                      <button
                        key={section.id}
                        onClick={() => onSectionChange(section.id)}
                        className={`
                          w-full flex items-center gap-2 py-1 px-2 text-xs rounded
                          hover:bg-[var(--vscode-line-highlight)] transition-colors
                          ${activeSection === section.id 
                            ? 'text-[var(--vscode-accent)] bg-[var(--vscode-line-highlight)]' 
                            : 'text-[var(--vscode-text-muted)]'
                          }
                        `}
                      >
                        <section.icon size={14} />
                        <span className="capitalize">{section.id}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Collapse/Expand Button (when collapsed) */}
      {isCollapsed && (
        <button
          onClick={onToggleCollapse}
          className="fixed left-[8px] top-[42px] z-40 p-1.5 bg-[var(--vscode-sidebar)] border border-[var(--vscode-border)] rounded hover:bg-[var(--vscode-line-highlight)] transition-colors hidden md:flex items-center justify-center"
          title="Expand Sidebar (Ctrl+B)"
          aria-label="Expand Sidebar"
        >
          <PanelLeft size={14} className="text-[var(--vscode-text-muted)]" />
        </button>
      )}

      {/* Mobile Sidebar (full overlay) */}
      <AnimatePresence>
        {!isCollapsed && (
          <>
            {/* Mobile backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onToggleCollapse}
              className="fixed inset-0 bg-black/50 z-30 md:hidden"
            />
            
            {/* Mobile sidebar */}
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed left-0 top-[30px] bottom-[22px] w-[280px] bg-[var(--vscode-sidebar)] border-r border-[var(--vscode-sidebar-border)] z-40 flex flex-col md:hidden"
            >
              {/* Mobile Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--vscode-sidebar-border)]">
                <span className="text-sm font-semibold text-[var(--vscode-text)]">Explorer</span>
                <button
                  onClick={onToggleCollapse}
                  className="p-1.5 hover:bg-[var(--vscode-line-highlight)] rounded transition-colors"
                  aria-label="Close sidebar"
                >
                  <PanelLeftClose size={18} className="text-[var(--vscode-text-muted)]" />
                </button>
              </div>

              {/* Mobile Navigation */}
              <nav className="flex-1 overflow-y-auto py-2">
                {sections.map((section) => {
                  const Icon = section.icon;
                  const isActive = activeSection === section.id;
                  
                  return (
                    <button
                      key={section.id}
                      onClick={() => {
                        onSectionChange(section.id);
                        onToggleCollapse();
                      }}
                      className={`
                        w-full p-3 
                        flex items-center gap-3
                        transition-colors relative
                        ${isActive 
                          ? 'text-white bg-[var(--vscode-line-highlight)]' 
                          : 'text-[var(--vscode-text-muted)] hover:text-white hover:bg-[var(--vscode-line-highlight)]'
                        }
                      `}
                    >
                      {isActive && (
                        <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-[var(--vscode-accent)]" />
                      )}
                      <Icon size={20} />
                      <span className="text-sm capitalize">{section.id}</span>
                    </button>
                  );
                })}
              </nav>

              {/* Mobile Bottom Actions */}
              <div className="border-t border-[var(--vscode-sidebar-border)] py-2">
                <button
                  onClick={() => { onGitClick?.(); onToggleCollapse(); }}
                  className="w-full p-3 flex items-center gap-3 text-[var(--vscode-text-muted)] hover:text-white hover:bg-[var(--vscode-line-highlight)] transition-colors"
                >
                  <GitBranch size={20} />
                  <span className="text-sm">Source Control</span>
                  <span className="ml-auto w-5 h-5 bg-[var(--vscode-accent)] rounded-full flex items-center justify-center text-[10px] font-bold text-white">
                    3
                  </span>
                </button>

                <button
                  onClick={() => { onExtensionsClick?.(); onToggleCollapse(); }}
                  className="w-full p-3 flex items-center gap-3 text-[var(--vscode-text-muted)] hover:text-white hover:bg-[var(--vscode-line-highlight)] transition-colors"
                >
                  <Puzzle size={20} />
                  <span className="text-sm">Extensions</span>
                  <span className="ml-auto w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-[10px] font-bold text-white">
                    8
                  </span>
                </button>

                <button
                  onClick={() => { onSettingsClick?.(); onToggleCollapse(); }}
                  className="w-full p-3 flex items-center gap-3 text-[var(--vscode-text-muted)] hover:text-white hover:bg-[var(--vscode-line-highlight)] transition-colors"
                >
                  <Settings size={20} />
                  <span className="text-sm">Settings</span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
