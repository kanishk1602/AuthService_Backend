const express = require("express");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
const { Kafka } = require("kafkajs");
const app = express();

//config load
require("dotenv").config(); //.env file me jo bhi data h usko load karao process file ke andar
const PORT = process.env.PORT || 4000; // port ki value nikalo env se, default port 4000

//JSON middleware
app.use(express.json());

// CORS middleware to allow frontend origin
const allowedOrigins = (process.env.CORS_ORIGINS ||
  "https://microservices-ecom.vercel.app,http://localhost:3000,http://localhost:3001")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
// Explicitly handle preflight requests for all routes
app.options("*", cors(corsOptions));

// Session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET || "supersecret",
    resave: false,
    saveUninitialized: false,
  })
);

// Passport config
require("./config/passport");
app.use(passport.initialize());
app.use(passport.session());

//ab database se connect karna h, uske liye ek folder banayenge config, usme hoga database.js

//index.js me ab database import kara lenge

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    service: "Auth Service",
    port: PORT,
    timestamp: new Date().toISOString(),
  });
});

// Service info endpoint
app.get("/", (req, res) => {
  res.json({
    service: "Auth Service",
    version: "1.0.0", 
    port: PORT,
    endpoints: {
      health: "/health",
      register: "/api/v1/auth/register",
      login: "/api/v1/auth/login",
      products: "/api/v1/products",
    },
  });
});

//route ko import karo and mount karo
//route naamka folder banao aur usme routes dalo
//ham ek user bana lete h aur route ko import kara lenge

const dbConnect = require("./config/database");

// Connect to DB, then mount routes and start server. No seeder is run here.
dbConnect.connect()
  .then(() => {
    // Mount routes after DB is ready
    const user = require("./routes/user");
    app.use("/api/v1/", user); // app.use krte user ko mount kara diya api/v1 pe

    // Mount product routes
    const productRoutes = require('./routes/product');
    app.use('/api/v1', productRoutes);

    //server ko activate karne ke liye
    app.listen(PORT, () => {
      console.log(`App is listening at ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("DB connection failed:", err);
    process.exit(1);
  });

// Kafka configuration - supports both local and cloud (Upstash/Confluent)
const kafkaBrokers = process.env.KAFKA_BROKERS 
  ? process.env.KAFKA_BROKERS.split(',').map(b => b.trim())
  : ["localhost:9094"];

const kafkaConfig = {
  clientId: "auth-service",
  brokers: kafkaBrokers,
};

// Add SASL authentication if credentials are provided (for Upstash/Confluent)
if (process.env.KAFKA_USE_SASL === 'true' && process.env.KAFKA_USERNAME && process.env.KAFKA_PASSWORD) {
  kafkaConfig.sasl = {
    mechanism: 'plain',
    username: process.env.KAFKA_USERNAME,
    password: process.env.KAFKA_PASSWORD,
  };
  kafkaConfig.ssl = true; // Upstash/Confluent require SSL
}

const kafka = new Kafka(kafkaConfig);

//ab routes define karenge
// route kaha se ho raha ?
