// Is this correct?
declare module 'jason.db' {

  interface DatabaseOptions {
    renameFile?: boolean;
    writeFile?: boolean;
  }

  interface CollectionOptions {
    caching?: boolean;
  }

  interface PoggersEncryptorOptions {
    charList?: ' {}()[]<>|°¬.,_-:;"\'¡!¿?#$%&+/\\*`´~^=@\n\ráéíóúÁÉÍÓÚ1234567890ABCDEFGHIJKLMNÑOPQRSTUVWXYZabcdefghijklmnñopqrstuvwxyz';
  }

  export class DB {
    constructor(path: string, options: DatabaseOptions);
    public readonly path: string;
    private _tmpFilePath: string;
    private _collections: string;
    private _read(): object;
    private _write(): boolean;
    private _setCollection(collection: string, data: any): boolean;
    public collection(name: string, options?: CollectionOptions): Collection;
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

  class PoggersDB {
    constructor(path: string, options: DatabaseOptions);
    public options: DatabaseOptions;
    public readonly path: string;
    private _read(callback: (err: any, data: object) => void): Promise<object>;
    private _write(data: string, callback: (err: any) => Promise<Collection>): Promise<void>;
    private _setCollection(collection: string, data: object, callback: (err: any) => void): Promise<void>;
    public collection(collection: string, options: CollectionOptions, callback: (err: any, collection: Collection) => void): Promise<Collection>;
    public clear(callback: (err: any) => void): Promise<void>;
  }

  class PoggersEncryptor {
    constructor(options: PoggersEncryptorOptions);
    public encrypt(data: string): string;
    public decrypt(data: string): string;
  }
}
