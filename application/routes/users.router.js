const express = require( 'express' );
const router = express.Router();
const UserController = require( '../controllers/user.controller' );
const Common = require( '../controllers/common' );


router.get( '/login', function( req, res, next ) {
    let m = null;
    switch ( req.query.m ) {
        case 'registered':
            m = 'Your account was created. Please log in.';
            break;
    }

    res.render( 'login', { message: m } );
} );

router.post( '/login', async function( req, res, next ) {
    console.log('login handler')
    try {
        const userResult = await UserController.login( req );
        if ( userResult instanceof Common.ResultOk ) {
            req.session.user = JSON.stringify( userResult.payload );
            return res.redirect( `/users/welcome?username=${user.username}` );
        } else {
            return res.render( 'login', { error: userResult
                    .payload } );
        }
    } catch ( e ) {
        // handle error
        console.log( `Error: ${e.message}` );
        return res.render( 'login', { error: e.message } );
    }
} );

router.get( '/logout', function( req, res, next ) {
    let m = null;
    let e = null;
    switch ( req.query.m ) {
        case 'expired':
            e = 'Your credentials have expired. Please log in.';
            break;
    }

    res.render( 'logout', { message: m, error: e } );
} );

router.get( '/register', async function( req, res, next ) {
    res.render( 'register', {
        email: '',
        username: ''
    } );
} );

router.post( '/register', async function( req, res, next ) {
    try {
        const userResult = await UserController.register( req );
        console.log( userResult )
        if ( userResult instanceof Common.ResultOk ) {
            req.session.user = JSON.stringify( userResult.payload );
            res.redirect('/');
        } else if ( userResult instanceof Common.ResultAlreadyExists ) {
            throw new Error( userResult.payload );
        } else {
            throw new Error( userResult.payload ? userResult.payload : "An error occurred." );
        }
    } catch ( e ) {
        console.log( e );
        res.render( 'register', {
            email: req.body.email,
            username: req.body.username,
            password: '',
            error: e.message
        } );
    }
} );

router.get( '/forgot-password', function( req, res, next ) {
    res.render( 'forgot-password' );
} );

router.post( '/forgot-password', async function( req, res, next ) {
    try {
        const resetPasswordResult = await UserController.forgotPassword( req );
        if ( resetPasswordResult instanceof Common.ResultOk ) {
            res.render( 'show-message', {title: 'Forgot Password', message: resetPasswordResult.payload});
        } else {
            throw new Error( resetPasswordResult.payload ? resetPasswordResult.payload : "An error occurred." );
        }
    } catch ( e ) {
        console.log( e );
        res.render( 'forgot-password', { error: e.message } );
    }
} );

router.get( '/reset-password', function( req, res, next ) {
    if ( req.query.token ) {
        res.render( 'reset-password', { token: req.query.token } );
    } else {
        res.redirect( '/users/login' );
    }
} );

router.post( '/reset-password', async function( req, res, next ) {
    try {
        const resetPasswordResult = await UserController.resetPassword( req );
        if ( resetPasswordResult instanceof Common.ResultOk ) {
            res.render( 'show-message', {title: 'Reset Password', message: resetPasswordResult.payload});
        } else {
            throw new Error( resetPasswordResult.payload ? resetPasswordResult.payload : "An error occurred." );
        }
    } catch ( e ) {
        console.log( e );
        res.render( 'reset-password', { token: req.query.token, error: e.message } );
    }
} );

router.get( '/welcome', function( req, res, next ) {
    res.render( 'welcome', { name: req.query.name } );
} );

module.exports = router;
