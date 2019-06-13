const express = require("express");
const bodyParser = require("body-parser");
const { connect } = require("mongoose");
const insertContentInDataBase = require("./setDataBase");

class App {
  constructor(controllers, port) {
    this.app = express();
    this.port = port;

    this.connectToTheDatabse();
    this.intializeMiddlewares();
    insertContentInDataBase();
  }

  intializeMiddlewares() {
    this.app.use(bodyParser.json());
  }

  intializeControllers(controllers) {
    controllers.forEach(controller => {
      this.app.use("/", controller.router);
    });
  }

  connectToTheDatabse() {
    connect(
      "mongodb://asdfg:hg1lh3x@ds237337.mlab.com:37337/wuzzuf-as",
      { useNewUrlParser: true }
    );
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`App listening on the port ${this.port}`);
    });
  }
}

module.exports = App;
