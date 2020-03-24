const express = require( 'express' );
const path = require( 'path' );
const favicon = require( 'serve-favicon' );
const logger = require( 'morgan' );
const cookieParser = require( 'cookie-parser' );
const cookieSession = require( 'cookie-session' );
const bodyParser = require( 'body-parser' );
const csrf = require( 'csurf' );
const indexRouter = require( './routes/index.router' );
const userRouter = require( './routes/users.router' );
const postRouter = require( './routes/post.router' );

require( 'dotenv' )
    .config();

const app = express();

// view engine setup
app.set( 'views', path.join( __dirname, 'views' ) );
app.set( 'view engine', 'jade' );

app.use( favicon( path.join( __dirname, 'public', 'favicon.ico' ) ) );
app.use( logger( 'dev' ) );
app.use( bodyParser.json() );
app.use( bodyParser.urlencoded( { extended: false } ) );
app.use( cookieParser() );
app.use( express.static( path.join( __dirname, 'public' ) ) );
app.use( '/icons', express.static( path.join( __dirname, 'node_modules/octicons/build/svg' ) ) );
app.use( cookieSession( {
    name: 'session',
    secret: process.env.COOKIE_SECRET,
    httpOnly: false,
    // Cookie Options
    maxAge: 60 * 60 * 1000 // 1 hour
} ) );

// check user cookie
app.use( function( req, res, next ) {
    try {
        if ( req.session && req.session.user ) {
            req.user = JSON.parse( req.session.user );
            return next();
        }

        throw new Error( 'User not authorized.' );
    } catch ( e ) {
        console.error( e.message + ' ' + req.path );
        
        if ( !isPublicPage( req.path ) ) {
            req.session = null;

            if( isApiPage( req.path )) {
                return res.status(403).json({error: 'User not authorized'});
            }
            return res.redirect( '/users/login' );
        } else {
            next();
        }
    }
} );

// validate csrf (this must come before routes)
app.use( csrf( { cookie: true } ) );

// add csrf token to forms
app.use( function( req, res, next ) {
    res.locals.csrfToken = req.csrfToken && req.csrfToken();
    next();
} );

// routes
app.use( '/', indexRouter );
app.use( '/users', userRouter );
app.use( '/post', postRouter );

// catch 404 and forward to error handler
app.use( function( req, res, next ) {
    var err = new Error( 'Not Found' );
    err.status = 404;
    next( err );
} );

// CSRF error handler
app.use( function( err, req, res, next ) {
    if ( err.code !== 'EBADCSRFTOKEN' ) return next( err )

    // handle CSRF token errors here
    res.redirect( '/error/403' );
} );

// error handler
app.use( function( err, req, res, next ) {
    // set locals, only providing error trace in development
    const showTrace = req.app.get( 'env' ) === 'development';

    res.locals.error = err.message;
    res.locals.trace = showTrace ? err : {};

    console.error( res.locals.message );
    // render the error page
    res.status( err.status || 500 );
    res.render( showTrace ? 'error-trace' : 'error' );
} );

module.exports = app;

function isPublicPage( url ) {
    const insecure = [
      '/users/login',
      '/users/logout',
      '/users/register',
      '/users/forgot-password',
      '/users/reset-password',
      '/error/'
    ];
    for ( let i = 0; i < insecure.length; i++ ) {
        if ( url.indexOf( insecure[ i ] ) >= 0 ) {
            return true;
        }
    }
    return false;
}

function isApiPage ( url ) {
    const apiPages = [
        '/post/all'
      ];
      for ( let i = 0; i < apiPages.length; i++ ) {
          if ( url.indexOf( apiPages[ i ] ) >= 0 ) {
              return true;
          }
      }
      return false;
}
