import AgentChart from "@/components/AgentChart";
import { pieDatas } from "@/services/api/charts/PieMockData";
import { ChartToolsEvents } from "@/tools/chartsTools";
import { Pie, PieConfig } from "@ant-design/charts";
import { useMemo, useState } from "react";

const PieCharts = () => {
  const [datas, setDatas] = useState<any[]>(pieDatas);
  const [config, setConfig] = useState<PieConfig | unknown>({});

  const pieConfig = useMemo<PieConfig>(() => {
    return {
      data: pieDatas,
      appendPadding: 10,
      angleField: "value",
      colorField: "type",
      radius: 0.9,
      label: {
        type: "inner",
        offset: "-30%",
        content: ({ percent }) => `${(percent * 100).toFixed(0)}%`,
        style: {
          fontSize: 14,
          textAlign: "center",
        },
      },
      interactions: [
        {
          type: "element-active",
        },
      ],
      ...(config || {}),
    };
  }, [datas, config]);

  // useChatEvent<TChartTools>((event) => {
  //   if (event.name === ChartToolsEvents.Create_PieCharts) {
  //     setDatas(event.datas ?? []);
  //     setConfig(event.config);
  //   }
  // });

  return (
    <div>
      {!!datas.length && (
        <AgentChart
          chartConfig={pieConfig}
          tools={[
            ChartToolsEvents.Create_PieCharts,
            ChartToolsEvents.Update_PieCharts,
          ]}
          onAgentChat={(chartInfo) => {
            setDatas(chartInfo.datas);
            setConfig(chartInfo.config);
          }}
        >
          <Pie {...pieConfig} data={datas} />
        </AgentChart>
      )}
    </div>
  );
};

export default PieCharts;
