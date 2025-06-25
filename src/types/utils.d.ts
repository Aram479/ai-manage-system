// 定义工具类型，用于从 JSON Schema 中提取 TypeScript 类型
type JSONSchemaToType<T> = T extends { type: 'object'; properties: infer P; required?: infer R }
  ? {
      [K in keyof P]: K extends Extract<keyof P, R>
        ? JSONSchemaPropertyToType<P[K]> // 必填字段
        : JSONSchemaPropertyToType<P[K]> | undefined; // 可选字段
    }
  : never;

type JSONSchemaPropertyToType<T> =
  // 枚举类型
  T extends { type: 'string'; enum: infer E }
    ? E[number] extends {value: string} ? E[number]['value'] : E[number] // 映射为联合类型
    : // 数组类型
    T extends { type: 'array'; items: infer I }
    ? JSONSchemaPropertyToType<I>[] // 递归处理数组元素
    : // 对象类型
    T extends { type: 'object'; properties: infer P; required?: infer R }
    ? JSONSchemaToType<{ type: 'object'; properties: P; required?: R }> // 递归处理嵌套对象
    : // 基础类型
    T extends { type: 'integer' }
    ? number // 整数映射为 number
    : T extends { type: 'boolean' }
    ? boolean // 布尔值映射为 boolean
    : T extends { type: 'string'; format: 'date' }
    ? string // 日期格式映射为 string
    : T extends { type: infer PrimitiveType }
    ? PrimitiveType extends 'string'
      ? string // 字符串类型
      : PrimitiveType extends 'number'
      ? number // 数字类型
      : any // 其他类型默认为 any
    : any; // 无法推导时默认为 any

// 工具类型：提取函数参数类型
type ExtractFunctionParameters<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => {
    type: string;
    function: infer F extends import('openai/resources/beta/assistants.mjs')['function'];
  }
    ? JSONSchemaToType<F['parameters']>
    : T[K];
};

// 封装方法：根据 JSON Schema 自动生成 TypeScript 类型
function generateTypeFromSchema<T>(schema: T): JSONSchemaToType<T> {
  return {} as JSONSchemaToType<T>;
}

type TGetColumns = {
  filterData?: any;
  callback?: (record: any, type: string) => void;
  getLocal?: (key: string, values?: any) => any;
};