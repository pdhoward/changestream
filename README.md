# Change Streams
Platform for managing active dialogues

A content-first approach to addresses the very challenging process of chat


## Getting Started

1. Clone this repository.
2. In a terminal window, start MongoDB as a replica set of one server with the command: `mongod --dbpath <DATA_PATH> --replSet "rs"`.
3. In a separate terminal window, run `mongo`, the MongoDB client.
4. If this is the first time you set up a replica set, execute the command `rs.initiate()`.
5. Create the database `tasksDb` (`use tasksDb`) and the collection `tasks` (`db.createCollection('tasks')`).
6. npm install
7. Navigate browser to end point and have a conversation

### Prerequisites

- [MongoDB (version 3.6 or superior)](https://www.mongodb.com/download-center#community)
- [Node.js (6 or superior)](https://nodejs.org/en/download/)

## Built With

* [MongoDB](https://www.mongodb.com/) - NoSQL database
* [Node.js](https://nodejs.org/en/) - A JavaScript runtime 
* [React](https://reactjs.org/) - A JavaScript library for building webapps

## LICENSE
MIT
