export interface ResponseModel<T = void> {
  data: T;
  msg: string;
  returnCode: string;
}
