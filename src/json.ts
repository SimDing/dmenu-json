// source: https://github.com/Microsoft/TypeScript/issues/15225#issuecomment-294718709
export type JSONObject = { [key: string]: JSON };
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface JSONArray extends Array<JSON> {}
export type JSON = null | string | number | boolean | JSONArray | JSONObject;
