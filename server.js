require('dotenv').config();

const cookieSession = require('cookie-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const flash = require('express-flash');
const express = require('express');
const logger = require('morgan');
const path = require('path');

const app = express();
const port = process.env.PORT || 8000;

app
  .use(
    bodyParser.urlencoded({
      extended: true,
    })
  )
  .use(bodyParser.json())
  .use(express.static(path.resolve('public/dist')))
  .use(cookieParser())
  .use(
    cookieSession({
      name: 'session',
      keys: [process.env.SESSIONKEY],
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    })
  )
  .use(logger('dev'))
  .use(flash())

  // *** routes *** /
  .use(require('./server/routes'));

const server = app.listen(port, () =>
  console.log(`[HackDojo] listening at: localhost: ${port}`)
);
