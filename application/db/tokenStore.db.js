const db = require( './db' );

const SCHEMANAME = 'blogapp';
const TABLENAME = 'token_store';

class TokenStoreDb {
  static getForUser( userId, securityStamp, refreshToken ) {
    const query = `SELECT * FROM ${SCHEMANAME}.${TABLENAME} WHERE user_id = $1 AND security_stamp = $2 AND refresh_token = $3`;
    const params = [ userId, securityStamp, refreshToken ];
    console.log( query, params );
    return db.oneOrNone( query, params );
  }

  static insertForUser( userId, securityStamp, refreshToken ) {
    const query = `INSERT into ${SCHEMANAME}.${TABLENAME} (user_id, security_stamp, refresh_token) VALUES($1, $2, $3) RETURNING *`;
    const params = [ userId, securityStamp, refreshToken ];
    console.log( query, params );
    return db.one( query, params );
  }

  static deleteForUser( id ) {
    id = parseInt( id );
    let query = `DELETE FROM ${SCHEMANAME}.${TABLENAME} WHERE user_id = $1`;
    console.log( query, id );
    return db.result( query, [ id ] );
  }
}

module.exports = TokenStoreDb;
