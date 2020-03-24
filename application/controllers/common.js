class ControllerResultStatus {
  static Ok = { name: 'Ok', code: 200 };
  static Error = { name: 'Error', code: 500 };
  static NotFound = { name: 'NotFound', code: 404 };
  static NotAuthorized = { name: 'NotAuthorized', code: 401 };
  static AlreadyExists = { name: 'AlreadyExists', code: 403 };

}

class Result {
  constructor( status, payload ) {
    this.status = status.name;
    this.statusCode = status.code;
    this.payload = payload;
  }
}

class ResultOk extends Result {
  constructor( payload = null ) {
    super( ControllerResultStatus.Ok, payload );
  }
}

class ResultError extends Result {
  constructor( payload = null ) {
    super( ControllerResultStatus.Error, payload );
  }
}

class ResultNotFound extends Result {
  constructor( payload = null ) {
    super( ControllerResultStatus.NotFound, payload );
  }
}

class ResultNotAuthorized extends Result {
  constructor( payload = null ) {
    super( ControllerResultStatus.NotAuthorized, payload );
  }
}

class ResultAlreadyExists extends Result {
  constructor( payload = null ) {
    super( ControllerResultStatus.AlreadyExists, payload );
  }
}

class GenerateResult {
  static Ok( payload ) {
    return new ResultOk( payload );
  }

  static NotFound( payload = 'Not found' ) {
    return new ResultNotFound( payload );
  }

  static NotAuthorized( payload = 'User is not authorized' ) {
    return new ResultNotAuthorized( payload );
  }

  static Error( payload = 'An error occurred' ) {
    return new ResultError( payload );
  }

  static AlreadyExists( payload = 'Already exists' ) {
    return new ResultAlreadyExists( payload );
  }
}

class PaginatedPayload {
  constructor(count=0, postCountLimit=0, pageNumber=0, payload=null) {
    this.count = count;
    this.pageLimit = postCountLimit;
    this.page = pageNumber;
    this.posts = payload;
  }
}

module.exports = { 
  GenerateResult, 
  ResultAlreadyExists, 
  ResultError, 
  ResultNotAuthorized, 
  ResultNotFound, 
  ResultOk,
  PaginatedPayload
};
