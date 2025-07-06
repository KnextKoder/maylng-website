"use client";

import { Button } from "@/components/ui/button"
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
    // Reset text content
    if (titleRef.current) {
      titleRef.current.innerHTML = title;
    }
    if (descriptionRef.current) {
      descriptionRef.current.innerHTML = description;
    }

    // Reset second component to hidden state
    if (secondComponentRef.current) {
      secondComponentRef.current.classList.remove('flex', 'flex-col', 'items-center', 'justify-center');
      secondComponentRef.current.classList.add('hidden');
      gsap.set(secondComponentRef.current, { opacity: 0 });
    }

    // Reset loading card and feature cards
    gsap.set("#loading-card", { opacity: 1, scale: 1, zIndex: 20 });
    
    // Reset each card to its initial position behind loading card (all centered)
    const cards = document.querySelectorAll(".feature-card");
    if (cards.length >= 4) {
      cards.forEach(card => {
        gsap.set(card, { 
          opacity: 0, 
          left: "50%", 
          top: "0%", 
          marginLeft: "-12rem" 
        });
      });
    }

    // Scroll back to top smoothly
    gsap.to(window, {
      scrollTo: { y: 0 },
      duration: 1,
      ease: "power2.out",
      onComplete: () => {
        setIsAnimated(false);
        setShowReset(false);
        gsap.set("body", { overflow: "auto" });
      }
    });
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

    // Animate letters falling down and disappearing mid-fall
    tl.to(".letter", {
      y: window.innerHeight + 10, // Just 10px past first component
      rotation: () => gsap.utils.random(-360, 360),
      duration: () => gsap.utils.random(1.5, 3),
      ease: "bounce.out",
      stagger: {
        amount: 0.8,
        from: "random"
      }
    });

    // Hide letters mid-fall (start hiding much earlier)
    tl.to(".letter", {
      opacity: 0,
      duration: 0.5,
      ease: "power2.out",
      stagger: {
        amount: 0.3,
        from: "random"
      }
    }, "-=2"); // Start hiding 2 seconds before letters finish falling

    // Follow the letters as they fall - animate the viewport using scroll
    tl.to(window, {
      scrollTo: { y: window.innerHeight * 0.8 },
      duration: 3,
      ease: "power2.inOut"
    }, 0.5);

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
            // Lower z-index after fade out to prevent interference
            gsap.set("#loading-card", { zIndex: 5 });
          }
        });
        
        // Set initial positions for cards (all move to center behind loading card)
        const cards = document.querySelectorAll(".feature-card");
        gsap.set(cards[0], { x: "50%", y: "100%" }); // Top Left moves from center-right-down
        gsap.set(cards[1], { x: "-50%", y: "100%" }); // Top Right moves from center-left-down  
        gsap.set(cards[2], { x: "50%", y: "-100%" }); // Bottom Left moves from center-right-up
        gsap.set(cards[3], { x: "-50%", y: "-100%" }); // Bottom Right moves from center-left-up
        
        // Animate all feature cards simultaneously back to their natural grid positions
        gsap.to(cards, {
          opacity: 1,
          x: "0%",
          y: "0%",
          duration: 1.5,
          ease: "back.out(1.7)",
          delay: 0.3
        });
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
              Get Started
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
          
          <div className="relative w-full min-h-[400px]">
            {/* Loading card - initially visible with higher z-index */}
            <div id="loading-card" className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10 mx-auto max-w-md relative z-20">
              <div className="flex items-center justify-center space-x-3">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <h3 className="text-xl font-semibold">Loading features...</h3>
              </div>
              <div className="mt-4 space-y-2">
                <div className="h-3 bg-gray-600/50 rounded animate-pulse"></div>
                <div className="h-3 bg-gray-600/30 rounded animate-pulse w-3/4"></div>
              </div>
            </div>
            
            {/* Feature cards grid - proper CSS grid that animates from center */}
            <div className="absolute top-0 left-0 right-0 z-10 grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
              {/* Feature 1 - Top Left */}
              <div className="feature-card bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10 opacity-0">
                <h3 className="text-xl font-semibold mb-3">Better Email Client</h3>
                <p className="text-gray-300">A superior email experience that surpasses Gmail with modern features designed for today&apos;s workflows.</p>
              </div>
              
              {/* Feature 2 - Top Right */}
              <div className="feature-card bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10 opacity-0">
                <h3 className="text-xl font-semibold mb-3">Agent Identities</h3>
                <p className="text-gray-300">Create permanent or temporary identities for your AI agents, giving them the email presence they need.</p>
              </div>
              
              {/* Feature 3 - Bottom Left */}
              <div className="feature-card bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10 opacity-0">
                <h3 className="text-xl font-semibold mb-3">Developer SDKs</h3>
                <p className="text-gray-300">Comprehensive SDKs to integrate MAYLNG with your favorite tools and platforms effortlessly.</p>
              </div>
              
              {/* Feature 4 - Bottom Right */}
              <div className="feature-card bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10 opacity-0">
                <h3 className="text-xl font-semibold mb-3">Seamless Integration</h3>
                <p className="text-gray-300">Simple and seamless integration process that gets you up and running in minutes, not hours.</p>
              </div>
            </div>
          </div>
          
          <div className="mt-12 text-center relative z-30">
            <p className="text-lg text-gray-400 mb-6">Ready to revolutionize your email experience?</p>
            <Button variant="default" className="px-8 py-3 text-lg">
              Start Building
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

