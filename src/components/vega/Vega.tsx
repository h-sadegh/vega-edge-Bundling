import React, { useCallback, useEffect, useState } from "react";
import { defaultSpec } from "./Vega.spec";
import { Vega } from "react-vega";
import { Handler } from "vega-tooltip";
import useDimensions from "../../hook/UseDimensions";
import { useList } from "../../api/Register";
import Register from "../register";
import { Button } from "antd";
import Presentation from "../present/Presentation";
import MouseRotate from "../mouse/MouseRotate";

export let select: number | undefined = undefined;
const VegaGraph = () => {
  const [spec, setSpec] = useState<any>();
  const [refresh, setRefresh] = useState<any>();
  const [add, setAdd] = useState<boolean>();
  const [dependencies, setDependencies] = useState<any>([]);

  const { innerWidth, innerHeight } = useDimensions();

  const { data } = useList({ refresh });

  const handleAdd = useCallback(() => {
    setAdd(!add);
  }, [add]);
  const handleAddSuccess = useCallback(() => {
    setAdd(!add);
    setRefresh(new Date());
  }, [add]);
  const onMouseMove = useCallback(
    (x: number, y: number) => {
      const spec2 = { ...spec };
      if (spec2?.signals) {
        spec2.signals.find((i: any) => i.name === "rotate").value =
          spec2.signals.find((i: any) => i.name === "rotate").value +
          (Math.abs(y) < 100
            ? x < 0
              ? -x
              : x
            : Math.abs(x) < 100
              ? y < 0
                ? -y
                : y
              : -y) /
            100;
        setSpec(spec2);
      }
    },
    [spec],
  );

  console.log(
    "spec : ",
    spec?.signals?.find((i: any) => i.name === "rotate"),
  );

  useEffect(() => {
    if (!innerWidth || !data) return;
    setSpec(
      defaultSpec({
        height: innerHeight * 0.8,
        width: innerWidth * 0.8,
        radius: Math.round(
          Math.min(270, innerWidth * (innerWidth < 900 ? 0.15 : 0.15)),
        ),
        textSize: Math.round(
          Math.min(8, innerWidth * (innerWidth < 900 ? 0.01 : 0.02)),
        ),
        data,
        dependencies,
      }),
    );
  }, [innerWidth, innerHeight, data]);

  const addDependencies = useCallback(
    (source: number, target: number) => {
      const spec2 = { ...spec };
      if (spec2?.data?.[2]?.values) {
        spec2.data[2].values = [...spec.data[2].values, { source, target }];
        setSpec(spec2);
      } else {
        console.log("--- : ", spec);
      }
    },
    [spec],
  );

  const handleHover = (...args: any[]) => {
    if (args[0] === "click") {
      if (select) {
        addDependencies(select, args[1]);
        select = undefined;
      } else {
        select = args[1];
      }
    }
  };

  const signalListeners = {
    active: handleHover,
    click: handleHover,
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
      }}
    >
      <div style={{ maxWidth: "50%" }}>
        {spec && (
          <MouseRotate onPosition={onMouseMove}>
            <Vega
              spec={spec}
              signalListeners={signalListeners}
              tooltip={new Handler().call}
            />
          </MouseRotate>
        )}
      </div>
      {add && <Register onSuccess={handleAddSuccess} />}
      <Button onClick={handleAdd}>{add ? "Close" : "Add Item"}</Button>
      <Presentation data={spec} />
    </div>
  );
};

export default VegaGraph;
