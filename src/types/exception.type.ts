export class InvalidCommandInteractionException extends Error {
  constructor() {
    super("This Interaction is not of CommandInteraction type");
  }
}
export class InvalidEmbedAuthorException extends Error {
  constructor() {
    super("Author name can not be empty.");
  }
}
export class InvalidEmbedDateException extends Error {
  constructor(parameter: Date) {
    console.error(parameter);

    super("The Date constructor has received an invalid parameter.");
  }
}
export class InvalidEmbedDescriptionException extends Error {
  constructor() {
    super("Embed description can not be empty/undefined");
  }
}
export class InvalidEmbedFieldsException extends Error {
  constructor(fields: unknown) {
    console.error(fields);

    super("Incomplete EmbedField provided. Once defined, both Name and Value have to be present.");
  }
}
export class InvalidURLException extends Error {
  constructor(url: string) {
    super("Supplied parameter is not a valid URL: " + url);
  }
}
