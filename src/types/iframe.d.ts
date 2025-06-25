// iframe Message
type IframeMessageType = {
  type: string;
  payload?: any;
};

type IframeMessageHandler = (data: MessageType, event: MessageEvent) => void;