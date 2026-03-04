import { Form, Input, InputNumber, Modal, Select } from "antd";
import { useEffect, useMemo, useState } from "react";
interface ITableAttrModal {
  open?: boolean;
  editor?: any;
  onOk?: () => void;
  onCancel?: () => void;
}
const TableAttrModal = (props: ITableAttrModal) => {
  const [form] = Form.useForm();
  const { open, editor, onOk, onCancel } = props;
  const [initialValues, setInitialValues] = useState({
    borderPosition: "all",
    borderStyle: "solid",
    borderSize: 2,
    borderColor: "#ced4da",
    cellHeight: 20,
    cellBackgroundColor: "#ffffff",
  });
  const [isBorderColor, setIsBorderColor] = useState(false);
  const [isBackgroundColor, setIsBackgroundColor] = useState(false);
  const isDisabled = useMemo<boolean>(
    () => !initialValues.borderPosition || !initialValues.borderStyle,
    [initialValues]
  );
  // 隐藏模态框
  const handleModalCancel = () => {
    setIsBackgroundColor(false);
    setIsBorderColor(false);
    onCancel?.();
  };

  // 模态框确认
  const handleModalOk = () => {
    const { borderPosition, borderStyle, borderSize, borderColor, cellBackgroundColor, cellHeight } =
      form.getFieldsValue();
    const borderStyleStr = `border: none; ${
      !borderPosition ? "" : borderPosition === "all" ? "border" : `border-${borderPosition}`
    }:${!borderPosition ? "" : !borderStyle ? "none" : `${borderSize}px ${borderStyle} ${borderColor}`}`;
    editor
      .chain()
      .focus()
      .setCellAttribute("style", `${borderStyleStr}; background-color: ${cellBackgroundColor}; height: ${cellHeight}px`)
      .run();
    onOk?.();
  };
  const handleFormValues = (values: any, allValues: any) => {
    if (!allValues.borderPosition) {
      allValues.borderStyle = "";
    }
    setInitialValues({ ...allValues });
  };

  // 颜色选择事件
  const handleColor = (color: string, key: string) => {
    if (key === "border") {
      initialValues.borderColor = color;
      // setIsBorderColor(false)
    } else if (key === "background") {
      initialValues.cellBackgroundColor = color;
      // setIsBackgroundColor(false)
    }
    setInitialValues({ ...initialValues });
  };
  useEffect(() => {
    form.setFieldsValue({
      ...initialValues,
    });
  }, [open, initialValues]);
  return (
    <>
      <Modal open={open} onCancel={handleModalCancel} onOk={handleModalOk} getContainer={document.body} destroyOnHidden>
        <Form
          form={form}
          layout={"vertical"}
          initialValues={initialValues}
          onValuesChange={handleFormValues}
          preserve={false}
        >
          <Form.Item label="边框位置" name="borderPosition">
            <Select
              options={[
                { value: "", label: "无" },
                { value: "all", label: "全部" },
                { value: "top", label: "上边框" },
                { value: "right", label: "右边框" },
                { value: "bottom", label: "下边框" },
                { value: "left", label: "左边框" },
              ]}
            ></Select>
          </Form.Item>

          <Form.Item label="边框样式" name="borderStyle">
            <Select
              disabled={!initialValues.borderPosition}
              options={[
                { value: "", label: "无" },
                { value: "dotted", label: "虚线" },
                { value: "solid", label: "实线" },
                { value: "double", label: "双线" },
                { value: "groove", label: "雕刻" },
                { value: "ridge", label: "浮雕" },
                { value: "inset", label: "凹显" },
                { value: "outset", label: "凸显" },
              ]}
            />
          </Form.Item>

          <Form.Item label="边框宽度" name="borderSize">
            <InputNumber min={1} disabled={isDisabled} />
          </Form.Item>

          <Form.Item label="边框颜色" name="borderColor">
            {/* <Tooltip
              color="transparent"
              trigger={(isDisabled) ? '' : 'click'}
              destroyTooltipOnHide
              open={isBorderColor}
              onOpenChange={(status) => setIsBorderColor(status)}
              placement='bottom'
              overlayInnerStyle={{ boxShadow: 'none' }}
              title={(<ColorSelector
                style={{ background: '#fff' }}
                visible={isBorderColor}
                onChange={({ color }) => handleColor(color, 'border')}
                onVisibleChange={(v: boolean) => setIsBorderColor(v)}
              />)}>
              <Button disabled={isDisabled} onClick={() => setIsBorderColor(true)} style={{ padding: '3px' }} icon={<div className="button_picker" style={{ background: `${initialValues.borderColor}` }}></div>}>
              </Button>
            </Tooltip> */}
            <Input
              type="color"
              disabled={isDisabled}
              style={{ width: 30, padding: "0" }}
              value={initialValues.borderColor}
              onBlur={(e) => handleColor(e.target.value, "border")}
            />
          </Form.Item>
          <Form.Item label="背景颜色" name="cellBackgroundColor">
            {/* <Tooltip
              color="transparent"
              trigger={(isDisabled) ? '' : 'click'}
              destroyTooltipOnHide
              open={isBackgroundColor}
              onOpenChange={(status) => setIsBackgroundColor(status)}
              placement='bottom'
              overlayInnerStyle={{ boxShadow: 'none' }}
              title={(<ColorSelector
                style={{ background: '#fff' }}
                visible={isBackgroundColor}
                onChange={({ color }) => handleColor(color, 'background')}
                onVisibleChange={(v: boolean) => setIsBackgroundColor(v)}
              />)}>
              <Button onClick={() => setIsBackgroundColor(true)} style={{ padding: '3px' }} icon={<div className="button_picker" style={{ backgroundColor: `${initialValues.cellBackgroundColor}` }}></div>}>
              </Button>
            </Tooltip> */}
            <Input
              type="color"
              style={{ width: 30, padding: "0" }}
              value={initialValues.cellBackgroundColor}
              onBlur={(e) => handleColor(e.target.value, "background")}
            />
          </Form.Item>
          <Form.Item label="行高" name="cellHeight">
            <InputNumber min={20} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default TableAttrModal;
