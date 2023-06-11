/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.addColumn('notes', {
    owner: {
      type: 'VARCHAR(50)',
      reference: 'users',
      onDelete: 'cascade',
    },
  });
};

exports.down = (pgm) => {
  pgm.dropColumn('notes', 'owner');
};
