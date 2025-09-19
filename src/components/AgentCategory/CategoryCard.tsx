import { Col, Flex, Row, Tag } from "antd";
import styles from "./index.less";
import { FireOutlined, HeartOutlined } from "@ant-design/icons";
import { useModel } from "@umijs/max";

interface ICategoryCard {
  items?: IAgentCategoryRole[];
}

const CategoryCard = (props: ICategoryCard) => {
  const { items } = props;
  const { agentRole, setAgentRoleAction } = useModel("agent");

  const handleAgentRole = (roleRecord: IAgentCategoryRole) => {
    setAgentRoleAction(roleRecord);
  };
  
  return (
    <div className={styles.categoryCard}>
      <Row className={styles.cardsBox}>
        {items?.map((item) => (
          <Col key={item.title} span={6} onClick={() => handleAgentRole(item)}>
            <Flex
              className={styles.cardItemBox}
              justify="space-between"
              vertical
            >
              <div className={styles.textContentBox}>
                {/* 标题 */}
                <div className={styles.titleText}>{item.title}</div>
                {/* 描述 */}
                <div className={`${styles.descText} doubleLine`}>
                  {item.desc}
                </div>
              </div>
              <div className={styles.footerBox}>
                <Flex gap={20}>
                  <Flex gap={5}>
                    <HeartOutlined />
                    <span>{item.collect}</span>
                  </Flex>
                  <Flex gap={5}>
                    <FireOutlined />
                    <span>{item.hot}</span>
                  </Flex>
                </Flex>
              </div>
            </Flex>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default CategoryCard;
