'use client';

import { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Search, 
  Filter, 
  RotateCcw, 
  ZoomIn, 
  ZoomOut, 
  Play,
  Pause,
  ChevronRight,
  Brain,
  Sparkles,
  BarChart3,
  Layers,
  Network
} from 'lucide-react';
import { 
  skillsData, 
  categoryInfo, 
  getProjectsUsingSkill, 
  getConnectedSkills, 
  getSkillById,
  getNetworkStats,
  getTimelineData,
  projectMapping,
  type SkillNode 
} from './skillsData';

// Dynamically import ForceGraph2D to avoid SSR issues
const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), { 
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full bg-[var(--vscode-bg)]">
      <div className="flex items-center gap-3 text-[var(--vscode-text-muted)]">
        <Brain className="w-8 h-8 animate-pulse text-[var(--vscode-accent)]" />
        <span>Loading Neural Network...</span>
      </div>
    </div>
  )
});

interface GraphNode extends SkillNode {
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  fx?: number | null;
  fy?: number | null;
  [key: string]: unknown;
}

interface GraphLink {
  source: string | GraphNode;
  target: string | GraphNode;
  value: number;
  [key: string]: unknown;
}

interface Filters {
  categories: string[];
  showLabels: boolean;
  showConnections: boolean;
  particleAnimation: boolean;
  autoRotate: boolean;
  selectedProject: string | null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ForceGraphRef = any;

export default function SkillsNetworkVisualizer() {
  const graphRef = useRef<ForceGraphRef>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showControls, setShowControls] = useState(true);
  const [showStats, setShowStats] = useState(false);
  const [isTrainingMode, setIsTrainingMode] = useState(false);
  const [trainingYear, setTrainingYear] = useState(2021);
  const [isPlaying, setIsPlaying] = useState(false);
  const [highlightNodes, setHighlightNodes] = useState<Set<string>>(new Set());
  const [highlightLinks, setHighlightLinks] = useState<Set<string>>(new Set());
  const [isMounted, setIsMounted] = useState(false);
  const [isGraphReady, setIsGraphReady] = useState(false);
  
  const [filters, setFilters] = useState<Filters>({
    categories: ['language', 'frontend', 'backend', 'ai', 'tools', 'concept'],
    showLabels: true,
    showConnections: true,
    particleAnimation: false,
    autoRotate: false,
    selectedProject: null,
  });

  // Set mounted state on client
  useEffect(() => {
    queueMicrotask(() => setIsMounted(true));
  }, []);

  // Handle resize with ResizeObserver for better accuracy
  useEffect(() => {
    if (!containerRef.current) return;

    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        // Use full container dimensions, ensuring minimum usable size
        const newWidth = Math.max(600, rect.width);
        const newHeight = Math.max(400, rect.height);
        
        setDimensions(prev => {
          // Only update if dimensions actually changed
          if (prev.width !== newWidth || prev.height !== newHeight) {
            return { width: newWidth, height: newHeight };
          }
          return prev;
        });
      }
    };

    // Use ResizeObserver for more accurate tracking
    const resizeObserver = new ResizeObserver(() => {
      updateDimensions();
    });

    resizeObserver.observe(containerRef.current);
    
    // Initial dimension calculation
    updateDimensions();
    
