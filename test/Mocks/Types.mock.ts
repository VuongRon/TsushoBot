// These types are temporary until the exact type is figured out
// This is for testing purposes only, so they don't need to be moved to globalTypes file

/**
 * Allows creating a custom user for new Interactions.
 *
 * NOTE: this can't be of APIUser type.
 */
export type FakeUser = { id: string; discriminator: string; username: string; avatar: string };

/** Allows building a full Interaction Object if we have more data than just slash command (id/name) */
export type FakeInteractionOptions = {
  id: string;
  name: string;
  options: [
    { name: string; type: number; options: [{ name: string; type: number; value: string | number | boolean }] }
  ];
};

/** Allows creating the simplest Interaction object for simple command testing purposes */
export type FakeBasicInteractionOptions = {
  id: string;
  name: string;
};
