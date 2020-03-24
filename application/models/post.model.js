class Post {
    constructor( obj ) {
        // db fields
        this.id = 0;
        this.title = '';
        this.post = '';
        this.user_id = 0;
        this.created_at = undefined;
        this.updated_at = undefined;
        this.deleted_at = undefined;
        this.is_deleted = false;
        // display fields
        this.author = undefined;

        obj && Object.assign( this, obj );
        let a = this.created_at;
        if ( a ) {
            console.log( typeof a )
            console.log( a )
            this.created_at =
                `${a.getFullYear()}/${a.getMonth()<9?'0':''}${a.getMonth()+1}/${a.getDate()} ${a.getHours()}:${a.getMinutes()}`;
        }
        a = this.updated_at;
        if ( a ) {
            this.updated_at =
                `${a.getFullYear()}/${a.getMonth()<9?'0':''}${a.getMonth()+1}/${a.getDate()} ${a.getHours()}:${a.getMinutes()}`;
        }
    }

    toString() {
        return ``;
    }
}

module.exports = Post;
