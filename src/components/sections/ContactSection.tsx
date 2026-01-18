'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Copy, Check, Github, Linkedin, ExternalLink } from 'lucide-react';

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const contactInfo = {
    email: "imstorm23203@gmail.com",
    location: "Mathura, India",
    social: {
      linkedin: "linkedin.com/in/imstorm23203attherategmail",
      github: "github.com/ArjunRajputGLA",
      leetcode: "leetcode.com/u/arjun2k4"
    },
    status: "🟢 Available for opportunities",
    responseTime: "< 24 hours"
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Using Web3Forms API to send actual emails
      const webFormData = new FormData();
      webFormData.append('access_key', 'd642b73a-e7e2-4fff-97b8-19cf8bc7ce97');
      webFormData.append('name', formData.name);
      webFormData.append('email', formData.email);
      webFormData.append('message', formData.message);
      webFormData.append('subject', `Portfolio Contact: Message from ${formData.name}`);
      webFormData.append('from_name', 'Portfolio Contact Form');

      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: webFormData
      });

      const result = await response.json();

      if (result.success) {
        setSubmitted(true);
        setFormData({ name: '', email: '', message: '' });
        // Reset success message after 5 seconds
        setTimeout(() => setSubmitted(false), 5000);
      } else {
        throw new Error(result.message || 'Failed to send message');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message. Please try again.');
      // Reset error after 5 seconds
      setTimeout(() => setError(null), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <section id="contact" className="min-h-screen p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <motion.div
          className="bg-[var(--vscode-bg)] border border-[var(--vscode-border)] rounded-lg overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          {/* Editor Header */}
          <div className="flex items-center gap-2 px-4 py-2 bg-[var(--vscode-sidebar)] border-b border-[var(--vscode-sidebar-border)]">
            <span className="text-lg">✉️</span>
            <span className="text-xs text-[var(--vscode-text-muted)]">contact.tsx — ArjunRajput.ai</span>
          </div>

          {/* Code Content */}
          <div className="p-4 md:p-6 font-mono text-sm">
            {/* Import statement */}
            <div className="syntax-comment mb-2">// contact.tsx</div>
            <div className="mb-4">
              <span className="syntax-keyword">import </span>
              <span className="syntax-variable">React</span>
              <span> from </span>
              <span className="syntax-string">&apos;react&apos;</span>
              <span>;</span>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
              {/* Left Column - Form */}
              <div className="flex-1">
                <div className="syntax-comment mb-4">{'// Let\'s build something together'}</div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Name Field */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    viewport={{ once: true }}
                  >
                    <label className="block mb-2 text-[var(--vscode-comment)]">
                      <span className="text-[var(--vscode-accent)]">const</span> name <span className="text-[var(--vscode-text-muted)]">=</span>
                    </label>
                    <div className="relative group">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--vscode-accent)] opacity-60 group-focus-within:opacity-100 transition-opacity">
                        👤
                      </div>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="'Your Name'"
                        className="w-full pl-10 pr-4 py-3 bg-[var(--vscode-sidebar)] border-2 border-[var(--vscode-border)] rounded-lg focus:border-[var(--vscode-accent)] outline-none text-[var(--vscode-text)] placeholder:text-[var(--vscode-text-muted)] transition-all duration-300 hover:border-[var(--vscode-accent)]/50"
                        required
                      />
                    </div>
                  </motion.div>

                  {/* Email Field */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    viewport={{ once: true }}
                  >
                    <label className="block mb-2 text-[var(--vscode-comment)]">
                      <span className="text-[var(--vscode-accent)]">const</span> email <span className="text-[var(--vscode-text-muted)]">=</span>
                    </label>
                    <div className="relative group">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--vscode-accent)] opacity-60 group-focus-within:opacity-100 transition-opacity">
                        ✉️
                      </div>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="'you@example.com'"
                        className="w-full pl-10 pr-4 py-3 bg-[var(--vscode-sidebar)] border-2 border-[var(--vscode-border)] rounded-lg focus:border-[var(--vscode-accent)] outline-none text-[var(--vscode-text)] placeholder:text-[var(--vscode-text-muted)] transition-all duration-300 hover:border-[var(--vscode-accent)]/50"
                        required
                      />
                    </div>
                  </motion.div>

                  {/* Message Field */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    viewport={{ once: true }}
                  >
                    <label className="block mb-2 text-[var(--vscode-comment)]">
                      <span className="text-[var(--vscode-accent)]">const</span> message <span className="text-[var(--vscode-text-muted)]">=</span>
                    </label>
                    <div className="relative group">
                      <div className="absolute left-3 top-4 text-[var(--vscode-accent)] opacity-60 group-focus-within:opacity-100 transition-opacity">
                        💬
                      </div>
                      <textarea
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="`Your message here...`"
                        rows={5}
                        className="w-full pl-10 pr-4 py-3 bg-[var(--vscode-sidebar)] border-2 border-[var(--vscode-border)] rounded-lg focus:border-[var(--vscode-accent)] outline-none text-[var(--vscode-text)] placeholder:text-[var(--vscode-text-muted)] resize-none transition-all duration-300 hover:border-[var(--vscode-accent)]/50"
                        required
                      />
                    </div>
                    <div className="mt-1 text-xs text-[var(--vscode-text-muted)] text-right">
                      {formData.message.length} / 1000 characters
                    </div>
                  </motion.div>

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    disabled={isSubmitting || submitted}
                    className={`w-full flex items-center justify-center gap-3 px-6 py-4 rounded-lg font-mono text-sm transition-all duration-300 ${
                      submitted
                        ? 'bg-[var(--vscode-success)] text-white shadow-lg shadow-[var(--vscode-success)]/30'
                        : error
                        ? 'bg-red-500 text-white'
                        : 'bg-gradient-to-r from-[var(--vscode-accent)] to-[#00d9ff] hover:shadow-lg hover:shadow-[var(--vscode-accent)]/30 text-white'
                    }`}
                    whileHover={{ scale: isSubmitting || submitted ? 1 : 1.02 }}
                    whileTap={{ scale: isSubmitting || submitted ? 1 : 0.98 }}
                  >
                    {isSubmitting ? (
                      <>
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                        >
                          ⏳
                        </motion.span>
                        <span>Sending message...</span>
                      </>
                    ) : submitted ? (
                      <>
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 500 }}
                        >
                          <Check size={18} />
                        </motion.span>
                        <span>Message Sent Successfully!</span>
                      </>
                    ) : (
                      <>
                        <span className="text-green-300">$</span>
                        <span>send_message()</span>
                        <Send size={16} />
                      </>
                    )}
                  </motion.button>

                  {/* Terminal Output - Success */}
                  {submitted && (
                    <motion.div
                      className="mt-4 p-4 bg-[var(--vscode-sidebar)] rounded-lg border-2 border-[var(--vscode-success)] shadow-lg shadow-[var(--vscode-success)]/10"
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <div className="flex items-center gap-2 text-[var(--vscode-success)] font-semibold">
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.2, type: "spring" }}
                        >
                          ✓
                        </motion.span>
                        <span>Message sent successfully!</span>
                      </div>
                      <div className="text-[var(--vscode-text-muted)] text-sm mt-2 ml-5">
                        Thanks for reaching out! I&apos;ll get back to you within 24 hours.
                      </div>
                      <div className="mt-3 ml-5 text-xs font-mono text-[var(--vscode-text-muted)]">
                        <span className="text-[var(--vscode-success)]">→</span> Response queued in inbox
                      </div>
                    </motion.div>
                  )}

                  {/* Terminal Output - Error */}
                  {error && (
                    <motion.div
                      className="mt-4 p-4 bg-[var(--vscode-sidebar)] rounded-lg border-2 border-red-500 shadow-lg shadow-red-500/10"
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <div className="flex items-center gap-2 text-red-500 font-semibold">
                        <span>✗</span>
                        <span>Error: {error}</span>
                      </div>
                      <div className="text-[var(--vscode-text-muted)] text-sm mt-2 ml-5">
                        Please try again or contact me directly:
                      </div>
                      <a 
                        href="mailto:imstorm23203@gmail.com" 
                        className="mt-2 ml-5 inline-flex items-center gap-2 text-xs font-mono text-[var(--vscode-accent)] hover:underline"
                      >
                        <span>→</span> imstorm23203@gmail.com
                      </a>
                    </motion.div>
                  )}
                </form>
              </div>

              {/* Right Column - Contact Info */}
              <div className="flex-1">
                <div className="syntax-comment mb-4">// Contact Information</div>
                
                <div className="bg-[var(--vscode-sidebar)] rounded-lg p-4 border border-[var(--vscode-border)]">
                  {/* Contact Info as JSON */}
                  <div className="space-y-2">
                    <div className="json-bracket">{'{'}</div>
                    
                    {/* Email */}
                    <div className="ml-4 flex items-center justify-between group">
                      <div>
                        <span className="json-key">&quot;email&quot;</span>
                        <span>: </span>
                        <span className="json-string">&quot;{contactInfo.email}&quot;</span>
                      </div>
                      <button
                        onClick={() => copyToClipboard(contactInfo.email, 'email')}
                        className="p-1 hover:bg-[var(--vscode-line-highlight)] rounded opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Copy email"
                      >
                        {copied === 'email' ? <Check size={14} className="text-[var(--vscode-success)]" /> : <Copy size={14} />}
                      </button>
                    </div>
                    
                    {/* Location */}
                    <div className="ml-4">
                      <span className="json-key">&quot;location&quot;</span>
                      <span>: </span>
                      <span className="json-string">&quot;{contactInfo.location}&quot;</span>
                      <span>,</span>
                    </div>
                    
                    {/* Status */}
                    <div className="ml-4">
                      <span className="json-key">&quot;status&quot;</span>
                      <span>: </span>
                      <span className="text-[var(--vscode-success)]">&quot;{contactInfo.status}&quot;</span>
                      <span>,</span>
                    </div>
                    
                    {/* Response Time */}
                    <div className="ml-4">
                      <span className="json-key">&quot;responseTime&quot;</span>
                      <span>: </span>
                      <span className="json-string">&quot;{contactInfo.responseTime}&quot;</span>
                    </div>

                    <div className="json-bracket">{'}'}</div>
                  </div>
                </div>

                {/* Social Links */}
                <div className="mt-6">
                  <div className="syntax-comment mb-4">// Social Links</div>
                  
                  <div className="grid grid-cols-1 gap-3">
                    <a
                      href={`https://${contactInfo.social.linkedin}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 bg-[var(--vscode-sidebar)] rounded border border-[var(--vscode-border)] hover:border-[var(--vscode-accent)] transition-colors group"
                    >
                      <Linkedin size={20} className="text-[#0077b5]" />
                      <span className="flex-1">{contactInfo.social.linkedin}</span>
                      <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                    
                    <a
                      href={`https://${contactInfo.social.github}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 bg-[var(--vscode-sidebar)] rounded border border-[var(--vscode-border)] hover:border-[var(--vscode-accent)] transition-colors group"
                    >
                      <Github size={20} />
                      <span className="flex-1">{contactInfo.social.github}</span>
                      <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                    
                    <a
                      href={`https://${contactInfo.social.leetcode}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 bg-[var(--vscode-sidebar)] rounded border border-[var(--vscode-border)] hover:border-[var(--vscode-accent)] transition-colors group"
                    >
                      <span className="text-[var(--vscode-warning)]">💻</span>
                      <span className="flex-1">{contactInfo.social.leetcode}</span>
                      <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="mt-6 p-4 bg-gradient-to-r from-[var(--vscode-accent)]/20 to-transparent rounded-lg border border-[var(--vscode-accent)]/50">
                  <div className="text-sm text-[var(--vscode-text-muted)]">
                    💡 Looking for an AI/ML enthusiast or Full-Stack developer?
                  </div>
                  <div className="text-[var(--vscode-success)] font-medium mt-1">
                    I&apos;m currently open to opportunities!
                  </div>
                </div>
              </div>
            </div>

            {/* Export statement */}
            <div className="mt-8 pt-4 border-t border-[var(--vscode-sidebar-border)]">
              <span className="syntax-keyword">export default </span>
              <span className="syntax-variable">Contact</span>
              <span>;</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
