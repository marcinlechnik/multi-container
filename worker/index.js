import redis from "redis";
import { KEYS } from "./keys";

const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000,
});
const subscription = redisClient.duplicate();

const getFibAtIndex = (index) => {
  if (index < 2) return 1;

  return getFibAtIndex(index - 1) + getFibAtIndex(index - 2);
};

// const getFibAtIndex = (index) =>
//   Array.from({ length: index + 1 }).reduce(
//     (previous, current) => {
//       if (index < 2) return [...previous, 1];

//       return [...previous, previous[index - 1] + previous[index - 2]];
//     },
//     []
//   )[index];

subscription.on("message", (_, message) => {
  redisClient.hset("values", message, getFibAtIndex(parseInt(message)));
});
subscription.subscribe("insert");
