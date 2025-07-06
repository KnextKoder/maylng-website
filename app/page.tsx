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

    // Fade in the second component as camera scrolls down
    tl.call(() => {
      // First make it visible by removing hidden class and adding flex
      if (secondComponentRef.current) {
        secondComponentRef.current.classList.remove('hidden');
        secondComponentRef.current.classList.add('flex', 'flex-col', 'items-center', 'justify-center');
        // Set initial opacity to 0 for fade in
        gsap.set(secondComponentRef.current, { opacity: 0 });
      }
    }, [], "-=1.5");
    
    tl.to(secondComponentRef.current, {
      opacity: 1,
      duration: 1.5,
      ease: "power2.inOut"
    }, "-=1.4");

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
      <div ref={firstComponentRef} className="flex flex-col items-center justify-center min-h-screen p-8 pb-20 sm:p-20 font-[family-name:var(--font-orbitron)] relative">
        <h1 ref={titleRef} className="font-extrabold md:text-5xl">{title}</h1>
        <div className="space-y-2 w-full text-center md:mt-3">
          <p ref={descriptionRef} className="md:text-2xl md:mb-6">
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
        <div className="flex flex-col items-center justify-center h-full">
          <h2 className="text-2xl font-bold mb-4">Welcome to the next phase</h2>
          <p className="text-center">This is where the story continues...</p>
        </div>
      </div>
    </div>
  );
}

