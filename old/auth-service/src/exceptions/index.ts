export class ServerException extends Error {
  constructor(public cause: any) {
    super(cause);
  }
}
