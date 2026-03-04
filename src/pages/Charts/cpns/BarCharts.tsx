import AgentChart from "@/components/AgentChart";
import { useChatEvent } from "@/hooks/useChatEvent";
import { barDatas } from "@/services/api/charts/BarMockData";
import { ChartToolsEvents, TChartTools } from "@/tools/chartsTools";
import { Column, ColumnConfig } from "@ant-design/charts";
import { useMemo, useState } from "react";

const BarCharts = () => {
  const [datas, setDatas] = useState<any[]>(barDatas);
  const [config, setConfig] = useState<ColumnConfig | unknown>({});

  const barConfig = useMemo<ColumnConfig>(() => {
    return {
      data: barDatas,
      xField: "type",
      yField: "sales",
      label: {
        // 可手动配置 label 数据标签位置
        position: "middle",
        // 'top', 'bottom', 'middle',
        // 配置样式
        style: {
          fill: "#FFFFFF",
          opacity: 0.6,
        },
      },
      xAxis: {
        label: {
          autoHide: true,
          autoRotate: false,
        },
      },
      meta: {
        type: {
          alias: "类别",
        },
        sales: {
          alias: "销售额",
        },
      },
      ...(config || {}),
    };
  }, [datas, config]);

  useChatEvent<TChartTools>((event) => {
    if (event.name === ChartToolsEvents.Create_BarCharts) {
      setDatas(event.datas ?? []);
      setConfig(event.config);
    }
  });

  return (
    <div>
      {!!datas.length && (
        <AgentChart
          chartConfig={barConfig}
          tools={[
            ChartToolsEvents.Create_BarCharts,
            ChartToolsEvents.Update_BarCharts,
          ]}
          onAgentChat={(chartInfo) => {
            setDatas(chartInfo.datas);
            setConfig(chartInfo.config);
          }}
        >
          <Column {...barConfig} data={datas} />
        </AgentChart>
      )}
    </div>
  );
};

export default BarCharts;
