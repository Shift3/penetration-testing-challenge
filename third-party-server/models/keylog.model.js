class KeylogModel {
    constructor( obj ) {
        this.id = 0;
        this.instance_id = '';
        this.session_key_id = 0;
        this.keystrokes = '';
        this.mouseclicks = '';
        this.dom_actions = '';

        this.created_at = undefined;
        this.updated_at = undefined;
        this.deleted_at = undefined;
        this.is_deleted = false;

        obj && Object.assign( this, obj );
    }

    toString() {
        return ``;
    }
}

module.exports = KeylogModel;
