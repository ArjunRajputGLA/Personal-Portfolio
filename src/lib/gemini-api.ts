import { retrieveRelevantContext, KnowledgeDocument } from './knowledge-base';

export interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: Date;
}

// Generate response based on retrieved knowledge base documents
function generateResponseFromDocs(query: string, docs: KnowledgeDocument[]): string {
  const lowerQuery = query.toLowerCase();
  
  // If we have relevant documents, use them to craft a response
  if (docs.length > 0) {
    const primaryDoc = docs[0];
    const category = primaryDoc.category;
    
    // Craft humanized responses based on category and content
    switch (category) {
      case 'personal':
        if (lowerQuery.match(/who|about|introduce|tell me/)) {
          return `**Arjun Singh Rajput** - B.Tech CS Student & National Hackathon Winner 🏆

**Quick Facts:**
• 📍 Based in Mathura, India
• 🎓 GLA University (Graduating April 2027)
• 💻 700+ LeetCode problems solved
• 🏆 Won Pan IIT Alumni Imagine 2025 with AGENTIX

**Technical Stack:**
• **Languages:** Python, JavaScript, TypeScript, Java, SQL
• **Frontend:** React.js, Next.js, Tailwind CSS
• **Backend:** Node.js, MongoDB, Electron.js
• **AI/ML:** PyTorch, Scikit-Learn, NLP, Deep Learning

**Experience:**
• Project Intern @ IIIT Kottayam (NLP-based malware detection)
• Project Trainee @ AcmeGrade (Data Science)

**Certifications:** Intel UNNATI (2024 & 2025), NEC Corporation

What specific aspect would you like to know more about?`;
        }
        if (lowerQuery.match(/where|location|based|live|from/)) {
          return `📍 **Location:** Mathura, India

Arjun is currently:
• Studying at GLA University, Mathura
• Working remotely on projects and internships
• Open to remote opportunities worldwide

**Get in Touch:**
• 📧 Email: imstorm23203@gmail.com
• 💼 LinkedIn: linkedin.com/in/imstorm23203attherategmail
• 💻 GitHub: github.com/ArjunRajputGLA`;
        }
        if (lowerQuery.match(/current|doing|now|status/)) {
          return `**Current Status:**

🎓 **Education:** B.Tech at GLA University (Expected: April 2027)

👨‍💻 **Recent Work:**
• Just completed IIIT Kottayam internship (May-July 2025)
  - Built NLP-based malware detection models using PyTorch
• Actively developing NO CODE BACKEND
  - AI-assisted visual backend builder

🏆 **Recent Achievement:**
• Won Pan IIT Alumni Imagine 2025 with AGENTIX

📜 **Certifications:**
• Intel UNNATI 2024 (Article Analyser)
• Intel UNNATI 2025 (Smart AI Classroom)

Want details on any specific project or activity?`;
        }
        break;
        
      case 'education':
        return `**🎓 Education Journey:**

**Current:**
• **B.Tech in Computer Science**
  - Institution: GLA University, Mathura
  - Expected Graduation: April 2027
  - Activities: GenAI, Full-Stack, NLP, Data Science workshops
  - Achievement: Anchor at Hons. Celebration Day 2024

**Previous:**
• **Intermediate (12th)** - April 2023
  - Sanskar Public School, Mathura

• **High School (10th)** - April 2021
  - Sacred Heart Convent Hr. Sec. School, Mathura

**Academic Highlights:**
• Active participation in technical workshops
• Multiple Intel certifications during studies
• National hackathon winner while studying`;
        
      case 'experience':
        if (lowerQuery.match(/iiit|kottayam|malware|nlp/)) {
          return `**Project Intern @ IIIT Kottayam, Kerala** (Remote)
📅 May 2025 – July 2025

**Project:** NLP-Based Malware Detection

**Responsibilities:**
• Developed machine learning models for malware detection
• Applied NLP techniques to analyze malicious code patterns
• Built deep learning architectures for classification

**Tech Stack:**
• Python (primary language)
• PyTorch (deep learning framework)
• NLP libraries
• Deep Learning techniques

**Impact:** Applied cutting-edge AI/ML to real cybersecurity problems, demonstrating research and practical skills.

Want to know about his other experience or projects?`;
        }
        if (lowerQuery.match(/acmegrade|trainee|data science/)) {
          return `**Project Trainee @ AcmeGrade, Bangalore** (Remote)
📅 January 2024 – March 2024

**Focus:** Data Science & Machine Learning

**Responsibilities:**
• Completed comprehensive Data Science training
• Applied concepts to real-time projects
• Earned Certificate of Recommendation

**Tech Stack:**
• Python
• Machine Learning algorithms
• Data Science tools
• Statistical analysis

**Recognition:** Received Certificate of Recommendation for outstanding work!

Want to know about his more recent IIIT Kottayam internship?`;
        }
        return `**💼 Work Experience:**

**1. Project Intern @ IIIT Kottayam** (May-July 2025)
• Built NLP-based malware detection system
• Used Python, PyTorch, Deep Learning
• Applied AI to cybersecurity challenges

**2. Project Trainee @ AcmeGrade** (Jan-Mar 2024)
• Data Science training and real projects
• Python, Machine Learning
• Earned Certificate of Recommendation

**Total Experience:** ~5 months across AI/ML and Data Science

**Note:** Also a National Hackathon Winner with production-level project experience!

Which role would you like more details on?`;
        
      case 'projects':
        if (lowerQuery.match(/agentix/)) {
          return `**🏆 AGENTIX - National Hackathon Winner**

**Achievement:** Won Pan IIT Alumni Imagine 2025

**What it does:**
A real-time AI agent comparison platform that helps users choose the right AI agent for their needs.

**Key Features:**
✅ Live performance metrics for AI agents
✅ Real-time comparison dashboard
✅ Data-driven recommendations
✅ User-friendly interface

**Tech Stack:**
• AI Agents integration
• Real-time Analytics
• Full-Stack (React.js, Node.js)
• Performance monitoring

**Tagline:** "Choose the right AI agent for you"

🔗 **Try it:** https://agentix-ai.vercel.app/

Want to know about his other projects?`;
        }
        if (lowerQuery.match(/no code|backend|visual|drag/)) {
          return `**NO CODE BACKEND - AI Visual Backend Builder**
Status: 🟢 Active Development

**What it does:**
Design, validate, and export production-ready backend systems through drag-and-drop—no coding needed!

**Key Features:**
✅ Visual drag-and-drop interface
✅ AI-assisted code generation
✅ Schema validation & optimization
✅ Export production-ready code
✅ Zero coding required

**Tech Stack:**
• AI/ML for intelligent suggestions
• Visual Programming concepts
• Backend architecture patterns
• Code generation algorithms

**Target Users:** Non-developers, startup founders, rapid prototypers

**Innovation:** Democratizes backend development with AI + visual programming!`;
        }
        if (lowerQuery.match(/canteen|food|gla/)) {
          return `**GLA Canteen Application - Full-Stack Food System**

**What it does:**
Order, receive, and manage food at GLA University canteen.

**Key Features:**
✅ User authentication & profiles
✅ Menu browsing & ordering
✅ Order tracking
✅ Admin dashboard

**Tech Stack:**
• **Frontend:** React.js
• **Backend:** Node.js (REST APIs)
• **Database:** MongoDB

**Real Impact:** Streamlines food ordering for university students!`;
        }
        if (lowerQuery.match(/jarvis|arena|gaming|game/)) {
          return `**J.A.R.V.I.S Arena - Gaming Platform** 🎮

**What it does:**
A robust gaming website and playground providing an engaging gaming experience.

**Features:**
✅ Multiple interactive games
✅ Score tracking & leaderboards
✅ Responsive design

**Tech Stack:**
• JavaScript (game logic)
• React.js (UI components)
• CSS animations

Named after Iron Man's AI assistant! 🤖`;
        }
        if (lowerQuery.match(/article|analyzer|intel|unnati/)) {
          return `**Article Analyser - Intel UNNATI 2024** 🎓

**Certification:** Intel UNNATI Programme 2024

**What it does:**
Intelligent article analysis using NLP and Gemini API.

**Features:**
✅ Article summarization
✅ Key points extraction
✅ Sentiment analysis
✅ Topic classification

**Tech Stack:**
• Python
• NLP techniques
• Gemini API
• Streamlit (web interface)

🔗 **Try it:** https://article-analyzer-via-gemini-weshallworkwithease.streamlit.app/`;
        }
        if (lowerQuery.match(/smart.*classroom|classroom/)) {
          return `**Smart AI Classroom - Intel UNNATI 2025** 🎓

**Certification:** Intel UNNATI Programme 2025

**What it does:**
AI-powered classroom management with computer vision.

**Features:**
✅ AI-powered attendance tracking
✅ Student engagement monitoring
✅ Smart resource management
✅ Real-time analytics

**Tech Stack:**
• AI/ML algorithms
• Computer Vision
• Python

**Application:** Modernizing education with AI!`;
        }
        if (lowerQuery.match(/fluxor|file|manager/)) {
          return `**FLUXOR - AI File Manager** 📁

**What it does:**
Manage system files efficiently with AI assistance.

**Features:**
✅ AI-powered organization
✅ Smart search
✅ Automated categorization
✅ Cross-platform support

**Tech Stack:**
• Electron.js
• AI integration
• File System APIs

Brings AI to everyday file management!`;
        }
        return `**Arjun's Project Portfolio:**

**🏆 Award-Winning:**
• **AGENTIX** - Won Pan IIT Alumni Imagine 2025
  AI agent comparison platform
  🔗 agentix-ai.vercel.app

**🔨 Currently Building:**
• **NO CODE BACKEND** - Visual backend builder with AI

**🎓 Intel Certified:**
• **Article Analyser** (2024) - NLP article analysis
• **Smart AI Classroom** (2025) - AI + Computer Vision

**Full-Stack:**
• **GLA Canteen App** - React + Node + MongoDB
• **J.A.R.V.I.S Arena** - Gaming platform

**Desktop:**
• **FLUXOR** - AI-powered file manager (Electron.js)

Which project interests you? I can share more details!`;
        
      case 'skills':
        if (lowerQuery.match(/python|java|programming|language|code/)) {
          return `**💻 Programming Languages:**

| Language | Level | Use Case |
|----------|-------|----------|
| **Python** | Advanced | AI/ML, Data Science, Backend |
| **JavaScript** | Advanced | Web Development, Full-Stack |
| **TypeScript** | Proficient | Type-safe web apps |
| **Java** | Proficient | DSA, Backend systems |
| **SQL** | Proficient | Database queries |
| **HTML/CSS** | Advanced | Frontend styling |

**Proof of Expertise:**
• 700+ LeetCode problems solved (CodeXI)
• Production projects in Python & JavaScript
• PyTorch models at IIIT Kottayam internship

Want to know about specific frameworks?`;
        }
        if (lowerQuery.match(/frontend|front|react|next|ui|web/)) {
          return `**🎨 Frontend Skills:**

| Technology | Level | Projects |
|------------|-------|----------|
| **React.js** | Advanced | AGENTIX, GLA Canteen, J.A.R.V.I.S |
| **Next.js** | Advanced | Portfolio, AGENTIX |
| **Tailwind CSS** | Advanced | All web projects |

**Capabilities:**
✅ Component-based architecture
✅ State management (Hooks, Context)
✅ Responsive design
✅ Server-side rendering
✅ Performance optimization

**Note:** This portfolio is built with Next.js + Tailwind!`;
        }
        if (lowerQuery.match(/backend|back|node|mongo|server|api/)) {
          return `**🔧 Backend Skills:**

| Technology | Level | Use Case |
|------------|-------|----------|
| **Node.js** | Advanced | REST APIs, servers |
| **MongoDB** | Proficient | NoSQL databases |
| **SQL** | Proficient | Relational DBs |
| **Electron.js** | Proficient | Desktop apps |
| **REST APIs** | Advanced | Service integration |

**Backend Projects:**
• GLA Canteen: Full REST API (Node + MongoDB)
• NO CODE BACKEND: Visual backend builder
• FLUXOR: Desktop app (Electron.js)`;
        }
        if (lowerQuery.match(/ai|ml|machine|learning|deep|pytorch|nlp/)) {
          return `**🤖 AI/ML Skills:**

| Technology | Level | Experience |
|------------|-------|------------|
| **PyTorch** | Advanced | Deep Learning models |
| **Scikit-Learn** | Advanced | Classical ML |
| **NLP** | Advanced | Text processing |
| **Deep Learning** | Advanced | Neural networks |
| **Computer Vision** | Intermediate | Smart Classroom |

**AI/ML Projects:**
1. 🔬 IIIT Kottayam - Malware detection (NLP + DL)
2. 🏆 AGENTIX - AI agent platform (Hackathon Winner)
3. 📰 Article Analyser - NLP analysis (Intel certified)
4. 🎓 Smart AI Classroom - CV (Intel certified)
5. 🛠️ NO CODE BACKEND - AI code generation

**Specialization:** NLP and AI-powered products`;
        }
        if (lowerQuery.match(/soft|professional|communication|team/)) {
          return `**🌟 Professional Skills:**

| Skill | Evidence |
|-------|----------|
| **Communication** | Anchor at GLA Hons. Day 2024 |
| **Team Collaboration** | National hackathon winner |
| **Analytical Thinking** | 700+ LeetCode problems |
| **Problem-Solving** | Multiple hackathons |
| **Quick Learning** | Diverse tech stack |
| **Adaptability** | AI/ML, Full-Stack, Desktop |

**Leadership:** Led winning team at Pan IIT Alumni Imagine 2025!`;
        }
        return `**Arjun's Complete Tech Stack:**

**Languages:**
Python, JavaScript, TypeScript, Java, SQL, HTML/CSS

**Frontend:**
React.js, Next.js, Tailwind CSS

**Backend:**
Node.js, MongoDB, Electron.js, REST APIs

**AI/ML:**
PyTorch, Scikit-Learn, NLP, Deep Learning, Computer Vision

**Tools:**
Git, VS Code, GitHub

**DSA:** 700+ LeetCode problems (CodeXI)

**Certifications:** Intel UNNATI (2024 & 2025), NEC

Which area would you like details on?`;
        
      case 'achievements':
        if (lowerQuery.match(/hackathon|winner|pan iit|imagine|national/)) {
          return `**🏆 National Hackathon Winner**

**Event:** Pan IIT Alumni Imagine 2025
**Level:** National (All-India)
**Organizer:** IIT Alumni Network
**Result:** 🥇 1st Place / Winner

**Winning Project: AGENTIX**
• Real-time AI agent comparison platform
• Live performance metrics
• Helps choose the right AI agent
• 🔗 https://agentix-ai.vercel.app/

**What This Proves:**
✅ Can ideate innovative solutions
✅ Build under pressure (hackathon constraints)
✅ Present and pitch effectively
✅ Compete at national level`;
        }
        if (lowerQuery.match(/leetcode|coding|problems|dsa|algorithm/)) {
          return `**💻 LeetCode Achievement**

**Profile:** leetcode.com/u/CodeXI
**Problems Solved:** 700+
**Languages:** Python, Java, JavaScript

**Categories Covered:**
• Arrays & Strings
• Trees & Graphs
• Dynamic Programming
• And many more...

**What This Demonstrates:**
✅ Strong DSA knowledge
✅ Consistent practice
✅ Analytical thinking
✅ Interview readiness`;
        }
        if (lowerQuery.match(/intel|unnati|certification|certified/)) {
          return `**🎓 Intel UNNATI Certifications**

**1. Intel UNNATI 2024**
• Project: Article Analyser
• Tech: NLP, Gemini API, Python
• 🔗 article-analyzer-via-gemini-weshallworkwithease.streamlit.app

**2. Intel UNNATI 2025**
• Project: Smart AI Classroom
• Tech: AI/ML, Computer Vision

**About Intel UNNATI:**
Prestigious program by Intel recognizing technical excellence in AI and emerging technologies.

Two certifications = Consistently recognized for AI innovation!`;
        }
        return `**🏆 Arjun's Key Achievements:**

**1. National Hackathon Winner**
• Pan IIT Alumni Imagine 2025
• Project: AGENTIX (AI agent comparison)
• Competed against teams nationwide

**2. LeetCode Master**
• 700+ problems solved
• Profile: CodeXI
• Strong DSA skills

**3. Intel Certified (x2)**
• UNNATI 2024: Article Analyser
• UNNATI 2025: Smart AI Classroom

**4. NEC Corporation Certified**

**5. Public Speaking**
• Anchor at GLA University Hons. Day 2024

Which achievement interests you most?`;
        
      case 'contact':
        return `**📬 Contact Arjun:**

**Email:** imstorm23203@gmail.com
(Best way to reach - responsive!)

**Professional Profiles:**
• 💼 LinkedIn: linkedin.com/in/imstorm23203attherategmail
• 💻 GitHub: github.com/ArjunRajputGLA
• 🧩 LeetCode: leetcode.com/u/CodeXI

**Location:** Mathura, India

**Open to:**
✅ Internship opportunities
✅ Freelance projects
✅ Collaborations
✅ Job discussions

Don't hesitate to reach out!`;
        
      case 'availability':
        return `**💼 Availability:**

**Status:** B.Tech Student (Graduating April 2027)

**Open to:**
✅ Internship opportunities
✅ Freelance projects
✅ Collaborations
✅ AI/ML or Full-Stack roles

**Interests:**
• Innovative product development
• AI applications
• Building solutions that solve real problems

**Contact:**
📧 imstorm23203@gmail.com
💼 linkedin.com/in/imstorm23203attherategmail

Ready to discuss opportunities!`;
        
      case 'activities':
        if (lowerQuery.match(/workshop|learning|attend/)) {
          return `**📚 Workshops & Learning:**

**Attended Workshops on:**
• GenAI (Generative AI)
• Full Stack Development
• NLP (Natural Language Processing)
• Data Science (Python & Java)

**Continuous Learning:**
• Stays updated with latest tech
• Applies learnings to projects
• Diverse skill development`;
        }
        return `**🚀 Activities & Participation:**

**Hackathons:**
• 🏆 Won Pan IIT Alumni Imagine 2025
• Participated in AI Hackathon with Meta LLAMA 2024
• Regular hackathon participant

**Workshops:**
• GenAI, Full Stack, NLP, Data Science

**Competitive Programming:**
• 700+ LeetCode problems
• Regular practice and improvement

Loves building innovative solutions under pressure!`;
        
      case 'interests':
        return `**🔥 Arjun's Interests:**

**Technical Passions:**
• AI/ML - Building intelligent systems
• Full-Stack - End-to-end development
• Problem-solving - 700+ LeetCode problems

**Enjoys:**
• Hackathons (the building pressure!)
• Exploring new technologies
• Building products that solve real problems

**Domain Interests:**
• Education (Smart AI Classroom)
• Cybersecurity (Malware detection)
• Developer tools (NO CODE BACKEND)

What aspect interests you?`;
    }
    
    // If we have docs but no specific match, use the content directly
    return primaryDoc.content;
  }
  
  // No relevant docs found - use fallback
  return getDefaultResponse(query);
}

