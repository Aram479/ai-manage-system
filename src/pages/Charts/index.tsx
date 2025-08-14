import styles from "./index.less";
import PieCharts from "./cpns/PieCharts";
import BarCharts from "./cpns/BarCharts";
import LineCharts from "./cpns/LineCharts";
import WaterfallCharts from "./cpns/WaterfallCharts";
import StockCharts from "./cpns/StockCharts";

const ChartsPage = () => {
  return (
    <div className={`${styles.chartsPage} dap-main-content`}>
      <div style={{ fontSize: "18px", fontWeight: "bold", marginBottom: 8 }}>
        请输入：随机生成 饼图/柱状图/折线图/瀑布图/股票图
      </div>
      <PieCharts />
      <BarCharts />
      <LineCharts />
      <WaterfallCharts />
      <StockCharts />
    </div>
  );
};

export default ChartsPage;
