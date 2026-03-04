import AgentChart from "@/components/AgentChart";
import { useChatEvent } from "@/hooks/useChatEvent";
import { stockDatas } from "@/services/api/charts/StockMockData";
import { ChartToolsEvents, TChartTools } from "@/tools/chartsTools";
import { Stock, StockConfig } from "@ant-design/charts";
import { useMemo, useState } from "react";

const StockCharts = () => {
  const [datas, setDatas] = useState<any[]>(stockDatas);
  const [config, setConfig] = useState<StockConfig | unknown>({});

  const stockConfig = useMemo<StockConfig>(() => {
    return {
      data: [],
      xField: "trade_date",
      yField: ["open", "close", "high", "low"],
      ...(config || {}),
    };
  }, [datas, config]);

  useChatEvent<TChartTools>((event) => {
    if (event.name === ChartToolsEvents.Create_StockCharts) {
      setDatas(event.datas ?? []);
      setConfig(event.config);
    }
  });
  
  return (
    <div>
      {!!datas.length && (
        <AgentChart
          chartConfig={stockConfig}
          tools={[
            ChartToolsEvents.Create_StockCharts,
            ChartToolsEvents.Update_StockCharts,
          ]}
          onAgentChat={(chartInfo) => {
            setDatas(chartInfo.datas);
            setConfig(chartInfo.config);
          }}
        >
          <Stock {...stockConfig} data={datas} />
        </AgentChart>
      )}
    </div>
  );
};

export default StockCharts;
