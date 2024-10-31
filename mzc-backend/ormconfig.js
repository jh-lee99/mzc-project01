const SnakeNamingStrategy = require("typeorm-naming-strategies").SnakeNamingStrategy
const isTS = require('detect-ts-node');

module.exports = {
  name: "default",
  type: process.env.DB_TYPE,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  // host: "localhost",
  // port: "3306",
  // username: "boarduser",
  // password: "boardpass",
  // database: "boarddb",
  // replication: {
  //   master: {
  //     host: "192.168.10.101",
  //     port: 3306,
  //     username: "boarduser",
  //     password: "boardpass",
  //     database: "boarddb"
  //   },
  //   slaves: [{
  //     host: "192.168.10.101",
  //     port: 3307,
  //     username: "boarduser",
  //     password: "boardpass",
  //     database: "boarddb"
  //   },]
  // },
  synchronize: true,
  logging: false,
  namingStrategy: new SnakeNamingStrategy(),
  entities: isTS ? ["src/entity/**/*.ts"] : ["dist/entity/**/*.js"],
  migrations: isTS ? ["src/migration/**/*.ts"] : ["dist/migration/**/*.js"],
  subscribers: isTS ? ["src/subscriber/**/*.ts"] : ["dist/subscriber/**/*.js"],
};
