const db = require( './db' );

const SCHEMANAME = 'blogapp';
const TABLENAME = 'roles';
const LINKTABLE = 'user_roles';

class Roles {
    static Admin = 1;
    static Everyone = 2;
    static Subscriber = 3;
    static Publisher = 4;
}

class RolesDb {
    static Roles = Roles;
    static getForUser( userId ) {
        const query = `SELECT * FROM ${SCHEMANAME}.${TABLENAME} as roles ` +
            `JOIN ${SCHEMANAME}.${LINKTABLE} as ur on roles.id = ur.roles_id ` +
            `WHERE user_id = $1 AND roles.deleted_at is NULL`;
        const params = [ userId ];
        console.log( query, params );
        return db.any( query, params );
    }

    static giveRoleToUser( userId, roleId ) {
        const query = `INSERT INTO ${SCHEMANAME}.${LINKTABLE} (user_id, roles_id) VALUES ($1, $2);`;
        const params = [ userId, roleId ];
        console.log( query, params );
        return db.any( query, params );
    }
}

module.exports = RolesDb;
