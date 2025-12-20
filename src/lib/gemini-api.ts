import { resumeData } from '@/data/resume-data';

export interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: Date;
}

// API key should ideally be in environment variables
const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';

const systemPrompt = `You are Arjun.ai, an AI assistant for Arjun Singh Rajput's portfolio website. Your role is to answer questions about Arjun's professional background, skills, projects, and experience based ONLY on the resume data provided.

PERSONALITY:
- Professional yet friendly and approachable
- Concise but informative (2-4 paragraphs max)
- Enthusiastic about Arjun's achievements
- Helpful in guiding visitors to relevant information

GUIDELINES:
1. Answer ONLY based on the resume data provided below
2. If asked something not in the resume, politely say you don't have that information
3. Use emojis sparingly for visual appeal (1-2 per response)
4. Format responses with clear structure (bullet points, sections)
5. Include relevant links when mentioning projects or profiles
6. Suggest related questions at the end of responses
7. If asked about contact, provide all contact methods
8. Keep responses under 200 words unless detailed explanation needed
9. Always be truthful - never fabricate information
10. If asked to connect or schedule, direct to contact form
11. When listing items, use bullet points with • symbol
12. Be conversational and engaging, not robotic

RESUME DATA:
${JSON.stringify(resumeData, null, 2)}

Remember: You represent Arjun professionally. Be helpful, accurate, and engaging!`;

