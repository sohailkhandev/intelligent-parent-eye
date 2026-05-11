import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Scrolls the window to the top when the route (pathname) changes and on first load.
 * Disables browser scroll restoration so the page always loads from the top.
 */
export const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    if (typeof window.history.scrollRestoration === "string") {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};
