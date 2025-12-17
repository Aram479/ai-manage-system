import styles from "./index.less";
import PieCharts from "./cpns/PieCharts";
import BarCharts from "./cpns/BarCharts";
import LineCharts from "./cpns/LineCharts";
import WaterfallCharts from "./cpns/WaterfallCharts";
import StockCharts from "./cpns/StockCharts";
import { Card, Flex } from "antd";

const ChartsPage = () => {
  return (
    <div className={`${styles.chartsPage} dap-main-content`}>
      <Flex vertical gap={8}>
        <Card>
          <PieCharts />
        </Card>
        <Card>
          <BarCharts />
        </Card>
        <Card>
          <LineCharts />
        </Card>
        <Card>
          <WaterfallCharts />
        </Card>
        <Card>
          <StockCharts />
        </Card>
      </Flex>
    </div>
  );
};

export default ChartsPage;
