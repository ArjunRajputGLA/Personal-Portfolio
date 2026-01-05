// Skills Network Data Structure
export interface SkillNode {
  id: string;
  label: string;
  category: 'language' | 'frontend' | 'backend' | 'ai' | 'tools' | 'concept';
  proficiency: number;
  color: string;
  yearLearned?: number;
  description?: string;
}

export interface SkillLink {
  source: string;
  target: string;
  value: number;
}

export interface SkillsData {
  nodes: SkillNode[];
  links: SkillLink[];
}

export const categoryInfo: Record<string, { label: string; icon: string; color: string }> = {
  language: { label: 'Programming Language', icon: '💻', color: '#8B5CF6' },
  frontend: { label: 'Frontend', icon: '🎨', color: '#3B82F6' },
  backend: { label: 'Backend', icon: '⚙️', color: '#10B981' },
  ai: { label: 'AI/ML', icon: '🤖', color: '#F59E0B' },
  tools: { label: 'Tools', icon: '🛠️', color: '#6B7280' },
  concept: { label: 'Core Concept', icon: '💡', color: '#06B6D4' },
};

export const skillsData: SkillsData = {
  nodes: [
    // Programming Languages (Purple nodes)
    { id: 'python', label: 'Python', category: 'language', proficiency: 90, color: '#8B5CF6', yearLearned: 2021, description: 'Primary language for AI/ML and backend development' },
    { id: 'javascript', label: 'JavaScript', category: 'language', proficiency: 85, color: '#8B5CF6', yearLearned: 2022, description: 'Core web development language' },
    { id: 'typescript', label: 'TypeScript', category: 'language', proficiency: 80, color: '#8B5CF6', yearLearned: 2023, description: 'Type-safe JavaScript for large applications' },
    { id: 'java', label: 'Java', category: 'language', proficiency: 75, color: '#8B5CF6', yearLearned: 2022, description: 'Object-oriented programming and DSA' },
    { id: 'sql', label: 'SQL', category: 'language', proficiency: 70, color: '#8B5CF6', yearLearned: 2022, description: 'Database querying and management' },
    
    // Frontend (Blue nodes)
    { id: 'react', label: 'React.js', category: 'frontend', proficiency: 85, color: '#3B82F6', yearLearned: 2023, description: 'Component-based UI development' },
    { id: 'nextjs', label: 'Next.js', category: 'frontend', proficiency: 80, color: '#3B82F6', yearLearned: 2023, description: 'Full-stack React framework' },
    { id: 'tailwind', label: 'Tailwind CSS', category: 'frontend', proficiency: 85, color: '#3B82F6', yearLearned: 2023, description: 'Utility-first CSS framework' },
    { id: 'html-css', label: 'HTML/CSS', category: 'frontend', proficiency: 90, color: '#3B82F6', yearLearned: 2021, description: 'Web fundamentals' },
    
    // Backend (Green nodes)
    { id: 'nodejs', label: 'Node.js', category: 'backend', proficiency: 75, color: '#10B981', yearLearned: 2023, description: 'JavaScript runtime for server-side' },
    { id: 'mongodb', label: 'MongoDB', category: 'backend', proficiency: 70, color: '#10B981', yearLearned: 2023, description: 'NoSQL database for modern apps' },
    { id: 'electron', label: 'Electron.js', category: 'backend', proficiency: 70, color: '#10B981', yearLearned: 2024, description: 'Desktop app development' },
    
    // AI/ML (Orange nodes)
    { id: 'ml', label: 'Machine Learning', category: 'ai', proficiency: 80, color: '#F59E0B', yearLearned: 2022, description: 'Statistical learning algorithms' },
    { id: 'pytorch', label: 'PyTorch', category: 'ai', proficiency: 75, color: '#F59E0B', yearLearned: 2023, description: 'Deep learning framework' },
    { id: 'sklearn', label: 'Scikit-Learn', category: 'ai', proficiency: 75, color: '#F59E0B', yearLearned: 2022, description: 'Classical ML algorithms' },
    { id: 'nlp', label: 'NLP', category: 'ai', proficiency: 75, color: '#F59E0B', yearLearned: 2023, description: 'Natural Language Processing' },
    { id: 'deep-learning', label: 'Deep Learning', category: 'ai', proficiency: 70, color: '#F59E0B', yearLearned: 2024, description: 'Neural network architectures' },
    
    // Tools (Gray nodes)
    { id: 'git', label: 'Git', category: 'tools', proficiency: 85, color: '#6B7280', yearLearned: 2021, description: 'Version control system' },
    { id: 'vscode', label: 'VS Code', category: 'tools', proficiency: 90, color: '#6B7280', yearLearned: 2021, description: 'Primary code editor' },
    
    // Core Concepts (Cyan nodes)
    { id: 'fullstack', label: 'Full-Stack Dev', category: 'concept', proficiency: 85, color: '#06B6D4', yearLearned: 2023, description: 'End-to-end application development' },
    { id: 'problem-solving', label: 'Problem Solving', category: 'concept', proficiency: 95, color: '#06B6D4', yearLearned: 2021, description: 'Analytical thinking and debugging' },
    { id: 'algorithms', label: 'Algorithms & DS', category: 'concept', proficiency: 90, color: '#06B6D4', yearLearned: 2022, description: 'Data structures and algorithms' },
    { id: 'data-science', label: 'Data Science', category: 'concept', proficiency: 75, color: '#06B6D4', yearLearned: 2023, description: 'Data analysis and visualization' },
  ],
  
  links: [
    // Python ecosystem
    { source: 'python', target: 'ml', value: 9 },
    { source: 'python', target: 'pytorch', value: 8 },
    { source: 'python', target: 'sklearn', value: 8 },
    { source: 'python', target: 'nlp', value: 8 },
    { source: 'python', target: 'deep-learning', value: 7 },
    { source: 'python', target: 'algorithms', value: 7 },
    { source: 'python', target: 'data-science', value: 8 },
    
    // JavaScript/TypeScript ecosystem
    { source: 'javascript', target: 'react', value: 9 },
    { source: 'typescript', target: 'react', value: 8 },
    { source: 'javascript', target: 'nodejs', value: 8 },
    { source: 'typescript', target: 'nextjs', value: 9 },
    { source: 'typescript', target: 'nodejs', value: 7 },
    
    // Frontend connections
    { source: 'react', target: 'nextjs', value: 9 },
    { source: 'react', target: 'tailwind', value: 7 },
    { source: 'html-css', target: 'react', value: 6 },
    { source: 'html-css', target: 'tailwind', value: 8 },
    { source: 'react', target: 'fullstack', value: 8 },
    
    // Backend connections
    { source: 'nodejs', target: 'mongodb', value: 8 },
    { source: 'nodejs', target: 'fullstack', value: 8 },
    { source: 'javascript', target: 'electron', value: 7 },
    
    // AI/ML interconnections
    { source: 'ml', target: 'pytorch', value: 9 },
    { source: 'ml', target: 'sklearn', value: 8 },
    { source: 'ml', target: 'nlp', value: 8 },
    { source: 'ml', target: 'deep-learning', value: 9 },
    { source: 'pytorch', target: 'deep-learning', value: 9 },
    { source: 'pytorch', target: 'nlp', value: 7 },
    { source: 'sklearn', target: 'data-science', value: 8 },
    { source: 'ml', target: 'data-science', value: 8 },
    
    // Core concepts connections
    { source: 'fullstack', target: 'problem-solving', value: 7 },
    { source: 'algorithms', target: 'problem-solving', value: 9 },
    { source: 'java', target: 'algorithms', value: 8 },
    { source: 'python', target: 'problem-solving', value: 7 },
    { source: 'sql', target: 'mongodb', value: 6 },
    
    // Tools connections
    { source: 'git', target: 'fullstack', value: 6 },
    { source: 'vscode', target: 'python', value: 5 },
    { source: 'vscode', target: 'javascript', value: 5 },
  ],
};

