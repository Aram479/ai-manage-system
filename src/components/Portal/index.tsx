import { useEffect, useMemo } from "react";
import { createPortal } from "react-dom";

interface IPortalProps {
  target?: Element | DocumentFragment | null;
  targetClassName?: string;
  children?: React.ReactNode;
}
const Portal = (props: Partial<IPortalProps>) => {
  const { target, targetClassName, children } = props;
  const node = document.querySelector(`.${targetClassName}`);
  const targetNode = useMemo(() => {
    if (target) return target;
    if (targetClassName && node) {
      return node;
    }
    return null;
  }, [target, node]);

  useEffect(() => {}, []);
  return <div>{targetNode && createPortal(children, targetNode)}</div>;
};

export default Portal;
