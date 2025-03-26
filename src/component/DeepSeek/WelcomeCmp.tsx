import { Welcome } from "@ant-design/x";
import { Card } from "antd";
import styles from "./index.less";
import { SlackSquareOutlined } from "@ant-design/icons";

const WelcomeCmp = () => {
  return (
    <div>
      <Card style={{ borderRadius: 0 }}>
        <Welcome
          className={styles.welcomeCmp}
          icon={
            <SlackSquareOutlined
              style={{
                fontSize: 70,
              }}
            />
          }
          title="Hello, I'm Ant Design X"
          description="当且页面接入了DeepSeek"
        />
      </Card>
    </div>
  );
};

export default WelcomeCmp;
