import { Col, Flex, Popover, Row, Tag, Tooltip } from "antd";
import { useModel } from "@umijs/max";
import { FireOutlined, HeartOutlined } from "@ant-design/icons";
import useForceUpdate from "@/hooks/useForceUpdate";
import styles from "./index.less";

interface ICategoryCard {
  items?: IAgentCategoryRole[];
}

const CategoryCard = (props: ICategoryCard) => {
  const { items } = props;
  const { agentRole, setAgentRoleAction } = useModel("agent");
  const forceUpdate = useForceUpdate();
  const handleAgentRole = (roleRecord: IAgentCategoryRole) => {
    setAgentRoleAction(roleRecord);
    forceUpdate();
  };

  return (
    <div className={styles.categoryCard}>
      <Row className={styles.cardsBox}>
        {items?.map((item) => (
          <Col key={item.key} span={6} onClick={() => handleAgentRole(item)}>
            <Flex
              className={`${styles.cardItemBox} ${
                agentRole.current?.key === item.key ? styles.activeItemBox : ""
              }`}
              justify="space-between"
              vertical
            >
              <div className={styles.textContentBox}>
                {/* 标题 */}
                <div className={styles.titleText}>{item.title}</div>
                {/* 描述 */}
                <Tooltip title={item.desc} arrow={false}>
                  <div className={`${styles.descText} doubleLine`}>
                    {item.desc}
                  </div>
                </Tooltip>
              </div>
              {!item.hideFooter && (
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
              )}
            </Flex>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default CategoryCard;
