import { createClient } from "redis";


export async function redisClient(){
    const port = process.env.REDIS_PORT as string
    const host = process.env.REDIS_HOST as string
    const client = createClient({
        url: `redis://${host}:${port}`
    });

    client.on('error', (err) => console.log('REDIS: error', err))
    await client.connect();
    return client;
}