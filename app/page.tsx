"use client";

import { Button } from "@/components/ui/button"
import { Features } from "@/components/feature-section"
import { useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollToPlugin);

export default function Home() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const firstComponentRef = useRef<HTMLDivElement>(null);
  const secondComponentRef = useRef<HTMLDivElement>(null);
  const [isAnimated, setIsAnimated] = useState(false);
  const [showReset, setShowReset] = useState(false);

  const title = "MAYLNG";
  const description = "email client and service for humans + ai.";

  const resetPage = () => {
    const tl = gsap.timeline({
      onComplete: () => {
        // After all animations, reset the innerHTML to remove spans
        if (titleRef.current) {
          titleRef.current.innerHTML = title;
        }
        if (descriptionRef.current) {
          descriptionRef.current.innerHTML = description;
        }
        
        // Reset state variables
        setIsAnimated(false);
        setShowReset(false);
        gsap.set("body", { overflow: "auto" });
      }
    });

    // 1. Animate letters flying back up
    tl.to(".letter", {
      y: 0,
      x: 0,
      rotation: 0,
      duration: 1.5,
      ease: "power2.inOut",
      stagger: {
        amount: 0.8,
        from: "random"
      }
    });

    // 2. Scroll back to top at the same time
    tl.to(window, {
      scrollTo: { y: 0 },
      duration: 1.5,
      ease: "power2.inOut"
    }, 0); // Start at time 0 of the timeline

    // 3. Hide the second component while scrolling up
    if (secondComponentRef.current) {
      tl.to(secondComponentRef.current, {
        opacity: 0,
        duration: 0.5,
        onComplete: () => {
          secondComponentRef.current?.classList.remove('flex', 'flex-col', 'items-center', 'justify-center');
          secondComponentRef.current?.classList.add('hidden');
          
          // Also reset the individual feature cards and loading card state here
          gsap.set("#loading-card", { opacity: 1, scale: 1, zIndex: 20, display: "block" });
          const cards = document.querySelectorAll(".feature-card");
          cards.forEach((card, index) => {
            gsap.set(card, { 
              opacity: 0, 
              x: 0, 
              y: 0, // Reset to center position (behind loading card)
              zIndex: 15 - index
            });
          });
        }
      }, 0);
    }
  };

  const handleStartClick = () => {
    // Split title text into individual letters
    if (titleRef.current) {
      const titleText = titleRef.current.textContent || "";
      titleRef.current.innerHTML = titleText
        .split("")
        .map((letter, index) => 
          `<span class="letter" data-index="${index}" style="display: inline-block; position: relative; z-index: 10;">${letter === " " ? "&nbsp;" : letter}</span>`
        )
        .join("");
    }

    // Split description text into individual letters
    if (descriptionRef.current) {
      const descText = descriptionRef.current.textContent || "";
      descriptionRef.current.innerHTML = descText
        .split("")
        .map((letter, index) => 
          `<span class="letter" data-index="${index}" style="display: inline-block; position: relative; z-index: 10;">${letter === " " ? "&nbsp;" : letter}</span>`
        )
        .join("");
    }

    // Create timeline for coordinated animation
    const tl = gsap.timeline();

    // Set initial overflow to hidden to prevent scrollbars during animation
    gsap.set("body", { overflow: "hidden" });

    // Initially hide the second component
    gsap.set(secondComponentRef.current, { opacity: 0 });

    // Animate letters falling down and settling in the bottom div area
    tl.to(".letter", {
      y: window.innerHeight + 400, // Fall further down to settle in the bottom div area
      x: () => gsap.utils.random(-100, 100), // Add horizontal drift
      rotation: () => gsap.utils.random(-720, 720), // More rotation
      duration: () => gsap.utils.random(2, 4), // Slightly longer duration
      ease: "power2.out", // Smoother ease
      stagger: {
        amount: 0.5, // Tighter stagger
        from: "random"
      }
    });

    // Keep letters visible as they pile up on the loading card
    // (Remove the opacity fade out so letters stay visible)

    // Follow the letters as they fall - animate the viewport using scroll (start immediately with letters)
    tl.to(window, {
      scrollTo: { y: window.innerHeight * 0.8 },
      duration: 3,
      ease: "power2.inOut"
    }, 0); // Start at the same time as the letters begin falling

    // Fade in the second component as camera scrolls down - overlap with letter disappearing
    tl.call(() => {
      // First make it visible by removing hidden class and adding flex
      if (secondComponentRef.current) {
        secondComponentRef.current.classList.remove('hidden');
        secondComponentRef.current.classList.add('flex', 'flex-col', 'items-center', 'justify-center');
        // Set initial opacity to 0 for fade in
        gsap.set(secondComponentRef.current, { opacity: 0 });
      }
    }, [], "-=1.8"); // Start showing component while letters are still disappearing
    
    tl.to(secondComponentRef.current, {
      opacity: 1,
      duration: 0.8,
      ease: "power2.inOut"
    }, "-=1.6"); // Begin fade-in while letters are mid-disappear

    // After second component fades in, start the loading sequence
    tl.call(() => {
      // Start the loading card animation after a brief delay
      setTimeout(() => {
        // Fade out loading card and lower its z-index
        gsap.to("#loading-card", {
          opacity: 0,
          scale: 0.95,
          duration: 0.6,
          ease: "power2.out",
          onComplete: () => {
            // Lower z-index and hide the loading card after fade out
            gsap.set("#loading-card", { zIndex: 5, display: "none" });
          }
        });
        
        // Set initial state for individual feature cards (stacked behind loading card at same position)
        const cards = document.querySelectorAll(".feature-card");
        cards.forEach((card, index) => {
          gsap.set(card, { 
            opacity: 0,
            x: "0px", // Start at center position (same as loading card)
            y: "0px", // Start at center position (same as loading card)
            zIndex: 15 - index // Cards have z-index 15, 14, 13, 12 (loading card is z-20)
          });
        });
        
        // Keep the fallen letters in their position - no dispersal animation
        // Letters remain piled where they fell on the loading card
        
        // First, make cards visible as loading card fades
        gsap.to(cards, {
          opacity: 1,
          duration: 0.6,
          ease: "power2.out",
          delay: 0.1, // Start slightly after loading card begins fading
          stagger: 0.05
        });
        
        // Then animate cards from center to their final row positions (emerging from behind loading card)
        setTimeout(() => {
          const rowPositions = [
            { x: "-450px", y: "0px" }, // Far left
            { x: "-150px", y: "0px" }, // Center left
            { x: "150px", y: "0px" },  // Center right
            { x: "450px", y: "0px" }   // Far right
          ];
          
          cards.forEach((card, index) => {
            gsap.to(card, {
              x: rowPositions[index].x,
              y: rowPositions[index].y,
              duration: 1.2,
              ease: "back.out(1.4)",
              delay: index * 0.1
            });
          });
        }, 400); // Start earlier to overlap with loading card fade
      }, 700); // Wait 700 milliseconds after second component is visible
    }, [], "-=0.2");

    // Final settle - scroll to show the second component
    tl.to(window, {
      scrollTo: { y: window.innerHeight },
      duration: 2.5,
      ease: "power2.out"
    }, "-=0.5");

    // After animation completes, restore scroll functionality and reset
    tl.call(() => {
      gsap.set("body", { overflow: "auto" });
      setIsAnimated(true);
      
      // Show reset button after 1.5 seconds
      setTimeout(() => {
        setShowReset(true);
      }, 1500);
    });
  };

  return (
    <div>
      <div ref={firstComponentRef} className="flex flex-col items-center justify-center min-h-screen pb-20 font-[family-name:var(--font-orbitron)] relative">
        <h1 ref={titleRef} className="font-extrabold text-3xl md:text-5xl">{title}</h1>
        <div className="space-y-1 w-full text-center md:mt-3">
          <p ref={descriptionRef} className="text-sm md:text-2xl md:mb-3 px-4">
            {description}
          </p>
          {!isAnimated ? (
            <Button variant="default" className="cursor-pointer" onMouseDown={handleStartClick}>
              Explore
            </Button>
          ) : showReset ? (
            <Button variant="outline" className="cursor-pointer" onClick={resetPage}>
              Reset
            </Button>
          ) : null}
        </div>
      </div>
      {/* Second component - initially hidden, fades in during animation */}
      <div ref={secondComponentRef} className="hidden min-h-screen p-8 font-[family-name:var(--font-orbitron)]">
        <div className="flex flex-col items-center justify-center h-full w-full mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">Why Choose MAYLNG?</h2>
          
          <div className="relative w-full min-h-[400px] flex items-center justify-center">
            {/* Loading card - initially visible with higher z-index, positioned absolutely */}
            <div id="loading-card" className="absolute bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10 max-w-md z-20 left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="flex items-center justify-center space-x-3">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <h3 className="text-xl font-semibold">Loading features...</h3>
              </div>
              <div className="mt-4 space-y-2">
                <div className="h-3 bg-gray-600/50 rounded animate-pulse"></div>
                <div className="h-3 bg-gray-600/30 rounded animate-pulse w-3/4"></div>
              </div>
            </div>
            
            {/* Feature cards - individual cards stacked behind loading card, positioned absolutely */}
            <div className="absolute inset-0 flex items-center justify-center">
              <Features enableAnimation={true} />
            </div>
          </div>
          
          <div className="mt-0 text-center relative z-30">
            {/* Empty div for fallen letters to settle in */}
          </div>
        </div>
      </div>
    </div>
  );
}

