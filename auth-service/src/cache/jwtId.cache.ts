import redis from "redis";

const REDIS_URL = process.env.REDIS_URL;
if (!REDIS_URL) throw new Error("REDIS_URL not found!");

const client = redis.createClient(REDIS_URL);

export const storeJwtIdInCache = async (
  jwtId: string,
  val: string
): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    client.set(jwtId, val, (err, reply) => {
      if (err) return reject(false);
      return resolve(Boolean(reply));
    });
  });
};

export const checkJwtIdInCache = async (
  jwtId: string
): Promise<string | null> => {
  return new Promise((resolve, reject) => {
    client.get(jwtId, (err, reply) => {
      if (err) return reject(err);
      return resolve(reply);
    });
  });
};

export const deleteJwtFromCache = async (jwtId: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    client.del(jwtId, (err) => {
      if (err) return reject(err);
      return resolve(true);
    });
  });
};
