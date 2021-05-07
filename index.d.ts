// Is this correct?
declare module 'jason.db' {

  interface DatabaseOptions {
    renameFile?: boolean;
    writeFile?: boolean;
  }

  interface PoggersDatabaseOptions {
    renameFile?: boolean;
    writeFile?: boolean;
    EncryptorOptions?: PoggersEncryptorOptions;
  }

  interface CollectionOptions {
    caching?: boolean;
  }

  interface PoggersEncryptorOptions {
    charList?: string;
    joinString?: string;
  }

  interface FileNameDatabaseOptions {
    startString?: string;
    endString?: string;
  }

  export class DB {
    constructor(path: string, options: DatabaseOptions);
    public readonly path: string;
    private _tmpFilePath: string;
    private _collections: string;
    private _read(): object;
    private _write(data: object): boolean;
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
    constructor(path: string, options: PoggersDatabaseOptions);
    public readonly path: string;
    private _tmpFilePath: string;
    private _collections: string;
    private _read(): object;
    private _write(data: object): boolean;
    private _setCollection(collection: string, data: any): boolean;
    public collection(name: string, options?: CollectionOptions): Collection;
    public clear(boolean: boolean): boolean;
  }

  class FileNameDB {
    constructor(folder: string, options: FileNameDatabaseOptions);
    public readonly folder: string;
    private _tmpFilePath: string;
    private _collections: string;
    private _getFile(): string;
    private _read(): object;
    private _write(data: object): boolean;
    private _clean(data: object): string;
    private _parse(string: string): object;
    private _setCollection(collection: string, data: any): boolean;
    public collection(name: string, options?: CollectionOptions): Collection;
    public clear(boolean: boolean): boolean;
  }

  class PoggersEncryptor {
    constructor(options: PoggersEncryptorOptions);
    public encrypt(data: string): string;
    public decrypt(data: string): string;
  }
}
