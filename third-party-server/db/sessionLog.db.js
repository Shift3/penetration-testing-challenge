const db = require( './db' );

const SCHEMANAME = 'hijack';
const TABLENAME = 'session_log';

class SessionLogDb {
    static async getOne( id ) {
        const query = `SELECT * FROM ${SCHEMANAME}.${TABLENAME} as "session_log" ` +
            `WHERE "session_log"."is_deleted"=false AND "session_log"."id" = $1`;
        const params = [ id ];
        console.log( query, params );
        return db.oneOrNone( query, params );
    }

    static async getAll( ) {
        const query = `SELECT * FROM ${SCHEMANAME}.${TABLENAME} as "session_log" ` +
            `WHERE "session_log"."is_deleted"=false`;

        return db.any( query );
    }

    static async insertOrUpdateOne( data ) {
        const getQuery = `SELECT * FROM ${SCHEMANAME}.${TABLENAME} as "session_log"` +
            `WHERE "session_log"."is_deleted"=false ` +
            `AND "session_log"."session_key" = $1 `;
            `AND "session_log"."referer" = $2 `;
            `AND "session_log"."user_agent" = $3 `;
            `AND "session_log"."ip_addr" = $4;`;
        const getParams = [
            data.session_key, 
            data.referer, 
            data.user_agent,
            data.ip_addr,
        ];

        const existingEntry = await db.oneOrNone( getQuery, getParams );

        let query = '';
        let params = [];
        if(existingEntry) {
            query = `UPDATE ${SCHEMANAME}.${TABLENAME} ` +
                `SET session_key=$1, referer=$2, user_agent=$3, ip_addr=$4, updated_at=$5 ` +
                `WHERE is_deleted=false AND id = $6 RETURNING *`;
            params = [
                data.session_key, 
                data.referer, 
                data.user_agent,
                data.ip_addr,
                new Date(),
                existingEntry.id
            ];
        } else {
            query = `INSERT into ${SCHEMANAME}.${TABLENAME} ` + 
                `(session_key, referer, user_agent, ip_addr) ` + 
                `VALUES($1, $2, $3, $4) RETURNING *`;

            params = [ 
                data.session_key, 
                data.referer, 
                data.user_agent,
                data.ip_addr,
            ];
        }
        
        console.log( query, params );
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

module.exports = SessionLogDb;