    // Also listen to window resize as fallback
    window.addEventListener('resize', updateDimensions);
    
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateDimensions);
    };
  }, [isMounted]);

  // Zoom to fit all nodes when graph is ready
  useEffect(() => {
    if (isGraphReady && graphRef.current && dimensions.width > 0 && dimensions.height > 0) {
      // Small delay to ensure graph has rendered
      const timer = setTimeout(() => {
        if (graphRef.current) {
          graphRef.current.zoomToFit(400, 80); // 400ms animation, 80px padding
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isGraphReady, dimensions]);

  // Auto-rotate effect (disabled for 2D - kept for future 3D implementation)
  useEffect(() => {
    // Auto-rotate is not applicable for 2D graphs
    // This is kept as a placeholder for potential 3D implementation
  }, [filters.autoRotate]);

  // Training animation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && isTrainingMode) {
      interval = setInterval(() => {
        setTrainingYear(prev => {
          if (prev >= 2025) {
            setIsPlaying(false);
            return 2025;
          }
          return prev + 1;
        });
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, isTrainingMode]);

  // Keyboard shortcuts for zoom controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in input fields
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      
      switch (e.key) {
        case '+':
        case '=':
          e.preventDefault();
          if (graphRef.current) {
            const currentZoom = graphRef.current.zoom();
            graphRef.current.zoom(Math.min(currentZoom * 1.5, 4), 300);
          }
          break;
        case '-':
        case '_':
          e.preventDefault();
          if (graphRef.current) {
            const currentZoom = graphRef.current.zoom();
            graphRef.current.zoom(Math.max(currentZoom / 1.5, 0.3), 300);
          }
          break;
        case 'r':
        case 'R':
          if (!e.ctrlKey && !e.metaKey) {
            e.preventDefault();
            if (graphRef.current) {
              graphRef.current.zoomToFit(400, 60);
            }
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filter data based on active filters and training mode
  // Keep all nodes in the graph but track which ones are visible
  const { graphData, visibleNodeIds, visibleLinkIds } = useMemo(() => {
    // Determine which nodes should be visible
    let visibleNodes = skillsData.nodes.filter(n => 
      filters.categories.includes(n.category)
    );

    // Training mode filter
    if (isTrainingMode) {
      visibleNodes = visibleNodes.filter(n => (n.yearLearned || 2021) <= trainingYear);
    }

    // Project filter
    if (filters.selectedProject) {
      const projectSkills = projectMapping[filters.selectedProject] || [];
      visibleNodes = visibleNodes.filter(n => projectSkills.includes(n.id));
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      visibleNodes = visibleNodes.filter(n => 
        n.label.toLowerCase().includes(query) ||
        n.category.toLowerCase().includes(query)
      );
    }

    const visibleNodeIdSet = new Set(visibleNodes.map(n => n.id));
    const visibleLinkIdSet = new Set<string>();
    
    // Determine visible links (both ends must be visible)
    skillsData.links.forEach(l => {
      if (visibleNodeIdSet.has(l.source) && visibleNodeIdSet.has(l.target)) {
        visibleLinkIdSet.add(`${l.source}-${l.target}`);
      }
    });

    // Return ALL nodes and links to keep simulation stable
    return { 
      graphData: { 
        nodes: skillsData.nodes, 
        links: skillsData.links 
      },
      visibleNodeIds: visibleNodeIdSet,
      visibleLinkIds: visibleLinkIdSet
    };
  }, [filters.categories, filters.selectedProject, searchQuery, isTrainingMode, trainingYear]);

  // Count of visible nodes for display
  const visibleNodeCount = visibleNodeIds.size;

  // Handle node hover
  const handleNodeHover = useCallback((node: GraphNode | null) => {
    setHoveredNode(node);
    
    if (node) {
      const connectedNodes = new Set<string>([node.id]);
      const connectedLinks = new Set<string>();
      
      skillsData.links.forEach(link => {
        if (link.source === node.id || link.target === node.id) {
          connectedNodes.add(link.source);
          connectedNodes.add(link.target);
          connectedLinks.add(`${link.source}-${link.target}`);
        }
      });
      
      setHighlightNodes(connectedNodes);
      setHighlightLinks(connectedLinks);
    } else {
      setHighlightNodes(new Set());
      setHighlightLinks(new Set());
    }
  }, []);

  // Handle node click
  const handleNodeClick = useCallback((node: GraphNode) => {
    setSelectedNode(node);
    
    // Center on node
    if (graphRef.current) {
      graphRef.current.centerAt(node.x, node.y, 1000);
      graphRef.current.zoom(2, 1000);
    }
  }, []);

  // Handle background click
  const handleBackgroundClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  // Reset view - zoom to fit all visible nodes
  const resetView = useCallback(() => {
    if (graphRef.current) {
      // Use zoomToFit to show all nodes with padding
      graphRef.current.zoomToFit(400, 60);
    }
    setSelectedNode(null);
    setHoveredNode(null);
    setSearchQuery('');
    setFilters(prev => ({ ...prev, selectedProject: null }));
  }, []);

  // Zoom controls
  const handleZoomIn = useCallback(() => {
    if (graphRef.current) {
      const currentZoom = graphRef.current.zoom();
      graphRef.current.zoom(Math.min(currentZoom * 1.5, 4), 300);
    }
  }, []);

  const handleZoomOut = useCallback(() => {
    if (graphRef.current) {
      const currentZoom = graphRef.current.zoom();
      graphRef.current.zoom(Math.max(currentZoom / 1.5, 0.3), 300);
    }
  }, []);

  // Toggle category filter
  const toggleCategory = useCallback((category: string) => {
    setFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  }, []);

  // Network stats
  const stats = useMemo(() => getNetworkStats(), []);
  const timelineData = useMemo(() => getTimelineData(), []);

  // Custom node canvas rendering
  const paintNode = useCallback((node: GraphNode, ctx: CanvasRenderingContext2D, globalScale: number) => {
    // Skip rendering if node is not visible (filtered out)
    if (!visibleNodeIds.has(node.id)) {
      return;
    }
    
    const label = node.label;
    const fontSize = 12 / globalScale;
    const nodeRadius = 4 + (node.proficiency / 10);
    const isHighlighted = highlightNodes.size === 0 || highlightNodes.has(node.id);
    const isHovered = hoveredNode?.id === node.id;
    const isSelected = selectedNode?.id === node.id;
    
    // Node glow effect
    if (isHovered || isSelected) {
      ctx.beginPath();
      ctx.arc(node.x!, node.y!, nodeRadius + 8, 0, 2 * Math.PI);
      const gradient = ctx.createRadialGradient(
        node.x!, node.y!, nodeRadius,
        node.x!, node.y!, nodeRadius + 8
      );
      gradient.addColorStop(0, `${node.color}80`);
      gradient.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient;
      ctx.fill();
    }
    
    // Main node
    ctx.beginPath();
    ctx.arc(node.x!, node.y!, nodeRadius, 0, 2 * Math.PI);
    ctx.fillStyle = isHighlighted ? node.color : `${node.color}40`;
    ctx.fill();
    
    // Border
    ctx.strokeStyle = isHovered || isSelected ? '#fff' : `${node.color}80`;
    ctx.lineWidth = isHovered || isSelected ? 2 / globalScale : 1 / globalScale;
    ctx.stroke();
    
    // Proficiency ring
    if (isHighlighted) {
      const startAngle = -Math.PI / 2;
      const endAngle = startAngle + (2 * Math.PI * node.proficiency / 100);
      ctx.beginPath();
      ctx.arc(node.x!, node.y!, nodeRadius + 3, startAngle, endAngle);
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2 / globalScale;
      ctx.stroke();
    }
    
    // Label
    if (filters.showLabels && (isHighlighted || globalScale > 1.5)) {
      ctx.font = `${isHovered ? 'bold ' : ''}${fontSize}px 'Fira Code', monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      
      // Label background
      const textWidth = ctx.measureText(label).width;
      ctx.fillStyle = 'rgba(30, 30, 30, 0.9)';
      ctx.fillRect(
        node.x! - textWidth / 2 - 4,
        node.y! + nodeRadius + 4,
        textWidth + 8,
        fontSize + 4
      );
      
      // Label text
      ctx.fillStyle = isHighlighted ? '#fff' : '#888';
      ctx.fillText(label, node.x!, node.y! + nodeRadius + 6);
    }
  }, [highlightNodes, hoveredNode, selectedNode, filters.showLabels, visibleNodeIds]);

  // Custom link rendering
  const paintLink = useCallback((link: GraphLink, ctx: CanvasRenderingContext2D, globalScale: number) => {
    const source = link.source as GraphNode;
    const target = link.target as GraphNode;
    const sourceId = typeof link.source === 'string' ? link.source : source.id;
    const targetId = typeof link.target === 'string' ? link.target : target.id;
    
    // Skip rendering if either end node is not visible
    if (!visibleNodeIds.has(sourceId) || !visibleNodeIds.has(targetId)) {
      return;
    }
    
    const linkId = `${sourceId}-${targetId}`;
    const isHighlighted = highlightLinks.size === 0 || highlightLinks.has(linkId);
    
    ctx.beginPath();
    ctx.moveTo(source.x!, source.y!);
    ctx.lineTo(target.x!, target.y!);
    ctx.strokeStyle = isHighlighted 
      ? `rgba(0, 122, 204, ${0.3 + link.value / 20})` 
      : 'rgba(100, 100, 100, 0.1)';
    ctx.lineWidth = (link.value / 3) / globalScale;
    ctx.stroke();
  }, [highlightLinks, visibleNodeIds]);

  // Show loading state until mounted to prevent hydration mismatch
  if (!isMounted) {
    return (
      <div className="relative w-full h-full bg-[var(--vscode-bg)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Brain className="w-12 h-12 text-[var(--vscode-accent)] animate-pulse" />
          <span className="text-[var(--vscode-text-muted)]">Loading Neural Network...</span>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="relative w-full h-full bg-[var(--vscode-bg)] overflow-hidden"
      ref={containerRef}
      style={{ minHeight: '100%' }}
    >
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-4 py-3 bg-gradient-to-b from-[var(--vscode-bg)] to-transparent">
        <div className="flex items-center gap-3">
          <Brain className="w-6 h-6 text-[var(--vscode-accent)]" />
          <h2 className="text-lg font-semibold text-[var(--vscode-text)]">Skills Neural Network</h2>
          <span className="px-2 py-0.5 text-xs bg-[var(--vscode-accent)]/20 text-[var(--vscode-accent)] rounded">
            {visibleNodeCount} skills
          </span>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--vscode-text-muted)]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search skills..."
            className="pl-10 pr-4 py-2 w-64 bg-[var(--vscode-sidebar)] border border-[var(--vscode-border)] rounded-lg text-sm text-[var(--vscode-text)] placeholder-[var(--vscode-text-muted)] focus:outline-none focus:border-[var(--vscode-accent)]"
          />
        </div>
        
        {/* Toggle buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowStats(!showStats)}
            className={`p-2 rounded-lg transition-colors ${showStats ? 'bg-[var(--vscode-accent)] text-white' : 'bg-[var(--vscode-sidebar)] text-[var(--vscode-text-muted)] hover:text-[var(--vscode-text)]'}`}
            title="Toggle Statistics"
            aria-label="Toggle statistics panel"
          >
            <BarChart3 className="w-5 h-5" />
          </button>
          <button
            onClick={() => setShowControls(!showControls)}
            className={`p-2 rounded-lg transition-colors ${showControls ? 'bg-[var(--vscode-accent)] text-white' : 'bg-[var(--vscode-sidebar)] text-[var(--vscode-text-muted)] hover:text-[var(--vscode-text)]'}`}
            title="Toggle Controls"
          >
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Control Panel */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            className="absolute top-16 left-4 z-20 w-64 bg-[var(--vscode-sidebar)] border border-[var(--vscode-border)] rounded-lg shadow-xl overflow-hidden max-h-[calc(100vh-200px)] overflow-y-auto"
          >
            <div className="p-4 border-b border-[var(--vscode-border)]">
              <h3 className="text-sm font-semibold text-[var(--vscode-text)] flex items-center gap-2">
                <Layers className="w-4 h-4" />
                Filter by Category
              </h3>
            </div>
            <div className="p-3 space-y-2 max-h-64 overflow-y-auto">
              {Object.entries(categoryInfo).map(([key, info]) => (
                <label
                  key={key}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-[var(--vscode-line-highlight)] cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={filters.categories.includes(key)}
                    onChange={() => toggleCategory(key)}
                    className="w-4 h-4 rounded border-[var(--vscode-border)] text-[var(--vscode-accent)] focus:ring-[var(--vscode-accent)] bg-[var(--vscode-bg)]"
                  />
                  <span className="text-lg">{info.icon}</span>
                  <span className="text-sm text-[var(--vscode-text)]">{info.label}</span>
                  <span 
                    className="ml-auto w-3 h-3 rounded-full"
                    style={{ backgroundColor: info.color }}
                  />
                </label>
              ))}
            </div>
            
            <div className="p-4 border-t border-[var(--vscode-border)]">
              <h3 className="text-sm font-semibold text-[var(--vscode-text)] flex items-center gap-2 mb-3">
                <Network className="w-4 h-4" />
                Display Options
              </h3>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.showLabels}
                    onChange={() => setFilters(prev => ({ ...prev, showLabels: !prev.showLabels }))}
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-sm text-[var(--vscode-text)]">Show Labels</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.particleAnimation}
                    onChange={() => setFilters(prev => ({ ...prev, particleAnimation: !prev.particleAnimation }))}
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-sm text-[var(--vscode-text)]">Particle Animation</span>
                </label>
              </div>
            </div>
            
            <div className="p-4 border-t border-[var(--vscode-border)]">
              <h3 className="text-sm font-semibold text-[var(--vscode-text)] mb-3">Select Project</h3>
              <select
                value={filters.selectedProject || ''}
                onChange={(e) => setFilters(prev => ({ 
                  ...prev, 
                  selectedProject: e.target.value || null 
                }))}
                aria-label="Filter by project"
                title="Select a project to highlight related skills"
                className="w-full px-3 py-2 bg-[var(--vscode-bg)] border border-[var(--vscode-border)] rounded-lg text-sm text-[var(--vscode-text)] focus:outline-none focus:border-[var(--vscode-accent)]"
              >
                <option value="">All Skills</option>
                {Object.keys(projectMapping).map(project => (
                  <option key={project} value={project}>{project}</option>
                ))}
              </select>
            </div>
            
            {/* Training Animation Controls */}
            <div className="p-4 border-t border-[var(--vscode-border)]">
              <h3 className="text-sm font-semibold text-[var(--vscode-text)] flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4" />
                Skill Growth Timeline
              </h3>
              <div className="flex items-center gap-2 mb-3">
                <button
                  onClick={() => {
                    setIsTrainingMode(!isTrainingMode);
                    if (!isTrainingMode) {
                      setTrainingYear(2021);
                      setIsPlaying(false);
                    }
                  }}
                  className={`flex-1 px-3 py-2 text-xs rounded-lg transition-colors ${
                    isTrainingMode 
                      ? 'bg-[var(--vscode-accent)] text-white' 
                      : 'bg-[var(--vscode-bg)] text-[var(--vscode-text)] border border-[var(--vscode-border)] hover:border-[var(--vscode-accent)]'
                  }`}
                >
                  {isTrainingMode ? 'Exit Timeline' : 'Enter Timeline'}
                </button>
              </div>
              
              {isTrainingMode && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="p-2 bg-[var(--vscode-accent)] text-white rounded-lg hover:opacity-90 transition-opacity"
                      title={isPlaying ? 'Pause timeline' : 'Play timeline'}
                      aria-label={isPlaying ? 'Pause timeline animation' : 'Play timeline animation'}
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </button>
                    <input
                      type="range"
                      min={2021}
                      max={2025}
                      value={trainingYear}
                      onChange={(e) => setTrainingYear(parseInt(e.target.value))}
                      className="flex-1"
                      aria-label="Timeline year selector"
                      title={`Year: ${trainingYear}`}
                    />
                    <span className="text-sm font-mono text-[var(--vscode-accent)]">{trainingYear}</span>
                  </div>
                  <div className="text-xs text-[var(--vscode-text-muted)]">
                    {timelineData.find(t => t.year === trainingYear)?.milestone || 'Building skills...'}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats Panel */}
      <AnimatePresence>
        {showStats && (
          <motion.div
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            className="absolute top-16 right-4 z-20 w-72 bg-[var(--vscode-sidebar)] border border-[var(--vscode-border)] rounded-lg shadow-xl overflow-hidden"
          >
            <div className="p-4 border-b border-[var(--vscode-border)]">
              <h3 className="text-sm font-semibold text-[var(--vscode-text)] flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Network Statistics
              </h3>
            </div>
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-[var(--vscode-bg)] rounded-lg">
                  <div className="text-2xl font-bold text-[var(--vscode-accent)]">{stats.totalSkills}</div>
                  <div className="text-xs text-[var(--vscode-text-muted)]">Total Skills</div>
                </div>
                <div className="p-3 bg-[var(--vscode-bg)] rounded-lg">
                  <div className="text-2xl font-bold text-[var(--vscode-accent)]">{stats.totalConnections}</div>
                  <div className="text-xs text-[var(--vscode-text-muted)]">Connections</div>
                </div>
              </div>
              
              <div className="p-3 bg-[var(--vscode-bg)] rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-[var(--vscode-text-muted)]">Average Proficiency</span>
                  <span className="text-sm font-bold text-[var(--vscode-text)]">{stats.avgProficiency}%</span>
                </div>
                <div className="h-2 bg-[var(--vscode-border)] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[var(--vscode-accent)] to-blue-400 rounded-full transition-all"
                    style={{ width: `${stats.avgProficiency}%` }}
                  />
                </div>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[var(--vscode-text-muted)]">Most Connected</span>
                  <span className="text-[var(--vscode-text)]">{stats.mostConnected.skill} ({stats.mostConnected.connections})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--vscode-text-muted)]">Newest Skill</span>
                  <span className="text-[var(--vscode-text)]">{stats.newestSkill}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--vscode-text-muted)]">Strongest Link</span>
                  <span className="text-[var(--vscode-text)] text-xs">{stats.strongestConnection.source} ↔ {stats.strongestConnection.target}</span>
                </div>
              </div>
              
              <div className="pt-3 border-t border-[var(--vscode-border)]">
                <h4 className="text-xs font-semibold text-[var(--vscode-text-muted)] mb-2">Category Breakdown</h4>
                <div className="space-y-2">
                  {Object.entries(stats.categoryBreakdown).map(([category, count]) => (
                    <div key={category} className="flex items-center gap-2">
                      <span 
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: categoryInfo[category]?.color }}
                      />
                      <span className="text-xs text-[var(--vscode-text)] flex-1">
                        {categoryInfo[category]?.label}
                      </span>
                      <span className="text-xs text-[var(--vscode-text-muted)]">
                        {count} ({Math.round(count / stats.totalSkills * 100)}%)
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Zoom Controls */}
      <div className="absolute bottom-4 right-4 z-20 flex flex-col gap-2">
        <button
          onClick={handleZoomIn}
          className="p-2 bg-[var(--vscode-sidebar)] border border-[var(--vscode-border)] rounded-lg text-[var(--vscode-text)] hover:border-[var(--vscode-accent)] hover:bg-[var(--vscode-line-highlight)] transition-colors active:scale-95"
          title="Zoom In (+)"
          aria-label="Zoom in on the network graph"
        >
          <ZoomIn className="w-5 h-5" />
        </button>
        <button
          onClick={handleZoomOut}
          className="p-2 bg-[var(--vscode-sidebar)] border border-[var(--vscode-border)] rounded-lg text-[var(--vscode-text)] hover:border-[var(--vscode-accent)] hover:bg-[var(--vscode-line-highlight)] transition-colors active:scale-95"
          title="Zoom Out (-)"
          aria-label="Zoom out on the network graph"
        >
          <ZoomOut className="w-5 h-5" />
        </button>
        <button
          onClick={resetView}
          className="p-2 bg-[var(--vscode-sidebar)] border border-[var(--vscode-border)] rounded-lg text-[var(--vscode-text)] hover:border-[var(--vscode-accent)] hover:bg-[var(--vscode-line-highlight)] transition-colors active:scale-95"
          title="Reset View (R)"
          aria-label="Reset view and fit all nodes"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>

      {/* Category Legend - Positioned to avoid overlap with Control Panel */}
      <div className={`absolute bottom-4 z-20 flex flex-wrap gap-1.5 max-w-[300px] p-2 bg-[var(--vscode-sidebar)]/95 border border-[var(--vscode-border)] rounded-lg backdrop-blur-sm transition-all duration-300 ${
        showControls ? 'left-[280px]' : 'left-4'
      }`}>
        {Object.entries(categoryInfo).map(([key, info]) => (
          <button
            key={key}
            onClick={() => toggleCategory(key)}
            className={`flex items-center gap-1.5 px-2 py-1 bg-[var(--vscode-bg)]/80 border border-[var(--vscode-border)] rounded text-[10px] transition-all whitespace-nowrap cursor-pointer hover:border-[var(--vscode-accent)] ${
              filters.categories.includes(key) ? 'opacity-100 border-[var(--vscode-accent)]/30' : 'opacity-40'
            }`}
            title={`Toggle ${info.label}`}
          >
            <span 
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: info.color }}
            />
            <span className="text-[var(--vscode-text)] truncate">{info.label}</span>
          </button>
        ))}
      </div>

      {/* Graph */}
      <div className="absolute inset-0 top-14">
        {/* @ts-expect-error - ForceGraph2D types are not fully compatible with our custom node/link types */}
        <ForceGraph2D
          ref={graphRef}
          graphData={graphData}
          width={dimensions.width}
          height={dimensions.height - 56}
          nodeRelSize={6}
          nodeVal={(node: GraphNode) => 4 + (node.proficiency / 10)}
          nodeCanvasObject={paintNode}
          nodePointerAreaPaint={(node: GraphNode, color: string, ctx: CanvasRenderingContext2D) => {
            // Only make visible nodes interactive
            if (!visibleNodeIds.has(node.id)) {
              return;
            }
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(node.x || 0, node.y || 0, 4 + (node.proficiency / 10) + 5, 0, 2 * Math.PI);
            ctx.fill();
          }}
          linkCanvasObject={filters.showConnections ? paintLink : undefined}
          linkWidth={(link: GraphLink) => link.value / 3}
          linkColor={() => 'rgba(100, 100, 100, 0.3)'}
          linkDirectionalParticles={filters.particleAnimation ? 2 : 0}
          linkDirectionalParticleWidth={2}
          linkDirectionalParticleSpeed={0.005}
          linkVisibility={(link: GraphLink) => {
            const sourceId = typeof link.source === 'string' ? link.source : (link.source as GraphNode).id;
            const targetId = typeof link.target === 'string' ? link.target : (link.target as GraphNode).id;
            return visibleNodeIds.has(sourceId) && visibleNodeIds.has(targetId);
          }}
          onNodeClick={handleNodeClick}
          onNodeHover={handleNodeHover}
          onBackgroundClick={handleBackgroundClick}
          onEngineStop={() => setIsGraphReady(true)}
          cooldownTicks={isGraphReady ? Infinity : 100}
          d3AlphaDecay={0.02}
          d3VelocityDecay={0.2}
          warmupTicks={isGraphReady ? 0 : 100}
          onNodeDragEnd={(node: GraphNode) => {
            // Release the fixed position so the node can flow naturally
            node.fx = undefined;
            node.fy = undefined;
          }}
          backgroundColor="transparent"
          enableZoomInteraction={true}
          enablePanInteraction={true}
          minZoom={0.3}
          maxZoom={4}
        />
      </div>

      {/* Skill Detail Modal */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-30 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={() => setSelectedNode(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md mx-4 bg-[var(--vscode-sidebar)] border border-[var(--vscode-border)] rounded-lg shadow-2xl overflow-hidden"
            >
              {/* Modal Header */}
              <div 
                className="p-4 border-b border-[var(--vscode-border)]"
                style={{ backgroundColor: `${selectedNode.color}20` }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{categoryInfo[selectedNode.category]?.icon}</span>
                    <div>
                      <h3 className="text-lg font-bold text-[var(--vscode-text)]">{selectedNode.label}</h3>
                      <span 
                        className="text-xs px-2 py-0.5 rounded"
                        style={{ backgroundColor: selectedNode.color, color: '#fff' }}
                      >
                        {categoryInfo[selectedNode.category]?.label}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedNode(null)}
                    className="p-2 hover:bg-[var(--vscode-line-highlight)] rounded-lg transition-colors"
                    title="Close skill details"
                    aria-label="Close skill details modal"
                  >
                    <X className="w-5 h-5 text-[var(--vscode-text-muted)]" />
                  </button>
                </div>
              </div>
              
              {/* Modal Content */}
              <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
                {/* Proficiency */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-[var(--vscode-text-muted)]">Proficiency</span>
                    <span className="text-sm font-bold text-[var(--vscode-text)]">{selectedNode.proficiency}%</span>
                  </div>
                  <div className="h-3 bg-[var(--vscode-bg)] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${selectedNode.proficiency}%` }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: selectedNode.color }}
                    />
                  </div>
                </div>
                
                {/* Description */}
                {selectedNode.description && (
                  <p className="text-sm text-[var(--vscode-text-muted)]">{selectedNode.description}</p>
                )}
                
                {/* Connected Skills */}
                <div>
                  <h4 className="text-sm font-semibold text-[var(--vscode-text)] mb-2">Connected Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {getConnectedSkills(selectedNode.id).slice(0, 8).map(({ id, strength }) => {
                      const skill = getSkillById(id);
                      if (!skill) return null;
                      return (
                        <button
                          key={id}
                          onClick={() => {
                            const node = graphData.nodes.find(n => n.id === id);
                            if (node && visibleNodeIds.has(id)) setSelectedNode(node as GraphNode);
                          }}
                          className="flex items-center gap-1.5 px-2 py-1 bg-[var(--vscode-bg)] border border-[var(--vscode-border)] rounded text-xs hover:border-[var(--vscode-accent)] transition-colors"
                        >
                          <span 
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: skill.color }}
                          />
                          <span className="text-[var(--vscode-text)]">{skill.label}</span>
                          <span className="text-[var(--vscode-text-muted)]">
                            ({strength > 7 ? 'Strong' : strength > 5 ? 'Medium' : 'Weak'})
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
                
                {/* Projects */}
                <div>
                  <h4 className="text-sm font-semibold text-[var(--vscode-text)] mb-2">Projects Using This Skill</h4>
                  <div className="space-y-2">
                    {getProjectsUsingSkill(selectedNode.id).map(project => (
                      <div
                        key={project}
                        className="flex items-center justify-between p-2 bg-[var(--vscode-bg)] border border-[var(--vscode-border)] rounded hover:border-[var(--vscode-accent)] transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-yellow-400">🏆</span>
                          <span className="text-sm text-[var(--vscode-text)]">{project}</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-[var(--vscode-text-muted)]" />
                      </div>
                    ))}
                    {getProjectsUsingSkill(selectedNode.id).length === 0 && (
                      <p className="text-sm text-[var(--vscode-text-muted)] italic">
                        No specific projects linked yet
                      </p>
                    )}
                  </div>
                </div>
                
                {/* Year Learned */}
                {selectedNode.yearLearned && (
                  <div className="text-sm text-[var(--vscode-text-muted)]">
                    📅 Learning started: {selectedNode.yearLearned}
                  </div>
                )}
              </div>
              
              {/* Modal Footer */}
              <div className="p-4 border-t border-[var(--vscode-border)] flex justify-end gap-2">
                <button
                  onClick={() => setSelectedNode(null)}
                  className="px-4 py-2 text-sm bg-[var(--vscode-bg)] border border-[var(--vscode-border)] rounded-lg text-[var(--vscode-text)] hover:border-[var(--vscode-accent)] transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hover Tooltip */}
      <AnimatePresence>
        {hoveredNode && !selectedNode && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="fixed z-40 pointer-events-none"
            style={{
              left: Math.min((hoveredNode.x || 0) + dimensions.width / 2 + 20, dimensions.width - 220),
              top: Math.min((hoveredNode.y || 0) + dimensions.height / 2 - 40, dimensions.height - 150),
            }}
          >
            <div className="bg-[#2d2d2d] border border-[var(--vscode-accent)] rounded-lg p-3 shadow-xl min-w-[180px]">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{categoryInfo[hoveredNode.category]?.icon}</span>
                <span className="font-bold text-[var(--vscode-text)]">{hoveredNode.label}</span>
              </div>
              <div className="mb-2">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-[var(--vscode-text-muted)]">Proficiency</span>
                  <span className="text-[var(--vscode-text)]">{hoveredNode.proficiency}%</span>
                </div>
                <div className="h-1.5 bg-[var(--vscode-bg)] rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full"
                    style={{ width: `${hoveredNode.proficiency}%`, backgroundColor: hoveredNode.color }}
                  />
                </div>
              </div>
              <span 
                className="text-[10px] px-1.5 py-0.5 rounded"
                style={{ backgroundColor: hoveredNode.color, color: '#fff' }}
              >
                {categoryInfo[hoveredNode.category]?.label}
              </span>
              <div className="mt-2 pt-2 border-t border-[var(--vscode-border)]">
                <span className="text-[10px] text-[var(--vscode-accent)]">Click to see details →</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
