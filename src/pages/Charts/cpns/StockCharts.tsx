import { useChatEvent } from "@/hooks/useChatEvent";
import { ChartToolsEvents, TChartTools } from "@/tools/chartsTools";
import { Stock, StockConfig } from "@ant-design/charts";
import { useMemo, useState } from "react";

const StockCharts = () => {
  const [datas, setDatas] = useState<any[]>([]);
  const [config, setConfig] = useState<StockConfig | unknown>({});

  const stockConfig = useMemo<StockConfig>(() => {
    return {
      data: [],
      xField: "",
      yField: ["", "", "", ""] as const,
      ...(config || {}),
    };
  }, [datas, config]);

  useChatEvent<TChartTools>((event) => {
    if (event.name === ChartToolsEvents.Create_StockCharts) {
      setDatas(event.datas ?? []);
      setConfig(event.config);
    }
  });
  return <div>{!!datas.length && <Stock {...stockConfig} data={datas} />}</div>;
};

export default StockCharts;
