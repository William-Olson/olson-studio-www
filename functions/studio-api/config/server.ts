export default {
  encryptKey: process.env['OS_ENCRYPTION_KEY'] || 'ReplaceThisKeySecret',
  jwtSecret: process.env['OS_JWT_SECRET'] || 'ReplaceThisJwtSecret'
};
