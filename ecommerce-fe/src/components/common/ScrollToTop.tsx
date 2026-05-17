import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Scrolls the window back to the top whenever the route pathname changes.
 * Mount once near the top of the tree (e.g. inside the BrowserRouter).
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
