# Battle Crab

A third-person game about a hermit crab. Its shell is a build site: wood, weapons and found objects
bolted on to make a fighting platform. Built in TypeScript on the
[Gridfall Engine](https://github.com/EdSpurrier/gridfall-engine) (WebGL2, no three.js).

## Running
```bash
npm install          # installs gridfall-engine from GitHub at the tag in package.json and builds it
npm run dev          # http://localhost:5182 · mouse to aim, WASD to scuttle, wheel to zoom, click to capture the mouse
npm run dev:engine   # the same on ../gridfall-engine's source, for engine work in progress
npm run typecheck
npm run build
npm run deploy       # build for GitHub Pages and push dist/ to the gh-pages branch
```

Tab opens the settings: camera projection (perspective / orthographic), field of view, depth of field
(focused on the crab or by hand), distance fog, volumetric haze and light shafts, mist banks. Settings
are kept in the browser between visits.

## Playing it online
`npm run deploy` publishes the current build to GitHub Pages at https://edspurrier.github.io/battle-crab/
(the `gh-pages` branch). The build is made locally, so nothing in CI needs access to the private engine.

## The engine
The engine is one shared repo, not a fork per game. Battle Crab pins a release
(`"gridfall-engine": "github:EdSpurrier/gridfall-engine#vX.Y.0"`); to move up, change the tag and
`npm install`. A rendering feature this game needs is added to the engine on a `feature/*` branch
there (game-agnostic, behind a setting), released as a tag, then picked up here. While it is being
built, `npm run dev:engine` runs this game on the sibling checkout's source so it shows straight away.

## Where things are
- `src/main.ts`: the scene, input and the frame loop.
- `src/camera.ts`: the third-person follow camera.
- `src/ground.ts`: the sand (the engine's terrain, flat for now).
- `src/player.ts`: the player's position, facing and velocity.
- `src/crab.ts`: the crab, built from code, with IK legs that step on their own.
- `src/look.ts` and `src/settings.ts`: the settings panel and what it controls.
