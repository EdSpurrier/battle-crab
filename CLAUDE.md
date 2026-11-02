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
src/props.ts    Props: the map's rocks, boulders, clam and snail shells, driftwood and starfish, one procedural
                (lumpy, seeded) mesh per kind, an instance per prop stood on the ground; the solid ones
                (rock, boulder, driftwood) as boxes for shots; pick by reach for the map maker
src/editor.ts   the map maker (editor.html): orbit camera; an icon toolbar down the left (SVG paths in TOOLS /
                ICONS, a tooltip per button from data-tip) with raise / lower / flatten / smooth under a round
                brush, paint, mist (click empty ground: new bank; click or drag a bank; a bank list for the
                beach-wide layer), props (a kind palette; click open ground: new prop; click or drag a prop;
                size, turn, kind, duplicate, delete on the right), start; the tool's options beside the toolbar
                (rebuilt per tool); the chosen bank's or prop's controls on the right; saves as you go;
                Download / Load / New in the toolbar
src/player.ts   the player: position, facing (the camera's while moving), velocity; drives the crab
src/controls.ts the two control schemes (settings or C), topdown the default: "3rd person" (mouse orbits, pointer lock) and "topdown"
                (orthographic 45° follow view; WASD on the view; the mouse aims a ground marker the crab faces;
                Q/E turn); the third-person camera's settings are kept while in top down
src/gamepad.ts  GamepadInput: the first connected pad (standard mapping) polled each frame: left stick moves, right
                stick faces (top down: the aim marker; 3rd person: orbits), LB / RB / LT / RT fire action slots 1-4 outright,
                left stick pressed in runs, A jumps; main.ts merges it over the keys and mouse (PadState)
src/pick.ts     pickGround: the ground point under a screen position (ray march + bisection on the heightfield)
src/overlayShapes.ts  bands on the ground (rings, footprints, the aim marker) as overlay data
src/models.ts   the model viewer (models.html): every .glb in Models/ (import.meta.glob), clips, turntable, wireframe
src/shell.ts    the Battle Shell: 5 shell types (deck grid, speed / jump / armour, looks); materials (wood / metal /
                stone: hp, weight, burns); piece kinds (plank, beam, joint; cannon, gatling, machine gun,
                flamethrower, bommy knocker, spiky ball cannon, fireworks gun) with hp and weight; claw kinds (own,
                tiny / medium / large / uber clampers: scale, damage, weight); a build (shell + pieces + claws);
                cell geometry (cells may reach OVERHANG past the deck on arms), `supported` / `canPlace` (a piece
                needs the deck's floor or a held neighbour), buildWeight / weightFactor; localStorage
src/structure.ts the build drawn on the crab and kept: hp per piece (damage; at 0 it drops to the Loot, and whatever
                it held up falls too; onChange), pickUp(kind) mounts a weapon found on the beach in a free cell
                (freeCell: deck floor first), shedAll() flings everything off (a cracked crab), fire on wood (ignite: damage over time, spreads), per-piece
                hit boxes (boxes: PartRef owners), turrets (aim: pitch only, a gun keeps the yaw it was placed at; pose), the
                knocker's anchor (its chain is the Arsenal's); lights(): a point light over each burning piece; a piece
                that breaks off bursts (impacts.ts shatter: wood splinters, metal sparks and shards, stone chips)
src/weapons.ts  Arsenal: ammo per weapon (AMMO; refill), the chosen weapon fires on the trigger: big cannonballs,
                hitscan tracers, flame (ignites wood), the knocker (Rope: a Verlet chain of links hung from the pole's ring;
                holding hauls the ball back, letting go swings it; hits by ball speed), the spiky ball trailing the same
                chain (fire; a second pull winds the chain onto the drum link by link, dragging the ball home over the sand; caught
                short it drops), fireworks rockets straight at the aim that wander and pop;
                chains of pieces that broke off go with them; hits hurt crabs and pieces;
                lights(dt): the flame's glow, muzzle flashes, rockets and pops (main.ts fills renderer.lights each frame,
                48 at most; a sunlit beach needs intensities in the tens to show)
src/loot.ts     Loot: what came off any shell and lies on the sand. Rubble tumbles, lies 25 s and sinks; a weapon
                rights itself, bobs under a cyan pulse (lights()) and is picked up by walking over it with a slot and a
                cell free (main.ts: structure.pickUp; a notice when it does not fit); at most 12 lie about
