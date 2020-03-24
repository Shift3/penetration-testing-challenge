class SessionLogModel {
    constructor( obj ) {
        this.id = 0;
        this.session_key = '';
        this.referer = '';
        this.user_agent = '';
        this.ip_addr = '';

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

module.exports = SessionLogModel;
