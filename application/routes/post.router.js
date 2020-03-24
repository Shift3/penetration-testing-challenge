const express = require( 'express' );
const Common = require( '../controllers/common' );
const PostController = require( '../controllers/post.controller' );
const dbPosts = require( '../db/post.db' );
const Post = require( '../models/post.model' );

class PostMode {
    static newPost = 1;
    static editPost = 2;
    static deletePost = 3;
}

class PostRouter {
    constructor() {
        this.router = express.Router();

        this.router.get( '/all', PostRouter.getAll );
        this.router.get( '/delete/:id', PostRouter.getDelete );
        this.router.post( '/delete/:id', PostRouter.doDelete );
        this.router.get( '/:id', PostRouter.getPost );
        this.router.get( '/', PostRouter.getPost );
        this.router.post( '/:id', PostRouter.savePost );
        this.router.post( '/', PostRouter.savePost );

        //router.post( '/:id', handlePost );
        //router.post( '/', handlePost );

        return this.router;
    }

    static async getAll( req, res, next ) {
        try {
            const postResult = await PostController.getAll( req.query.order, req.query.by, req.query.pl, req.query
                .p );

            if ( postResult instanceof Common.ResultOk ) {
                const postsPaginated = postResult.payload;

                return res.status( 200 )
                    .json( postsPaginated );
            }
            j

            return res.status( 200 )
                .json( new Common.PaginatedPayload() );

        } catch ( e ) {
            res.status( 500 )
                .json( { error: e.message } );
        }
    }

    static async getPost( req, res, next ) {
        try {
            const id = req.params.id;

            if ( id ) {
                const postResult = await PostController.getOne( id );
                if ( postResult instanceof Common.ResultOk ) {
                    return PostRouter.renderPost( res, PostMode.editPost, postResult.payload );
                }

                throw new Error("Post not found.");
            }

            const newPostResult = await PostController.getNewPostForUser( req.user.id );
            if ( newPostResult instanceof Common.ResultOk ) {
                return PostRouter.renderPost( res, PostMode.newPost, newPostResult.payload );
            }

            throw new Error( newPostResult.payload );
        } catch ( e ) {
            PostRouter.showErrorScreen( res, e );
        }
    }

    static async savePost( req, res, next ) {
        try {
            const id = Number.parseInt(req.params.id);

            if ( id ) {
                const postResult = await PostController.updateOne(id, req.body);
                if ( postResult instanceof Common.ResultOk ) {
                    res.locals.message = 'Post Updated!';
                    return res.redirect('/?m=' + res.locals.message);
                }

                throw new Error(postResult.payload);
            }

            const newPostResult = await PostController.insertOne( req.body );
            if ( newPostResult instanceof Common.ResultOk ) {
                res.locals.message = 'Post Created!';
                return res.redirect('/?m=' + res.locals.message);
            }

            throw new Error( newPostResult.payload );
        } catch ( e ) {
            PostRouter.showErrorScreen( res, e );
        }
    }

    static async getDelete( req, res, next ) {
        try {
            const id = req.params.id;

            if ( id ) {
                const postResult = await PostController.getOne( id );

                if ( postResult instanceof Common.ResultOk ) {
                    return PostRouter.renderPost( res, PostMode.deletePost, postResult.payload );
                }
            }

            throw new Error( 'Post does not exist' );
        } catch ( e ) {
            return PostRouter.showErrorScreen( res, e );
        }
    }

    static async doDelete( req, res, next ) {
        try {
            const id = Number.parseInt(req.params.id);

            if ( id ) {
                const postResult = await PostController.deleteOne(id);
                if ( postResult instanceof Common.ResultOk ) {
                    res.locals.message = 'Post Deleted!';
                    return res.redirect('/?m=' + res.locals.message);
                }

                throw new Error(postResult.payload);
            }

            throw new Error( 'Post not found.' );
        } catch ( e ) {
            PostRouter.showErrorScreen( res, e );
        }
    }

    static handleError( res, postMode, post, err ) {
        res.locals.error = err.message;
        this.renderPost( res, postMode, post );
    }

