class User {
    constructor( obj ) {
        this.id = 0;
        this.username = '';
        this.email = '';
        this.password = '';
        this.created_at = undefined;
        this.updated_at = undefined;
        this.deleted_at = undefined;
        this.is_deleted = false;
        this.security_stamp = null;
        this.forgot_password_token = undefined;
        this.forgot_password_timestamp = undefined;

        // view model properties
        this.roleId;
        this.roles = [];

        obj && Object.assign( this, obj );

        // don't return password hash in object
        delete this[ 'password' ];
    }

    toString() {
        return ``;
    }
}

module.exports = User;