src/pickups.ts  ammo crates (refill), health boxes (half back), starfish (8 s invincible); bob, taken by walking over
src/buildScreen.ts the build screen (build.html): shell cards, piece palette, a lit cell under the pointer; left
                places, right removes, R turns; four action slots (MAX_ACTIONS): the claws take the first when they can
                bite (CLAWS[k].works), weapons the rest in placement order; the tiny clampers cannot bite and free a
                fourth weapon slot (maxWeapons); switching claws back drops the extra weapon
src/impacts.ts  World: what shots hit (the heightfield, boulders, the crabs' boxes set each frame in `moving`) with
                surface and normal; impact effects by surface (sand, rock, shell); wreckFx for a cracked crab
src/combat.ts   Combatant (health, hurt), DAMAGE per weapon, crabBox (a crab's hit box, owner = the combatant)
src/enemy.ts    Enemy: a Player with a random shell and build, a blue team tint, a softer Arsenal (damage × 0.3,
                a wandering aim error); a mind that keeps a distance, circles, fires in bursts, jumps; at 0 health it
                collapses, bursts 2.2 s later and is `gone` (main.ts then drops it and counts the kill)
src/lifebars.ts life bars over opponents (projected through the camera) and the player's along the bottom
src/crab.ts     the crab built from code (body, spiral shell, eye stalks, claws, three leg pairs) with
                procedural walking: rest spots per foot, steps in two alternating groups, two-bone IK per leg
src/settings.ts SettingsPanel: sections of toggles / sliders (handle-less bars with an editable number) / choices /
                colours / buttons on live getters and setters, kept in localStorage (or not: persist false)
src/look.ts     the Look (Tab): camera projection, field of view, ground clearance, near fade, depth of field (focus
                on the crab or by hand); distance fog (start, end, colour tint; pushed back by the orthographic
                eye's extra distance); volumetric haze; mist banks
src/ui.css      the look, shared by every page: cyberpunk sci-fi (dark clipped plates, neon cyan --cy, magenta --mg for
                warnings, mono uppercase labels); the crosshair is an SVG in index.html (spinning dashed rings, brackets)
```

## Deploying
`npm run deploy` builds with `--base=/battle-crab/` and pushes `dist/` to the `gh-pages` branch
(the `gh-pages` package); GitHub Pages serves that branch at https://edspurrier.github.io/battle-crab/.
The build runs locally, so the private engine needs no token in CI.

## Assets
`Models/*.glb` are the game's source models (the siege snail rig is the first); the model viewer lists
them automatically. Keep the folder flat; a file dropped in shows on the next dev reload or build.

## Weight
`Player.setWeight(structure.weight() + claws)`: speed and jump scale by `weightFactor` (halved at 45). Called at
the start and from `structure.onChange` as pieces come off.

## Combat so far
Three opponents on the beach at a time (main.ts ENEMIES), spawned at least 14 units from the player, one
replaced 4 s after it is cracked. Health is the shell's armour. Hits flash the crab red. The player cracked
keels over (`Crab.collapse`: a roll about its forward axis in `toWorld`/`poseBody`, the body sinks, the legs splay,
the claws drop, the lids shut; 1.3 s), bursts at 1.2 s, and is back at the spawn after 3.5 s under a "Cracked!" message.
An opponent that bursts sheds every piece still on it: its weapons lie on the sand for the player to collect (a picked-up
weapon comes with a full load; it is not saved into the build).
Shots never hit their shooter. Solid props (rocks, boulders, driftwood: `world.obstacles`) block walking: `Player.blockers`,
a round crab pushed out of turned boxes each frame (`unblock`), so a crab can hide behind a rock.

## Game feel decided so far
- Walk 4.8 units a second, run (Shift) 1.75 × that (`Player.speed`, `Player.runFactor`). Space jumps.
  Sprinting spends stamina (`Player.stamina`, 0..1: 7 s unladen × weightFactor, back in 5 s; at 0 the crab is
  winded until a third is back); the thin bar under the life bar, magenta when winded.
  The gait steps slowly with long strides (STEP_TRIGGER, STEP_SECONDS, STEP_LEAD in crab.ts).
- Actions: four slots (main.ts `actions()`): the claws first when they work, then the weapons on the shell in
  build order. Keys 1-4 choose, the left button fires the chosen one (claws take turns: `Crab.snapNext`); the
  right button aims down the barrel (`camera.aimZoom`: narrower view, camera in). A gamepad fires the slots
  directly, several at once: every weapon has its own trigger (`Arsenal.fire(m, down)`; `trigger` is the chosen
  one's, `releaseAll` on blur or death). Googly eyes: pupils are weights on springs.
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
