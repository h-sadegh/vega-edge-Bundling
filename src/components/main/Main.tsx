import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { ConfigProvider } from "antd";
import VegaGraph from "../vega";

const Main = () => {
  const [queryClient] = React.useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider>
        <VegaGraph />
      </ConfigProvider>
    </QueryClientProvider>
  );
};

export default Main;
