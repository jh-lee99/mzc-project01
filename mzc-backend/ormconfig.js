const SnakeNamingStrategy = require("typeorm-naming-strategies").SnakeNamingStrategy

module.exports = {
  "type": "mysql",
  "host": process.env.DATABASE_HOST,
  "port": process.env.DATABASE_PORT,
  "username": process.env.DATABASE_USER,
  "password": process.env.DATABASE_PASSWORD,
  "database": process.env.DATABASE_DBNAME,
  "synchronize": true,
  "logging": false,
  "entities": [
    ".entity/**/*.js"
  ],
  "migrations": [
    ".migration/**/*.js"
  ],
  "subscribers": [
    ".subscriber/**/*.js"
  ],
  namingStrategy: new SnakeNamingStrategy()
}

// const SnakeNamingStrategy = require("typeorm-naming-strategies").SnakeNamingStrategy;
// const isTS = require('detect-ts-node');

// const config = {
//   "name": "default",
//   "type": "mysql",
//   "replication": {
//     "master": {
//       "host": "192.168.30.101",
//       "port": 3306,
//       "username": "boarduser",
//       "password": "boardpass",
//       "database": "boarddb"
//     },
//     "slaves": [{
//       "host": "192.168.30.101",
//       "port": 3307,
//       "username": "boarduser",
//       "password": "boardpass",
//       "database": "boarddb"
//     }]
//   },
//   "synchronize": false,
//   "logging": false,
//   "namingStrategy": new SnakeNamingStrategy()
// };

// if (isTS) {
//   config.entities = [
//     "src/entity/**/*.ts"
//   ];
//   config.migrations = [
//     "src/migration/**/*.ts"
//   ];
//   config.subscribers = [
//     "src/subscriber/**/*.ts"
//   ];
// } else {
//   config.entities = [
//     "./entity/**/*.js"
//   ];
//   config.migrations = [
//     "./migration/**/*.js"
//   ];
//   config.subscribers = [
//     "./subscriber/**/*.js"
//   ];
// }

// module.exports = config;
