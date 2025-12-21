'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronDown, FolderOpen, Folder, Image, X, ChevronLeft, Award, Play, Pause, FastForward, Rewind } from 'lucide-react';

interface GalleryImage {
  id: string;
  name: string;
  category: string;
  date: string;
  location: string;
  event: string;
  featured?: boolean;
  imagePath?: string;
}

interface Certificate {
  id: string;
  name: string;
  issuer: string;
  date: string;
  credentialId?: string;
  skills: string[];
  fileName: string;
  fileType: 'png' | 'pdf';
}

const certificates: Certificate[] = [
  { id: 'cert1', name: 'Career Essentials in Generative AI', issuer: 'Microsoft & LinkedIn', date: '2024', skills: ['Generative AI', 'AI Fundamentals', 'Career Development'], fileName: 'Career Essentials in Generative AI by Microsoft and LinkedIn.png', fileType: 'png' },
  { id: 'cert2', name: 'Advanced Learning Algorithms', issuer: 'Coursera', date: '2024', skills: ['Machine Learning', 'Neural Networks', 'Decision Trees'], fileName: 'Coursera - Advanced Learning Algorithms.pdf', fileType: 'pdf' },
  { id: 'cert3', name: 'E-Business', issuer: 'Academic', date: '2025', skills: ['E-Commerce', 'Digital Business', 'Online Marketing'], fileName: 'E-Business.pdf', fileType: 'pdf' },
  { id: 'cert4', name: 'Google Cloud Career Launchpad - Generative AI', issuer: 'Google Cloud', date: '2024', skills: ['GCP', 'Generative AI', 'Cloud AI Services'], fileName: 'Google Cloud Career Launchpad Generative AI track.png', fileType: 'png' },
  { id: 'cert5', name: 'IIIT Kottayam Internship', issuer: 'IIIT Kottayam', date: '2025', skills: ['Research', 'AI/ML', 'Academic Project'], fileName: 'IIIT Kottayam Internship Certificate.pdf', fileType: 'pdf' },
  { id: 'cert6', name: 'Improving Deep Learning Models', issuer: 'Coursera - DeepLearning.AI', date: '2024', skills: ['Hyperparameter Tuning', 'Regularization', 'Optimization'], fileName: 'Improving Deep Learning Models.pdf', fileType: 'pdf' },
  { id: 'cert7', name: 'Intel Unnati Certificate 2024', issuer: 'Intel Corporation', date: '2024', skills: ['AI/ML', 'Edge Computing', 'Intel OneAPI'], fileName: 'Intel Unnati Certificate 2024.pdf', fileType: 'pdf' },
  { id: 'cert8', name: 'Intel Unnati Certificate', issuer: 'Intel Corporation', date: '2024', skills: ['AI Development', 'Intel Technologies', 'Edge AI'], fileName: 'INTEL Unnati Certificate.pdf', fileType: 'pdf' },
  { id: 'cert9', name: 'Environmental Engineering & Science', issuer: 'Academic', date: '2025', skills: ['Sustainability', 'Environmental Science', 'Engineering Fundamentals'], fileName: 'Introduction to Environmental Engineering and Science - Fundamental and Sustainability Concepts.pdf', fileType: 'pdf' },
  { id: 'cert10', name: 'JOVAC 2025', issuer: 'JOVAC', date: '2025', skills: ['Technical Skills', 'Professional Development'], fileName: 'JOVAC - 2025.pdf', fileType: 'pdf' },
  { id: 'cert11', name: 'Management Information System', issuer: 'Academic', date: '2025', skills: ['MIS', 'Information Systems', 'Business Technology'], fileName: 'Management Information System.pdf', fileType: 'pdf' },
  { id: 'cert12', name: 'NEC Certificate (B1 SEM2)', issuer: 'NEC', date: '2024', skills: ['Academic Excellence', 'Technical Skills'], fileName: 'NEC Certificate_B1_SEM2-pages-15.pdf', fileType: 'pdf' },
  { id: 'cert13', name: 'NEC Certificate (GLA)', issuer: 'NEC - GLA University', date: '2024', skills: ['Academic Achievement', 'University Recognition'], fileName: 'NEC Certificate_GLA-pages-15.pdf', fileType: 'pdf' },
  { id: 'cert14', name: 'Neural Networks and Deep Learning', issuer: 'Coursera - DeepLearning.AI', date: '2024', skills: ['Neural Networks', 'Deep Learning', 'TensorFlow'], fileName: 'Neural Networks and Deep Learning.pdf', fileType: 'pdf' },
  { id: 'cert15', name: 'Pan IIT Imagine 2025', issuer: 'Pan IIT', date: '2025', skills: ['Hackathon', 'Innovation', 'Team Collaboration'], fileName: 'Pan IIT Imagine 2025 (Participation Certificate).pdf', fileType: 'pdf', featured: true },
  { id: 'cert16', name: 'SatHack Hackathon', issuer: 'SatHack', date: '2025', skills: ['Hackathon', 'Problem Solving', 'Innovation'], fileName: 'SatHack Hackathon Participation Certificate.pdf', fileType: 'pdf' },
  { id: 'cert17', name: 'Acmegrade Data Science Internship', issuer: 'Acmegrade', date: '2024', credentialId: 'AGI24010375', skills: ['Data Science', 'Machine Learning', 'Data Analysis'], fileName: 'AcmeGrade_Internship completion.jpg', fileType: 'png' },
] as (Certificate & { featured?: boolean })[];

