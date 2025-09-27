const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const session = require('express-session');
const passport = require('passport');
const GithubStrategy = require('passport-github2').Strategy;
const cors = require('cors');
const { MongoClient } = require('mongodb');

dotenv.config();

const port = process.env.PORT || 3000;
const app = express();

// Body parser
app.use(bodyParser.json());

// Session
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'fallbacksecret',
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// CORS
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'],
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'Z-Key',
      'Authorization',
    ],
  })
);

// ---------- PASSPORT GITHUB STRATEGY ----------
passport.use(
  new GithubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_URL, // e.g. http://localhost:3000/github/callback
    },
    (accessToken, refreshToken, profile, done) => {
      return done(null, profile);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});

// Simple homepage to test login status
app.get('/', (req, res) => {
  if (req.user) {
    res.send(`Logged in as ${req.user.username || req.user.displayName}`);
  } else {
    res.send('Logged Out');
  }
});

// GITHUB LOGIN + CALLBACK
app.get('/login', passport.authenticate('github', { scope: ['user:email'] }));

app.get(
  '/github/callback',
  passport.authenticate('github', { failureRedirect: '/' }),
  (req, res) => {
    req.session.user = req.user; // store GitHub user in session
    res.redirect('/');
  }
);

// LOGOUT
app.get('/logout', (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);
    req.session.destroy(() => {
      res.redirect('/');
    });
  });
});

// ---------- ROUTES ----------
app.use('/', require('./routes/index.js'));

// ---------- CONNECT TO MONGODB AND START SERVER ----------
async function startServer() {
  try {
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    console.log('Database connected!');

    // you can export client.db('yourDBName') here if needed

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (err) {
    console.error('MongoDB connection error:', err);
  }
}

startServer();
