import React, { useState } from "react";

const ImageCarouselCell = ({ folderName, onClickImage }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const images = Array.from({ length: 5 }, (_, i) => `/pictures/${folderName}/pic_${i + 1}.webp`);

  const prevImage = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextImage = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

//   <img
//   src={images[currentIndex]}
//   alt={`Image ${currentIndex + 1}`}
//   className="carousel-image"
//   onClick={() => onClickImage(images, currentIndex)} // trigger popup
//   style={{ cursor: "pointer" }}
// />

  return (
    <div className="carousel-cell">
     <div style={{ position: "relative" }}>
        <img
          src={images[currentIndex]}
          alt={`Image ${currentIndex + 1}`}
          className="carousel-image"
          onClick={() => onClickImage(images, currentIndex)}
          style={{ cursor: "pointer" }}
        />

        {/* Image counter overlaid on image */}
        <div className="carousel-image-counter-overlay">
          {currentIndex + 1} / {images.length}
        </div>
      </div>
       
      <div className="carousel-controls">
        <button onClick={prevImage}>←</button>
        <button onClick={nextImage}>→</button>
      </div>
    </div>
  );
};

const ModalCarousel = ({ images, startIndex, onClose }) => {
    const [currentIndex, setCurrentIndex] = useState(startIndex);
  
    const prevImage = () => {
      setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };
  
    const nextImage = () => {
      setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };
  
    return (
        <div className="modal-overlay">
             {/* Close Button -- move to div with position= relative if want inside the image*/}
          <button
            className="modal-close-button"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        {/* Image wrapper to position arrows inside the image area */}
        <div style={{ position: "relative" }}>
         
      
          {/* Left Arrow */}
          <button
            className="modal-arrow left"
            onClick={prevImage}
            aria-label="Previous"
          >
            ←
          </button>
      
          {/* Image */}
          <img
            src={images[currentIndex]}
            alt={`Popup image ${currentIndex + 1}`}
            className="modal-image"
          />
      
          {/* Right Arrow */}
          <button
            className="modal-arrow right"
            onClick={nextImage}
            aria-label="Next"
          >
            →
          </button>
        </div>
      </div>
      
    );
  };
  

  const ListingsImageCarausel = ({ folderNames = [], cols = 2, basePath = "" }) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [modalImages, setModalImages] = useState([]);
    const [modalIndex, setModalIndex] = useState(0);
  
    const openModal = (images, index) => {
      setModalImages(images);
      setModalIndex(index);
      setModalOpen(true);
    };
  
    return (
      <>
        <div
          className="grid-container"
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
            gap: "16px",
            padding: "20px",
          }}
        >
          {folderNames.map((folder, index) => (
            <ImageCarouselCell
              key={index}
              folderName={`${basePath}/${folder}`} // updated to include basePath
              onClickImage={openModal}
            />
          ))}
        </div>
        {modalOpen && (
          <ModalCarousel
            images={modalImages}
            startIndex={modalIndex}
            onClose={() => setModalOpen(false)}
          />
        )}
      </>
    );
  };

export default ListingsImageCarausel;
