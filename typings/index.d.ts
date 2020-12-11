// Is this correct?
declare module 'json-db' {

  interface DatabaseOptions {
    caching?: boolean;
  }

  export class DB {
    constructor(path: string, options: DatabseOptions);
    private _read(): object;
    private _write(): boolean;
    private _setCollection(collection: string, data: any): boolean;
    public collection(name: string): Collection;
    public clear(boolean: boolean): boolean;
  }
  class Collection {
    constructor(name: string, Database: DB);
    private _read(): object;
    private _write(data: any): boolean;
    private _cursor(key: string, value: any): object;
    public push(key: string, value: string): [any];
    public set(key: string, value: string): boolean;
    public get(key: string): any;
    public has(key: string): boolean;
  }
}