const App = require("./app");
const insertContentInDataBase = require("./setDataBase");

const port = process.env.PORT | 3000;

const app = new App([], port);

setInterval(() => {
  insertContentInDataBase();
}, 86400000);

app.listen();
