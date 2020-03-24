const User = require( '../models/user.model' );
const Role = require( '../models/role.model' );
const UserDb = require( '../db/user.db' );
const RolesDb = require( '../db/roles.db' );
const PermissionDb = require( '../db/permissions.db' );
const Common = require( './common' );
const bcrypt = require( 'bcryptjs' );
const crypto = require( 'crypto' );

const SALT_ROUNDS = parseInt( process.env.SALT_ROUNDS );
const STAMP_ROUNDS = parseInt( process.env.STAMP_ROUNDS );

const EMAIL_PASSWORD_INCORRECT = 'Email or Password was incorrect.';
const EMAIL_NOT_FOUND = 'The email address you entered was not found.';
const RESET_PASSWORD_EMAIL_SENT = 'An email was sent to you.';
const PASSWORD_RESET_TOKEN_INVALID = 'Your reset token is invalid or expired.';
const PASSWORD_UPDATED = 'Your password has been updated.';
const USER_EXISTS = 'Username already taken.';
const EMAIL_EXISTS = 'An account already exists using this email address.';
const CREATE_USER_FAILED = 'User could not be created.';

class UserController {
    static async login( req ) {
        const email = req.body.email;
        const password = req.body.password;
        const data = await UserDb.getByEmail( email );
        if ( data ) {
            const result = await bcrypt.compare( password, data.password );
            if ( result ) {
                const userModel = new User( data );
                const userRoles = await RolesDb.getForUser( userModel.id );
                for ( let urRole of userRoles ) {
                    userModel.roles.push( new Role( urRole ) );
                }
                return Common.GenerateResult.Ok( userModel );
            } else {
                return Common.GenerateResult.NotAuthorized( EMAIL_PASSWORD_INCORRECT );
            }
        } else {
            // in debug mode we could say user doesn't exist here
            // calculate hash to create a delay (don't leak fact that user doesn't exist)
            await bcrypt.hash( password, SALT_ROUNDS );
            return Common.GenerateResult.NotAuthorized( EMAIL_PASSWORD_INCORRECT );
        }
    }

    static async register( req ) {
        const password = req.body.password;
        const tmpUser = new User(req.body);
        console.log(tmpUser)
        try {
            const data = await UserDb.getByEmail( tmpUser.email );
            if ( data ) {
                // user already exists
                // calculate hash anyway to create a delay (discourage email snooping)
                await bcrypt.hash( password, SALT_ROUNDS );
                return Common.GenerateResult.AlreadyExists( EMAIL_EXISTS );
            } else {
                const hash = await bcrypt.hash( password, SALT_ROUNDS );
                const user = await UserDb.register( tmpUser.username, tmpUser.email, hash );

                if ( user ) {
                    await RolesDb.giveRoleToUser( user.id, tmpUser.roleId || RolesDb.Roles.Subscriber );
                    await UserController.updateSecurityStamp( user );
                    const userRoles = await RolesDb.getForUser( user.id );
                    const userModel = new User( user );
                    for ( let urRole of userRoles ) {
                        userModel.roles.push( new Role( urRole ) );
                    }
                    return Common.GenerateResult.Ok( userModel );
                } else {
                    return Common.GenerateResult.Error( CREATE_USER_FAILED );
                }
            }
        } catch ( e ) {
            console.error( e );
            if ( e.code === '23505' && e.constraint === 'users_username_key' ) {
                return Common.GenerateResult.Error( USER_EXISTS );
            }
            throw new Error( e );
        }
    }