const galleryImages: GalleryImage[] = [
  // Hackathons
  { id: '1', name: 'PanIIT Winning Image.jpg', category: 'hackathons', date: '2025', location: 'Pan IIT', event: 'Imagine 2025 - National Winner', featured: true, imagePath: '/Gallery Images/PanIIT Winning Image.jpg' },
  { id: '2', name: 'Meta Llama Hackathon.jpg', category: 'hackathons', date: '2024', location: 'Online', event: 'Meta LLAMA AI Hackathon', featured: true, imagePath: '/Gallery Images/Meta Llama Hackathon.jpg' },
  { id: '3', name: 'Hackathon with Meta Llama.png', category: 'hackathons', date: '2024', location: 'Online', event: 'Hackathon with Meta Llama', imagePath: '/Gallery Images/Hackathon with Meta Llama.png' },
  { id: '4', name: 'Team Pioneer(PanIIT Imagine Hackahton).jpg', category: 'hackathons', date: '2025', location: 'Pan IIT', event: 'Team Pioneer - PanIIT Imagine', imagePath: '/Gallery Images/Team Pioneer(PanIIT Imagine Hackahton).jpg' },
  { id: '5', name: 'Team Pioneer(SatHack Hackathon).jpg', category: 'hackathons', date: '2024', location: 'SatHack', event: 'Team Pioneer - SatHack Hackathon', imagePath: '/Gallery Images/Team Pioneer(SatHack Hackathon).jpg' },
  // Workshops
  { id: '6', name: 'Discover Deloitte Workshop.jpg', category: 'workshops', date: '2024', location: 'GLA University', event: 'Discover Deloitte Workshop', imagePath: '/Gallery Images/Discover Deloitte Workshop.jpg' },
  { id: '7', name: 'Google Cloud Arcade 2024.jpg', category: 'workshops', date: '2024', location: 'Virtual', event: 'Google Cloud Arcade 2024', imagePath: '/Gallery Images/Google Cloud Arcade 2024.jpg' },
  // Campus Life
  { id: '8', name: 'Hons Day 2024.jpg', category: 'campus_life', date: '2024', location: 'GLA University', event: 'Hons. Celebration Day 2024', imagePath: '/Gallery Images/Hons Day 2024.jpg' },
  // Achievements
  { id: '9', name: 'Recognition for Competitive Programming.JPG', category: 'achievements', date: '2024', location: 'GLA University', event: 'Recognition for Competitive Programming', featured: true, imagePath: '/Gallery Images/Recognition for Competitive Programming.JPG' },
  { id: '10', name: 'Recognition for External Participation.JPG', category: 'achievements', date: '2024', location: 'GLA University', event: 'Recognition for External Participation', imagePath: '/Gallery Images/Recognition for External Participation.JPG' },
];

