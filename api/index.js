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
const ReviewRouter = require("./routes/Review.route");
const MedicalRecord = require("./routes/MedicalRecord.route");
const http = require("http");
const { Server } = require("socket.io");
const Message = require("./models/Message.model");
const MessageRouter = require("./routes/Message.route");
const multer = require("multer");
const path = require("path");

dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

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
app.use("/uploads", express.static("uploads"));

require("./config/passport");

const PORT = process.env.PORT || 8800;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

io.on("connection", (socket) => {
  console.log("Un utilisateur s'est connecté");

  socket.on("join", (roomId) => {
    socket.join(roomId);
    console.log(`L'utilisateur a rejoint la salle ${roomId}`);
  });

  socket.on("sendMessage", async (data) => {
    const { senderId, receiverId, content, roomId, attachment } = data;
    try {
      let newMessage = new Message({
        senderId,
        receiverId,
        content,
        timestamp: new Date().toISOString(),
        read: false,
      });

      if (attachment) {
        newMessage.attachment = {
          type: attachment.type,
          url: attachment.url,
        };
      }

      await newMessage.save();
      io.to(roomId).emit("message", newMessage);
    } catch (error) {
      console.error("Erreur lors de l'enregistrement du message:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("Un utilisateur s'est déconnecté");
  });
});

connectDB();
app.use("/api", userRoute);
app.use("/api", AppointmentRouter);
app.use("/api", DoctorRouter);
app.use("/api", PatientRouter);
app.use("/api", ReviewRouter);
app.use("/api", MedicalRecord);
app.use("/api", MessageRouter);
app.post("/api/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("Aucun fichier n'a été uploadé.");
  }
  res.send({ url: `http://192.168.43.149:8800/uploads/${req.file.filename}` });
});

server.listen(PORT, () => {
  console.log(`server run on the PORT ${PORT}`);
});
