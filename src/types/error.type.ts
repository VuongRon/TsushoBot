/* --- Error Types Definitions

export class <ErrorName>Error extends Error {
  constructor(m: string) {
    super(m);

    Object.setPrototypeOf(this, <ErrorName>Error.prototype);
  }
}

*/

/** Error type thrown when performing a search on a Set of elements other than Objects */
export class SetContentMismatchError extends Error {
  constructor(m: string) {
    super(m);

    Object.setPrototypeOf(this, SetContentMismatchError.prototype);
  }
}

/** Error type thrown when the given property does not exist in the inspected Object */
export class PropertyNotFoundError extends Error {
  constructor(m: string) {
    super(m);

    Object.setPrototypeOf(this, PropertyNotFoundError.prototype);
  }
}
