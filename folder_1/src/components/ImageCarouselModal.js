import React from "react";
import "./ImageCarouselModal.css";

const ImageCarouselModal = ({ images, currentIndex, onClose, onNext, onPrev }) => {
  if (!images || images.length === 0) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>✕</button>
        <img src={images[currentIndex]} alt={`Slide ${currentIndex}`} className="carousel-image" />
        <div className="carousel-controls">
          <button onClick={onPrev}>◀</button>
          <button onClick={onNext}>▶</button>
        </div>
      </div>
    </div>
  );
};

export default ImageCarouselModal;
