( function() {
    'use strict';
    InsecureBlogApp.onload( () => {
        console.log( 'feed loaded' )
        InsecureBlogApp.fetchFeed = function() {
            InsecureBlogApp.spin();
            // get feed content
            const page = $( '#paginator' );
            const order = document.getElementById( 'order' )
                .value;
            const by = document.getElementById( 'orderBy' )
                .value;

            const pageLimit = 10;
            const currPage = page.pagination( 'getCurrentPage' );

            fetch( `/post/all?order=${order}&by=${by}&pl=${pageLimit}&p=${currPage}`, {
                    credentials: 'same-origin'
                } )
                .then( function( response ) {
                    if ( response.status >= 200 && response.status < 300 ) {
                        return response;
                    } else {
                        var error = new Error( response.statusText );
                        error.response = response;
                        throw error;
                    }
                } )
                .then( function( response ) {
                    return response.json();
                } )
                .then( function( json ) {
                    InsecureBlogApp.updatePaginator( json );
                    InsecureBlogApp.postFeed( json );
                    setTimeout( InsecureBlogApp.spinStop, 300 );
                } )
                .catch( function( e ) {
                    InsecureBlogApp.toast( 'danger', e.response && e.response.status === 500 ? e
                        .response.json() : e.message );
                    InsecureBlogApp.spinStop();
                } );
        }

        InsecureBlogApp.updatePaginator = function( data ) {
            const page = $( '#paginator' );
            page.pagination( 'updateItems', data.count );
        }

        InsecureBlogApp.postFeed = function( data ) {
            const feed = document.getElementById( 'feed' );
            const temp = document.getElementById( 'postTemplate' );
            const spacer = document.getElementById( 'postSpacer' );
            const item = temp.content.querySelector( 'div' );

            const s = ( data.page - 1 ) * data.pageLimit + 1;
            const f = s + data.posts.length - 1;
            const t = data.count;
            document.getElementById( 'viewCount' )
                .textContent = `Viewing ${s}-${f} of ${t}`;

            feed.innerHTML = '';
            data = data.posts;
            for ( let i = 0; i < data.length; i++ ) {
                const postData = data[ i ];
                const post = document.importNode( item, true );
                post.innerHTML = post.innerHTML.replace( /\{\{title\}\}/, postData.title )
                    .replace( /\{\{id\}\}/g, postData.id )
                    .replace( /\{\{post\}\}/, postData.post.replace( /(\r|\n|\r\n)/g, '<br>' ) )
                    .replace( /\{\{author\}\}/, postData.author )
                    .replace( /\{\{created\}\}/, postData.created_at )
                    .replace( /\{\{updated\}\}/, postData.updated_at );

                if ( postData.created_at !== postData.updated_at ) {
                    post.querySelector( ".post-updated" )
                        .classList.remove( 'hidden' );
                }

                if ( postData.user_id !== InsecureBlogApp.user.id ) {
                    const controls = post.querySelector( '.user-controls' );
                    controls.classList.add( 'hidden');
                }

                feed.appendChild( post );
                feed.appendChild( document.importNode( spacer.content, true ) );
            }
        }

        setupPage();

    } );

    function setupPage() {
        document.getElementById( 'btnRefresh' )
            .addEventListener( 'click', InsecureBlogApp.fetchFeed );
        document.getElementById( 'feed' )
            .addEventListener( 'click', handleFeedClick );
            document.getElementById( 'create-post-button' )
            .addEventListener( 'click', handleCreatePostClick );

        $( '#paginator' )
            .pagination( {
                items: 100,
                itemsOnPage: 10,
                onPageClick: InsecureBlogApp.fetchFeed,
                cssStyle: 'dark-theme'
            } );

        InsecureBlogApp.fetchFeed();
    }

    function handleFeedClick( e ) {
        let el = e.target;
        let id = el.dataset.id;
        if ( id === undefined ) {
            el = el.parentNode;
            id = el.dataset.id;
        }
        const type = el.dataset.type;

        if ( type === 'edit' ) {
            document.location.href = `/post/${id}`;
        } else if ( type === 'del' ) {
            document.location.href = `/post/delete/${id}`;
        }
    }

    function handleCreatePostClick( e ) {
        if(InsecureBlogApp.canUserEdit()) {
            document.location.href = `/post`;
        } else {
            InsecureBlogApp.toast('danger', 'You do not have permission to create a post.');
        }
    }

} )();
