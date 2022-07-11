(async function () {
  const crypto = await import('crypto');
  Object.defineProperty(global, 'crypto', {
    value: crypto
  });
})();
export {};
