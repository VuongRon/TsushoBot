// Warning, __this file is not a module__!!!
const Errors = require("../types/error.type");

declare interface Set<T> {
  /**
   * Iterates over this Set and returns an object within the specified constraints (key-name and value must match).
   *
   * Applies only to Sets of Objects of identical structure.
   *
   * @param   {string}      searchBy  Search phrase - value to look for under the specified property
   * @param   {string}      searchIn  Property name, which will have its value compared to the searchBy
   * @this    {Set<T>}                Set of Objects of identical structure
   *
   * @throws  {SetContentMismatchError|PropertyNotFoundError}
   *
   * @return  {T}                     Object matching the search criteria
   */
  findObject<T>(searchBy: string, searchIn: string): T | undefined;

  /**
   * Alias of findObject() - perform the same search, but returns all matching objects found
   *
   * @param   {string}      searchBy  Search phrase - value to look for under the specified property
   * @param   {string}      searchIn  Property name, which will have its value compared to the searchBy
   * @this    {Set<T>}                Set of Objects of identical structure
   *
   * @throws  {SetContentMismatchError|PropertyNotFoundError}
   *
   * @return  {T[]}                   Objects matching the search criteria
   */
  findAllObjects<T>(searchBy: string, searchIn: string): T[] | undefined;

  /**
   * Returns the first element from this Set or undefined if the set it empty.
   *
   * Applies to Sets of any data
   */
  first<T>(): T | undefined;

  /**
   * Returns the last element from this Set undefined if the set is empty.
   *
   * Applies to Sets of any data
   */
  last<T>(): T | undefined;
}

/**
 * Checks if the given element is an object. If <property> argument is provided,
 * will trigger a property check on that element with the name
 *
 * @param   {any}      element   Element to verify
 * @param   {string}   property  Property name to check on the inspected element
 *
 * @throws  {SetContentMismatchError|PropertyNotFoundError}
 */
function validateSearch(element: any, property: string): void {
  // The Set should only consist of identically structured objects
  if (element.constructor !== Object) {
    throw new Errors.SetContentMismatchError(`This Set contains elements other than Object`);
  }

  // Force the presence of searched property
  if (element.hasOwnProperty(property) === false) {
    throw new Errors.PropertyNotFoundError(`Property '${property}' does not exist on this object`);
  }
}

Set.prototype.findAllObjects = function <T>(searchBy: string, searchIn: string): T[] | undefined {
  const searchResults: T[] = new Array<T>();

  for (const element of this) {
    // Will Throw on validation error
    validateSearch(element, searchIn);

    if (element[searchIn] === searchBy) {
      searchResults.push(element);
    }
  }

  return searchResults.length > 0 ? searchResults : undefined;
};

Set.prototype.findObject = function <T>(searchBy: string, searchIn: string): T | undefined {
  for (const element of this) {
    // Will Throw on validation error
    validateSearch(element, searchIn);

    // Break on the first match
    if (element[searchIn] === searchBy) {
      return element;
    }
  }

  return undefined;
};

Set.prototype.first = function <T>(): T | undefined {
  // Not really an impact on performance even for huge sets...
  return [...this].shift();
};

Set.prototype.last = function <T>(): T | undefined {
  return [...this].pop();
};
