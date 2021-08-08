import "../src/extensions/SetExtensions";
import { name } from "faker";
import { PropertyNotFoundError, SetContentMismatchError } from "../src/types/error.type";

/** Defines the Person type only for testing purposes */
type Person = {
  name: string;
  lastName: string;
  jobTitle: string;
};

const people = new Set<Person>();

/** Creates and returns a new Fake person. Allows overriding the object properties  */
function newPerson(firstName?: string, lastName?: string, jobTitle?: string): Person {
  return {
    name: firstName ?? name.findName(),
    lastName: lastName ?? name.lastName(),
    jobTitle: jobTitle ?? name.jobTitle(),
  };
}

/** Insert new people once, since we don't need to create a new set on each test */
beforeAll(() => {
  for (let x = 0; x < 5; x++) {
    people.add(newPerson());
  }
});

describe("Test: Set.findObject()", () => {
  it("can search in a Set of objects", () => {
    // Insert a new test person into the set
    const testPerson: Person = newPerson();
    people.add(testPerson);

    // Make sure that search can be performed by any key in the given set
    // Note: both findObject() and findAllObjects() perform the same search,
    // so there's no need to duplicate this test in another method
    Object.keys(testPerson).forEach((key: string) => {
      const result: Person | undefined = people.findObject(testPerson[key as keyof Person], key);

      expect(result).toBeTruthy();
    });
  });

  it("returns undefined when no matches are found", () => {
    // Try to look for something that does not exist in the set
    // This assumes that searched Property exists in the given set
    const result: Person | undefined = people.findObject("something", "name");

    expect(result).toBeUndefined();
  });

  it("will throw PropertyNotFoundError when performing a search against non-existing property", () => {
    expect(() => people.findObject("something", "nonExistingProperty")).toThrowError(PropertyNotFoundError);
  });

  it("will throw SetContentMismatchError of the Set elements are of different type than required", () => {
    const testSet: Set<string[]> = new Set<string[]>();
    testSet.add(["a", "b", "c"]);

    expect(() => testSet.findObject("a", "a")).toThrowError(SetContentMismatchError);
  });
});

describe("Test: Set.findAllObjects()", () => {
  it("can return multiple results", () => {
    const searchCriteria = {
      /** Value we will be searching for */
      searchBy: "TestTitle",
      /** Value to look for in the object keys - searching for users of jobTitle: "TetsTitle" */
      searchIn: "jobTitle",
    };

    // We need to insert two objects into our pre-defined set of people according to our test searchCriteria
    people.add(newPerson(undefined, undefined, searchCriteria.searchBy));
    people.add(newPerson(undefined, undefined, searchCriteria.searchBy));

    const searchResults: Person[] | undefined | undefined = people.findAllObjects(
      searchCriteria.searchBy,
      searchCriteria.searchIn
    );

    // We know these people exist in the Set
    expect(searchResults!.length).toEqual(2);
  });

  // We have to cover the same test for multiple objects in both tests
  it("can validate property existence", () => {
    expect(() => people.findAllObjects("something", "nonExistingProperty")).toThrowError(PropertyNotFoundError);
  });

  it("can validate Set element type", () => {
    const testSet: Set<string[]> = new Set<string[]>();
    testSet.add(["a", "b", "c"]);

    expect(() => testSet.findAllObjects("a", "a")).toThrowError(SetContentMismatchError);
  });

  it("returns undefined when no matches are found", () => {
    const result: Person[] | undefined = people.findAllObjects("something", "name");

    expect(result).toBeUndefined();
  });
});

describe("Test: Set.first() / last()", () => {
  it("can return the first/last element from any Set", () => {
    // Test the Set we already have created
    expect(people.first()).toBeDefined();
    expect(people.last()).toBeDefined();

    // Test other sets with different data types too in case we need to get
    const testCases = [[], "test String", 2, new Set<string>(), {}, null, { undefined }];

    for (const testCase of testCases) {
      // Type does not matter here
      // This is fine for having only one element in the set
      const testSet = new Set<any>().add(testCase);

      expect(testSet.first()).toBeDefined();
      expect(testSet.last()).toBeDefined();
    }
  });

  it("returns undefined if the Set is empty", () => {
    expect(new Set<string>().first()).toBeUndefined();
    expect(new Set<string>().last()).toBeUndefined();
  });
});
