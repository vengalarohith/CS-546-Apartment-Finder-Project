import express from 'express';
import bodyParser from 'body-parser';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import { dbConnection } from './config/mongoConnection.js';
import { loggingMiddleware } from './middleware.js';
import routes from './routes/index.js';
import auth_routes from './routes/auth_routes.js';
import landord_routes from './routes/landlord.js';
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import exphbs from 'express-handlebars';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const hbs = exphbs.create();

hbs.handlebars.registerHelper('jsonstringify', function (data) {
  return JSON.stringify(data);
});

// Register ifCond helper
hbs.handlebars.registerHelper('ifCond', function (v1, operator, v2, options) {
  switch (operator) {
    case '===':
      return v1 === v2 ? options.fn(this) : options.inverse(this);
    default:
      return options.inverse(this);
  }
});

const app = express();
const port = process.env.PORT || 3000;

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.use(express.static('public'));

app.use(
  session({
    secret: 'Rohith Secret',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: 'mongodb://localhost:27017/Apartment_Finder',
      ttl: 60 * 60 * 24,
      autoRemove: 'native',
      mongoOptions: {},
    }),
  })
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(loggingMiddleware);

app.use('/', routes);
app.use('/auth', auth_routes);
app.use('/landlord', landord_routes);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
