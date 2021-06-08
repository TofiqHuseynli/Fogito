import { useState, useEffect } from "react";

export const useWindowDimensions = () => {
  const hasWindow = typeof window !== "undefined";

  function getBreakpoint(width) {
    if (width >= 992) {
      return "xl";
    } else if (width >= 768) {
      return "lg";
    } else if (width >= 576) {
      return "md";
    } else {
      return "sm";
    }
  }

  function getWindowDimensions() {
    const width = hasWindow ? window.innerWidth : null;
    const height = hasWindow ? window.innerHeight : null;
    const breakpoint = getBreakpoint(width);
    return {
      width,
      height,
      breakpoint,
    };
  }

  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );

  useEffect(() => {
    if (hasWindow) {
      const handleResize = () => {
        setWindowDimensions(getWindowDimensions());
      };

      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, [hasWindow]);

  return windowDimensions;
};
