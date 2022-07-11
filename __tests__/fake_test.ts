export {};

test('some test should succeed', () => {
  expect(true).toBeTruthy();
});

test('should inject crypto as a global', () => {
  expect(global.crypto).toBeDefined();

  // test randomBytes
  const res: string = (global.crypto as any).randomBytes(32).toString('hex');

  expect(Buffer.byteLength(Buffer.from(res, 'hex'))).toBe(32);
});
