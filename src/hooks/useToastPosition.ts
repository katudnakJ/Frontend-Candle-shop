"use client";

import { useState, useEffect } from "react";

export const useToastPosition = () => {
  const [position, setPosition] = useState<"top-right" | "top-center">("top-right");

  useEffect(() => {
    const updatePosition = () => {
      if (window.innerWidth < 640) { 
        setPosition("top-center");
      } else {
        setPosition("top-right");
      }
    };

    updatePosition(); 
    window.addEventListener("resize", updatePosition);
    return () => window.removeEventListener("resize", updatePosition);
  }, []);

  return position;
};