export const projectMapping: Record<string, string[]> = {
  'AGENTIX': ['python', 'ml', 'react', 'nextjs', 'fullstack', 'problem-solving', 'algorithms'],
  'NO CODE BACKEND': ['typescript', 'react', 'nextjs', 'nodejs', 'fullstack'],
  'GLA Canteen App': ['react', 'nodejs', 'mongodb', 'fullstack', 'html-css'],
  'Malware Detection': ['python', 'nlp', 'pytorch', 'ml', 'deep-learning'],
  'Article Analyser': ['python', 'nlp', 'ml', 'data-science'],
  'FLUXOR': ['javascript', 'electron', 'nodejs', 'algorithms'],
  'J.A.R.V.I.S Arena': ['javascript', 'react', 'html-css'],
  'Smart AI Classroom': ['python', 'ml', 'pytorch', 'react'],
};

// Helper function to get projects using a skill
export function getProjectsUsingSkill(skillId: string): string[] {
  return Object.entries(projectMapping)
    .filter(([, skills]) => skills.includes(skillId))
    .map(([project]) => project);
}

// Helper function to get connected skills
export function getConnectedSkills(skillId: string): { id: string; strength: number }[] {
  const connected: { id: string; strength: number }[] = [];
  
  skillsData.links.forEach(link => {
    if (link.source === skillId) {
      connected.push({ id: link.target, strength: link.value });
    } else if (link.target === skillId) {
      connected.push({ id: link.source, strength: link.value });
    }
  });
  
  return connected.sort((a, b) => b.strength - a.strength);
}

