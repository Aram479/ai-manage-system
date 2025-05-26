import { Bar } from "@ant-design/charts";
import { useMemo, useState } from "react";

const BarCharts = () => {
  const [data, setData] = useState([
    {
      count: 10,
      type: "类型1",
    },
    {
      count: 20,
      type: "类型2",
    },
    {
      count: 30,
      type: "类型3",
    },
  ]);

  const pieConfig = useMemo(() => {
    return {
      data: [],
      angleField: "count", // 扇形弧度(对应值)
      colorField: "type", // 扇形颜色(对应分类)
      // height: 300,
      radius: 0.8, // 饼图半径：(0,1]
      // animation: false, // 是否开启动画
      // innerRadius: 0.7, // 饼图内半径：(0,1]
      autoFit: true, // 是否自适应宽高
      padding: 0, // 内边距：值越大圆越小，反之则越大，数组：[上、右、下、左]
      appendPadding: [-15, 0, 20, 0], // appendPadding同上
      label: {
        callback: () => {
          return {
            type: "spider", // 长折线: spider  内嵌: inner
            // name -> data的type  百分比：{percentage}
            // content: (item) => `${item.formartLabelValue}`,
            autoRotate: false,
            offset: "12%", // 文字居中一点
            style: {
              fontSize: 14,
              fontWeight: "bold",
              textAlign: "center", // 文字水平居中
              textBaseline: "middle",
            },
          };
        },
      },
      // 图例
      legend: {
        position: "bottom",
        flipPage: false, // 是否分页
        // offsetY: 265,
        // title: {
        //   text: '标题',
        // },
        // padding: [30, 30, 30, 30], // [上、右、下、左]
      },
      tooltip: {
        shared: true,
        showCrosshairs: false,
        showMarkers: false,
        // customItems: (data) => {
        //   // 格式化浮窗数据
        //   const currentData = data[0];
        //   return [
        //     {
        //       ...currentData,
        //       value: currentData.data.formartValue,
        //     },
        //   ];
        // },
      },
      pieStyle: {
        cursor: "pointer", // 鼠标样式
      },
      interactions: [
        // {
        //   type: 'element-selected',
        // },
        {
          type: "element-active",
        },
      ],
      // 标题
      // annotations: [
      //   {
      //     type: 'text',
      //     position: ['22%', '25%'], // [left, top]
      //     content: '占比/\n数量',
      //     style: {
      //       fill: '#000',
      //       fontSize: 20,
      //       textAlign: 'center',
      //     },
      //     offsetX: 0,
      //     offsetY: 0, // 向下偏移
      //   },
      // ],

      // 环形图中心内容
      // statistic: {
      //   title: false,
      //   // 中心内容样式
      //   content: {
      //     style: {
      //       fontSize: "20px",
      //       whiteSpace: "pre-wrap",
      //       overflow: "hidden",
      //       textOverflow: "ellipsis",
      //     },
      //     content: "分类",
      //   },
      // },
    };
  }, [data]);
  return (
    <div>
      <Bar {...pieConfig} data={data} />
    </div>
  );
};

export default BarCharts;
