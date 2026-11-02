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
npm run dev          # http://localhost:5182 (the game), /build.html (the Battle Shell), /editor.html (the map maker), /models.html (models)
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
src/map.ts      MapData: a level per cell (LEVEL_HEIGHT, MAX_LEVEL), a tile per cell, mist banks (MistDef), the spawn;
                defaults, validation, localStorage (the game loads what the map maker last saved), file download / read
src/tiles.ts    the ground tiles (TILES): canvas-drawn, seeded, seamless; a map's paint indexes them
src/ground.ts   the beach from a map: engine terrain (levels; one step slopes, more is a cliff) with its top splatted
                from the tiles; rebuild (levels changed), paint + commit (a cell's tile), setGrid, dispose
src/mist.ts     MistSet: the map's banks as fog volumes, kept in step with their defs (sync), a thickness over all
src/editor.ts   the map maker (editor.html): orbit camera; an icon toolbar down the left (SVG paths in TOOLS /
                ICONS, a tooltip per button from data-tip) with raise / lower / flatten / smooth under a round
                brush, paint, mist (click empty ground: new bank; click or drag a bank; a bank list for the
                beach-wide layer), start; the tool's options beside the toolbar (rebuilt per tool); the chosen
                bank's controls on the right; saves as you go; Download / Load / New in the toolbar
src/player.ts   the player: position, facing (the camera's while moving), velocity; drives the crab
src/controls.ts the two control schemes (settings or C), topdown the default: "3rd person" (mouse orbits, pointer lock) and "topdown"
                (orthographic 45° follow view; WASD on the view; the mouse aims a ground marker the crab faces;
                Q/E turn); the third-person camera's settings are kept while in top down
src/pick.ts     pickGround: the ground point under a screen position (ray march + bisection on the heightfield)
src/overlayShapes.ts  bands on the ground (rings, footprints, the aim marker) as overlay data
src/models.ts   the model viewer (models.html): every .glb in Models/ (import.meta.glob), clips, turntable, wireframe
src/shell.ts    the Battle Shell: 5 shell types (deck grid, speed / jump / armour, looks), piece kinds (plank, joint,
                cannon, gatling, machine gun, flamethrower, bommy knocker), a build (shell + pieces in deck cells),
                cell geometry on the shell, localStorage (the game wears what the build screen last saved)
src/structure.ts the build drawn on the crab: a mesh per piece in body space, weapons with a moving part (kick, spin)
src/weapons.ts  Arsenal: the chosen weapon fires on the trigger (cannon balls with gravity, tracers, flame, a swing),
                shots are particles and a ball mesh; nothing is hit yet
src/buildScreen.ts the build screen (build.html): shell cards, piece palette, a lit cell under the pointer; left
                places, right removes, R turns; weapons take action slots 2-5 in placement order (4 at most)
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

## Assets
`Models/*.glb` are the game's source models (the siege snail rig is the first); the model viewer lists
them automatically. Keep the folder flat; a file dropped in shows on the next dev reload or build.

## Game feel decided so far
- Walk 4.8 units a second, run (Shift) 1.75 × that (`Player.speed`, `Player.runFactor`). Space jumps.
  The gait steps slowly with long strides (STEP_TRIGGER, STEP_SECONDS, STEP_LEAD in crab.ts).
- Actions: 1 is the claws, 2-5 the weapons on the shell in build order. The left button fires the chosen
  action (claws take turns: `Crab.snapNext`); the right button aims down the barrel (`camera.aimZoom`:
  narrower view, camera in). Googly eyes: pupils are weights on springs.
- The mouse orbits the camera with no button held (pointer lock on any click, Esc releases). A
  standing crab does not turn with the camera (you can look at its face). While any key is held the
  crab turns, eased, to face the camera's way and moves relative to it: W/S forward and back along
  the look, A/D a sidestep across it (it does not turn to face a sidestep or a back-pedal).
- The shell is the build site for the weapon platform; its spire curls up and to the crab's right.
- The settings panel never pauses the game: keys walk and the mouse orbits while it is open (not over the
  panel); opening it only gives the cursor back. Camera rig settings (`lift`, `height`, `aim`, `shoulder`,
  `distance`, `stiffness`): lift raises eye and look-at point together so the camera still faces forward.
- The camera never goes under the ground: `ThirdPersonCamera.clearance` (a setting) is how high the eye
  stays; the tilt shown is raised from the one asked for when needed. The eye checked is the virtual
  one at the zoom distance (the orthographic eye is 200 back and its height means nothing); in
  orthographic the ray behind it is checked too, so parallel rays do not pass through a rise behind. Things close to the eye fade
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
