const RxController = require( './rx.controller' );
const express = require( 'express' );
const router = express.Router();

new RxController( router );

module.exports = router;
