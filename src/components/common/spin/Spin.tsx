import { LoadingOutlined } from "@ant-design/icons";
import { Spin as AntSpin } from "antd";
import React from "react";

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

const Spin: React.FC<{
  size?: "small" | "default" | "large";
  spinning?: boolean;
  style?: any;
  indicator?: React.ReactElement<HTMLElement>;
}> = ({ size, spinning = true, style = {}, indicator = antIcon }) => (
  <AntSpin
    spinning={spinning}
    size={size}
    style={{ display: "block", ...style }}
    indicator={indicator}
  />
);

export default Spin;
