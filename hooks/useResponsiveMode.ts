"use client";

import { useEffect, useState } from "react";

const MOBILE_QUERY = "(max-width: 767px)";
const TABLET_QUERY = "(min-width: 768px) and (max-width: 1024px)";

export function useResponsiveMode() {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    const mobileQuery = window.matchMedia(MOBILE_QUERY);
    const tabletQuery = window.matchMedia(TABLET_QUERY);

    const updateMatches = () => {
      setIsMobile(mobileQuery.matches);
      setIsTablet(tabletQuery.matches);
      setIsTouch(
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0
      );
    };

    updateMatches();
    mobileQuery.addEventListener("change", updateMatches);
    tabletQuery.addEventListener("change", updateMatches);

    return () => {
      mobileQuery.removeEventListener("change", updateMatches);
      tabletQuery.removeEventListener("change", updateMatches);
    };
  }, []);

  return {
    isMobile,
    isTablet,
    isDesktop: !isMobile && !isTablet,
    isTouch,
  };
}
