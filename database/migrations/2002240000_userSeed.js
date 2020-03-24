const SCHEMANAME = 'blogapp';
const TABLENAME = 'users';
const USERROLETABLE = 'user_roles'

class MigrationFile {
    constructor( migration ) {
        this.m = migration;
    }

    async up( transaction ) {
        const N = 20;
        const seeds = [];
        let script = '';
        // create admin user
        script = `INSERT INTO ${SCHEMANAME}.${TABLENAME} (username, email, password) VALUES `;
        const password = await this.m.bcrypt.hash( this.m.seed.word( 8, 16 ), 8 );
        const values = `('admin', 'admin@secureblog.com', '${password}') RETURNING id`;
        script += values;
        const adminId = await transaction.one( script );
        // admin role
        script = `INSERT INTO ${SCHEMANAME}.${USERROLETABLE} (user_id, roles_id) VALUES (${adminId.id},1)`;
        seeds.push(script);

        // seed users
        script = `INSERT INTO ${SCHEMANAME}.${TABLENAME} (username, email, password) VALUES `;
        for ( let i = 2; i <= N; i++ ) {
            const password = await this.m.bcrypt.hash( this.m.seed.word( 8, 16 ), 8 );
            const values = `('${this.m.seed.name.en()}', '${this.m.seed.email()}', '${password}')`;
            script += values;
            if ( i < N ) {
                script += ', ';
            }
        }
        script += ' RETURNING id;'
        const userIds = await transaction.many( script );
        console.log(userIds)

        // seed role, all users are publishers
        script = `INSERT INTO ${SCHEMANAME}.${USERROLETABLE} (user_id, roles_id) VALUES `;
        for ( let i = 0; i < userIds.length; i++ ) {
            const values = `(${userIds[i].id}, 4)`;
            script += values;
            if ( i < userIds.length - 1 ) {
                script += ', ';
            }
        }
        seeds.push( script );

        return seeds;
    }

    async down() {

    }
}

module.exports = MigrationFile;
