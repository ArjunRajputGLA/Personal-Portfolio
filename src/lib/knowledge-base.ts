// Comprehensive Knowledge Base for RAG-based Chatbot
// Each document has an ID, category, keywords, and content for semantic matching
// Enhanced with detailed, specific information for precise responses

export interface KnowledgeDocument {
  id: string;
  category: string;
  keywords: string[];
  content: string;
  metadata?: Record<string, unknown>;
}

export const knowledgeBase: KnowledgeDocument[] = [
  // Personal Information
  {
    id: 'personal-intro',
    category: 'personal',
    keywords: ['who', 'about', 'arjun', 'introduce', 'introduction', 'tell me about', 'yourself', 'bio', 'biography'],
    content: `Arjun Singh Rajput is a B.Tech Computer Science student at GLA University, Mathura (graduating April 2027). Key highlights:
    
**National Achievement:** Won Pan IIT Alumni Imagine 2025 hackathon with AGENTIX - a real-time AI agent comparison platform.

**Technical Expertise:**
- Primary Languages: Python, JavaScript, TypeScript, Java, SQL
- Frontend: React.js, Next.js, Tailwind CSS
- Backend: Node.js, MongoDB, Electron.js
- AI/ML: PyTorch, Scikit-Learn, NLP, Deep Learning

**Experience:**
- Project Intern at IIIT Kottayam (May-July 2025) - NLP-based malware detection
- Project Trainee at AcmeGrade (Jan-Mar 2024) - Data Science projects

**Coding Profile:** 700+ problems solved on LeetCode (username: CodeXI)

**Certifications:** Intel UNNATI Programme (2024 & 2025), NEC Corporation

**Contact:** imstorm23203@gmail.com | GitHub: ArjunRajputGLA | LinkedIn: imstorm23203attherategmail`
  },
  {
    id: 'personal-location',
    category: 'personal',
    keywords: ['where', 'location', 'based', 'live', 'city', 'country', 'from'],
    content: `Arjun is currently based in Mathura, India. He studies at GLA University in Mathura and works remotely on various projects and internships.`
  },
  {
    id: 'personal-current-status',
    category: 'personal',
    keywords: ['current', 'status', 'doing', 'now', 'currently', 'working on', 'studying'],
    content: `Arjun is currently a B.Tech student at GLA University (expected graduation April 2027). He recently completed a Project Internship at IIIT Kottayam where he worked on NLP-based malware detection. He's actively working on projects like NO CODE BACKEND and continues to participate in hackathons and coding competitions. He's also certified through the Intel UNNATI Programme (2024 & 2025).`
  },

  // Education
  {
    id: 'education-btech',
    category: 'education',
    keywords: ['education', 'study', 'university', 'college', 'degree', 'btech', 'bachelor', 'graduation', 'gla', 'academic'],
    content: `Arjun is pursuing his Bachelor of Technology (B.Tech) in Computer Science at GLA University, Mathura. He's expected to graduate in April 2027. During his time at GLA, he has actively participated in workshops on GenAI, Full Stack Development, NLP, and Data Science. He also performed as an Anchor during the Hons. Celebration Day at GLA University in 2024, showcasing his public speaking abilities.`
  },
  {
    id: 'education-school',
    category: 'education',
    keywords: ['school', 'intermediate', 'high school', '12th', '10th', 'secondary'],
    content: `Arjun completed his Intermediate education (12th) from Sanskar Public School, Mathura in April 2023. Before that, he completed his High School (10th) from Sacred Heart Convent Hr. Sec. School, Mathura in April 2021.`
  },

  // Experience - Detailed
  {
    id: 'experience-iiit',
    category: 'experience',
    keywords: ['experience', 'intern', 'internship', 'work', 'job', 'iiit', 'kottayam', 'malware', 'nlp'],
    content: `**Project Intern at IIIT Kottayam, Kerala (Remote)**
Duration: May 2025 – July 2025

**Key Responsibilities:**
- Developed a model for malware detection using NLP techniques and Deep Learning methods
- Applied natural language processing to analyze and classify malicious code patterns
- Built and trained neural network models for cybersecurity applications

**Technologies Used:**
- Python (primary language)
- PyTorch (deep learning framework)
- NLP libraries and techniques
- Deep Learning architectures

**Impact:** Applied cutting-edge AI/ML to real-world cybersecurity challenges, demonstrating ability to work on complex research problems.`
  },
  {
    id: 'experience-acmegrade',
    category: 'experience',
    keywords: ['experience', 'trainee', 'acmegrade', 'data science', 'bangalore'],
    content: `**Project Trainee at AcmeGrade, Bangalore (Remote)**
Duration: January 2024 – March 2024

**Key Responsibilities:**
- Completed comprehensive Data Science training through structured online lectures
- Applied Data Science concepts to real-time projects
- Earned Certificate of Recommendation for outstanding performance

**Technologies Used:**
- Python
- Machine Learning algorithms
- Data Science tools and libraries
- Statistical analysis and data visualization

**Recognition:** Received Certificate of Recommendation for quality work and dedication.`
  },

  // Projects - AGENTIX (Detailed)
  {
    id: 'project-agentix',
    category: 'projects',
    keywords: ['agentix', 'hackathon', 'winner', 'ai agent', 'comparison', 'pan iit', 'imagine'],
    content: `**AGENTIX - National Hackathon Winner Project**
🏆 Won Pan IIT Alumni Imagine 2025 (National Level Hackathon)

**What it does:**
A real-time AI agent comparison platform that helps users choose the right AI agent for their specific needs.

**Key Features:**
- Live performance metrics for AI agents
- Real-time comparison dashboard
- Data-driven recommendations
- User-friendly interface for AI selection

**Tagline:** "Choose the right AI agent for you"

**Tech Stack:**
- AI Agents integration
- Real-time Analytics
- Full-Stack Development (React.js, Node.js)
- Performance monitoring systems

**Live Demo:** https://agentix-ai.vercel.app/

**Why it won:** Innovative approach to solving the problem of AI agent selection, with practical real-world application and excellent execution under hackathon constraints.`
  },
  {
    id: 'project-nocode',
    category: 'projects',
    keywords: ['no code', 'backend', 'visual', 'drag drop', 'low code'],
    content: `**NO CODE BACKEND - AI-Powered Visual Backend Builder**
Status: Active Development

**What it does:**
An AI-assisted visual platform that empowers users to design, validate, and export production-ready backend systems through intuitive drag-and-drop workflows—without writing a single line of code.

**Key Features:**
- Visual drag-and-drop interface for backend design
- AI-assisted code generation
- Schema validation and optimization
- Export production-ready code
- No coding knowledge required

**Tech Stack:**
- AI/ML for intelligent suggestions
- Visual Programming concepts
- Backend architecture patterns
- Code generation algorithms

**Target Users:** Non-developers, startup founders, rapid prototypers, and anyone who wants to build backends quickly.

**Innovation:** Democratizes backend development by combining AI intelligence with visual programming.`
  },
  {
    id: 'project-canteen',
    category: 'projects',
    keywords: ['canteen', 'food', 'gla', 'order', 'university', 'application'],
    content: `**GLA Canteen Application - Full-Stack Food Ordering System**
Status: Active

**What it does:**
A comprehensive full-stack application for ordering, receiving, and managing food items in the GLA University canteen pantry.

**Key Features:**
- User authentication and profiles
- Menu browsing and food ordering
- Order tracking and management
- Payment integration
- Admin dashboard for canteen management

**Tech Stack:**
- Frontend: React.js (responsive UI, component-based architecture)
- Backend: Node.js (RESTful APIs, server logic)
- Database: MongoDB (flexible document storage)
- Additional: Authentication, State Management

**Real-world Impact:** Streamlines food ordering for university students, reducing wait times and improving canteen efficiency.`
  },
  {
    id: 'project-jarvis',
    category: 'projects',
    keywords: ['jarvis', 'arena', 'gaming', 'games', 'playground'],
    content: `**J.A.R.V.I.S Arena - Gaming Website & Playground**
Status: Active

**What it does:**
A robust gaming website and playground that provides an engaging gaming experience to users.

**Key Features:**
- Multiple interactive games
- User-friendly gaming interface
- Score tracking and leaderboards
- Responsive design for all devices

**Tech Stack:**
- JavaScript (game logic, interactivity)
- React.js (UI components, state management)
- CSS animations and effects
- Browser-based gaming technologies

**Inspiration:** Named after Iron Man's AI assistant, designed to provide an amazing gaming experience.`
  },
  {
    id: 'project-article-analyzer',
    category: 'projects',
    keywords: ['article', 'analyzer', 'intel', 'unnati', 'nlp', 'gemini'],
    content: `**Article Analyser - Intel UNNATI Programme 2024 Project**
🎓 Earned Intel UNNATI Certification

**What it does:**
An intelligent article analysis tool that uses NLP and the Gemini API to extract insights from articles.

**Key Features:**
- Article text analysis and summarization
- Key points extraction
- Sentiment analysis
- Topic classification
- AI-powered insights generation

**Tech Stack:**
- Python (core programming)
- NLP (Natural Language Processing)
- Gemini API (AI capabilities)
- Streamlit (web interface)

**Live Demo:** https://article-analyzer-via-gemini-weshallworkwithease.streamlit.app/

**Recognition:** Earned Intel UNNATI Programme 2024 Certification for this project.`
  },
  {
    id: 'project-smart-classroom',
    category: 'projects',
    keywords: ['smart', 'classroom', 'ai', 'education', 'intel', '2025'],
    content: `**Smart AI Classroom - Intel UNNATI Programme 2025 Project**
🎓 Earned Intel UNNATI Certification

**What it does:**
An AI-powered classroom management system that enhances the educational experience using artificial intelligence and computer vision.

**Key Features:**
- AI-powered attendance tracking
- Student engagement monitoring
- Smart resource management
- Computer vision integration
- Real-time analytics for educators

**Tech Stack:**
- AI/ML algorithms
- Computer Vision (image/video processing)
- Educational Technology integration
- Python and related libraries

**Application:** Modernizing classrooms with AI to improve teaching effectiveness and student outcomes.

**Recognition:** Earned Intel UNNATI Programme 2025 Certification for this project.`
  },
  {
    id: 'project-fluxor',
    category: 'projects',
    keywords: ['fluxor', 'file', 'manager', 'ai', 'electron', 'desktop'],
    content: `**FLUXOR - AI-Powered File Manager**
Status: Active

**What it does:**
A desktop application that helps users manage system files efficiently using AI-powered organization and search.

**Key Features:**
- AI-powered file organization suggestions
- Smart search functionality
- Automated file categorization
- Bulk operations with AI assistance
- Cross-platform desktop support

**Tech Stack:**
- Electron.js (cross-platform desktop framework)
- AI integration for smart features
- File System APIs
- Modern UI/UX design

**Innovation:** Brings AI intelligence to everyday file management tasks, making organization effortless.`
  },

  // Projects Summary
  {
    id: 'projects-summary',
    category: 'projects',
    keywords: ['all projects', 'project list', 'projects', 'portfolio', 'work', 'built', 'created', 'developed'],
    content: `**Arjun's Complete Project Portfolio (7+ Projects):**

**🏆 AWARD-WINNING:**
1. **AGENTIX** - Real-time AI agent comparison platform
   - Achievement: Won Pan IIT Alumni Imagine 2025 (National Level)
   - Tech: AI Agents, Real-time Analytics, React.js, Node.js
   - Live: https://agentix-ai.vercel.app/

**🔨 ACTIVELY DEVELOPING:**
2. **NO CODE BACKEND** - AI-assisted visual backend builder
   - Tech: AI/ML, Visual Programming, Code Generation
   - Purpose: Build production backends without coding

**🎓 INTEL CERTIFIED:**
3. **Article Analyser** (Intel UNNATI 2024)
   - Tech: Python, NLP, Gemini API, Streamlit
   - Live: https://article-analyzer-via-gemini-weshallworkwithease.streamlit.app/

4. **Smart AI Classroom** (Intel UNNATI 2025)
   - Tech: AI/ML, Computer Vision, Python

**💻 FULL-STACK:**
5. **GLA Canteen Application**
   - Tech: React.js, Node.js, MongoDB
   - Purpose: University food ordering system

6. **J.A.R.V.I.S Arena**
   - Tech: JavaScript, React.js
   - Purpose: Gaming platform

**🖥️ DESKTOP:**
7. **FLUXOR** - AI File Manager
   - Tech: Electron.js, AI
   - Purpose: Smart file organization`
  },

  // Skills - Detailed
  {
    id: 'skills-programming',
    category: 'skills',
    keywords: ['programming', 'language', 'code', 'coding', 'python', 'java', 'javascript', 'typescript'],
    content: `**Programming Languages:**

| Language | Proficiency | Primary Use |
|----------|-------------|-------------|
| Python | Advanced | AI/ML, Data Science, Backend |
| JavaScript | Advanced | Web Development, Full-Stack |
| TypeScript | Proficient | Type-safe web development |
| Java | Proficient | DSA, Backend systems |
| SQL | Proficient | Database queries |
| HTML/CSS | Advanced | Frontend styling |

**Evidence of Expertise:**
- 700+ problems solved on LeetCode (username: CodeXI)
- Built multiple production projects in Python and JavaScript
- Used Python extensively at IIIT Kottayam internship for ML models`
  },
  {
    id: 'skills-frontend',
    category: 'skills',
    keywords: ['frontend', 'front-end', 'ui', 'react', 'next', 'nextjs', 'tailwind', 'web'],
    content: `**Frontend Development Skills:**

| Technology | Experience Level | Projects |
|------------|------------------|----------|
| React.js | Advanced | AGENTIX, GLA Canteen App, J.A.R.V.I.S Arena |
| Next.js | Advanced | Personal Portfolio, AGENTIX |
| Tailwind CSS | Advanced | All web projects |

**Capabilities:**
- Component-based architecture
- State management (React hooks, Context API)
- Responsive design for all devices
- Server-side rendering (Next.js)
- Performance optimization
- Modern CSS frameworks

**Portfolio Note:** This portfolio website is built with Next.js and Tailwind CSS, showcasing these skills.`
  },
  {
    id: 'skills-backend',
    category: 'skills',
    keywords: ['backend', 'back-end', 'server', 'node', 'nodejs', 'mongodb', 'database', 'api'],
    content: `**Backend Development Skills:**

| Technology | Experience Level | Use Cases |
|------------|------------------|-----------|
| Node.js | Advanced | REST APIs, server logic |
| MongoDB | Proficient | NoSQL database design |
| SQL | Proficient | Relational databases |
| Electron.js | Proficient | Desktop applications |
| REST APIs | Advanced | Service integration |

**Backend Projects:**
- GLA Canteen App: Full REST API with Node.js + MongoDB
- NO CODE BACKEND: Visual backend builder (in development)
- FLUXOR: Desktop app with Electron.js

**Architecture Knowledge:**
- RESTful API design
- Database schema design
- Authentication & authorization
- Server deployment`
  },
  {
    id: 'skills-aiml',
    category: 'skills',
    keywords: ['ai', 'ml', 'machine learning', 'artificial intelligence', 'deep learning', 'pytorch', 'nlp', 'neural'],
    content: `**AI/ML Skills:**

| Technology | Proficiency | Applications |
|------------|-------------|--------------|
| PyTorch | Advanced | Deep Learning models |
| Scikit-Learn | Advanced | Classical ML algorithms |
| NLP | Advanced | Text processing, malware detection |
| Deep Learning | Advanced | Neural networks |
| Computer Vision | Intermediate | Smart AI Classroom |
| Seaborn | Proficient | Data visualization |

**AI/ML Projects:**
1. **IIIT Kottayam Internship** - Malware detection using NLP + Deep Learning
2. **AGENTIX** - AI agent comparison platform (Hackathon Winner)
3. **Article Analyser** - NLP-based article analysis (Intel certified)
4. **Smart AI Classroom** - Computer Vision for education (Intel certified)
5. **NO CODE BACKEND** - AI-assisted code generation

**Specialization:** NLP applications and building AI-powered products.`
  },

  // Skills Summary
  {
    id: 'skills-summary',
    category: 'skills',
    keywords: ['all skills', 'skill list', 'skills', 'technologies', 'tech stack', 'technical', 'expertise'],
    content: `**Arjun's Complete Technical Skillset:**

**💻 PROGRAMMING LANGUAGES:**
| Language | Level | Primary Use |
|----------|-------|-------------|
| Python | Advanced | AI/ML, Backend |
| JavaScript | Advanced | Full-Stack Web |
| TypeScript | Proficient | Type-safe Development |
| Java | Proficient | DSA, Systems |
| SQL | Proficient | Databases |
| HTML/CSS | Advanced | Frontend |

**🎨 FRONTEND:**
• React.js (Advanced) - Used in AGENTIX, GLA Canteen, J.A.R.V.I.S
• Next.js (Advanced) - Portfolio, production apps
• Tailwind CSS (Advanced) - Styling

**🔧 BACKEND:**
• Node.js (Advanced) - REST APIs
• MongoDB (Proficient) - NoSQL
• Electron.js (Proficient) - Desktop apps
• REST APIs (Advanced) - Service design

**🤖 AI/ML:**
• PyTorch (Advanced) - Deep Learning
• Scikit-Learn (Advanced) - Classical ML
• NLP (Advanced) - Text processing
• Deep Learning (Advanced) - Neural networks
• Computer Vision (Intermediate) - Image processing

**🛠️ TOOLS:**
• Git, VS Code, GitHub, Streamlit

**📊 PROOF:**
• 700+ LeetCode problems (CodeXI)
• 7+ production projects
• Intel certified AI projects`
  },

  {
    id: 'skills-tools',
    category: 'skills',
    keywords: ['tools', 'git', 'vscode', 'vs code', 'rest', 'api'],
    content: `**Development Tools & Practices:**

| Tool | Usage |
|------|-------|
| Git | Version control for all projects |
| VS Code | Primary IDE |
| REST APIs | API design and integration |
| GitHub | Code hosting and collaboration |
| Streamlit | Quick ML app deployment |

**Profiles:**
- GitHub: github.com/ArjunRajputGLA
- LeetCode: leetcode.com/u/CodeXI (700+ problems)`
  },
  {
    id: 'skills-soft',
    category: 'skills',
    keywords: ['soft skills', 'communication', 'teamwork', 'problem solving', 'analytical', 'professional'],
    content: `**Professional Skills:**

| Skill | Evidence |
|-------|----------|
| **Communication** | Anchor at GLA University Hons. Celebration Day 2024 |
| **Team Collaboration** | Won national hackathon (requires strong teamwork) |
| **Analytical Thinking** | 700+ LeetCode problems solved |
| **Problem-Solving** | Multiple hackathon participations |
| **Quick Learning** | Mastered multiple tech stacks |
| **Adaptability** | Works across AI/ML, Full-Stack, Desktop apps |

**Leadership:** Successfully led and contributed to winning hackathon team at Pan IIT Alumni Imagine 2025.`
  },

  // Achievements - Detailed
  {
    id: 'achievement-hackathon',
    category: 'achievements',
    keywords: ['hackathon', 'winner', 'pan iit', 'imagine', 'national', 'award', 'first', 'won'],
    content: `**🏆 National Hackathon Winner - Pan IIT Alumni Imagine 2025**

**Event Details:**
- Competition: Pan IIT Alumni Imagine 2025
- Level: National (All-India)
- Organizer: IIT Alumni network
- Result: 1st Place / Winner

**Winning Project: AGENTIX**
- A real-time AI agent comparison platform
- Helps users choose the right AI agent with live performance metrics
- Live at: https://agentix-ai.vercel.app/

**Significance:**
- Competed against talented teams from across India
- Demonstrated ability to ideate, build, and present under pressure
- Proved innovation and technical execution skills`
  },
  {
    id: 'achievement-leetcode',
    category: 'achievements',
    keywords: ['leetcode', 'coding', 'problems', '700', 'competitive', 'dsa', 'algorithm'],
    content: `**💻 LeetCode Achievement: 700+ Problems Solved**

**Profile:** leetcode.com/u/CodeXI

**Statistics:**
- Total Problems: 700+ solved
- Languages Used: Python, Java, JavaScript
- Categories: Arrays, Strings, Trees, Graphs, DP, and more

**What This Demonstrates:**
- Strong Data Structures & Algorithms knowledge
- Consistent practice and dedication
- Problem-solving abilities under constraints
- Analytical thinking and optimization skills

**Relevance:** Essential skill for technical interviews and writing efficient code.`
  },
  {
    id: 'achievement-intel',
    category: 'achievements',
    keywords: ['intel', 'unnati', 'certification', 'certified', '2024', '2025'],
    content: `**🎓 Intel UNNATI Programme Certifications**

Arjun holds TWO Intel UNNATI certifications:

**1. Intel UNNATI Programme 2024**
- Project: Article Analyser
- Technology: NLP, Gemini API, Python
- Live Demo: article-analyzer-via-gemini-weshallworkwithease.streamlit.app

**2. Intel UNNATI Programme 2025**
- Project: Smart AI Classroom
- Technology: AI/ML, Computer Vision, Educational Technology

**About Intel UNNATI:**
A prestigious program by Intel recognizing technical excellence in AI and emerging technologies. Selected participants work on industry-relevant projects and earn Intel certification.`
  },
  {
    id: 'achievement-nec',
    category: 'achievements',
    keywords: ['nec', 'corporation', 'certification'],
    content: `**🏅 NEC Corporation Certification**

Arjun holds a certification from NEC Corporation, a global leader in IT and network technologies.

**About NEC:** A multinational IT and electronics company providing solutions for businesses and society.

**Significance:** Adds professional credibility and demonstrates industry-recognized knowledge.`
  },
  {
    id: 'achievement-speaking',
    category: 'achievements',
    keywords: ['anchor', 'speaking', 'public', 'presentation', 'hons', 'celebration'],
    content: `**🎤 Public Speaking - Anchor at GLA University**

**Event:** Hons. Celebration Day 2024
**Role:** Main Anchor/Host
**Institution:** GLA University, Mathura

**Demonstrates:**
- Excellent communication skills
- Confidence in front of large audiences
- Ability to engage and lead
- Professional presentation abilities

**Context:** Complements technical skills with strong soft skills, making Arjun effective in both individual and team settings.`
  },

  // Achievements Summary
  {
    id: 'achievements-summary',
    category: 'achievements',
    keywords: ['all achievements', 'achievement list', 'achievements', 'accomplishments', 'awards', 'recognition'],
    content: `**Arjun's Complete Achievements:**

**🏆 COMPETITIONS:**
1. **National Hackathon Winner**
   - Event: Pan IIT Alumni Imagine 2025
   - Project: AGENTIX (AI agent comparison)
   - Level: All-India

**💻 CODING:**
2. **LeetCode Master**
   - Problems Solved: 700+
   - Profile: CodeXI
   - Skills: DSA, Algorithms

**🎓 CERTIFICATIONS:**
3. **Intel UNNATI 2024**
   - Project: Article Analyser
   
4. **Intel UNNATI 2025**
   - Project: Smart AI Classroom

5. **NEC Corporation Certification**

**🎤 LEADERSHIP:**
6. **Public Speaking**
   - Role: Anchor at GLA Hons. Day 2024
   - Demonstrates: Communication & leadership

**🔬 RESEARCH:**
7. **IIIT Kottayam Internship**
   - Focus: NLP-based malware detection
   - Applied AI to cybersecurity`
  },

  // Activities
  {
    id: 'activities-workshops',
    category: 'activities',
    keywords: ['workshop', 'learning', 'genai', 'full stack', 'attended'],
    content: `Arjun has attended multiple workshops related to GenAI, Full Stack Development, NLP, and Data Science using Python and Java. He believes in continuous learning and staying updated with the latest technologies.`
  },
  {
    id: 'activities-competitions',
    category: 'activities',
    keywords: ['hackathon', 'codathon', 'competition', 'participate', 'meta', 'llama'],
    content: `Arjun actively participates in hackathons and codathons. Notable participations include the AI Hackathon with Meta LLAMA 2024 and the Pan IIT Alumni Imagine 2025 (which he won). He enjoys the challenge of building innovative solutions under time constraints.`
  },

  // Contact
  {
    id: 'contact-email',
    category: 'contact',
    keywords: ['email', 'mail', 'contact', 'reach', 'message'],
    content: `You can reach Arjun via email at imstorm23203@gmail.com. He's open to discussions about collaborations, job opportunities, project ideas, or just to connect!`
  },
  {
    id: 'contact-linkedin',
    category: 'contact',
    keywords: ['linkedin', 'professional', 'network', 'connect'],
    content: `Connect with Arjun on LinkedIn: https://www.linkedin.com/in/imstorm23203attherategmail/ - He regularly shares updates about his projects and professional journey.`
  },
  {
    id: 'contact-github',
    category: 'contact',
    keywords: ['github', 'code', 'repository', 'repo', 'open source'],
    content: `Check out Arjun's GitHub profile at https://github.com/ArjunRajputGLA to see his projects and contributions. He maintains several active repositories showcasing his work in AI/ML and Full-Stack development.`
  },
  {
    id: 'contact-leetcode',
    category: 'contact',
    keywords: ['leetcode', 'profile', 'coding'],
    content: `Visit Arjun's LeetCode profile at https://leetcode.com/u/CodeXI/ to see his problem-solving journey with 700+ solved problems.`
  },

  // Availability & Interests
  {
    id: 'availability-hiring',
    category: 'availability',
    keywords: ['hire', 'job', 'opportunity', 'available', 'work', 'position', 'career', 'employ'],
    content: `Arjun is a B.Tech student expected to graduate in April 2027. He's open to internship opportunities, freelance projects, and collaborations. He's particularly interested in roles involving AI/ML, Full-Stack Development, or innovative product development. Feel free to reach out at imstorm23203@gmail.com to discuss opportunities!`
  },
  {
    id: 'interests-passion',
    category: 'interests',
    keywords: ['interest', 'passion', 'like', 'enjoy', 'hobby', 'love'],
    content: `Arjun is passionate about AI/ML and building products that solve real problems. He enjoys competitive programming, participating in hackathons, and exploring new technologies. He's also interested in the intersection of AI and various domains like education (Smart AI Classroom), cybersecurity (malware detection), and developer tools (NO CODE BACKEND).`
  }
];

