import { useChatEvent } from "@/hooks/useChatEvent";
import { ChartToolsEvents, TChartTools } from "@/tools/chartsTools";
import { Line, LineConfig } from "@ant-design/charts";
import { useMemo, useState } from "react";

const LineCharts = () => {
  const [datas, setDatas] = useState<any[]>([]);
  const [config, setConfig] = useState<LineConfig | unknown>({});

  const lineConfig = useMemo<LineConfig>(() => {
    return {
      data: [],
      ...(config || {}),
    };
  }, [datas, config]);

  useChatEvent<TChartTools>((event) => {
    if (event.name === ChartToolsEvents.Create_LineCharts) {
      setDatas(event.datas ?? []);
      setConfig(event.config);
    }
  });
  return <div>{!!datas.length && <Line {...lineConfig} data={datas} />}</div>;
};

export default LineCharts;