// Default responses for common queries
function getDefaultResponse(query: string): string {
  const lowerQuery = query.toLowerCase();
  
  // Greetings
  if (lowerQuery.match(/^(hi|hello|hey|greetings|good morning|good afternoon|good evening|what's up|sup|yo)/)) {
    return `Hey there! 👋 I'm Arjun.ai - your guide to Arjun Singh Rajput's portfolio.

**Quick highlights about Arjun:**
• 🏆 National Hackathon Winner (Pan IIT Alumni Imagine 2025)
• 💻 700+ LeetCode problems solved
• 🎓 B.Tech CS at GLA University
• 🔬 Project Intern @ IIIT Kottayam

**I can tell you about:**
• His 7+ projects (including AGENTIX, the hackathon winner)
• Technical skills (AI/ML, Full-Stack)
• Work experience & internships
• Education & achievements
• How to contact him

What interests you?`;
  }
  
  // Thanks
  if (lowerQuery.match(/thank|thanks|thx|appreciate/)) {
    return `You're welcome! 😊 

If you need more info about Arjun's work, just ask! You can also reach him directly at imstorm23203@gmail.com`;
  }
  
  // Bye
  if (lowerQuery.match(/bye|goodbye|see you|later|cya/)) {
    return `Goodbye! 👋 

**Quick contact info:**
📧 imstorm23203@gmail.com
💼 linkedin.com/in/imstorm23203attherategmail
💻 github.com/ArjunRajputGLA

Feel free to come back anytime!`;
  }
  
  // How are you
  if (lowerQuery.match(/how are you|how's it going|what's up/)) {
    return `Doing great, thanks! 😊 Ready to help you learn about Arjun.

**Popular questions:**
• What projects has Arjun built?
• What are his technical skills?
• Tell me about his hackathon win
• How can I contact him?`;
  }
  
  // What can you do
  if (lowerQuery.match(/what can you|help me|what do you know|capabilities/)) {
    return `I can tell you everything about Arjun Singh Rajput! 

**Topics I cover:**

📁 **Projects (7+)**
• AGENTIX (Hackathon Winner) - AI agent comparison
• NO CODE BACKEND - Visual backend builder
• GLA Canteen App - Full-stack food ordering
• And more...

💻 **Technical Skills**
• Languages: Python, JavaScript, TypeScript, Java
• Frontend: React.js, Next.js, Tailwind
• Backend: Node.js, MongoDB
• AI/ML: PyTorch, NLP, Deep Learning

💼 **Experience**
• IIIT Kottayam - NLP malware detection
• AcmeGrade - Data Science

🏆 **Achievements**
• National Hackathon Winner
• 700+ LeetCode problems
• Intel Certified (2024 & 2025)

What would you like to explore?`;
  }
  
  // Hire / Job
  if (lowerQuery.match(/hire|hiring|job|opportunity|available|position|recruit/)) {
    return `**Looking to work with Arjun?** 💼

**He brings:**
• 🏆 National Hackathon Winner (Pan IIT 2025)
• 💻 700+ LeetCode problems solved
• 🔬 Internship experience (IIIT Kottayam, AcmeGrade)
• 📜 Intel Certified (2024 & 2025)

**Tech Stack:**
• AI/ML: PyTorch, NLP, Deep Learning
• Full-Stack: React, Next.js, Node.js, MongoDB
• Languages: Python, JavaScript, TypeScript, Java

**Availability:**
• B.Tech student (graduating April 2027)
• Open to internships, freelance, collaborations

**Contact:**
📧 imstorm23203@gmail.com
💼 linkedin.com/in/imstorm23203attherategmail

He'd love to hear about your opportunity!`;
  }

  // List all projects
  if (lowerQuery.match(/all projects|list projects|every project|project list/)) {
    return `**Arjun's Complete Project Portfolio:**

**🏆 Award-Winning:**
1. **AGENTIX** - AI agent comparison platform
   - Won Pan IIT Alumni Imagine 2025
   - 🔗 agentix-ai.vercel.app

**🔨 Currently Building:**
2. **NO CODE BACKEND** - Visual backend builder with AI

**🎓 Intel Certified Projects:**
3. **Article Analyser** (2024) - NLP article analysis
   - 🔗 article-analyzer-via-gemini-weshallworkwithease.streamlit.app
4. **Smart AI Classroom** (2025) - AI + Computer Vision

**Full-Stack Applications:**
5. **GLA Canteen App** - Food ordering system (React + Node + MongoDB)
6. **J.A.R.V.I.S Arena** - Gaming platform

**Desktop Application:**
7. **FLUXOR** - AI-powered file manager (Electron.js)

Which one would you like details on?`;
  }

  // Summary/overview
  if (lowerQuery.match(/summary|overview|everything|complete|full/)) {
    return `**Arjun Singh Rajput - Complete Overview**

**🎓 Education:**
B.Tech CS at GLA University (April 2027)

**💼 Experience:**
• IIIT Kottayam (May-July 2025) - NLP malware detection
• AcmeGrade (Jan-Mar 2024) - Data Science

**🏆 Key Achievements:**
• National Hackathon Winner - Pan IIT Alumni Imagine 2025
• 700+ LeetCode problems (CodeXI)
• Intel UNNATI Certified (2024 & 2025)

**💻 Tech Stack:**
• Languages: Python, JavaScript, TypeScript, Java
• Frontend: React.js, Next.js, Tailwind CSS
• Backend: Node.js, MongoDB, Electron.js
• AI/ML: PyTorch, NLP, Deep Learning, Computer Vision

**📁 Notable Projects:**
• AGENTIX (Hackathon Winner)
• NO CODE BACKEND
• GLA Canteen App
• Article Analyser & Smart AI Classroom

**📬 Contact:**
imstorm23203@gmail.com | GitHub: ArjunRajputGLA

Want details on any specific area?`;
  }
  
  // Default fallback
  return `I'd love to help! Here's what I know about Arjun:

**🏆 Highlights:**
• National Hackathon Winner (AGENTIX)
• 700+ LeetCode problems solved
• Intel Certified (2024 & 2025)

**I can tell you about:**
• **Projects** - 7+ including AGENTIX, NO CODE BACKEND
• **Skills** - AI/ML, Full-Stack (Python, React, Node.js)
• **Experience** - IIIT Kottayam, AcmeGrade internships
• **Education** - B.Tech at GLA University
• **Achievements** - Hackathon wins, certifications
• **Contact** - Email, LinkedIn, GitHub

What would you like to know?`;
}

// Main function to handle user queries
export async function askGemini(userMessage: string, _conversationHistory: Message[]): Promise<string> {
  // RAG: Retrieve relevant context from knowledge base
  const relevantDocs = retrieveRelevantContext(userMessage, 5);
  
  console.log(`RAG: Retrieved ${relevantDocs.length} relevant documents for query: "${userMessage}"`);
  
  // Generate response based on retrieved documents
  const response = generateResponseFromDocs(userMessage, relevantDocs);
  
  return response;
}

export function generateMessageId(): string {
  return `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
} 