class Role {
    constructor( obj ) {
        this.id = 0;
        this.role = '';
        this.description = '';

        this.created_at = null;
        this.deleted_at = null;

        obj && Object.assign( this, obj );
    }

    toString() {
        return ``;
    }
}

module.exports = Role;
