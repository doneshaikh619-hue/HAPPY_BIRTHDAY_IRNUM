/**
 * Aceternity-style 3D Card Tilt & Dynamic Spotlight Component
 * Inspired by 21st.dev luxury interaction patterns.
 */

export function init3DTilt(selector = ".tilt-card") {
  const cards = document.querySelectorAll(selector);

  cards.forEach((card) => {
    const glare = card.querySelector(".card-glare");

    const handleMouseMove = (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Calculate tilt angles (constrained for luxury subtlety)
      const rotateX = ((y - centerY) / centerY) * -12;
      const rotateY = ((x - centerX) / centerX) * 12;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;

      if (glare) {
        glare.style.opacity = "1";
        glare.style.background = `radial-gradient(circle 240px at ${x}px ${y}px, rgba(212, 175, 55, 0.22), transparent 70%)`;
      }
    };

    const handleMouseLeave = () => {
      card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
      card.style.transition = "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)";
      if (glare) {
        glare.style.opacity = "0";
        glare.style.transition = "opacity 0.6s ease";
      }
    };

    const handleMouseEnter = () => {
      card.style.transition = "transform 0.15s ease-out";
      if (glare) {
        glare.style.transition = "none";
      }
    };

    card.addEventListener("mousemove", handleMouseMove);
    card.addEventListener("mouseleave", handleMouseLeave);
    card.addEventListener("mouseenter", handleMouseEnter);
  });
}
