// Is this correct?
declare module 'jason.db' {

  interface DatabaseOptions {
    renameFile?: boolean;
    writeFile?: boolean;
  }

  interface CollectionOptions {
    caching?: boolean
  }

  export class DB {
    constructor(path: string, options: DatabaseOptions);
    public readonly path: string;
    private _tmpFilePath: string;
    private _collections: string;
    private _read(): object;
    private _write(): boolean;
    private _setCollection(collection: string, data: any): boolean;
    public collection(name: string, options?: DatabaseOptions): Collection;
    public clear(boolean: boolean): boolean;
  }
  class Collection {
    constructor(name: string, options: CollectionOptions, Database: DB);
    public options: object;
    public readonly name: string;
    private _db: DB;
    private _read(): object;
    private _write(data: any): boolean;
    private _cursor(key: string, value: any): object;
    public push(key: string, value: any): [any];
    public set(key: string, value: any): boolean;
    public get(key: string): any;
    public has(key: string): boolean;
  }
}
