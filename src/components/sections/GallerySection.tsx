'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronDown, FolderOpen, Folder, Image, X, ChevronLeft } from 'lucide-react';

interface GalleryImage {
  id: string;
  name: string;
  category: string;
  date: string;
  location: string;
  event: string;
  featured?: boolean;
}

const galleryImages: GalleryImage[] = [
  // Hackathons
  { id: '1', name: 'pan_iit_imagine_2025.jpg', category: 'hackathons', date: '2025', location: 'Pan IIT', event: 'Imagine 2025 - National Winner', featured: true },
  { id: '2', name: 'meta_llama_hackathon.jpg', category: 'hackathons', date: '2024', location: 'Online', event: 'Meta LLAMA AI Hackathon', featured: true },
  { id: '3', name: 'team_agentix.jpg', category: 'hackathons', date: '2025', location: 'Pan IIT', event: 'Team AGENTIX' },
  // Workshops
  { id: '4', name: 'intel_unnati_2024.jpg', category: 'workshops', date: '2024', location: 'GLA University', event: 'Intel UNNATI Programme' },
  { id: '5', name: 'genai_workshop.jpg', category: 'workshops', date: '2024', location: 'Virtual', event: 'GenAI Workshop' },
  { id: '6', name: 'nlp_training.jpg', category: 'workshops', date: '2024', location: 'GLA University', event: 'NLP Training' },
  // Campus Life
  { id: '7', name: 'anchor_hons_day.jpg', category: 'campus_life', date: '2024', location: 'GLA University', event: 'Hons. Celebration Day - Anchor' },
  { id: '8', name: 'coding_session.jpg', category: 'campus_life', date: '2024', location: 'GLA Campus', event: 'Late Night Coding' },
  // Internships
  { id: '9', name: 'iiit_kottayam_project.jpg', category: 'internships', date: '2025', location: 'Remote', event: 'IIIT Kottayam Internship' },
  { id: '10', name: 'acmegrade_certificate.jpg', category: 'internships', date: '2024', location: 'Bangalore', event: 'AcmeGrade Certificate' },
];

const folders = {
  hackathons: ['pan_iit_imagine_2025.jpg', 'meta_llama_hackathon.jpg', 'team_agentix.jpg'],
  workshops: ['intel_unnati_2024.jpg', 'genai_workshop.jpg', 'nlp_training.jpg'],
  campus_life: ['anchor_hons_day.jpg', 'coding_session.jpg'],
  internships: ['iiit_kottayam_project.jpg', 'acmegrade_certificate.jpg']
};

export default function GallerySection() {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['hackathons']));
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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
    return gradients[parseInt(id) % gradients.length];
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
            {['all', 'hackathons', 'workshops', 'campus_life', 'internships'].map(filter => (
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
                    {/* Image Placeholder */}
                    <div className={`aspect-square rounded-lg bg-gradient-to-br ${getGradient(image.id)} flex items-center justify-center overflow-hidden border border-[var(--vscode-border)] group-hover:border-[var(--vscode-accent)] transition-colors`}>
                      <Image size={32} className="text-white/50" />
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
              >
                <X size={24} />
              </button>

              {/* Navigation Arrows */}
              <button
                className="absolute left-4 p-2 text-white hover:bg-white/10 rounded"
                onClick={(e) => { e.stopPropagation(); prevImage(); }}
              >
                <ChevronLeft size={32} />
              </button>

              <button
                className="absolute right-4 p-2 text-white hover:bg-white/10 rounded"
                onClick={(e) => { e.stopPropagation(); nextImage(); }}
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
                {/* Image Placeholder */}
                <div className={`aspect-video rounded-lg bg-gradient-to-br ${getGradient(filteredImages[currentImageIndex].id)} flex items-center justify-center`}>
                  <Image size={64} className="text-white/50" />
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
      </div>
    </section>
  );
}
