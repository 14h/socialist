import * as redis from 'redis';

import { Callback, ClientOpts, Multi, RedisClient } from 'redis';

import { promisify } from 'util';

export const get_redis_client = (param?: redis.ClientOpts) =>
    redis.createClient(Object.assign(
        {},
        {
            host: process.env.REDIS_HOST,
            port: process.env.REDIS_PORT,
        } as any,
        param,
    ));

export class Database {
    private readonly _client: redis.RedisClient;

    public readonly get: (key: string) => Promise<string | undefined>;
    public readonly set: (key: string, val: string) => Promise<'OK'>;
    public readonly del: (key: string) => Promise<number>;
    public readonly exists: (key: string) => Promise<number>;
    public readonly scan: (key: string, ...keys: string[]) => Promise<[string, string[]]>;

    public readonly sadd: (set: string, ...keys: string[]) => Promise<number>;
    public readonly srem: (set: string, ...keys: string[]) => Promise<number>;
    public readonly sismember: (set: string, key: string) => Promise<number>;
    public readonly smembers: (set: string) => Promise<string[]>;

    public readonly zadd: (set: string, scrore: number, ...keys: string[]) => Promise<number>;
    public readonly zrem: (set: string, ...keys: string[]) => Promise<number>;
    public readonly zrange: (set: string, start: number, stop: number) => Promise<string[]>;

    public readonly hget: (hash: string, field: string) => Promise<string>;
    public readonly hset: (hash: string, field: string, value: string) => Promise<number>;
    public readonly hgetall: (hash: string) => Promise<{[key: string]: string}>;
    public readonly hkeys: (hash: string) => Promise<string[]>;
    public readonly hscan: (hash: string, key: string, ...keys: string[]) => Promise<[string, string[]]>;

    public readonly hmget: (hash: string, fields: string[]) => Promise<string[]>;
    public readonly hmset: (
        hash: string,
        map: (string | number) | { [key: string]: (string | number) } | (string | number)[],
        cb?: (err: Error | null, reply: 'OK') => void,
    ) => Promise<'OK'>;

    public readonly multi: (args?: (string | number | Callback<any>)[][]) => Multi;

    constructor(
        deps: { get_redis_client (options?: ClientOpts): RedisClient },
    ) {
        this._client = deps.get_redis_client();

        this.get = promisify(this._client.get.bind(this._client));
        this.set = promisify(this._client.set.bind(this._client));
        this.del = promisify(this._client.del.bind(this._client));
        this.exists = promisify(this._client.exists.bind(this._client));
        this.scan = promisify(this._client.scan.bind(this._client));

        this.sadd = promisify(this._client.sadd.bind(this._client));
        this.srem = promisify(this._client.srem.bind(this._client));
        this.sismember = promisify(this._client.sismember.bind(this._client));
        this.smembers = promisify(this._client.smembers.bind(this._client));

        this.zadd = promisify(this._client.zadd.bind(this._client));
        this.zrem = promisify(this._client.zrem.bind(this._client));
        this.zrange = promisify(this._client.zrange.bind(this._client));

        this.hget = promisify(this._client.hget.bind(this._client));
        this.hset = promisify(this._client.hset.bind(this._client));
        this.hgetall = promisify(this._client.hgetall.bind(this._client));
        this.hkeys = promisify(this._client.hkeys.bind(this._client));
        this.hscan = promisify(this._client.hscan.bind(this._client));

        this.hmget = promisify(this._client.hmget.bind(this._client));

        this.hmset = promisify(
            this._client.hmset.bind(this._client) as any as (
                key: string,
                arg1: (string | number) | { [key: string]: (string | number) } | (string | number)[],
                cb?: Callback<'OK'>,
            ) => any,
        );

        this.multi = this._client.multi.bind(this._client);
    }

    public static exec_multi(
        multi: Multi,
    ) {
        return promisify(multi.exec_atomic.bind(multi))();
    }
}
