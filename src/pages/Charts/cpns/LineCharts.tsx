import { useMemo, useState } from "react";
import { Line, LineConfig } from "@ant-design/charts";
import { lineDatas } from "@/services/api/charts/LineMockData";
import { ChartToolsEvents } from "@/tools/chartsTools";
import AgentChart from "@/components/AgentChart";

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
