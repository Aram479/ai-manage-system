import { Welcome, WelcomeProps } from "@ant-design/x";
import { Card } from "antd";
import styles from "./index.less";
import { SlackSquareOutlined } from "@ant-design/icons";

interface IWelcomeCmp extends WelcomeProps {}

const WelcomeCmp = (props: IWelcomeCmp) => {
  const { title = "Hello, I'm Ant Design X" } = props;
  return (
    <div className={styles.welcomeCmp}>
      <Card style={{ borderRadius: 0 }}>
        <Welcome
          className={styles.welcome}
          icon={
            <SlackSquareOutlined
              style={{
                fontSize: 70,
              }}
            />
          }
          title={title}
          description="当前页面接入了DeepSeek"
        />
      </Card>
    </div>
  );
};

export default WelcomeCmp;
