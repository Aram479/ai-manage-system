import AgentChart from "@/components/AgentChart";
import { useChatEvent } from "@/hooks/useChatEvent";
import { waterfallDatas } from "@/services/api/charts/WaterfallMockData";
import { ChartToolsEvents, TChartTools } from "@/tools/chartsTools";
import { Waterfall, WaterfallConfig } from "@ant-design/charts";
import { useMemo, useState } from "react";

const WaterfallCharts = () => {
  const [datas, setDatas] = useState<any[]>(waterfallDatas);
  const [config, setConfig] = useState<WaterfallConfig | unknown>({});

  const waterfallConfig = useMemo<WaterfallConfig>(() => {
    return {
      data: [],
      xField: "type",
      yField: "money",
      appendPadding: [15, 0, 0, 0],
      meta: {
        type: {
          alias: "类别",
        },
        money: {
          alias: "收支",
          formatter: (v) => `${v} 元`,
        },
      },
      label: {
        style: {
          fontSize: 10,
          fill: "rgba(0,0,0,0.65)",
        },
        layout: [
          {
            type: "interval-adjust-position",
          },
        ],
      },
      total: {
        label: "总支出",
        style: {
          fill: "#96a6a6",
        },
      },
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
    <div>
      {!!datas.length && (
        <AgentChart
          chartConfig={waterfallConfig}
          tools={[
            ChartToolsEvents.Create_WaterfallCharts,
            ChartToolsEvents.Update_WaterfallCharts,
          ]}
          onAgentChat={(chartInfo) => {
            setDatas(chartInfo.datas);
            setConfig(chartInfo.config);
          }}
        >
          <Waterfall {...waterfallConfig} data={datas} />
        </AgentChart>
      )}
    </div>
  );
};

export default WaterfallCharts;
