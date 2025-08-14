import { useChatEvent } from "@/hooks/useChatEvent";
import { ChartToolsEvents, TChartTools } from "@/tools/chartsTools";
import { Waterfall, WaterfallConfig } from "@ant-design/charts";
import { useMemo, useState } from "react";

const WaterfallCharts = () => {
  const [datas, setDatas] = useState<any[]>([]);
  const [config, setConfig] = useState<WaterfallConfig | unknown>({});

  const waterfallConfig = useMemo<WaterfallConfig>(() => {
    return {
      data: [],
      xField: "",
      yField: "",
      ...(config || {}),
    };
  }, [datas, config]);

  useChatEvent<TChartTools>((event) => {
    if (event.name === ChartToolsEvents.Create_WaterfallCharts) {
      setDatas(event.datas ?? []);
      setConfig(event.config);
    }
  });
  return (
    <div>{!!datas.length && <Waterfall {...waterfallConfig} data={datas} />}</div>
  );
};

export default WaterfallCharts;