// Function to calculate similarity score between query and document
export function calculateRelevanceScore(query: string, doc: KnowledgeDocument): number {
  const queryLower = query.toLowerCase();
  const queryWords = queryLower.split(/\s+/).filter(w => w.length > 2);
  
  let score = 0;
  
  // Check keyword matches (highest weight)
  for (const keyword of doc.keywords) {
    if (queryLower.includes(keyword.toLowerCase())) {
      score += 10;
    }
    // Partial keyword match
    for (const word of queryWords) {
      if (keyword.toLowerCase().includes(word) || word.includes(keyword.toLowerCase())) {
        score += 3;
      }
    }
  }
  
  // Check content matches
  const contentLower = doc.content.toLowerCase();
  for (const word of queryWords) {
    if (contentLower.includes(word)) {
      score += 1;
    }
  }
  
  // Category bonus for specific question types
  if (queryLower.match(/who|about|introduce|tell me/) && doc.category === 'personal') {
    score += 5;
  }
  if (queryLower.match(/project|built|created|made/) && doc.category === 'projects') {
    score += 5;
  }
  if (queryLower.match(/skill|technology|tech|know|proficient/) && doc.category === 'skills') {
    score += 5;
  }
  if (queryLower.match(/education|study|university|college|school/) && doc.category === 'education') {
    score += 5;
  }
  if (queryLower.match(/experience|work|intern|job/) && doc.category === 'experience') {
    score += 5;
  }
  if (queryLower.match(/achieve|award|win|certif|accomplish/) && doc.category === 'achievements') {
    score += 5;
  }
  if (queryLower.match(/contact|email|reach|connect|linkedin|github/) && doc.category === 'contact') {
    score += 5;
  }
  if (queryLower.match(/hire|job|opportunity|available|position/) && doc.category === 'availability') {
    score += 5;
  }
  
  return score;
}

// Retrieve most relevant documents for a query
export function retrieveRelevantContext(query: string, topK: number = 5): KnowledgeDocument[] {
  const scoredDocs = knowledgeBase.map(doc => ({
    doc,
    score: calculateRelevanceScore(query, doc)
  }));
  
  // Sort by score descending
  scoredDocs.sort((a, b) => b.score - a.score);
  
  // Return top K documents with score > 0
  return scoredDocs
    .filter(item => item.score > 0)
    .slice(0, topK)
    .map(item => item.doc);
}

// Build context string from retrieved documents
export function buildContextFromDocs(docs: KnowledgeDocument[]): string {
  if (docs.length === 0) {
    return "No specific information found. Please provide a general helpful response.";
  }
  
  const contextParts = docs.map(doc => `[${doc.category.toUpperCase()}]\n${doc.content}`);
  return contextParts.join('\n\n---\n\n');
}
