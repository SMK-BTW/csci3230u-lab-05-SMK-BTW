// =====================================================================
// sudoku.js  -  the DOM controller for the game page
// =====================================================================
// The "view": it reads the model (model.js) and reflects it onto the page,
// and turns the player's clicks back into model calls. The game RULES stay
// in model.js - this file is only about the DOM.
//
// Fill in every function marked TODO. The state, the element references,
// and the scoring/celebration helpers are done for you.
// =====================================================================

import {
  EMPTY,
  SAMPLE_BOARD,
  getCell,
  setCell,
  findConflicts,
  isComplete,
} from './model.js'
import confetti from 'canvas-confetti' // you installed this with `npm install`

let board = SAMPLE_BOARD
let activeDigit = null
const history = [] // previous boards, for undo
const startTime = Date.now()

const boardEl = document.getElementById('board')
const paletteEl = document.getElementById('palette')

// ---- rendering ------------------------------------------------------

/**
 * Build the 9x9 board from `board` into <table id="board">.
 * TODO:
 *  - clear boardEl (boardEl.innerHTML = '')
 *  - for each row r, make a <tr>; for each col c, make a <td>:
 *      - give it id `cell-${r}-${c}`
 *      - show the digit (getCell), or '' for EMPTY
 *      - if the cell was EMPTY in SAMPLE_BOARD but isn't now, add class 'user-input'
 *      - on click, call placeAt(r, c)
 *  - append the rows, then call highlightConflicts()
 */
function renderBoard() {
  boardEl.innerHTML =''; 
  for (let r = 0 ; r<9 ; r++){
    const tr = document.createElement('tr');
    for (let c = 0; c <9; c++){
      const td = document.createElement('td');
      const value = getCell(board,r,c);

      td.id=`cell-${r}-${c}`;
      td.textContent= value === EMPTY ? '' : value;
      if (getCell(SAMPLE_BOARD,r,c)===EMPTY && value !==EMPTY){
        td.classList.add('user-input');
      }

      td.addEventListener('click', () => placeAt(r,c));

      tr.append(td);
    }
    boardEl.append(tr);
  }
  highlightConflicts();
}

/**
 * Toggle the 'error' class on every cell that currently conflicts.
 * TODO: for each (r, c), find its <td> by id and toggle 'error' based on
 * whether findConflicts(board, r, c) has any entries.
 */
function highlightConflicts() {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const td = document.getElementById(`cell-${r}-${c}`);
      const hasConflict = findConflicts(board, r, c).length > 0;
      td.classList.toggle('error', hasConflict);
    }
  }
}

/**
 * Build the palette into <table id="palette">: a row of 1-9 (each click
 * selects that digit) followed by an undo cell.
 * TODO:
 *  - clear paletteEl; make one <tr>
 *  - for d = 1..9: a <td> showing d, click → selectDigit(d)
 *  - a final <td> holding <img src="/images/undo.png" alt="Undo">, click → undo
 */
function renderPalette() {
  // TODO
  paletteEl.innerHTML='';
  const tr = document.createElement('tr');
  for(let d = 1 ; d <= 9; d++){
    const td = document.createElement('td');
    td.textContent = d;
    td.id = `palette-${d}`;
    td.addEventListener('click', () => selectDigit(d));
    tr.append(td);
  }

  const undoTd = document.createElement('td');
  const img = document.createElement('img');
  img.src = '/images/undo.png';
  img.alt = 'Undo';
  undoTd.append(img);
  undoTd.addEventListener('click', undo);
  tr.append(undoTd);

  paletteEl.append(tr);

}

// ---- interaction ----------------------------------------------------

/**
 * Remember the chosen digit and mark its palette cell 'active'.
 * TODO: set activeDigit; toggle 'active' on the matching palette <td>.
 */
function selectDigit(digit) {
  activeDigit = digit;
  for(let d  = 1; d<=9; d++){
    const td = document.getElementById(`palette-${d}`);
    td.classList.toggle('active', d === digit);
  }
}

/**
 * Place the active digit at (row, col).
 * TODO:
 *  - do nothing if no digit is selected
 *  - do nothing if that cell is a given clue (getCell(SAMPLE_BOARD,…) !== EMPTY)
 *  - push the current board onto `history`, then setCell into `board`
 *  - renderBoard(); if isComplete(board), call celebrate()
 */
function placeAt(row, col) {
  if (activeDigit!==null){
    if (getCell(SAMPLE_BOARD,row,col)=== EMPTY){
      history.push(board);
      board = setCell(board, row,col, activeDigit);
      renderBoard();
      if(isComplete(board)){
        celebrate();
      }
    }
  }
}

/** Step back one move. TODO: if history isn't empty, pop into `board`, re-render. */
function undo() {
  if (history.length!==0){
    board = history.pop();
    renderBoard();
  }
}

// ---- finishing (done for you) ---------------------------------------

function celebrate() {
  recordScore()
  confetti()
  setTimeout(() => alert('Solved! 🎉'), 50)
}

function recordScore() {
  const durationSeconds = Math.round((Date.now() - startTime) / 1000)
  const scores = JSON.parse(localStorage.getItem('sudoku-scores') || '[]')
  scores.push({ date: new Date().toISOString(), durationSeconds })
  localStorage.setItem('sudoku-scores', JSON.stringify(scores))
}

// ---- start ----------------------------------------------------------
renderPalette()
renderBoard()
