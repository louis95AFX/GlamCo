import { useEffect, useState } from "react";
import photos from "./carousel-photos.json";

export default function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setPlaying(!preference.matches);
    const updateVisibility = () => setVisible(!document.hidden);

    updatePreference();
    updateVisibility();

    preference.addEventListener("change", updatePreference);
    document.addEventListener("visibilitychange", updateVisibility);

    return () => {
      preference.removeEventListener("change", updatePreference);
      document.removeEventListener("visibilitychange", updateVisibility);
    };
  }, []);

  useEffect(() => {
    if (!playing || hovered || focused || !visible || photos.length < 2) return;

    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % photos.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, [playing, hovered, focused, visible]);

  function changePhoto(nextIndex) {
    setPlaying(false);
    setIndex((nextIndex + photos.length) % photos.length);
  }

  return (
    <div
      className="hero-photo academy-carousel"
      role="region"
      aria-roledescription="carousel"
      aria-label="Glam Co Academy photos"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setFocused(false);
        }
      }}
    >
      <div
        className="carousel-slide"
        role="group"
        aria-roledescription="slide"
        aria-label={`${index + 1} of ${photos.length}`}
      >
        <img
          src={photos[index].src}
          alt={photos[index].alt}
          fetchPriority="high"
        />
      </div>

      <div className="photo-caption">
        <span>A NEW CHAPTER STARTS HERE</span>
        <p>Learn. Grow. Become.</p>
      </div>

      {photos.length > 1 && (
        <div className="carousel-controls">
          <div className="carousel-buttons">
            <button
              type="button"
              aria-label="Previous photo"
              onClick={() => changePhoto(index - 1)}
            >
              Previous
            </button>

            <span className="carousel-counter">
              {index + 1} / {photos.length}
            </span>

            <button
              type="button"
              aria-label="Next photo"
              onClick={() => changePhoto(index + 1)}
            >
              Next
            </button>

            <button
              type="button"
              aria-label={playing ? "Pause automatic slideshow" : "Play automatic slideshow"}
              onClick={() => setPlaying((current) => !current)}
            >
              {playing ? "Pause" : "Play"}
            </button>
          </div>

          <div className="carousel-dots" aria-label="Choose a photo">
            {photos.map((photo, photoIndex) => (
              <button
                key={photo.src}
                type="button"
                className={index === photoIndex ? "active" : ""}
                aria-label={`Show photo ${photoIndex + 1}`}
                aria-current={index === photoIndex ? "true" : undefined}
                onClick={() => changePhoto(photoIndex)}
              >
                <span />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
