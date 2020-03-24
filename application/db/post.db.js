const db = require( './db' );
const Common = require( '../controllers/common' );

const SCHEMANAME = 'blogapp';
const TABLENAME = 'posts';
const USERTABLE = 'users';

class PostDb {
    static async getOne( id ) {
        const query = `SELECT "posts".*, users.username as author FROM ${SCHEMANAME}.${TABLENAME} as "posts" ` +
            `JOIN ${SCHEMANAME}.${USERTABLE} as "users" on "posts"."user_id" = "users"."id" ` +
            `WHERE "posts"."is_deleted"=false AND "users"."is_deleted"=false AND "posts"."id" = $1`;
        const params = [ id ];
        console.log( query, params );
        return db.oneOrNone( query, params );
    }

    static async getAll( orderDirection, orderBy, postCountLimit, pageNumber ) {
        let byParam = 'created_at';
        switch ( orderBy ) {
            case 'Author':
                byParam = 'author';
                break;
            case 'Updated':
                byParam = 'updated_at';
                break;
            case 'Title':
                byParam = 'title';
                break;
        }
        const queryCount = `SELECT count(*) FROM ${SCHEMANAME}.${TABLENAME} as "posts" ` +
            `JOIN ${SCHEMANAME}.${USERTABLE} as "users" on "posts"."user_id" = "users"."id" ` +
            `WHERE "posts"."is_deleted"=false AND "users"."is_deleted"=false`;
        const count = await db.one( queryCount, [], a => +a.count );

        const query = `SELECT "posts".*, users.username as author FROM ${SCHEMANAME}.${TABLENAME} as "posts" ` +
            `JOIN ${SCHEMANAME}.${USERTABLE} as "users" on "posts"."user_id" = "users"."id" ` +
            `WHERE "posts"."is_deleted"=false AND "users"."is_deleted"=false ORDER BY ${byParam} ${orderDirection} ` +
            `OFFSET $1 LIMIT $2`;
        postCountLimit = parseInt( postCountLimit ) || 10;
        pageNumber = parseInt( pageNumber ) || 1;
        const params = [ ( pageNumber - 1 ) * postCountLimit, postCountLimit ];
        console.log( query, params );
        const posts = await db.any( query, params );

        return new Common.PaginatedPayload( count, postCountLimit, pageNumber, posts );
        return { count: count, pageLimit: postCountLimit, page: pageNumber, posts };
    }

    static updateOne( id, data ) {
        const query =
            `UPDATE ${SCHEMANAME}.${TABLENAME} SET title=$1, post=$2, updated_at=$3 WHERE is_deleted=false AND id = $4 RETURNING *`;
        const params = [ data.title, data.post, new Date(), id ];
        console.log( query, params );
        return db.one( query, params );
    }

    static deleteOne( id ) {
        const query = `UPDATE ${SCHEMANAME}.${TABLENAME} SET is_deleted=true WHERE id = $1`;
        const params = [ id ];
        console.log( query, params );
        return db.result( query, params, r => r.rowCount );
    }

    static insertOne( data ) {
        const query = `INSERT into ${SCHEMANAME}.${TABLENAME} (title, post, user_id) VALUES($1, $2, $3) RETURNING *`;
        const params = [ data.title, data.post, data.user_id ];
        console.log( query, params );
        return db.one( query, params );
    }

    static getTotal() {
        const query = `SELECT count(*) FROM ${SCHEMANAME}.${TABLENAME}`;
        console.log( query );
        return db.one( query, [], a => +a.count );
    }

    static search( param ) {
        const query =
            `SELECT * FROM ${SCHEMANAME}.${TABLENAME} WHERE is_deleted=false AND post ILIKE '%${param}%' OR author ILIKE '%${param}%'`;
        //let query = `SELECT * FROM ${TABLENAME} WHERE is_deleted=false AND make = '${param}'`;
        console.log( query );
        return db.any( query );
    }
}

module.exports = PostDb;