    static showErrorScreen( res, err ) {
        res.locals.error = err.message;
        res.render( 'error' );
    }

    static renderPost( res, postMode, post ) {
        const postTemplate = postMode === PostMode.deletePost ? 'delete' : 'edit';
        const mode = postMode === PostMode.newPost ? 'New Post' : 'Edit Post';
        const submitButton = postMode === PostMode.newPost ? 'Create Post' : 'Save Changes';

        const templateVariables = {
            mode,
            submitButton,
        }

        Object.assign(templateVariables, post);

        res.render( postTemplate, templateVariables );
    }

}

/*
router.get( '/all', async function( req, res, next ) {
    try {
        const result = await dbPosts.getAll( req.query.order, req.query.by, req.query.pl, req.query.p );
        const posts = result.posts.map( ( p ) => { return new Post( p ) } );
        result.posts = posts;
        res.status( 200 )
            .json( result );
    } catch ( e ) {
        res.status( 500 )
            .json( { error: e.message } );
    }
} );

router.get( '/delete/:id', async function( req, res, next ) {
    try {
        const id = req.params.id;
        let post = await dbPosts.getOne( id );
        post = new Post( post );
        if ( post && post.id ) {
            res.render( 'delete', {
                id: id,
                title: post.title,
                post: post.post,
                username: post.username,
                postdate: post.created_at,
                editdate: post.updated_at
            } );
        } else {
            throw new Error( "Invalid post" );
        }
    } catch ( e ) {
        res.render( 'delete', { id: id, title: '', post: '', error: e.message } );
    }
} );

router.post( '/delete/:id', async function( req, res, next ) {
    try {
        const id = req.params.id;
        let post = await dbPosts.deleteOne( id );
        res.redirect( '/' );
    } catch ( e ) {
        res.render( 'delete', { id: id, title: '', post: '', error: e.message } );
    }
} );


router.get( '/:id', async function( req, res, next ) {
    try {
        const id = req.params.id;
        let post = await dbPosts.getOne( id );
        post = new Post( post );
        if ( post && post.id ) {
            res.render( 'edit', {
                id: id,
                mode: 'Edit Post',
                submitButton: 'Save Changes',
                title: post.title,
                post: post.post,
                username: post.username,
                postdate: post.created_at,
                editdate: post.updated_at
            } );
        } else {
            res.render( 'edit', {
                id: 0,
                mode: 'New Post',
                submitButton: 'Create Post',
                title: '',
                post: '',
                error: 'Post Not Found'
            } );
        }
    } catch ( e ) {
        res.render( 'edit', {
            id: id,
            mode: 'New Post',
            submitButton: 'Create Post',
            title: '',
            post: '',
            error: e.message
        } );
    }
} );


router.get( '/', async function( req, res, next ) {
    res.render( 'edit', {
        id: 0,
        mode: 'New Post',
        submitButton: 'Create Post',
        title: '',
        post: '',
        username: req.cookies.username
    } );
} );

async function handlePost( req, res, next ) {
    try {
        if ( !isNaN( req.body.id ) && req.body.id > 0 ) {
            console.log( 'update post' )
            let post = await dbPosts.updateOne( req.body.id, req.body );
            post = new Post( post );
            res.render( 'edit', {
                id: req.body.id,
                mode: 'Edit Post',
                submitButton: 'Save Changes',
                title: post.title,
                post: post.post,
                username: post.username,
                postdate: post.created_at,
                editdate: post.updated_at
            } );

        } else {
            console.log( 'create new post' );
            let post = await dbPosts.insertOne( req.body, req.user.id );
            post = new Post( post );
            //res.render('edit', { id: req.user.id, mode: 'Edit Post', submitButton: 'Save Changes', title: post.title, post: post.post, username: post.username, postdate: post.created_at, editdate: post.updated_at });
            res.redirect( '/post/' + post.id );
        }
    } catch ( e ) {
        res.render( 'edit', {
            id: req.body.id,
            mode: 'Edit Post',
            submitButton: 'Save Changes',
            title: req.body.title,
            post: req.body.post,
            error: e.message
        } );
    }
}
*/

module.exports = new PostRouter();
