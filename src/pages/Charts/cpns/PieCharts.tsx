import { useChatEvent } from "@/hooks/useChatEvent";
import { ChartToolsEvents, TChartTools } from "@/tools/chartsTools";
import { Pie, PieConfig } from "@ant-design/charts";
import { useMemo, useState } from "react";

const PieCharts = () => {
  const [datas, setDatas] = useState<any[]>([]);
  const [config, setConfig] = useState<PieConfig | unknown>({});

  const pieConfig = useMemo<PieConfig>(() => {
    return {
      data: [],
      angleField: "", // 扇形弧度(对应值)
      colorField: "", // 扇形颜色(对应分类)
      ...(config || {}),
    };
  }, [datas, config]);

  useChatEvent<TChartTools>((event) => {
    if (event.name === ChartToolsEvents.Create_PieCharts) {
      setDatas(event.datas ?? []);
      setConfig(event.config);
    }
  });
  return <div>{!!datas.length && <Pie {...pieConfig} data={datas} />}</div>;
};

export default PieCharts;
