import React, { useState } from "react";

const ImageCarouselCell = ({ folderName, listing }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const images = Array.from({ length: 5 }, (_, i) => `/pictures/${folderName}/pic_${i + 1}.webp`);
  
    const prevImage = () => {
      setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };
  
    const nextImage = () => {
      setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };
  
    return (
      <div className="carousel-cell">
        <img
          src={images[currentIndex]}
          alt={`Image ${currentIndex + 1}`}
          className="carousel-image"
        />
        <div className="carousel-controls">
          <button onClick={prevImage}>←</button>
          <button onClick={nextImage}>→</button>
        </div>
        {listing && (
          <div style={{ marginTop: "10px", padding: "0 8px" }}>
            <p><strong>Price:</strong> ${listing.price}</p>
            <p><strong>Bedrooms:</strong> {listing.beds}</p>
            <p><strong>Bathrooms:</strong> {listing.baths}</p>
          </div>
        )}
      </div>
    );
  };
  
  
  const ListingsImageCarausel = ({ folderNames = [], cols = 2 }) => {
    return (
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
          <ImageCarouselCell key={index} folderName={folder} />
        ))}
      </div>
    );
  };
  
  

export default ListingsImageCarausel;
