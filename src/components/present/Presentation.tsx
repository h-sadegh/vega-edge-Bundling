import React, { useEffect } from "react";
import { select } from "../vega/Vega";

const Presentation = ({ data }: { data: any }) => {
  useEffect(() => {
    // console.log("select : ", select);
  }, [select]);

  const item = data?.data?.[2].values.find((i: any) => i.id === select);

  return <div>{/*<div>{data.data[2].values}</div>*/}</div>;
};

export default Presentation;
