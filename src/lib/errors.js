export class AuthError extends Error {
  constructor(message = 'Invalid credentials. Please reconnect.') {
    super(message);
    this.name = 'AuthError';
  }
}

export class SchemaError extends Error {
  constructor(message = 'Database schema does not match what this app expects.') {
    super(message);
    this.name = 'SchemaError';
  }
}
