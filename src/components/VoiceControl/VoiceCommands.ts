export interface VoiceCommand {
  id: string;
  patterns: RegExp[];
  action: string; // Action identifier to be handled by parent
  response: string;
  category: 'navigation' | 'information' | 'interaction' | 'system';
  description: string;
  examples: string[];
}

export const voiceCommands: VoiceCommand[] = [
  // NAVIGATION COMMANDS
  {
    id: 'nav-projects',
    patterns: [
      /(?:go to|show me|navigate to|open) (?:the )?projects?/i,
      /(?:show|display) (?:my )?projects?/i,
    ],
    action: 'navigate:projects',
    response: 'Navigating to projects section',
    category: 'navigation',
    description: 'Navigate to projects section',
    examples: ['Go to projects', 'Show me projects', 'Open projects'],
  },
  {
    id: 'nav-about',
    patterns: [
      /(?:go to|show me|navigate to|open) (?:the )?about/i,
      /tell me about (?:yourself|arjun)/i,
    ],
    action: 'navigate:about',
    response: 'Opening about section',
    category: 'navigation',
    description: 'Navigate to about section',
    examples: ['Go to about', 'Tell me about yourself'],
  },
  {
    id: 'nav-skills',
    patterns: [/(?:go to|show me|navigate to|open) (?:the )?skills?/i],
    action: 'navigate:skills',
    response: 'Showing skills section',
    category: 'navigation',
    description: 'Navigate to skills section',
    examples: ['Go to skills', 'Show me skills'],
  },
  {
    id: 'nav-contact',
    patterns: [/(?:go to|show me|navigate to|open) (?:the )?contact/i],
    action: 'navigate:contact',
    response: 'Opening contact section',
    category: 'navigation',
    description: 'Navigate to contact section',
    examples: ['Go to contact', 'Open contact'],
  },
  {
    id: 'nav-gallery',
    patterns: [/(?:go to|show me|navigate to|open) (?:the )?(?:gallery|photos)/i],
    action: 'navigate:gallery',
    response: 'Opening photo gallery',
    category: 'navigation',
    description: 'Navigate to gallery section',
    examples: ['Go to gallery', 'Show me photos'],
  },
  {
    id: 'nav-achievements',
    patterns: [/(?:go to|show me|navigate to|open) (?:the )?(?:achievements?|awards?)/i],
    action: 'navigate:achievements',
    response: 'Showing achievements',
    category: 'navigation',
    description: 'Navigate to achievements section',
    examples: ['Go to achievements', 'Show me awards'],
  },
  {
    id: 'nav-experience',
    patterns: [/(?:go to|show me|navigate to|open) (?:the )?(?:experience|timeline)/i],
    action: 'navigate:experience',
    response: 'Opening experience timeline',
    category: 'navigation',
    description: 'Navigate to experience section',
    examples: ['Go to experience', 'Show me timeline'],
  },
  {
    id: 'nav-games',
    patterns: [/(?:go to|show me|navigate to|open) (?:the )?games?/i],
    action: 'navigate:games',
    response: 'Opening games section',
    category: 'navigation',
    description: 'Navigate to games section',
    examples: ['Go to games', 'Open games'],
  },
  {
    id: 'nav-home',
    patterns: [
      /(?:go )?home/i, 
      /go to (?:the )?top/i,
      /scroll to top/i,
    ],
    action: 'navigate:home',
    response: 'Going to home',
    category: 'navigation',
    description: 'Navigate to home/top',
    examples: ['Go home', 'Go to top', 'Scroll to top'],
  },

  // INFORMATION COMMANDS
  {
    id: 'info-skills',
    patterns: [
      /what skills? (?:do you|does arjun) have/i,
      /(?:tell me about|show me|list) (?:your|arjun'?s) skills?/i,
      /what (?:can you|do you) do/i,
    ],
    action: 'info:skills',
    response: "I specialize in Python, JavaScript, React, Next.js, Machine Learning, AI, and full-stack development. I've solved over 700 LeetCode problems and won a national hackathon.",
    category: 'information',
    description: 'Learn about skills and expertise',
    examples: ['What skills do you have?', 'What can you do?'],
  },
  {
    id: 'info-agentix',
    patterns: [
      /tell me about agentix/i,
      /what is agentix/i,
      /explain agentix/i,
    ],
    action: 'info:agentix',
    response: "AGENTIX is my National Hackathon winning project. It's an AI agent evaluation platform that helps users choose the right AI agent with real-time comparison metrics. I won the Pan IIT Alumni Imagine 2025 hackathon with this project.",
    category: 'information',
    description: 'Learn about AGENTIX project',
    examples: ['Tell me about AGENTIX', 'What is AGENTIX?'],
  },
  {
    id: 'info-projects',
    patterns: [
      /what (?:projects?|work) (?:have you|has arjun) (?:done|worked on|built)/i,
      /(?:show|tell me about) (?:your|arjun'?s) projects?/i,
    ],
    action: 'info:projects',
    response: "I've built several projects including AGENTIX, a national hackathon winning AI platform, NO CODE BACKEND, GLA Canteen App, JARVIS Arena, and more.",
    category: 'information',
    description: 'Learn about projects',
    examples: ['What projects have you built?', 'Tell me about your work'],
  },
  {
    id: 'info-achievements',
    patterns: [
      /what (?:are|about) (?:your|arjun'?s) achievements?/i,
      /(?:tell me about|show me) (?:your|arjun'?s) (?:achievements?|accomplishments?|awards?)/i,
    ],
    action: 'info:achievements',
    response: "I'm a National Hackathon winner, solved 700+ LeetCode problems, and hold Intel certifications in AI.",
    category: 'information',
    description: 'Learn about achievements',
    examples: ['What are your achievements?', 'Tell me about your awards'],
  },
  {
    id: 'info-experience',
    patterns: [
      /(?:what'?s|what is) (?:your|arjun'?s) (?:experience|background)/i,
      /tell me about (?:your|arjun'?s) (?:work )?experience/i,
    ],
    action: 'info:experience',
    response: "I've interned at IIIT Kottayam and AcmeGrade, working on machine learning and full-stack development projects.",
    category: 'information',
    description: 'Learn about work experience',
    examples: ['What is your experience?', 'Tell me about your background'],
  },
  {
    id: 'info-who',
    patterns: [
      /who (?:are you|is arjun)/i, 
      /introduce yourself/i,
    ],
    action: 'info:who',
    response: "I'm Arjun Singh Rajput, an AI innovator and full-stack developer, currently pursuing B.Tech at GLA University. I'm passionate about building intelligent solutions.",
    category: 'information',
    description: 'Introduction',
    examples: ['Who are you?', 'Introduce yourself'],
  },

  // INTERACTION COMMANDS
  {
    id: 'open-terminal',
    patterns: [
      /open (?:the )?terminal/i, 
      /show (?:me )?(?:the )?terminal/i,
    ],
    action: 'open:terminal',
    response: 'Opening terminal',
    category: 'interaction',
    description: 'Open the terminal',
    examples: ['Open terminal', 'Show me terminal'],
  },
  {
    id: 'open-chatbot',
    patterns: [
      /open (?:the )?(?:chatbot|chat)/i, 
      /(?:start|begin) (?:a )?chat/i, 
      /talk to (?:the )?(?:ai|bot)/i,
    ],
    action: 'open:chatbot',
    response: 'Opening AI chatbot',
    category: 'interaction',
    description: 'Open AI chatbot',
    examples: ['Open chatbot', 'Start a chat', 'Talk to AI'],
  },
  {
    id: 'play-games',
    patterns: [
      /(?:play|open) games?/i, 
      /open (?:the )?playground/i,
      /let'?s play/i,
    ],
    action: 'open:games',
    response: 'Opening games playground',
    category: 'interaction',
    description: 'Open games section',
    examples: ['Play games', 'Open playground', "Let's play"],
  },
  {
    id: 'download-resume',
    patterns: [
      /download (?:the |my )?resume/i, 
      /(?:get|show) (?:the |my )?resume/i,
      /(?:get|download) cv/i,
    ],
    action: 'download:resume',
    response: 'Downloading resume',
    category: 'interaction',
    description: 'Download resume/CV',
    examples: ['Download resume', 'Get CV'],
  },
  {
    id: 'send-message',
    patterns: [
      /(?:send|write) (?:a )?(?:message|email)/i, 
      /contact (?:arjun|you)/i,
    ],
    action: 'open:contact',
    response: 'Opening contact form',
    category: 'interaction',
    description: 'Open contact form',
    examples: ['Send a message', 'Contact you'],
  },

  // SYSTEM COMMANDS
  {
    id: 'toggle-theme',
    patterns: [
      /(?:toggle|switch|change) (?:the )?theme/i, 
      /(?:dark|light) mode/i,
      /change (?:to )?(?:dark|light)/i,
    ],
    action: 'system:toggle-theme',
    response: 'Toggling theme',
    category: 'system',
    description: 'Toggle dark/light theme',
    examples: ['Toggle theme', 'Dark mode', 'Light mode'],
  },
  {
    id: 'open-settings',
    patterns: [
      /open (?:the )?settings/i, 
      /show (?:the )?settings/i,
    ],
    action: 'system:settings',
    response: 'Opening settings',
    category: 'system',
    description: 'Open settings panel',
    examples: ['Open settings', 'Show settings'],
  },
  {
    id: 'show-help',
    patterns: [
      /(?:show|display) (?:voice )?(?:commands?|help)/i, 
      /what can (?:i say|you do)/i, 
      /^help$/i,
      /voice help/i,
    ],
    action: 'system:help',
    response: 'Showing available voice commands',
    category: 'system',
    description: 'Show voice commands help',
    examples: ['Show help', 'What can I say?', 'Voice help'],
  },
  {
    id: 'stop-listening',
    patterns: [
      /stop (?:listening|voice)/i, 
      /close (?:this|voice)/i, 
      /^cancel$/i,
      /^stop$/i,
    ],
    action: 'system:stop',
    response: 'Stopping voice control',
    category: 'system',
    description: 'Stop voice control',
    examples: ['Stop listening', 'Cancel', 'Close'],
  },
  {
    id: 'open-command-palette',
    patterns: [
      /open (?:the )?command palette/i,
      /show (?:the )?command palette/i,
    ],
    action: 'system:command-palette',
    response: 'Opening command palette',
    category: 'system',
    description: 'Open command palette',
    examples: ['Open command palette'],
  },
];

// Fuzzy matching utility for suggestions
export function findClosestCommand(input: string): VoiceCommand | null {
  const normalizedInput = input.toLowerCase().trim();
  
  // First try exact pattern matching
  for (const command of voiceCommands) {
    for (const pattern of command.patterns) {
      if (pattern.test(normalizedInput)) {
        return command;
      }
    }
  }
  
  // If no exact match, try fuzzy matching
  let bestMatch: VoiceCommand | null = null;
  let bestScore = 0;
  
  for (const command of voiceCommands) {
    // Check against examples and description
    const searchableText = [
      ...command.examples,
      command.description,
    ].join(' ').toLowerCase();
    
    const score = calculateSimilarity(normalizedInput, searchableText);
    if (score > bestScore && score > 0.3) {
      bestScore = score;
      bestMatch = command;
    }
  }
  
  return bestMatch;
}

// Simple Jaccard similarity for fuzzy matching
function calculateSimilarity(str1: string, str2: string): number {
  const words1 = new Set(str1.split(/\s+/));
  const words2 = new Set(str2.split(/\s+/));
  
  const intersection = new Set([...words1].filter(x => words2.has(x)));
  const union = new Set([...words1, ...words2]);
  
  return intersection.size / union.size;
}

// Get commands by category
export function getCommandsByCategory(category: VoiceCommand['category']): VoiceCommand[] {
  return voiceCommands.filter(cmd => cmd.category === category);
}

// Get all categories with their commands
export function getAllCommandCategories(): { category: VoiceCommand['category']; commands: VoiceCommand[] }[] {
  const categories: VoiceCommand['category'][] = ['navigation', 'information', 'interaction', 'system'];
  return categories.map(category => ({
    category,
    commands: getCommandsByCategory(category),
  }));
}

// Category display info
export const categoryInfo: Record<VoiceCommand['category'], { icon: string; label: string }> = {
  navigation: { icon: '📍', label: 'Navigation' },
  information: { icon: 'ℹ️', label: 'Information' },
  interaction: { icon: '🎮', label: 'Interactions' },
  system: { icon: '⚙️', label: 'System' },
};
