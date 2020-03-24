const Post = require( '../models/post.model' );
const User = require( '../models/user.model' );
const PostDb = require( '../db/post.db' );
const UserDb = require( '../db/user.db' );
const Common = require( './common' );

class PostController {
    static async getOne( id ) {
        try {
            const postBlob = await PostDb.getOne( id );
            if ( postBlob ) {
                const post = new Post( postBlob );
                return Common.GenerateResult.Ok( post );
            }

            return Common.GenerateResult.NotFound();
        } catch ( e ) {
            return PostController.handleCatch( e );
        }
    }

    static async updateOne( id, updatedPost ) {
        try {
            const postBlob = await PostDb.updateOne( id, updatedPost );
            if ( postBlob ) {
                const post = new Post( postBlob );
                return Common.GenerateResult.Ok( post );
            }

            return Common.GenerateResult.NotFound();
        } catch ( e ) {
            return PostController.handleCatch( e );
        }
    }

    static async insertOne( newPost ) {
        try {
            const postBlob = await PostDb.insertOne( newPost );
            if ( postBlob ) {
                const post = new Post( postBlob );
                return Common.GenerateResult.Ok( post );
            }

            return Common.GenerateResult.NotFound();
        } catch ( e ) {
            return PostController.handleCatch( e );
        }
    }

    static async deleteOne( id ) {
        try {
            const deleteCount = await PostDb.deleteOne( id );
            if ( deleteCount ) {
                return Common.GenerateResult.Ok();
            }

            return Common.GenerateResult.NotFound();
        } catch ( e ) {
            return PostController.handleCatch( e );
        }
    }

    static async getAll( orderDirection, orderBy, postCountLimit, pageNumber ) {
        try {
            const postsPaginated = await PostDb.getAll( orderDirection, orderBy, postCountLimit, pageNumber );
            if ( postsPaginated ) {
                const postsMapped = postsPaginated.posts.map( p => { return new Post( p ) } );
                postsPaginated.posts = postsMapped;
                return Common.GenerateResult.Ok( postsPaginated );
            }

            return Common.GenerateResult.NotFound();
        } catch ( e ) {
            return PostController.handleCatch( e );
        }
    }

    static async search( searchQuery ) {
        try {
            const postsBlob = await PostDb.search( searchQuery );
            if ( postsBlob ) {
                const posts = postsBlob.map( p => { return new Post( p ) } );
                return Common.GenerateResult.Ok( posts );
            }

            return Common.GenerateResult.NotFound();
        } catch ( e ) {
            return PostController.handleCatch( e );
        }
    }

    static async getNewPostForUser( userId ) {
        try {
            const userBlob = await UserDb.getOne( userId );

            if ( userBlob ) {
                const user = new User( userBlob );
                const post = new Post();

                post.user_id = user.id;
                post.author = user.username;
                return Common.GenerateResult.Ok( post );
            }

            return Common.GenerateResult.NotAuthorized();
        } catch ( e ) {
            return PostController.handleCatch( e );
        }
    }

    static handleCatch( e ) {
        console.error( e );
        if ( e.code === 0 ) {
            return Common.GenerateResult.NotFound();
        }

        return Common.GenerateResult.Error(e.message);
    }
}

module.exports = PostController;
