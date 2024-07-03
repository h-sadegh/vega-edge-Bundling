import { useState, useEffect } from "react";
function getWindowDimensions() {
  const { width, height } = window.screen;
  const innerWidth = window.innerWidth;
  const innerHeight = window.innerHeight;
  return {
    width,
    height,
    innerWidth,
    innerHeight,
  };
}

export default function useDimensions() {
  const [windowDimensions, setWindowDimensions] = useState({
    width: 0,
    height: 0,
    innerWidth: 0,
    innerHeight: 0,
    windowInnerWidth: 0,
  });

  useEffect(() => {
    function handleResize() {
      setWindowDimensions({
        windowInnerWidth: window.innerWidth,
        ...getWindowDimensions(),
      });
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return windowDimensions;
}
