export enum MockApiTypeEnum {
  通用 = "0",
  设计规范 = "1",
  移动到 = "2",
  其他 = "3",
}

export interface MockApiInfoDTO {
  id: number;
  name: string;
  type: MockApiTypeEnum;
  author?: string;
  introduce?: string;
  updateTime?: string;
}