// Local fallback responses based on resume data
function getLocalResponse(query: string): string {
  const lowerQuery = query.toLowerCase();
  
  // Greetings
  if (lowerQuery.match(/^(hi|hello|hey|greetings|good morning|good afternoon|good evening)/)) {
    return `Hello! 👋 I'm Arjun.ai, ready to help you learn about Arjun Singh Rajput.

I can tell you about:
• His projects like AGENTIX (National Hackathon Winner!) and NO CODE BACKEND
• Technical skills in AI/ML, Full-Stack Development, and more
• Education at GLA University
• Professional experience and achievements

What would you like to know?`;
  }
  
  // About/Who is Arjun
  if (lowerQuery.match(/who is|about arjun|tell me about|introduce/)) {
    return `**Arjun Singh Rajput** is a passionate B.Tech student at GLA University (Expected April 2027) with expertise in AI/ML and Full-Stack Development. 🚀

**Highlights:**
• National Hackathon Winner - Pan IIT Alumni Imagine 2025 with AGENTIX
• 700+ problems solved on LeetCode
• Project Intern at IIIT Kottayam working on NLP-based malware detection
• Intel UNNATI Programme certified (2024 & 2025)

He's skilled in Python, JavaScript, TypeScript, React.js, Next.js, PyTorch, and more!

Would you like to know more about his projects or skills?`;
  }
  
  // Projects
  if (lowerQuery.match(/project|work|built|created|developed|portfolio/)) {
    const projects = resumeData.projects;
    let response = `Here are some of Arjun's notable projects: 🛠️\n\n`;
    
    projects.slice(0, 4).forEach(project => {
      response += `**${project.name}**${project.achievement ? ` ⭐ ${project.achievement}` : ''}\n`;
      response += `${project.description}\n`;
      response += `Technologies: ${project.technologies.join(', ')}\n`;
      if (project.link) response += `[View Project](${project.link})\n`;
      response += `\n`;
    });
    
    response += `Want to know more about any specific project?`;
    return response;
  }
  
  // Skills
  if (lowerQuery.match(/skill|technology|tech stack|programming|language|framework|tool/)) {
    const skills = resumeData.skills;
    return `**Arjun's Technical Skills** 💻

**Programming Languages:**
${skills.languages.join(', ')}

**Frontend:**
${skills.frontend.join(', ')}

**Backend:**
${skills.backend.join(', ')}

**AI/ML:**
${skills.aiml.join(', ')}

**Tools:**
${skills.tools.join(', ')}

**Professional Skills:**
${skills.professional.join(', ')}

Would you like details about his experience with any specific technology?`;
  }
  
  // Education
  if (lowerQuery.match(/education|study|university|college|degree|school|academic/)) {
    return `**Arjun's Education** 🎓

**Bachelor of Technology**
GLA University, Mathura
Expected Graduation: April 2027 (In Progress)

**Intermediate**
Sanskar Public School, Mathura
Completed: April 2023

**High School**
Sacred Heart Convent Hr. Sec. School, Mathura
Completed: April 2021

He's actively involved in workshops on GenAI, Full Stack, NLP, and Data Science!

Any questions about his academic journey?`;
  }
  
  // Experience
  if (lowerQuery.match(/experience|work|job|intern|career|professional/)) {
    return `**Arjun's Professional Experience** 💼

**Project Intern** - IIIT Kottayam, Kerala (Remote)
May 2025 – July 2025
• Developed a model for malware detection using NLP techniques and Deep Learning
• Technologies: NLP, Deep Learning, Python, PyTorch

**Project Trainee** - AcmeGrade, Bangalore (Remote)
January 2024 – March 2024
• Learned Data Science through online lectures and applied it in real-time projects
• Received Certificate of Recommendation
• Technologies: Data Science, Python, Machine Learning

Want to know more about his projects or skills?`;
  }
  
  // Achievements
  if (lowerQuery.match(/achievement|award|accomplish|win|certificate|recognition/)) {
    return `**Arjun's Achievements** 🏆

• **National Hackathon Winner** - Pan IIT Alumni Imagine 2025 with AGENTIX project

• **LeetCode Expert** - Solved 700+ problems ([Profile](https://leetcode.com/u/CodeXI/))

• **Intel Certified** - Intel UNNATI Programme 2024 & 2025

• **NEC Corporation Certification**

• **Public Speaking** - Performed as Anchor in Hons. Celebration Day at GLA University (2024)

• **Active Participant** - Multiple Hackathons, Codathons, and AI Hackathon with Meta LLAMA 2024

Any specific achievement you'd like to know more about?`;
  }
  
  // Contact
  if (lowerQuery.match(/contact|email|reach|connect|linkedin|github|social/)) {
    return `**Get in Touch with Arjun** 📬

**Email:** imstorm23203@gmail.com

**Social Profiles:**
• [LinkedIn](https://www.linkedin.com/in/imstorm23203attherategmail/)
• [GitHub](https://github.com/ArjunRajputGLA)
• [LeetCode](https://leetcode.com/u/CodeXI/)

**Location:** Mathura, India

Feel free to reach out for collaborations, opportunities, or just to say hi! 👋`;
  }
  
  // AGENTIX specific
  if (lowerQuery.match(/agentix/)) {
    return `**AGENTIX - Choose the Right AI Agent for You** 🤖

This is Arjun's award-winning project that won the **National Hackathon - Pan IIT Alumni Imagine 2025**!

**Description:**
A real-time AI agent comparison platform with live performance metrics that helps users select the best AI agent for their needs.

**Features:**
• Real-time Analytics
• AI Agent Comparison
• Live Performance Metrics

**Tech Stack:** AI Agents, Real-time Analytics, Full-Stack

🔗 [Try AGENTIX](https://agentix-ai.vercel.app/)

Would you like to know about his other projects?`;
  }
  
  // LeetCode
  if (lowerQuery.match(/leetcode|coding|competitive|dsa|algorithm|problem solving/)) {
    return `**Arjun's Competitive Coding Journey** 💡

Arjun has solved **700+ problems** on LeetCode, demonstrating strong algorithmic thinking and problem-solving skills!

Profile: [CodeXI on LeetCode](https://leetcode.com/u/CodeXI/)

This achievement showcases his:
• Strong grasp of Data Structures & Algorithms
• Problem-solving abilities
• Analytical thinking
• Consistency and dedication

Want to know about his technical skills or projects?`;
  }
  
  // Default fallback
  return `Thanks for your question! 🤔

I can help you learn about Arjun in these areas:
• **Projects** - Including AGENTIX (National Hackathon Winner!)
• **Skills** - AI/ML, Full-Stack, Python, JavaScript, and more
• **Education** - B.Tech at GLA University
• **Experience** - Internships at IIIT Kottayam and AcmeGrade
• **Achievements** - Awards, certifications, and milestones
• **Contact** - Ways to reach Arjun

Just ask about any of these topics!`;
}

