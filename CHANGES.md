# Changes

## 4.1.1

- [`8c5a835`](https://github.com/offen/analyticstxt-parser/commit/8c5a8356f396969e7bda6478133a977b86f1ed91)
  Update minimist to fix Prototype Pollution CVE (Frederik Ring)

## 4.1.0

- [`f6cc188`](https://github.com/offen/analyticstxt-parser/commit/f6cc18854b96885f00b781fcbecd832bedf6326d)
  add basic test for explainer (Frederik Ring)
- [`ef1becd`](https://github.com/offen/analyticstxt-parser/commit/ef1becd206015091b8ac0ceee5adab114420fb37)
  add documentation on explain method (Frederik Ring)
- [`26835bd`](https://github.com/offen/analyticstxt-parser/commit/26835bd5025c60a3df4e56c4c407950e5ac87fdc)
  render explainer in vue template instead of markdown (Frederik Ring)
- [`fa80412`](https://github.com/offen/analyticstxt-parser/commit/fa804128e7c960cea3037df83e8948de21d7393e)
  allow for custom formatting of explanation result (Frederik Ring)
- [`8656a98`](https://github.com/offen/analyticstxt-parser/commit/8656a98975f9e71efce5005f8fcb243a6278af41)
  Proof read explainer content (Frederik Ring)
- [`af4f34f`](https://github.com/offen/analyticstxt-parser/commit/af4f34f7f795a692cf73b9de937b32754ae452fe)
  Proof read explainer copy (Frederik Ring)
- [`1bd9f91`](https://github.com/offen/analyticstxt-parser/commit/1bd9f912101ba373a220e95f7566363af63538ad)
  Handle missing fields on minimal doc (Frederik Ring)
- [`e4f6a7e`](https://github.com/offen/analyticstxt-parser/commit/e4f6a7eed49bb3bfea202fb131119efe45cd0650)
  Tweak explainer content according to feedback (Frederik Ring)
- [`29259f1`](https://github.com/offen/analyticstxt-parser/commit/29259f10b352aa5bd5f394a7782ce21eaa3d8cce)
  Start adding explainer content (Frederik Ring)
- [`6753fa7`](https://github.com/offen/analyticstxt-parser/commit/6753fa7eb11b97e0fb94beb53686f022288fd694)
  add templating for node and browser (Frederik Ring)
- [`18b41a2`](https://github.com/offen/analyticstxt-parser/commit/18b41a291344ab7e4c2f53664ea5a39a26fa3afb)
  scaffold explain command (Frederik Ring)

## 4.0.0

- [`1b78b3d`](https://github.com/offen/analyticstxt-parser/commit/1b78b3dbbba11d344526bed654928fa8e81b47a6)
  Adjust to draft-03 (Frederik Ring)
- [`f80d85a`](https://github.com/offen/analyticstxt-parser/commit/f80d85a2a60655d98d1afe76e116d791b9d1d1a9)
  Update README.md (Hendrik Niefeld)

## 3.0.0

- [`8625a99`](https://github.com/offen/analyticstxt-parser/commit/8625a99b6d4506ab9b6e14877975a5ad520664db)
  fix pattern for downloading allowed drafts (Frederik Ring)
- [`ddba598`](https://github.com/offen/analyticstxt-parser/commit/ddba59830582cb3eb9fda58659b88baefe7dad69)
  run npm audit fix (Frederik Ring)
- [`bcdccc1`](https://github.com/offen/analyticstxt-parser/commit/bcdccc1ba933c4541554a0e53185cd273ffb8c7e)
  adjust schema to match draft version 02 (Frederik Ring)

## 2.2.0

- [`ea749f7`](https://github.com/offen/analyticstxt-parser/commit/ea749f76b5b4fa55eed414434e19a831df63f592)
  implement throwing versions of public methods (Frederik Ring)
- [`28ef253`](https://github.com/offen/analyticstxt-parser/commit/28ef253b4ed91abc92685ae0a64a2c5625bce33b)
  add custom error messages to schema failures (Frederik Ring)

## 2.1.0

- [`c1902d6`](https://github.com/offen/analyticstxt-parser/commit/c1902d651342df25402381421be434190853d37f)
  validate draft name before calling through to ietf (Frederik Ring)
- [`048d347`](https://github.com/offen/analyticstxt-parser/commit/048d3473766f79d780a9c93d29ecbd1c4fa696c4)
  return early on download failure (Frederik Ring)
- [`011542f`](https://github.com/offen/analyticstxt-parser/commit/011542f3792eb2b25761f1ef4f859f9b7c7a92e5)
  add cli command for downloading draft doc from IETF (Frederik Ring)

## 2.0.0

- [`230cf5f`](https://github.com/offen/analyticstxt-parser/commit/230cf5ff295f09fbc3acdd5c433b9fad8e5cd67c)
  use esbuild for bundling and provide global and commonjs versions (Frederik Ring)
- [`6a690ba`](https://github.com/offen/analyticstxt-parser/commit/6a690babb4cb26c65d3ae3f878ce11a94ae3abed)
  add draft-01 (Frederik Ring)
- [`9374b73`](https://github.com/offen/analyticstxt-parser/commit/9374b737dd9e69ae10584224b2cc052daf177724)
  babelify code for use in browser envs (Frederik Ring)
- [`d903bc6`](https://github.com/offen/analyticstxt-parser/commit/d903bc64b1ea2fc2f9c7f208d8cbb721b67c91bc)
  remove obsolete intermediate variable (Frederik Ring)
- [`41cee53`](https://github.com/offen/analyticstxt-parser/commit/41cee53a15001812fefad79aedf4796371f276b5)
  leverage default args for minimist flags (Frederik Ring)
- [`5deeeb8`](https://github.com/offen/analyticstxt-parser/commit/5deeeb8ff26aee2542a1cfcd1c9c2432fde4d36b)
  improve behavior when piping from stdin (Frederik Ring)
- [`847259d`](https://github.com/offen/analyticstxt-parser/commit/847259deaa85699ea90fe193d1933e630109ba4d)
  fall back to object keys when no ordering is given (Frederik Ring)
- [`9d641bf`](https://github.com/offen/analyticstxt-parser/commit/9d641bfb44be1231070f67043663aeac784803e3)
  require ordering items to be unique (Frederik Ring)
- [`b411981`](https://github.com/offen/analyticstxt-parser/commit/b411981d99ab71dc1ccdcbee802193fe0785d7b2)
  add jsdoc to public facing library code (Frederik Ring)
- [`8e80429`](https://github.com/offen/analyticstxt-parser/commit/8e804298056f960858ad03ef0346ecffc6cb73e4)
  add version subcommand (Frederik Ring)
- [`0beeb23`](https://github.com/offen/analyticstxt-parser/commit/0beeb239aa96067ba7df0600b3923908ce6e6b2c)
  make comments field optional (Frederik Ring)
- [`65dce1b`](https://github.com/offen/analyticstxt-parser/commit/65dce1bab3b28389a2d0475c211891c94f0e7502)
  run npm ci in ci (Frederik Ring)
- [`e5ef9ba`](https://github.com/offen/analyticstxt-parser/commit/e5ef9ba4c1f6fa1f60cf3cd6cb6bc22563c68dce)
  also parse and serialize comments (Frederik Ring)
- [`d3a602b`](https://github.com/offen/analyticstxt-parser/commit/d3a602b9f6f86004e0176f0e7c28787ad94c6fca)
  leverage minimist aliases for gnu-style flags (Frederik Ring)

## 1.0.2

- [`8339e00`](https://github.com/offen/analyticstxt-parser/commit/8339e000316dcf6ade030ac762cff55f4d9196ec)
  pass public access value when publishing (Frederik Ring)

## 1.0.1

- [`295ce9f`](https://github.com/offen/analyticstxt-parser/commit/295ce9f3e008a9581e7731e023b863f357e1361b)
  explicitly declare package as public (Frederik Ring)

## 1.0.0

- [`6b57cc5`](https://github.com/offen/analyticstxt-parser/commit/6b57cc5be5ab775e3f6249030de8e95d350ceaff)
  prepare initial release after draft submission (Frederik Ring)
