'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface ImageCarouselProps {
  images: string[];
  title: string;
}

export default function ImageCarousel({ images, title }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showGrid, setShowGrid] = useState(false);
  const [showFullscreen, setShowFullscreen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (images.length > 1) {
      const timer = setInterval(() => {
        handleNext();
      }, 5000);

      return () => clearInterval(timer);
    }
  }, [images.length]);

  const handlePrevious = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    setTimeout(() => setIsTransitioning(false), 1300);
  };

  const handleNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    setTimeout(() => setIsTransitioning(false), 1300);
  };

  const getImageClasses = (index: number) => {
    if (index === currentIndex) {
      return 'opacity-100 scale-100';
    }
    return 'opacity-0 scale-105';
  };

  const GridPortal = () => {
    if (!mounted) return null;

    return createPortal(
      <div 
        className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
        onClick={() => setShowGrid(false)}
      >
        <button
          className="absolute top-4 right-4 text-white hover:text-gray-300"
          onClick={() => setShowGrid(false)}
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Grid de imagens */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-7xl mx-auto">
          {images.map((image, index) => (
            <div
              key={index}
              className="relative aspect-square cursor-pointer group overflow-hidden rounded-lg"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImageIndex(index);
                setShowFullscreen(true);
              }}
            >
              <img
                src={image}
                alt={`${title} - Imagem ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
            </div>
          ))}
        </div>
      </div>,
      document.body
    );
  };

  const FullscreenPortal = () => {
    if (!mounted) return null;

    return createPortal(
      <div 
        className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
        onClick={(e) => {
          e.stopPropagation();
          setShowFullscreen(false);
        }}
      >
        <button
          className="absolute top-4 right-4 text-white hover:text-gray-300"
          onClick={(e) => {
            e.stopPropagation();
            setShowFullscreen(false);
          }}
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <button
          className="absolute left-4 text-white hover:text-gray-300"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
          }}
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <img
          src={images[selectedImageIndex]}
          alt={`${title} - Imagem ${selectedImageIndex + 1}`}
          className="max-h-[90vh] max-w-[90vw] object-contain"
        />

        <button
          className="absolute right-4 text-white hover:text-gray-300"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedImageIndex((prevIndex) => (prevIndex + 1) % images.length);
          }}
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Indicador de posição */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {images.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                index === selectedImageIndex ? 'bg-white' : 'bg-white/50'
              }`}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImageIndex(index);
              }}
            />
          ))}
        </div>
      </div>,
      document.body
    );
  };

  return (
    <>
      <div 
        className="relative aspect-square cursor-pointer group overflow-hidden rounded-lg shadow-lg"
        onClick={() => setShowGrid(true)}
      >
        {/* Container das imagens com transição */}
        <div className="relative w-full h-full">
          {images.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-all duration-1000 ease-in-out ${getImageClasses(index)}`}
            >
              <img
                src={image}
                alt={`${title} - Imagem ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
        
        {/* Indicador de múltiplas imagens */}
        {images.length > 1 && (
          <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded-full text-sm">
            {currentIndex + 1}/{images.length}
          </div>
        )}

        {/* Overlay com efeito hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
      </div>

      {/* Portais para grid e visualização em tela cheia */}
      {showGrid && <GridPortal />}
      {showFullscreen && <FullscreenPortal />}
    </>
  );
} 