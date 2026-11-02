# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is
Battle Crab: a third-person game about a hermit crab whose shell carries a weapon platform the
player builds from wood, weapons and found objects. Drawn by the Gridfall Engine
(`EdSpurrier/gridfall-engine`, raw WebGL2), installed as a package at a release tag in
`package.json`. The engine is shared with Gridfall Next (`../gridfall-next`): it is one repo, not
forked per game.

## Commands
```bash
npm install          # installs gridfall-engine from GitHub at the tag in package.json (and builds it)
npm run dev          # http://localhost:5182
npm run dev:engine   # the same, but on ../gridfall-engine's source (an engine feature being built next door)
npm run typecheck    # tsc --noEmit
npm run build        # typecheck + vite build
npm run deploy       # build for GitHub Pages (base /battle-crab/) and push dist/ to the gh-pages branch
```

## Layout
```
src/main.ts     bootstrap: scene, input (mouse orbits with no button held, pointer lock on click; WASD walks
                relative to the camera), the frame
src/camera.ts   ThirdPersonCamera (the engine's CameraLike: eye / view / projection / target / distance)
src/ground.ts   the sand the crab walks on (engine terrain, flat for now)
src/player.ts   the player: position, facing (the camera's while moving), velocity; drives the crab
src/crab.ts     the crab built from code (body, spiral shell, eye stalks, claws, three leg pairs) with
                procedural walking: rest spots per foot, steps in two alternating groups, two-bone IK per leg
src/settings.ts SettingsPanel: sections of toggles / sliders (handle-less bars with an editable number) / choices /
                colours / buttons on live getters and setters, kept in localStorage (or not: persist false)
src/look.ts     the Look (Tab): camera projection, field of view, ground clearance, near fade, depth of field (focus
                on the crab or by hand); distance fog (start, end, colour tint; pushed back by the orthographic
                eye's extra distance); volumetric haze; mist banks
src/ui.css      the HUD (black text, no shadow), crosshair and panel styles, shared by every page
```

## Deploying
`npm run deploy` builds with `--base=/battle-crab/` and pushes `dist/` to the `gh-pages` branch
(the `gh-pages` package); GitHub Pages serves that branch at https://edspurrier.github.io/battle-crab/.
The build runs locally, so the private engine needs no token in CI.

## Game feel decided so far
- The mouse orbits the camera with no button held (pointer lock on any click, Esc releases). A
  standing crab does not turn with the camera (you can look at its face). While any key is held the
  crab turns, eased, to face the camera's way and moves relative to it: W/S forward and back along
  the look, A/D a sidestep across it (it does not turn to face a sidestep or a back-pedal).
- The shell is the build site for the weapon platform; its spire curls up and to the crab's right.
- The camera never goes under the ground: `ThirdPersonCamera.clearance` (a setting) is how high the eye
  stays; the tilt shown is raised from the one asked for when needed. Things close to the eye fade
  (`renderer.nearFade`, a setting); the ground's materials have `nearFade: false` so only what stands on it does.
- Pointer lock is asked for on mousedown and again on click of the same gesture, so the first press
  that gives the window focus is enough in a real browser (the embedded pane refuses it altogether).
- Crab body space (`src/crab.ts`): the crab faces +z and +x is its LEFT (right-handed, +y up).

## Rules
- Engine work (new rendering features, fixes) goes in `../gridfall-engine` on a `feature/*` branch
  there, game-agnostic, released as a tag; then bump the tag here. Battle-Crab-only looks live
  here, built on top of what the renderer exports.
- Input, camera behaviour, game state, UI and sound are this repo's; the engine only draws.
- Column-major matrices, right-handed, +y up (the engine's conventions). `multiply` and the other
  matrix helpers must not be given one of their inputs as `out`.
- Repo flow: `main` (released) + `develop`, `feature/*` branches, PRs merged with merge commits,
  releases as `vX.Y.0` tags. Commits end with `Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>`.
