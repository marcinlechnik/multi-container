import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import pg from "pg";
import redis from "redis";
import { KEYS } from "./keys.js";

const { Pool } = pg;
const app = express();
app.use(cors());
app.use(bodyParser.json());

const pgClient = new Pool({
  user: KEYS.pgUser,
  host: KEYS.pgHost,
  database: KEYS.pgDatabase,
  password: KEYS.pgPassword,
  port: KEYS.pgPort,
});

pgClient.on("connect", (client) => {
  client
    .query("CREATE TABLE IF NOT EXISTS values (number INT)")
    .catch((err) => console.error(err));
});

const redisClient = redis.createClient({
  host: KEYS.redisHost,
  port: KEYS.redisPort,
  retry_strategy: () => 1000,
});
const redisSubscription = redisClient.duplicate();

app.get("/", (_, response) => {
  response.send("Hello");
});

app.get("/values/all", async (_, response) => {
  const values = await pgClient.query("SELECT * from values");

  response.send(values.rows);
});

app.get("/values/current", async (_, response) => {
  redisClient.hgetall("values", (_, values) => {
    response.send(values);
  });
});

app.post("/values", async (request, response) => {
  const index = request.body.index;

  if (parseInt(index) > 40) {
    return response.status(422).send("Index too high");
  }

  redisClient.hset("values", index, "Nothing yet!");
  redisSubscription.publish("insert", index);
  pgClient.query("INSERT INTO values(number) VALUES($1)", [index]);

  response.send({ working: true });
});

app.listen(5000, (_) => {
  console.log("Listening");
});
