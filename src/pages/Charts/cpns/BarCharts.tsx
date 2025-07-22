import { useChatEvent } from "@/hooks/useChatEvent";
import { ChartToolsEvents, TChartTools } from "@/tools/chartsTools";
import { Column, ColumnConfig } from "@ant-design/charts";
import { useMemo, useState } from "react";

const BarCharts = () => {
  const [datas, setDatas] = useState<any[]>([]);

  const barConfig = useMemo<ColumnConfig>(() => {
    return {
      data: [],
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
    };
  }, [datas]);

  useChatEvent<TChartTools>((event) => {
    if (event.name === ChartToolsEvents.Create_BarCharts) {
      setDatas(event.datas ?? []);
    }
  });

  return (
    <div>
      <Column {...barConfig} data={datas} />
    </div>
  );
};

export default BarCharts;
