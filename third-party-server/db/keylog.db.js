const db = require( './db' );

const SCHEMANAME = 'hijack';
const TABLENAME = 'keylog';

class KeylogDb {
    static async getOne( id ) {
        const query = `SELECT * FROM ${SCHEMANAME}.${TABLENAME} as "keylog" ` +
            `WHERE "keylog"."is_deleted"=false AND "keylog"."id" = $1`;
        const params = [ id ];
        console.log( query, params );
        return db.oneOrNone( query, params );
    }

    static async getOneByUUID( uuid ) {
        const query = `SELECT * FROM ${SCHEMANAME}.${TABLENAME} as "keylog" ` +
            `WHERE "keylog"."is_deleted"=false AND "keylog"."instance_id" = $1`;
        const params = [ uuid ];
        console.log( query, params );
        return db.oneOrNone( query, params );
    }

    static async getAll( ) {
        const query = `SELECT * FROM ${SCHEMANAME}.${TABLENAME} as "keylog" ` +
            `WHERE "keylog"."is_deleted"=false`;

        return db.any( query );
    }

    static async insertOrUpdateOne( session_log_id, data ) {
        const existingEntry = await KeylogDb.getOneByUUID(data.instance_id);

        let query = '';
        let params = [];
        if(existingEntry) {
            query = `UPDATE ${SCHEMANAME}.${TABLENAME} ` +
                `SET keystrokes=$1, mouseclicks=$2, dom_actions=$3, updated_at=$4 ` +
                `WHERE is_deleted=false AND id = $5 RETURNING *`;

            params = [
                JSON.stringify(JSON.parse(existingEntry.keystrokes || '[]').concat(data.keystrokes || [])), 
                JSON.stringify(JSON.parse(existingEntry.mouseclicks || '[]').concat(data.mouseclicks || [])), 
                JSON.stringify(JSON.parse(existingEntry.dom_actions || '[]').concat(data.dom_actions || [])),
                new Date(),
                existingEntry.id
            ];
        } else {
            query = `INSERT into ${SCHEMANAME}.${TABLENAME} ` + 
                `(session_log_id, instance_id, keystrokes, mouseclicks, dom_actions) ` + 
                `VALUES($1, $2, $3, $4, $5) RETURNING *`;

            params = [ 
                session_log_id,
                data.instance_id,
                JSON.stringify(data.keystrokes || []), 
                JSON.stringify(data.mouseclicks || []), 
                JSON.stringify(data.dom_actions || [])
            ];
        }
        
        //console.log( query, params );
        return db.one( query, params );
    }

    static deleteOne( id ) {
        const query = `UPDATE ${SCHEMANAME}.${TABLENAME} SET is_deleted=true WHERE id = $1`;
        const params = [ id ];
        console.log( query, params );
        return db.result( query, params, r => r.rowCount );
    }

    static getTotal() {
        const query = `SELECT count(*) FROM ${SCHEMANAME}.${TABLENAME}`;
        console.log( query );
        return db.one( query, [], a => +a.count );
    }
}

module.exports = KeylogDb;
