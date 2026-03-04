import { useMemo, useState } from "react";
import { Line, LineConfig } from "@ant-design/charts";
import { lineDatas } from "@/services/api/charts/LineMockData";
import { ChartToolsEvents, TChartTools } from "@/tools/chartsTools";
import AgentChart from "@/components/AgentChart";
import { useChatEvent } from "@/hooks/useChatEvent";

const LineCharts = () => {
  const [datas, setDatas] = useState<any[]>(lineDatas);
  const [config, setConfig] = useState<LineConfig | unknown>({});

  const lineConfig = useMemo<LineConfig>(() => {
    return {
      data: datas,
      padding: "auto",
      xField: "Date",
      yField: "scales",
      xAxis: {
        // type: 'timeCat',
        tickCount: 5,
      },
      ...(config || {}),
    };
  }, [datas, config]);

  useChatEvent<TChartTools>((event) => {
    if (event.name === ChartToolsEvents.Create_LineCharts) {
      setDatas(event.datas ?? []);
      setConfig(event.config);
    }
  });

  return (
    <div>
      {!!datas.length && (
        <AgentChart
          chartConfig={lineConfig}
          tools={[
            ChartToolsEvents.Create_LineCharts,
            ChartToolsEvents.Update_LineCharts,
          ]}
          onAgentChat={(chartInfo) => {
            setDatas(chartInfo.datas);
            setConfig(chartInfo.config);
          }}
        >
          <Line {...lineConfig} data={datas} />
        </AgentChart>
      )}
    </div>
  );
};

export default LineCharts;
