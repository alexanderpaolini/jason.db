// Is this correct?
declare module 'json-db' {
  export public class DB {
    constructor(path: string);
    private _read(): object;
    private _write(): boolean;
    private _cursor(): object;
    public set(collection: string, key: string, value: string): boolean;
    public get(collection: string, key: string): any;
    public has(collection: string, key: string): boolean;
    public clear(boolean: boolean): boolean;
  }
}