const folders = {
  hackathons: ['PanIIT Winning Image.jpg', 'Meta Llama Hackathon.jpg', 'Hackathon with Meta Llama.png', 'Team Pioneer(PanIIT Imagine Hackahton).jpg', 'Team Pioneer(SatHack Hackathon).jpg'],
  workshops: ['Discover Deloitte Workshop.jpg', 'Google Cloud Arcade 2024.jpg'],
  campus_life: ['Hons Day 2024.jpg'],
  achievements: ['Recognition for Competitive Programming.JPG', 'Recognition for External Participation.JPG']
};

export default function GallerySection() {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['hackathons']));
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Certificate carousel state
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [certificateLightboxOpen, setCertificateLightboxOpen] = useState(false);
  const [isCarouselPaused, setIsCarouselPaused] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [carouselPosition, setCarouselPosition] = useState(0);
  const [carouselSpeed, setCarouselSpeed] = useState(1); // Speed multiplier: 0.5x, 1x, 2x

  // Auto-scroll carousel
  useEffect(() => {
    if (isCarouselPaused) return;
    
    const baseInterval = 14; // Base interval in ms
    const interval = setInterval(() => {
      setCarouselPosition(prev => {
        const maxScroll = certificates.length * 320; // card width + gap
        return prev >= maxScroll ? 0 : prev + carouselSpeed;
      });
    }, baseInterval);

    return () => clearInterval(interval);
  }, [isCarouselPaused, carouselSpeed]);

  // Speed control functions
  const decreaseSpeed = () => {
    setCarouselSpeed(prev => Math.max(0.5, prev - 0.5));
  };

  const increaseSpeed = () => {
    setCarouselSpeed(prev => Math.min(3, prev + 0.5));
  };

  const toggleFolder = (folder: string) => {
    setExpandedFolders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(folder)) {
        newSet.delete(folder);
      } else {
        newSet.add(folder);
      }
      return newSet;
    });
  };

  const getImageByName = (name: string) => {
    return galleryImages.find(img => img.name === name);
  };

  const filteredImages = activeFilter === 'all' 
    ? galleryImages 
    : galleryImages.filter(img => img.category === activeFilter);

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const nextImage = () => {
    setCurrentImageIndex(prev => (prev + 1) % filteredImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(prev => (prev - 1 + filteredImages.length) % filteredImages.length);
  };

  // Placeholder gradient for images
  const getGradient = (id: string) => {
    const gradients = [
      'from-blue-600 to-purple-600',
      'from-green-600 to-teal-600',
      'from-orange-600 to-red-600',
      'from-pink-600 to-rose-600',
      'from-indigo-600 to-blue-600',
      'from-yellow-600 to-orange-600',
      'from-cyan-600 to-blue-600',
      'from-violet-600 to-purple-600',
      'from-emerald-600 to-green-600',
      'from-rose-600 to-pink-600',
    ];
    return gradients[parseInt(id.replace(/\D/g, '')) % gradients.length];
  };

  const openCertificateLightbox = (cert: Certificate) => {
    setSelectedCertificate(cert);
    setCertificateLightboxOpen(true);
  };

  const nextCertificate = () => {
    const currentIndex = certificates.findIndex(c => c.id === selectedCertificate?.id);
    const nextIndex = (currentIndex + 1) % certificates.length;
    setSelectedCertificate(certificates[nextIndex]);
  };

  const prevCertificate = () => {
    const currentIndex = certificates.findIndex(c => c.id === selectedCertificate?.id);
    const prevIndex = (currentIndex - 1 + certificates.length) % certificates.length;
    setSelectedCertificate(certificates[prevIndex]);
  };

  return (
    <section id="gallery" className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="bg-[var(--vscode-bg)] border border-[var(--vscode-border)] rounded-lg overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          {/* Editor Header */}
          <div className="flex items-center gap-2 px-4 py-2 bg-[var(--vscode-sidebar)] border-b border-[var(--vscode-sidebar-border)]">
            <span className="text-lg">🖼️</span>
            <span className="text-xs text-[var(--vscode-text-muted)]">media/journey/ — ArjunRajput.ai</span>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-1 p-2 bg-[var(--vscode-tab-inactive)] border-b border-[var(--vscode-sidebar-border)] overflow-x-auto">
            {['all', 'hackathons', 'workshops', 'campus_life', 'achievements'].map(filter => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-3 py-1 text-xs rounded transition-colors whitespace-nowrap ${
                  activeFilter === filter 
                    ? 'bg-[var(--vscode-accent)] text-white' 
                    : 'hover:bg-[var(--vscode-line-highlight)] text-[var(--vscode-text-muted)]'
                }`}
              >
                {filter === 'all' ? 'All' : filter.replace('_', ' ').toUpperCase()}
              </button>
            ))}
          </div>

          <div className="flex flex-col md:flex-row">
            {/* File Tree Sidebar */}
            <div className="md:w-64 border-r border-[var(--vscode-sidebar-border)] bg-[var(--vscode-sidebar)] p-2">
              <div className="text-xs text-[var(--vscode-text-muted)] uppercase mb-2 px-2">Explorer</div>
              <div className="px-2 py-1 text-sm text-[var(--vscode-text-muted)] mb-1">
                📁 media/journey/
              </div>
              
              {Object.entries(folders).map(([folder, files]) => (
                <div key={folder} className="ml-2">
                  <button
                    onClick={() => toggleFolder(folder)}
                    className="flex items-center gap-1 w-full px-2 py-1 hover:bg-[var(--vscode-line-highlight)] rounded text-sm"
                  >
                    {expandedFolders.has(folder) ? (
                      <>
                        <ChevronDown size={14} />
                        <FolderOpen size={14} className="text-[var(--vscode-warning)]" />
                      </>
                    ) : (
                      <>
                        <ChevronRight size={14} />
                        <Folder size={14} className="text-[var(--vscode-warning)]" />
                      </>
                    )}
                    <span>{folder}/</span>
                  </button>

                  <AnimatePresence>
                    {expandedFolders.has(folder) && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        {files.map(file => {
                          const image = getImageByName(file);
                          const isSelected = selectedImage?.name === file;
                          
                          return (
                            <button
                              key={file}
                              onClick={() => setSelectedImage(image || null)}
                              className={`flex items-center gap-1 w-full pl-8 pr-2 py-1 text-xs ${
                                isSelected 
                                  ? 'bg-[var(--vscode-selection)]' 
                                  : 'hover:bg-[var(--vscode-line-highlight)]'
                              }`}
                            >
                              <Image size={12} className="text-[var(--vscode-accent)]" />
                              <span className="truncate">{file}</span>
                              {image?.featured && (
                                <span className="text-[var(--vscode-warning)]">●</span>
                              )}
                            </button>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            {/* Gallery Grid */}
            <div className="flex-1 p-4">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredImages.map((image, index) => (
                  <motion.div
                    key={image.id}
                    className="relative group cursor-pointer"
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    viewport={{ once: true }}
                    onClick={() => openLightbox(index)}
                  >
                    {/* Image Display */}
                    <div className={`aspect-square rounded-lg ${!image.imagePath ? `bg-gradient-to-br ${getGradient(image.id)}` : ''} flex items-center justify-center overflow-hidden border border-[var(--vscode-border)] group-hover:border-[var(--vscode-accent)] transition-colors`}>
                      {image.imagePath ? (
                        <img 
                          src={image.imagePath}
                          alt={image.event}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Image size={32} className="text-white/50" />
                      )}
                    </div>

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex flex-col justify-end p-2">
                      <div className="text-xs text-white font-medium truncate">{image.name}</div>
                      <div className="text-xs text-white/70 truncate">{image.event}</div>
                    </div>

                    {/* Featured Indicator */}
                    {image.featured && (
                      <div className="absolute top-2 right-2 w-3 h-3 rounded-full bg-[var(--vscode-warning)]" />
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Image Count */}
              <div className="mt-4 text-center text-sm text-[var(--vscode-text-muted)]">
                {filteredImages.length} / {galleryImages.length} images
              </div>
            </div>
          </div>
        </motion.div>

        {/* Certificates Carousel Section */}
        <motion.div
          className="mt-8 bg-[var(--vscode-bg)] border border-[var(--vscode-border)] rounded-lg overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
        >
          {/* Certificates Header */}
          <div className="flex items-center justify-between px-4 py-2 bg-[var(--vscode-sidebar)] border-b border-[var(--vscode-sidebar-border)]">
            <div className="flex items-center gap-2">
              <Award className="text-[var(--vscode-warning)]" size={18} />
              <span className="text-xs text-[var(--vscode-text-muted)]">media/certificates/ — Certifications & Achievements</span>
            </div>
            <div className="flex items-center gap-1">
              {/* Speed Control */}
              <button
                onClick={decreaseSpeed}
                disabled={carouselSpeed <= 0.5}
                className="p-1.5 hover:bg-[var(--vscode-line-highlight)] rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                title="Slow down"
              >
                <Rewind size={14} className="text-[var(--vscode-text-muted)]" />
              </button>
              <span className="text-xs text-[var(--vscode-text-muted)] min-w-[32px] text-center">
                {carouselSpeed}x
              </span>
              <button
                onClick={increaseSpeed}
                disabled={carouselSpeed >= 3}
                className="p-1.5 hover:bg-[var(--vscode-line-highlight)] rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                title="Speed up"
              >
                <FastForward size={14} className="text-[var(--vscode-text-muted)]" />
              </button>
              {/* Play/Pause */}
              <div className="w-px h-4 bg-[var(--vscode-border)] mx-1" />
              <button
                onClick={() => setIsCarouselPaused(!isCarouselPaused)}
                className="p-1.5 hover:bg-[var(--vscode-line-highlight)] rounded transition-colors"
                title={isCarouselPaused ? 'Play carousel' : 'Pause carousel'}
              >
                {isCarouselPaused ? (
                  <Play size={14} className="text-[var(--vscode-text-muted)]" />
                ) : (
                  <Pause size={14} className="text-[var(--vscode-text-muted)]" />
                )}
              </button>
            </div>
          </div>

          {/* Carousel Container */}
          <div 
            className="relative overflow-hidden py-6 px-4"
            onMouseEnter={() => setIsCarouselPaused(true)}
            onMouseLeave={() => setIsCarouselPaused(false)}
          >
            {/* Gradient Overlays */}
            <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[var(--vscode-bg)] to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[var(--vscode-bg)] to-transparent z-10 pointer-events-none" />

            {/* Scrolling Carousel */}
            <div 
              ref={carouselRef}
              className="flex gap-4"
              style={{
                transform: `translateX(-${carouselPosition}px)`,
                width: 'max-content',
              }}
            >
              {/* Duplicate certificates for infinite scroll effect */}
              {[...certificates, ...certificates].map((cert, index) => (
                <motion.div
                  key={`${cert.id}-${index}`}
                  className="flex-shrink-0 w-[300px] bg-[var(--vscode-sidebar)] border border-[var(--vscode-border)] rounded-lg overflow-hidden cursor-pointer group hover:border-[var(--vscode-accent)] transition-all duration-300"
                  whileHover={{ scale: 1.02, y: -4 }}
                  onClick={() => openCertificateLightbox(cert)}
                >
                  {/* Certificate Preview */}
                  <div className={`h-40 ${cert.fileType === 'png' ? '' : 'bg-white'} flex items-center justify-center relative overflow-hidden`}>
                    {cert.fileType === 'png' ? (
                      <img 
                        src={`/Certificates/${cert.fileName}`}
                        alt={cert.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      /* PDF Preview using object embed with fallback */
                      <object
                        data={`/Certificates/${cert.fileName}#page=1&view=FitH`}
                        type="application/pdf"
                        className="w-full h-full"
                      >
                        {/* Fallback if PDF can't be embedded */}
                        <div className={`w-full h-full bg-gradient-to-br ${getGradient(cert.id)} flex flex-col items-center justify-center`}>
                          <Award size={32} className="text-white/50 mb-2" />
                          <span className="text-white/70 text-xs">PDF Certificate</span>
                        </div>
                      </object>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                      <span className="text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity font-medium bg-black/50 px-3 py-1 rounded">
                        {cert.fileType === 'pdf' ? '📄 View PDF' : '🔍 View'}
                      </span>
                    </div>
                  </div>

                  {/* Certificate Info */}
                  <div className="p-4">
                    <h4 className="font-semibold text-[var(--vscode-text)] text-sm truncate mb-1">
                      {cert.name}
                    </h4>
                    <p className="text-xs text-[var(--vscode-text-muted)] mb-2">
                      {cert.issuer} • {cert.date}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {cert.skills.slice(0, 3).map((skill, i) => (
                        <span 
                          key={i}
                          className="px-1.5 py-0.5 text-[10px] bg-[var(--vscode-line-highlight)] text-[var(--vscode-text-muted)] rounded"
                        >
                          {skill}
                        </span>
                      ))}
                      {cert.skills.length > 3 && (
                        <span className="px-1.5 py-0.5 text-[10px] text-[var(--vscode-text-muted)]">
                          +{cert.skills.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Certificate Count */}
          <div className="px-4 py-2 border-t border-[var(--vscode-sidebar-border)] text-center text-xs text-[var(--vscode-text-muted)]">
            {certificates.length} certificates • Hover to pause • Click to view details
          </div>
        </motion.div>

        {/* Lightbox */}
        <AnimatePresence>
          {lightboxOpen && filteredImages[currentImageIndex] && (
            <motion.div
              className="fixed inset-0 bg-black/90 flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setLightboxOpen(false)}
            >
              {/* Close Button */}
              <button
                className="absolute top-4 right-4 p-2 text-white hover:bg-white/10 rounded"
                onClick={() => setLightboxOpen(false)}
                aria-label="Close lightbox"
              >
                <X size={24} />
              </button>

              {/* Navigation Arrows */}
              <button
                className="absolute left-4 p-2 text-white hover:bg-white/10 rounded"
                onClick={(e) => { e.stopPropagation(); prevImage(); }}
                aria-label="Previous image"
              >
                <ChevronLeft size={32} />
              </button>

              <button
                className="absolute right-4 p-2 text-white hover:bg-white/10 rounded"
                onClick={(e) => { e.stopPropagation(); nextImage(); }}
                aria-label="Next image"
              >
                <ChevronRight size={32} />
              </button>

              {/* Image Content */}
              <motion.div
                key={currentImageIndex}
                className="max-w-4xl w-full mx-4"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Image Display */}
                <div className={`rounded-lg overflow-hidden ${!filteredImages[currentImageIndex].imagePath ? `aspect-video bg-gradient-to-br ${getGradient(filteredImages[currentImageIndex].id)} flex items-center justify-center` : ''}`}>
                  {filteredImages[currentImageIndex].imagePath ? (
                    <img 
                      src={filteredImages[currentImageIndex].imagePath}
                      alt={filteredImages[currentImageIndex].event}
                      className="w-full h-auto max-h-[70vh] object-contain mx-auto"
                    />
                  ) : (
                    <Image size={64} className="text-white/50" />
                  )}
                </div>

                {/* Image Info */}
                <div className="mt-4 p-4 bg-[var(--vscode-sidebar)] rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-white">{filteredImages[currentImageIndex].name}</h3>
                      <p className="text-[var(--vscode-text-muted)]">{filteredImages[currentImageIndex].event}</p>
                    </div>
                    <div className="text-right text-sm text-[var(--vscode-text-muted)]">
                      <div>📍 {filteredImages[currentImageIndex].location}</div>
                      <div>📅 {filteredImages[currentImageIndex].date}</div>
                    </div>
                  </div>
                </div>

                {/* Image Counter */}
                <div className="text-center mt-4 text-white/70">
                  {currentImageIndex + 1} / {filteredImages.length} images
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Certificate Lightbox */}
        <AnimatePresence>
          {certificateLightboxOpen && selectedCertificate && (
            <motion.div
              className="fixed inset-0 bg-black/90 flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCertificateLightboxOpen(false)}
            >
              {/* Close Button */}
              <button
                className="absolute top-4 right-4 p-2 text-white hover:bg-white/10 rounded z-10"
                onClick={() => setCertificateLightboxOpen(false)}
                aria-label="Close certificate viewer"
              >
                <X size={24} />
              </button>

              {/* Navigation Arrows */}
              <button
                className="absolute left-4 p-2 text-white hover:bg-white/10 rounded z-10"
                onClick={(e) => { e.stopPropagation(); prevCertificate(); }}
                aria-label="Previous certificate"
              >
                <ChevronLeft size={32} />
              </button>

              <button
                className="absolute right-4 p-2 text-white hover:bg-white/10 rounded z-10"
                onClick={(e) => { e.stopPropagation(); nextCertificate(); }}
                aria-label="Next certificate"
              >
                <ChevronRight size={32} />
              </button>

              {/* Certificate Content */}
              <motion.div
                key={selectedCertificate.id}
                className="max-w-5xl w-full mx-4"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Certificate Display */}
                {selectedCertificate.fileType === 'png' ? (
                  <div className="rounded-lg overflow-hidden bg-[var(--vscode-sidebar)]">
                    <img 
                      src={`/Certificates/${selectedCertificate.fileName}`}
                      alt={selectedCertificate.name}
                      className="w-full h-auto max-h-[60vh] object-contain"
                    />
                  </div>
                ) : (
                  <div className="rounded-lg overflow-hidden bg-[var(--vscode-sidebar)]">
                    {/* PDF Viewer using iframe */}
                    <iframe
                      src={`/Certificates/${selectedCertificate.fileName}`}
                      className="w-full h-[60vh] bg-white"
                      title={selectedCertificate.name}
                    />
                  </div>
                )}

                {/* Certificate Details */}
                <div className="mt-4 p-4 bg-[var(--vscode-sidebar)] rounded-lg">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-white">{selectedCertificate.name}</h3>
                      <p className="text-[var(--vscode-text-muted)]">Issued by {selectedCertificate.issuer}</p>
                    </div>
                    <div className="text-right text-sm text-[var(--vscode-text-muted)]">
                      <div>📅 {selectedCertificate.date}</div>
                      {selectedCertificate.credentialId && (
                        <div>🔑 {selectedCertificate.credentialId}</div>
                      )}
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="mb-4">
                    <div className="text-xs uppercase tracking-wider text-[var(--vscode-text-muted)] mb-2">Skills & Technologies</div>
                    <div className="flex flex-wrap gap-2">
                      {selectedCertificate.skills.map((skill, i) => (
                        <span 
                          key={i}
                          className="px-2 py-1 text-xs bg-[var(--vscode-line-highlight)] text-[var(--vscode-accent)] rounded border border-[var(--vscode-border)]"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Download/View Link */}
                  <a
                    href={`/Certificates/${selectedCertificate.fileName}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--vscode-accent)] hover:bg-[var(--vscode-accent-hover)] rounded text-white text-sm transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {selectedCertificate.fileType === 'pdf' ? '📄 Open PDF' : '🖼️ View Full Size'}
                  </a>
                </div>

                {/* Certificate Counter */}
                <div className="text-center mt-4 text-white/70">
                  {certificates.findIndex(c => c.id === selectedCertificate.id) + 1} / {certificates.length} certificates
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
