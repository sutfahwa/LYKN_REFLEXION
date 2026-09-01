const test = require('node:test');
const assert = require('node:assert/strict');
const { buildSeatKey, normalizeSegment } = require('../shared/seatKey.js');

test('normalizeSegment: zone variants all match', () => {
  assert.equal(normalizeSegment('b'), 'B');
  assert.equal(normalizeSegment('B'), 'B');
  assert.equal(normalizeSegment('โซน B'), 'B');
  assert.equal(normalizeSegment('  โซน b  '), 'B');
});

test('normalizeSegment: seat number variants all match (incl. Thai digits)', () => {
  assert.equal(normalizeSegment('2'), '002');
  assert.equal(normalizeSegment('02'), '002');
  assert.equal(normalizeSegment('๒'), '002');
  assert.equal(normalizeSegment('เลขที่ 2'), '002');
  assert.equal(normalizeSegment('ที่นั่ง ๐๒'), '002');
});

test('normalizeSegment: row prefix word stripped', () => {
  assert.equal(normalizeSegment('แถว AA'), 'AA');
  assert.equal(normalizeSegment('aa'), 'AA');
});

test('normalizeSegment: already-padded 3-digit stays 3-digit', () => {
  assert.equal(normalizeSegment('012'), '012');
});

test('normalizeSegment: 4+ digit numbers are not truncated, only left-padded if shorter than 3', () => {
  assert.equal(normalizeSegment('1234'), '1234');
});

test('normalizeSegment: non-numeric row is left as uppercase text, not padded', () => {
  assert.equal(normalizeSegment('u'), 'U');
  assert.equal(normalizeSegment('AA'), 'AA');
});

test('buildSeatKey: full key format is show_id|ZONE|ROW|SEAT', () => {
  assert.equal(
    buildSeatKey({ showId: '2569-10-24', zone: 'b', row: 'a', seat: '12' }),
    '2569-10-24|B|A|012'
  );
});

test('buildSeatKey: three equivalent raw inputs produce an identical key', () => {
  const variants = [
    { showId: '2569-10-24', zone: 'b', row: 'aa', seat: '2' },
    { showId: '2569-10-24', zone: 'B', row: 'AA', seat: '02' },
    { showId: '2569-10-24', zone: 'โซน B', row: 'แถว AA', seat: '๒' },
  ];
  const keys = variants.map(buildSeatKey);
  assert.equal(keys[0], keys[1]);
  assert.equal(keys[1], keys[2]);
  assert.equal(keys[0], '2569-10-24|B|AA|002');
});

test('buildSeatKey: different zones never collide', () => {
  const a = buildSeatKey({ showId: '2569-10-24', zone: 'A', row: 'AA', seat: '1' });
  const b = buildSeatKey({ showId: '2569-10-24', zone: 'B', row: 'AA', seat: '1' });
  assert.notEqual(a, b);
});

test('buildSeatKey: different show_id (round) never collides even with same seat', () => {
  const fri = buildSeatKey({ showId: '2569-10-23', zone: 'A', row: 'AA', seat: '1' });
  const sat = buildSeatKey({ showId: '2569-10-24', zone: 'A', row: 'AA', seat: '1' });
  assert.notEqual(fri, sat);
});
