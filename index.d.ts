// Is this correct?
declare module 'json-db' {
    export public class DB {
        constructor(path: string);
        private _readDB(): object;
        private _writeDB(): boolean;
        public saveToDB(collection: string, key: string, data: string): boolean;
        public getFromDB(collection: string, key: string): any;
        public clearDB(boolean: boolean): boolean;
    }
}