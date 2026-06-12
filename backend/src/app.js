const errorHandler = require("./middlewares/error");
const dashboardRoute = require("./modules/dashboard/route");
const whatsappRoute = require("./modules/whatsapp/route");
const devicesRoute = require("./modules/devices/route");
const targetsRoute = require("./modules/targets/route");
const templatesRoute = require("./modules/templates/route");
const blastsRoute = require("./modules/blasts/route");
const express = require("express");
const cors = require("cors");
const reportsRoute =
require("./modules/reports/route");

const authRoute = require("./modules/auth/route");
const usersRoute = require("./modules/users/route");
const staffRoute = require("./modules/staff/route");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "RUPIAHBLAST backend is running",
  });
});

app.use(errorHandler);
app.use("/dashboard", dashboardRoute);
app.use("/auth", authRoute);
app.use("/settings", require("./modules/settings/route"));
app.use("/users", usersRoute);
app.use("/staff", staffRoute);
app.use("/templates", templatesRoute);
app.use("/targets", targetsRoute);
app.use("/devices", devicesRoute);
app.use("/whatsapp", whatsappRoute);
app.use("/blasts", blastsRoute);
app.use(
"/reports",
reportsRoute
);

module.exports = app;