export async function askGemini(userMessage: string, conversationHistory: Message[]): Promise<string> {
  const apiKey = GEMINI_API_KEY;
  
  // Debug: Log API key status (not the actual key)
  console.log('API Key configured:', apiKey ? `Yes (${apiKey.substring(0, 10)}...)` : 'No');
  
  // If no API key, use local responses
  if (!apiKey) {
    console.log('No API key configured, using local responses');
    return getLocalResponse(userMessage);
  }

  try {
    // Build conversation for Gemini's multi-turn format
    const contents: Array<{ role: string; parts: Array<{ text: string }> }> = [];
    
    // Add system context as first user message
    contents.push({
      role: 'user',
      parts: [{ text: systemPrompt + "\n\nPlease acknowledge that you understand your role as Arjun.ai." }]
    });
    
    contents.push({
      role: 'model',
      parts: [{ text: "I understand! I'm Arjun.ai, the AI assistant for Arjun Singh Rajput's portfolio. I'll answer questions about his background, skills, projects, and experience based on the resume data provided. I'll be professional, friendly, and helpful. How can I assist you today?" }]
    });
    
    // Add conversation history (limit to last 6 messages for context)
    const recentHistory = conversationHistory.slice(-6);
    recentHistory.forEach(msg => {
      contents.push({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      });
    });
    
    // Add current user message
    contents.push({
      role: 'user',
      parts: [{ text: userMessage }]
    });

    console.log('Sending request to Gemini API...');

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000); // 20 second timeout

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: contents,
          generationConfig: {
            temperature: 0.8,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024
          },
          safetySettings: [
            { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_ONLY_HIGH" },
            { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_ONLY_HIGH" },
            { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_ONLY_HIGH" },
            { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_ONLY_HIGH" }
          ]
        }),
        signal: controller.signal
      }
    );

    clearTimeout(timeoutId);

    const data = await response.json();
    
    console.log('Gemini API Response Status:', response.status);
    
    // Log for debugging
    if (!response.ok) {
      console.error('Gemini API Error Response:', JSON.stringify(data, null, 2));
      // Fall back to local response on API error
      console.log('Falling back to local response due to API error');
      return getLocalResponse(userMessage);
    }
    
    if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
      console.log('Successfully received response from Gemini API');
      return data.candidates[0].content.parts[0].text;
    }
    
    // Check for blocked content
    if (data.promptFeedback?.blockReason) {
      console.error('Content blocked:', data.promptFeedback);
      return "I apologize, but I couldn't process that request. Please try rephrasing your question about Arjun's background, skills, or projects.";
    }
    
    // Check for empty candidates
    if (data.candidates && data.candidates.length === 0) {
      console.error('Empty candidates array:', JSON.stringify(data, null, 2));
      return getLocalResponse(userMessage);
    }
    
    console.error('Unexpected response format:', JSON.stringify(data, null, 2));
    return getLocalResponse(userMessage);
    
  } catch (error) {
    console.error('Gemini API Error:', error);
    
    // Check for specific error types
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        console.log('Request timed out, using local response');
      } else {
        console.log('API error, falling back to local response:', error.message);
      }
    }
    
    // Always fall back to local responses on error
    return getLocalResponse(userMessage);
  }
}

export function generateMessageId(): string {
  return `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
