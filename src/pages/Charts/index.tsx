import styles from "./index.less";
import PieCharts from "./cpns/PieCharts";
import BarCharts from "./cpns/BarCharts";

const ChartsPage = () => {
  return (
    <div className={`${styles.chartsPage} dap-main-content`}>
      <div style={{ fontSize: "18px", fontWeight: "bold", marginBottom: 8 }}>
        请输入：随机生成饼图/柱状图数据
      </div>
      <PieCharts />
      <BarCharts />
    </div>
  );
};

export default ChartsPage;
