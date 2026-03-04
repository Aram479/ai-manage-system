import { useState } from "react";
import { Col, Empty, Flex, Row, Tooltip } from "antd";
import { FireOutlined, HeartOutlined } from "@ant-design/icons";
import { useAgentRoleContext } from "@/context/AgentRoleContext";
import styles from "./index.less";

interface ICategoryCard {
  open?: boolean;
  items?: IAgentCategoryRole[];
}

const CategoryCard = (props: ICategoryCard) => {
  const { items } = props;
  const { selectRole, updateSelectRole } = useAgentRoleContext();
  const handleAgentRole = (roleRecord: IAgentCategoryRole) => {
    updateSelectRole?.(roleRecord);
  };

  return (
    <div className={styles.categoryCard}>
      <Row className={styles.cardsBox}>
        {!!items?.length ? (
          items?.map((item) => (
            <Col key={item.key} span={6} onClick={() => handleAgentRole(item)}>
              <Flex
                className={`${styles.cardItemBox} ${
                  selectRole?.key === item.key ? styles.activeItemBox : ""
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
          ))
        ) : (
          <Col span={24}>
            <Flex align="center" justify="center">
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            </Flex>
          </Col>
        )}
      </Row>
    </div>
  );
};

export default CategoryCard;
