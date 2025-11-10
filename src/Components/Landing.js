import '../Stylesheets/Landing.css'
import { useEffect, useState } from 'react'
import bg1 from '../Images/IMG_4662.JPG'
import bg2 from '../Images/womensclass.jpeg'
import bg3 from '../Images/kids.jpeg'
import bg4 from '../Images/mt.jpg'
import bg6 from '../Images/Tony.jpg'
import bg8 from '../Images/kidstwo.jpg'
import bg9 from '../Images/maple-logo-new.jpg'
import TypewriterCycle from '../Utils/TypewriterCycle'

export default function Landing() {
  const images = [
    { src: bg6, alt: "Boxing" },
    { src: bg2, alt: "Women's class" },
    { src: bg1, alt: "BJJ class" },
    { src: bg3, alt: "Kids' class", right: true },
 
 
    { src: bg9, alt: "Maple Logo" },
  ]

  const interval = 3500 // ms per slide
  const transition = 1000 // fade duration in ms
  const [index, setIndex] = useState(0)
  const n = images.length

  // Cycle slides but stop at the last image
  useEffect(() => {
    if (n <= 1) return
    // Don't schedule another timeout if we're already at the last slide
    if (index >= n - 1) return

    const timer = setTimeout(() => {
      // advance but never pass the last index
      setIndex(i => Math.min(i + 1, n - 1))
    }, interval)

    return () => clearTimeout(timer)
  }, [index, n, interval])

  // Preload next slide (still fine)
  useEffect(() => {
    if (n <= 1) return
    const nextIndex = (index + 1) % n
    const img = new Image()
    img.src = images[nextIndex].src
  }, [index, images, n])

  return (
    <div className="landing-container">
      {images.map((img, i) => (
        <img
          key={i}
          src={img.src}
          alt={img.alt || ""}
          className={`landing-slide ${i === index ? "is-visible" : ""} ${img.right ? "image-right" : ""} ${img.smaller ? "image-smaller" : ""}`}
          style={{ transitionDuration: `${transition}ms` }}
          loading="lazy"
          decoding="async"
        />
      ))}
      <div className='image-container'></div>

      <TypewriterCycle texts={['www.maplebjj.com']}   startDelay = {16000} />
    </div>
  )
}
