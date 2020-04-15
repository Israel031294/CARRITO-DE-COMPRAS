const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const axios = require("axios");
const port = process.env.PORT || 4000;
const index = require("./routes/index");
const app = express();

app.use(index);

const server = http.createServer(app);
const io = socketIo(server);

var os = require('os');
var ifaces = os.networkInterfaces();

Object.keys(ifaces).forEach(function (ifname) {
  var alias = 0;

  ifaces[ifname].forEach(function (iface) {
    if ('IPv4' !== iface.family || iface.internal !== false) {
      // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
      return;
    }

    if (alias >= 1) {
      // this single interface has multiple ipv4 addresses
      console.log(ifname + ':' + alias, iface.address);
    } else {
      // this interface has only one ipv4 adress
      console.log(ifname, iface.address);
    }
    ++alias;
  });
});

io.on("connection", socket => {
  console.log("New client connected"), setInterval(
    () => getApiAndEmit(socket),
    10000
  );
  socket.on("disconnect", () => console.log("Client disconnected"));
});

const getApiAndEmit = async socket => {
  try {
    const res = await axios.get(
      ""
    );
    socket.emit("FromAPI", res.data.currently.temperature);
  } catch (error) {
    console.error(`Error: ${error.code}`);
  }
};

server.listen(port, () => console.log(`Listening on port ${port}`));