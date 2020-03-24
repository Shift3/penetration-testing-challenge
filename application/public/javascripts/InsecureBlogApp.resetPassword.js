InsecureBlogApp.onload( () => {
    // event handler for login action
    InsecureBlogApp.resetPasswordHandler = function( e ) {
        const form = document.querySelector( "form#reset-password-form" );
        const emailAddress = form.elements.emailAddress.value;
        const password = form.elements.password.value;
        const passwordAgain = form.elements.passwordAgain.value;
        const token = form.elements.token.value;

        if ( !emailAddress || !password || !passwordAgain ) {
            e.preventDefault();
            InsecureBlogApp.toast( 'danger', "Email and password required" );
            return;
        }

        if ( password !== passwordAgain ) {
            e.preventDefault();
            InsecureBlogApp.toast( 'danger', 'Your passwords do not match' );
            return;
        }

        InsecureBlogApp.spin();
    }
    // setup the event handler
    document.getElementById( 'resetPasswordSubmit' )
        .addEventListener( 'click', InsecureBlogApp.resetPasswordHandler );
} );
