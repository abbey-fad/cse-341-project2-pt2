const express = require('express');
const mongodb = require('./data/database');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const passport = require('passport');
const session = require('express-session');
const GithubStrategy = require('passport-github2').Strategy;
const cors = require('cors');

dotenv.config();
const port = process.env.PORT || 3000;
const app = express();

app.use(bodyParser.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'fallbacksecret',
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(
  cors({
    origin: '*', 
    methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'],
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Z-Key', 'Authorization']
  })
);

app.use('/', require('./routes/index.js'));

process.on('uncaughtException', (err, origin) => {
  console.error(`Caught exception: ${err}\nException origin: ${origin}`);
});

passport.use(
  new GithubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_URL
    },
    function (accessToken, refreshToken, profile, done) {
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


app.get('/', (req, res) => {
  if (req.session.user !== undefined) {
    res.send(`Logged in as ${req.session.user.displayName}`);
  } else {
    res.send('Logged Out');
  }
});

// GitHub OAuth callback
app.get(
  '/github/callback',
  passport.authenticate('github', { failureRedirect: '/api-docs', session: false }),
  (req, res) => {
    req.session.user = req.user; 
    res.redirect('/');
  }
);

mongodb.initDb((err) => {
  if (err) {
    console.error(err);
  } else {
    app.listen(port, () =>
      console.log(`Database connected. Server running on port ${port}`)
    );
  }
});
