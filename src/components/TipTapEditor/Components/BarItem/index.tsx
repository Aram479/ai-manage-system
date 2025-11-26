import { CSSProperties } from "react";
import "./index.less";

// import remixiconUrl from 'remixicon/fonts/remixicon.symbol.svg'
import "remixicon/fonts/remixicon.css";
interface IBarItem {
  style?: CSSProperties;
  icon?: string;
  title?: string;
  isActive?: () => {};
  onClick?: () => void;
}
const BarItem = (props: IBarItem) => {
  const {
    icon,
    title = "",
    isActive = false,
    style,
    onClick = () => {},
  } = props;

  const handleIcon = () => {
    onClick?.();
  };
  return (
    <>
      <button
        className={`menu-item ${isActive && isActive?.() ? " is-active" : ""}`}
        onClick={handleIcon}
        title={title}
        style={style}
      >
        <i className={`ri-${icon}`}></i>
      </button>
    </>
  );
};
export default BarItem;
