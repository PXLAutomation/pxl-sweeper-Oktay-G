1. Overview

A faithful clone of classic Minesweeper implemented as a single-page web application.

The goal is to closely replicate the original gameplay and interaction model, with only minimal modern concessions.

2. Core Principles
Preserve original Minesweeper gameplay
Maintain minimal complexity
Avoid feature creep
Prefer clarity over abstraction
Ensure deterministic, predictable behavior
3. Game Rules
3.1 Board Sizes
Beginner: 9×9, 10 mines
Intermediate: 16×16, 40 mines
Expert: 30×16, 99 mines
3.2 Mine Placement
Mines are generated after the first click
The first click must:
never be a mine
always reveal a zero tile (no adjacent mines)
3.3 Tile Behavior
Each tile can be:
hidden
revealed
flagged
Revealed tiles show:
number of adjacent mines (1–8)
empty (0 → triggers flood reveal)
3.4 Flood Reveal
Revealing a zero tile recursively reveals adjacent tiles
Must be instant (no animation delays)
3.5 Win Condition
All non-mine tiles are revealed

On win:

All mines are automatically flagged
Timer stops
Game state becomes won
3.6 Loss Condition
Player clicks on a mine

On loss:

Clicked mine is highlighted
All mines are revealed
Incorrect flags are indicated
Game state becomes lost
4. Interaction Model
4.1 Input

Desktop-first:

Left click:
reveal tile
Right click:
toggle flag
Chord (left + right click or equivalent):
on revealed number tile
4.2 Chording Rules
Only activates if:
number of adjacent flags == tile number
Behavior:
reveals all adjacent hidden tiles
incorrect flags can cause immediate loss
4.3 Browser Behavior
Disable default browser context menu on game board
No mobile-specific controls required
5. Game State
5.1 States
idle (before first click)
playing
won
lost
5.2 State Requirements

Single source of truth must include:

board (mine layout)
revealed tiles
flagged tiles
game state
timer value
mine counter
6. UI Requirements
6.1 Header

Include:

mine counter (can go negative)
timer
reset button (smiley face)
6.2 Reset Button
Resets current difficulty
Generates new board
Returns to idle state
6.3 Visual Behavior
Instant tile reveal (no animations)
Classic number colors
Clear distinction between:
hidden
revealed
flagged
mine
exploded mine
incorrect flag
7. Tech Stack & Architecture
7.1 Stack
Vanilla JavaScript (ES Modules)
Vite (build tool + dev server)
HTML
CSS

No frameworks (React, Vue, etc.)

7.2 Project Structure
index.html

src/
  main.js

  game/
    state.js       // global game state
    board.js       // grid + mine generation
    logic.js       // reveal, flood fill, win/loss
    input.js       // click + flag + chord handling
    render.js      // DOM rendering

  ui/
    header.js      // timer, mine counter, reset button

  styles/
    main.css
7.3 Architectural Rules
Separation of concerns
Game logic must be independent of the DOM
Rendering must not contain game logic
State-driven updates
State is the single source of truth
UI updates are derived from state
No framework patterns

Avoid:

virtual DOM
reactive systems
component frameworks

Use:

direct DOM updates
simple functions
Rendering strategy
Either:
update entire board
or update affected tiles only

Both are acceptable

8. Non-Goals

Do NOT include:

animations beyond minimal feedback
mobile-first support
hint systems
power-ups
progression systems
themes or skins
multiplayer
backend or persistence
sound effects (optional later)
9. Performance Constraints
Must run smoothly on standard modern browsers
No unnecessary reflows or heavy DOM operations
Keep implementation lightweight
10. Acceptance Criteria

The implementation is complete when:

Gameplay matches classic Minesweeper behavior
All interactions behave correctly (including chording)
UI clearly reflects all states
No additional features beyond defined scope
Code structure follows defined architecture
Key improvement you now have

This version:

locks architecture decisions early
prevents AI-generated overengineering
enforces clean separation of logic vs UI
removes ambiguity around tricky behaviors