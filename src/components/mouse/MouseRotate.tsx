import { useState, useRef } from "react";
import exp from "node:constants";

function MouseRotate({
  rootClass = "",
  children,
  onPosition,
}: {
  rootClass?: string;
  children?: any;
  onPosition?: (x: number, y: number) => void;
}) {
  const ourRef = useRef(null);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const mouseCoords = useRef({
    startX: 0,
    startY: 0,
    scrollLeft: 0,
    scrollTop: 0,
  });
  const [isScrolling, setIsScrolling] = useState(false);
  const handleDragStart = (e: any) => {
    if (!ourRef.current) return;
    // @ts-ignore
    const slider = ourRef.current.children[0];
    const startX = e.pageX - slider.offsetLeft;
    const startY = e.pageY - slider.offsetTop;
    const scrollLeft = slider.scrollLeft;
    const scrollTop = slider.scrollTop;
    mouseCoords.current = { startX, startY, scrollLeft, scrollTop };
    setIsMouseDown(true);
    document.body.style.cursor = "grabbing";
  };
  const handleDragEnd = () => {
    setIsMouseDown(false);
    if (!ourRef.current) return;
    document.body.style.cursor = "default";
  };
  const handleDrag = (e: any) => {
    if (!isMouseDown || !ourRef.current) return;
    e.preventDefault(); // @ts-ignore

    const slider = ourRef.current.children[0];
    const x = e.pageX - slider.offsetLeft;
    const y = e.pageY - slider.offsetTop;
    const walkX = (x - mouseCoords.current.startX) * 1.5;
    const walkY = (y - mouseCoords.current.startY) * 1.5;
    slider.scrollLeft = mouseCoords.current.scrollLeft - walkX;
    slider.scrollTop = mouseCoords.current.scrollTop - walkY;
    onPosition && onPosition(walkX, walkY);
  };

  return (
    <div
      ref={ourRef}
      onMouseDown={handleDragStart}
      onMouseUp={handleDragEnd}
      onMouseMove={handleDrag}
      className={rootClass + "flex overflow-x-scroll"}
    >
      {children}
    </div>
  );
}

export default MouseRotate;
// export default function useMouseRotate() {
//   const [rotate, setRotate] = useState<number>();
//
//   const { innerWidth, innerHeight } = useDimensions();
//
//   useEffect(() => {
//     function handleRotate() {}
//     handleRotate();
//
//     window.addEventListener("mousemove", (e) => {
//       let angle =
//         Math.atan2(e.pageX - innerWidth * 0.5, -(e.pageY - innerHeight * 0.5)) *
//         (180 / Math.PI);
//       // console.log("angle : ", angle);
//     });
//     return () => window.removeEventListener("mousemove", handleRotate);
//   }, []); // eslint-disable-line react-hooks/exhaustive-deps
//
//   return rotate;
// }
