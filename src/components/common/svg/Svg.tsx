import React, { forwardRef, Ref, useEffect, useRef, useState } from "react";
import { ImageProps } from "antd";

const Svg = forwardRef(function Svg(props: React.ImgHTMLAttributes<any>) {
  return <image {...props} />;
});

const SVG = (props: any) => {
  const ref = useRef(null);
  const [isServer, setIsServer] = useState<boolean>(true);

  useEffect(() => {
    setIsServer(false);
  }, []);

  return (
    <Svg
      ref={ref}
      alt={props.alt || ""}
      {...props}
      style={{
        ...props.style,
      }}
    />
  );
};

export default SVG;
