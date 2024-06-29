const express = require("express");
const dotenv = require("dotenv");
const bodyparser = require("body-parser");
const session = require("express-session");
const cors = require("cors");
const connectDB = require("./config/db");
const userRoute = require("./routes/User.route");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const AppointmentRouter = require("./routes/Appointment.route");
const DoctorRouter = require("./routes/Doctor.route");
const PatientRouter = require("./routes/Patient.route");
const ReviewRouter = require("./routes/Review.route")

dotenv.config();

const app = express();

app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(cors());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());

require("./config/passport");

const PORT = process.env.PORT || 8800;

connectDB();

app.use("/api", userRoute);
app.use("/api", AppointmentRouter);
app.use("/api", DoctorRouter);
app.use("/api", PatientRouter);
app.use("/api",ReviewRouter)

app.listen(PORT, () => {
  console.log(`server run on the PORT ${PORT}`);
});
