( function() {
    'use strict';

    const createdAt = document.querySelector( "#created-at" )
        .textContent;
    const updatedAt = document.querySelector( "#updated-at" )
        .textContent;

    if ( createdAt !== '' ) {
        document.querySelector( "#created-at-container" )
            .classList.remove( 'hidden' );
    }

    if ( createdAt !== updatedAt ) {
        document.querySelector( "#updated-at-container" )
            .classList.remove( 'hidden' );
    }

    if ( document.getElementById( 'id' )
        .value > 0 ) {
        document.querySelector( '#delete-btn' )
            .classList.remove( 'hidden' );
    }

} )();
