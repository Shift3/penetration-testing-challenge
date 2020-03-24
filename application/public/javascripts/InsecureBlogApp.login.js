InsecureBlogApp.onload( () => {
    // event handler for login action
    InsecureBlogApp.loginHandler = function( e ) {
        const form = document.querySelector( "form#login-form" );
        const email = form.elements.email.value;
        const password = form.elements.password.value;
        if ( !email || !password ) {
            e.preventDefault();
            InsecureBlogApp.toast( 'danger', "Email and password required" );
        }
    }
    // setup the event handler
    document.getElementById( 'loginSubmit' )
        .addEventListener( 'click', InsecureBlogApp.loginHandler );
} );