// Helper function to get skill by ID
export function getSkillById(skillId: string): SkillNode | undefined {
  return skillsData.nodes.find(node => node.id === skillId);
}

// Calculate network statistics
export function getNetworkStats() {
  const nodes = skillsData.nodes;
  const links = skillsData.links;
  
  // Calculate connections per node
  const connectionCount: Record<string, number> = {};
  nodes.forEach(node => connectionCount[node.id] = 0);
  links.forEach(link => {
    connectionCount[link.source]++;
    connectionCount[link.target]++;
  });
  
  // Find most connected
  const mostConnected = Object.entries(connectionCount)
    .sort((a, b) => b[1] - a[1])[0];
  
  // Find strongest connection
  const strongestLink = [...links].sort((a, b) => b.value - a.value)[0];
  
  // Category breakdown
  const categoryBreakdown: Record<string, number> = {};
  nodes.forEach(node => {
    categoryBreakdown[node.category] = (categoryBreakdown[node.category] || 0) + 1;
  });
  
  // Average proficiency
  const avgProficiency = Math.round(
    nodes.reduce((sum, node) => sum + node.proficiency, 0) / nodes.length
  );
  
  // Newest skill (highest yearLearned)
  const newestSkill = [...nodes]
    .filter(n => n.yearLearned)
    .sort((a, b) => (b.yearLearned || 0) - (a.yearLearned || 0))[0];
  
  return {
    totalSkills: nodes.length,
    totalConnections: links.length,
    avgProficiency,
    mostConnected: {
      skill: getSkillById(mostConnected[0])?.label || mostConnected[0],
      connections: mostConnected[1],
    },
    newestSkill: newestSkill?.label || 'N/A',
    strongestConnection: {
      source: getSkillById(strongestLink.source)?.label || strongestLink.source,
      target: getSkillById(strongestLink.target)?.label || strongestLink.target,
      strength: strongestLink.value,
    },
    categoryBreakdown,
  };
}

// Timeline data for training animation
export function getTimelineData() {
  const skillsByYear: Record<number, SkillNode[]> = {};
  
  skillsData.nodes.forEach(node => {
    if (node.yearLearned) {
      if (!skillsByYear[node.yearLearned]) {
        skillsByYear[node.yearLearned] = [];
      }
      skillsByYear[node.yearLearned].push(node);
    }
  });
  
  return Object.entries(skillsByYear)
    .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
    .map(([year, skills]) => ({
      year: parseInt(year),
      skills,
      milestone: getMilestoneForYear(parseInt(year)),
    }));
}

function getMilestoneForYear(year: number): string {
  const milestones: Record<number, string> = {
    2021: 'Started Programming Journey',
    2022: 'Learned Java & Data Structures',
    2023: 'React/ML Deep Dive',
    2024: 'Hackathon Victory & Advanced AI',
    2025: 'Full-Stack Mastery',
  };
  return milestones[year] || '';
}
