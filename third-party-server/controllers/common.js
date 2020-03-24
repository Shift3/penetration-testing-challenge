const path = require( 'path' );

class Common {
  static resultOk( res, obj ) {
    var options = {
      root: path.join(__dirname, '/../assets'),
      dotfiles: 'deny',
      headers: {
        'x-timestamp': Date.now(),
        'x-sent': true
      }
    }
    res.sendFile('good.png', options);
  }
  static resultErr( res, obj ) {
    let payload = {};
    if ( typeof obj === 'string' || obj === null || obj === undefined ) {
      payload = { message: obj ? obj : 'error' };
    } else {
      payload = { error: obj };
    }
    res.status( 500 )
      .json( payload );
  }
  static resultNotFound( res, msg ) {
    res.status( 404 )
      .json( { message: msg ? msg : 'Not Found' } );
  }
  static userAlreadyExists( res ) {
    res.status( 403 )
      .json( { message: 'User already exists.' } );
  }

  static userNotAuthorized( res ) {
    res.status( 403 )
      .json( { message: 'You are not logged in.' } );
  }
}

module.exports = Common;
