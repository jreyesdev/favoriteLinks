const express = require('express');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const path = require('path');
const flash = require('connect-flash');
const expSession = require('express-session');
const MYSQLStore = require('express-mysql-session');
const passport = require('passport');

const { database } = require('./keys');

// initializations
const app = express();
require('./lib/passport');

// settings
app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({
    //plantilla
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: require('./lib/handlebars')
}));
app.set('view engine','.hbs');

// middlewares
app.use(expSession({
    secret: 'favoritelinksmysql',
    resave: false,
    saveUninitialized: false,
    store: new MYSQLStore(database)
}));
app.use(flash());
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false})); // para sin imagenes
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

// Global variables
app.use( (req, res, next) => {
    app.locals.success = req.flash('success');
    app.locals.message = req.flash('message');
    app.locals.user = req.user;
    next();
});

// Routes
app.use(require('./routes'));
app.use(require('./routes/auth'));
app.use('/links',require('./routes/links'));

// Public
app.use(express.static(path.join(__dirname, 'public')));

// Start server
app.listen(app.get('port'),()=>{ 
    console.log('Server on port ',app.get('port'));
});