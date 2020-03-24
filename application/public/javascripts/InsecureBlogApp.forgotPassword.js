InsecureBlogApp.onload( () => {
    InsecureBlogApp.forgotPasswordHandler = function( e ) {
        const form = document.querySelector( 'form#forgot-password-form' );
        const emailAddress = form.elements.emailAddress.value;
        if ( !emailAddress ) {
            e.preventDefault();
            InsecureBlogApp.toast( 'danger', "Email required" );
            return;
        }

        InsecureBlogApp.spin();
    }

    document.getElementById( 'forgotPasswordSubmit' )
        .addEventListener( 'click', InsecureBlogApp.forgotPasswordHandler );
} );
