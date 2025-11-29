'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { Camera, X, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Gallery() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [selectedGallery, setSelectedGallery] = useState<number | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const galleryImages = [
    {
      title: 'Hackathon Victory',
      description: 'Winning moment at Pan IIT Alumni Imagine Hackathon 2025',
      category: 'Achievement',
      thumbnail: '/PanIIT/PanIIT-Win.jpg',
      images: [
        '/PanIIT/PanIIT-Win.jpg',
        '/PanIIT/WhatsApp Image 2025-01-24 at 08.32.00_0893f5ba.jpg',
        '/PanIIT/WhatsApp Image 2025-01-24 at 08.28.42_3c9ec5d7.jpg',
        '/PanIIT/WhatsApp Image 2025-01-24 at 08.27.24_dbb32670.jpg',
        '/PanIIT/IMG-20250122-WA0040.jpg',
        '/PanIIT/IMG-20250122-WA0039.jpg',
        '/PanIIT/IMG-20250119-WA0023.jpg',
        '/PanIIT/IMG-20250119-WA0018.jpg'
      ],
    },
    {
      title: 'Discover Deloitte Workshop August-2025',
      description: 'Engaging in Deloitte workshop on corporate life and skills',
      category: 'Learning',
      thumbnail: '/DiscoverDeloitte2025/IMG-20250813-WA0020.jpg',
      images: [
        '/DiscoverDeloitte2025/IMG-20250813-WA0020.jpg',
        '/DiscoverDeloitte2025/IMG-20250813-WA0012.jpg',
        '/DiscoverDeloitte2025/IMG-20250817-WA0007.jpg',
        '/DiscoverDeloitte2025/IMG-20250817-WA0011.jpg',
        '/DiscoverDeloitte2025/IMG-20250817-WA0012.jpg',
        '/DiscoverDeloitte2025/IMG-20250817-WA0013.jpg',
        '/DiscoverDeloitte2025/IMG-20250817-WA0008.jpg'
      ],
    },
    {
      title: 'Coding Marathon',
      description: 'Participating in AI Hackathon with Meta LLAMA',
      category: 'Hackathon',
      thumbnail: '/MetaLlama/WhatsApp Image 2024-10-21 at 17.02.22_3a3b238e.jpg',
      images: [
        '/MetaLlama/WhatsApp Image 2024-10-21 at 17.02.22_3a3b238e.jpg',
        '/MetaLlama/IMG-20241021-WA0026.jpg',
        '/MetaLlama/IMG-20241021-WA0025.jpg',
        '/MetaLlama/IMG-20241021-WA0024.jpg',
        '/MetaLlama/IMG-20241021-WA0023.jpg',
      ],
    },
    {
      title: 'Workshop Session',
      description: 'GenAI Workshop - Learning and Sharing',
      category: 'Learning',
      thumbnail: '/gallery/image4.jpg',
      images: [
        '/gallery/image4.jpg',
        // Add more images for this gallery
      ],
    },
    {
      title: 'Team Collaboration',
      description: 'Working with the team on AGENTIX project',
      category: 'Project',
      thumbnail: '/gallery/image5.jpg',
      images: [
        '/gallery/image5.jpg',
        // Add more images for this gallery
      ],
    },
    {
      title: 'Intel UNNATI',
      description: 'Intel UNNATI Programme Completion',
      category: 'Achievement',
      thumbnail: '/gallery/image6.jpg',
      images: [
        '/gallery/image6.jpg',
        // Add more images for this gallery
      ],
    },
    {
      title: 'Campus Life',
      description: 'GLA University - Where it all began',
      category: 'Campus',
      thumbnail: '/gallery/image7.jpg',
      images: [
        '/gallery/image7.jpg',
        // Add more images for this gallery
      ],
    },
    {
      title: 'Tech Talk',
      description: 'Sharing insights on AI and Machine Learning',
      category: 'Leadership',
      thumbnail: '/gallery/image8.jpg',
      images: [
        '/gallery/image8.jpg',
        // Add more images for this gallery
      ],
    },
    {
      title: 'Anchor Performance',
      description: 'Hosting Hons. Celebration Day at GLA University',
      category: 'Leadership',
      thumbnail: '/HonsDay/Hons Day 2024.jpg',
      images: [
        '/HonsDay/Hons Day 2024.jpg',
      ],
    },
  ];

  const categories = ['All', 'Achievement', 'Hackathon', 'Leadership', 'Learning', 'Project', 'Campus'];
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredImages = activeCategory === 'All' 
    ? galleryImages 
    : galleryImages.filter(img => img.category === activeCategory);

  const openLightbox = (index: number) => {
    setSelectedGallery(index);
    setCurrentImageIndex(0);
  };

  const closeLightbox = () => {
    setSelectedGallery(null);
    setCurrentImageIndex(0);
  };

  const nextImage = () => {
    if (selectedGallery !== null) {
      const gallery = filteredImages[selectedGallery];
      setCurrentImageIndex((currentImageIndex + 1) % gallery.images.length);
    }
  };

  const prevImage = () => {
    if (selectedGallery !== null) {
      const gallery = filteredImages[selectedGallery];
      setCurrentImageIndex((currentImageIndex - 1 + gallery.images.length) % gallery.images.length);
    }
  };

  return (
    <section id="gallery" ref={ref} className="py-20 px-4 bg-white/50 dark:bg-gray-900/50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : { scale: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl mb-6"
          >
            <Camera className="w-8 h-8 text-white" />
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            My <span className="gradient-text">Journey</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-600 to-blue-600 mx-auto rounded-full mb-6" />
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Capturing moments from hackathons, workshops, and milestones
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {categories.map((category) => (
            <motion.button
              key={category}
              onClick={() => setActiveCategory(category)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                activeCategory === category
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-2 border-gray-200 dark:border-gray-700 hover:border-purple-500'
              }`}
            >
              {category}
            </motion.button>
          ))}
        </motion.div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredImages.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="group relative cursor-pointer overflow-hidden rounded-2xl aspect-square bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900 dark:to-blue-900"
              onClick={() => openLightbox(index)}
            >
              {/* Placeholder with gradient and icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <Camera className="w-16 h-16 text-purple-600 dark:text-purple-400 opacity-50" />
              </div>
              
              <img
                src={image.thumbnail}
                alt={image.title}
                className="w-full h-full object-cover"
              />

              {/* Image count badge */}
              {image.images.length > 1 && (
                <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {image.images.length} photos
                </div>
              )}

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <span className="inline-block px-3 py-1 bg-purple-600 rounded-full text-xs font-semibold mb-2">
                    {image.category}
                  </span>
                  <h3 className="font-bold text-lg mb-1">{image.title}</h3>
                  <p className="text-sm text-gray-200">{image.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Lightbox */}
        {selectedGallery !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-10"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Previous Button */}
            {filteredImages[selectedGallery].images.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
                className="absolute left-4 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-10"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
            )}

            {/* Image */}
            <div
              className="max-w-5xl max-h-[80vh] w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full aspect-video bg-gradient-to-br from-purple-900 to-blue-900 rounded-2xl flex items-center justify-center overflow-hidden">
                <img
                  src={filteredImages[selectedGallery].images[currentImageIndex]}
                  alt={`${filteredImages[selectedGallery].title} - Image ${currentImageIndex + 1}`}
                  className="w-full h-full object-contain rounded-2xl"
                />
                
                {/* Image counter */}
                {filteredImages[selectedGallery].images.length > 1 && (
                  <div className="absolute top-4 right-4 bg-black/70 text-white px-4 py-2 rounded-full text-sm font-semibold">
                    {currentImageIndex + 1} / {filteredImages[selectedGallery].images.length}
                  </div>
                )}
              </div>
              
              <div className="mt-4 text-center text-white">
                <span className="inline-block px-4 py-1 bg-purple-600 rounded-full text-sm font-semibold mb-3">
                  {filteredImages[selectedGallery].category}
                </span>
                <h3 className="text-2xl font-bold mb-2">
                  {filteredImages[selectedGallery].title}
                </h3>
                <p className="text-gray-300">
                  {filteredImages[selectedGallery].description}
                </p>
              </div>

              {/* Thumbnail navigation for multiple images */}
              {filteredImages[selectedGallery].images.length > 1 && (
                <div className="mt-6 px-4">
                  <div className="flex items-center justify-center gap-3 mb-3">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-purple-600 to-transparent"></div>
                    <p className="text-gray-400 text-sm font-medium">
                      {filteredImages[selectedGallery].images.length} Images
                    </p>
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-purple-600 to-transparent"></div>
                  </div>
                  
                  <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3 max-w-4xl mx-auto">
                    {filteredImages[selectedGallery].images.map((img, idx) => (
                      <motion.button
                        key={idx}
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentImageIndex(idx);
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`relative aspect-square rounded-xl overflow-hidden transition-all duration-300 ${
                          currentImageIndex === idx
                            ? 'ring-4 ring-purple-600 shadow-lg shadow-purple-600/50'
                            : 'ring-2 ring-gray-700 hover:ring-purple-500 opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img
                          src={img}
                          alt={`Image ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                        {/* Active indicator */}
                        {currentImageIndex === idx && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute inset-0 bg-purple-600/20 flex items-center justify-center"
                          >
                            <div className="w-3 h-3 bg-purple-600 rounded-full shadow-lg"></div>
                          </motion.div>
                        )}
                        {/* Image number */}
                        <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-2 py-0.5 rounded-full font-semibold">
                          {idx + 1}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Next Button */}
            {filteredImages[selectedGallery].images.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                className="absolute right-4 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-10"
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            )}
          </motion.div>
        )}

        {/* Empty State */}
        {filteredImages.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              No images found in this category
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
