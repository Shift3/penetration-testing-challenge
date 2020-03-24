const db = require( './db' );

const SCHEMANAME = 'blogapp';
const TABLENAME = 'permissions';
const LINKTABLEUR = 'user_roles';
const LINKTABLERP = 'roles_permissions';

class PermissionsDb {
  static getForUser( userId ) {
    const query = `SELECT * FROM ${SCHEMANAME}.${TABLENAME} as per ` +
      `JOIN ${SCHEMANAME}.${LINKTABLERP} as pr on per.id = pr.permissions_id ` +
      `JOIN ${SCHEMANAME}.${LINKTABLEUR} as ur on pr.roles_id = ur.roles_id ` +
      `WHERE user_id = $1 AND per.deleted_at is NULL`;
    const params = [ userId ];
    console.log( query, params );
    return db.any( query, params );
  }
}

module.exports = PermissionsDb;
