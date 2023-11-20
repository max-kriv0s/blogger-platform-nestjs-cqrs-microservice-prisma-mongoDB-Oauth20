import { ExceptionCodes } from './exceptionCodes';

export class CustomError {
  constructor(
    protected readonly _message: string,
    protected readonly _code?: number,
  ) {}

  get code(): number {
    return this._code;
  }

  get message(): string {
    return this._message;
  }
}

export class BadRequestError extends CustomError {
  constructor(msg: string) {
    super(msg, ExceptionCodes.BadRequest);
  }
}

export class UnauthorizedError extends CustomError {
  constructor(msg: string) {
    super(msg, ExceptionCodes.Unauthorized);
  }
}

export class ForbiddenError extends CustomError {
  constructor(msg: string) {
    super(msg, ExceptionCodes.Forbidden);
  }
}

export class NotFoundError extends CustomError {
  constructor(msg: string) {
    super(msg, ExceptionCodes.NotFound);
  }
}

export class InternalServerError extends CustomError {
  constructor(msg: string) {
    super(msg, ExceptionCodes.InternalServerError);
  }
}
