import styles from "./index.less";
import PieCharts from "./cpns/PieCharts";

const ChartsPage = () => {
  return (
    <div className={styles.chartsPage}>
      <div style={{ fontSize: "18px", fontWeight: "bold", marginBottom: 8 }}>
        请输入：随机生成饼图数据
      </div>
      <PieCharts />
    </div>
  );
};

export default ChartsPage;