    static async forgotPassword( req ) {
        try {
            const emailAddress = req.body.emailAddress;
            const userBlob = await UserDb.getByEmail( emailAddress );
            if ( userBlob ) {
                const user = new User( userBlob );
                // token length is fixed in database
                const token = crypto.randomBytes( 30 )
                    .toString( 'hex' );

                // calculate hash to create a delay (discourage email snooping)
                await bcrypt.hash( token, STAMP_ROUNDS );

                await UserDb.updateForgotPasswordToken( user.id, token );
                const email = `${process.env.RESET_PASSWORD_URL}?token=${token}`;

                // This is where we sould send the email. Instead we'll output to console for this app.
                console.log( `Reset url sent to ${user.email}` );
                console.log( email );
                return Common.GenerateResult.Ok( RESET_PASSWORD_EMAIL_SENT );
            } else {

                return Common.GenerateResult.NotFound( EMAIL_NOT_FOUND );
            }
        } catch ( e ) {
            await bcrypt.hash( crypto.randomBytes( 20 )
                .toString( 'hex' ), STAMP_ROUNDS );
            return Common.GenerateResult.Error( e.message );
        }
    }

    static isForgotPasswordTokenValid( user, token ) {
        if ( user.forgot_password_token !== token ) return false;
        if ( UserController.isForgotPasswordTokenExpired( user ) ) return false;
        return true;
    }

    static isForgotPasswordTokenExpired( user ) {
        if ( !user.forgot_password_timestamp ) return true;
        const tokenAge = Date.now() - Date.parse( user.forgot_password_timestamp );
        return tokenAge >= process.env.RESET_PASSWORD_TOKEN_MAX_AGE_MINUTES * 60 * 1000;
    }

    static async resetPassword( req ) {
        try {
            const emailAddress = req.body.emailAddress;
            const token = req.body.token;
            const password = req.body.password;

            const user = await UserDb.getByEmail( emailAddress );
            console.log( user )
            if ( user ) {
                if ( UserController.isForgotPasswordTokenValid( user, token ) ) {
                    await UserController.updatePassword( user, password );
                    return Common.GenerateResult.Ok( PASSWORD_UPDATED );
                }

                return Common.GenerateResult.Error( PASSWORD_RESET_TOKEN_INVALID );
            }

            return Common.GenerateResult.Error( PASSWORD_RESET_TOKEN_INVALID );
        } catch ( e ) {
            console.error( e );
            return Common.GenerateResult.Error( PASSWORD_RESET_TOKEN_INVALID );
        }
    }

    static async changePassword( req ) {
        try {
            const emailAddress = req.body.emailAddress;
            const password = req.body.password;

            const user = await UserDb.getByEmail( emailAddress );
            if ( user ) {
                const passwordValid = await bcrypt.compare( password, user.password );
                if ( passwordValid ) {
                    await UserController.updatePassword( user, password );
                    return Common.GenerateResult.Ok( PASSWORD_UPDATED );
                }

                return Common.GenerateResult.NotAuthorized( EMAIL_PASSWORD_INCORRECT );
            } else {
                // in debug mode we could say user doesn't exist here
                // calculate hash to create a delay (don't leak fact that user doesn't exist)
                await bcrypt.hash( password, SALT_ROUNDS );
                return Common.GenerateResult.NotAuthorized( EMAIL_PASSWORD_INCORRECT );
            }
        } catch ( e ) {
            console.error( e );
            return Common.GenerateResult.Error( e.message );
        }
    }

    static async getUserRolesPermissions( user ) {
        const roles = RolesDb.getForUser( user.id );
        const permissions = PermissionDb.getForUser( user.id );
        return { roles: await roles, permission: await permissions };
    }

    static async updateSecurityStamp( user ) {
        const stampData = JSON.stringify( user );
        const hmac = crypto.createHmac( 'sha256', crypto.randomBytes( 40 )
            .toString( 'hex' ) );
        const secstamp = hmac.update( stampData )
            .digest( 'hex' );
        await UserDb.updateSecurityStamp( user.id, secstamp );
    }

    static async updatePassword( user, password ) {
        const hash = await bcrypt.hash( password, SALT_ROUNDS );
        await UserDb.updatePassword( user.id, hash );
        await UserDb.updateForgotPasswordToken( user.id, null );
        await UserController.updateSecurityStamp( user );
    }
}

module.exports = UserController;
