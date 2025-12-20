'use client';

import { ChevronRight } from 'lucide-react';

interface BreadcrumbProps {
  path: string[];
}

export default function Breadcrumb({ path }: BreadcrumbProps) {
  return (
    <div className="breadcrumb text-[var(--vscode-text-muted)] text-xs py-1 px-3 bg-[var(--vscode-bg)] border-b border-[var(--vscode-sidebar-border)]">
      <span className="text-[var(--vscode-text-muted)] hover:text-[var(--vscode-text)] cursor-pointer">
        ArjunRajput.ai
      </span>
      {path.map((item, index) => (
        <span key={index} className="breadcrumb-item">
          <ChevronRight size={14} className="text-[var(--vscode-text-muted)]" />
          <span className={`hover:text-[var(--vscode-text)] cursor-pointer ${index === path.length - 1 ? 'text-[var(--vscode-text)]' : ''}`}>
            {item}
          </span>
        </span>
      ))}
    </div>
  );
}
