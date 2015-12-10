import configureFixes from '../src/fixes';
import { applyFix } from '../src/fixes';
import { expect } from 'chai';

describe('Fixes', () => {
  let fixes;
  
  before(() => {
    fixes = configureFixes();
  });

  it('should be an object', () => {
    expect(typeof fixes).to.equal('object');
  });
  it('should have all camel-case keys', () => {
    Object.keys(fixes).forEach((key) => {
      let character = key.charAt(0);
      expect(character).to.equal(character.toLowerCase());
    });
  });
  it('should have an exec or a search/replace pair', () => {
    Object.keys(fixes).forEach((key) => {
      let fix = fixes[key];
      expect(fix).to.satisfy((fix) => {
        return (fix.exec || (fix.search && fix.replace))
      });
    });
  });
  describe('Rules', () => {
    let lines;
    before(() => {
      lines = [ 'export default function dragdrop(state = initialState, action) {',
                'function makeDeck() {',
                'function shuffle(array) {',
                'function deal(cards) {',
                'function card(state = initialState, action) {',
                'function pointInsideRect(rX, rY, width, height, ptX, ptY) {',
                'function locationFilter(location) {',
                'return function(elem) {',
                'function getCardSuit(card) {',
                'function getCardColor(card) {',
                'function getCardValue(card) {',
                'export function beginDrag(cards) {',
                'export function endDrag() {',
                'export function shuffleCards() {',
                'export function moveCards(cards, destination) {',
                'export function flipCard(card) {',
                'export function undoMove() {',
                'export function redoMove() {',
                'handleBeginDragDrop={ function() {} }',
                'getAvailableMoves={ function() {} }',
                'moveCards={ function() {} }',
                'flipCard={ function() {} }',
                'function noop() {',
                'const deck = (function() {',
                'beginDrag={function() {}}',
                'endDrag={function() {}}',
                'moveCards={function() {}} />);',
                'function deepCheckForCardAndCount(elem) {',
                'function checkForCardAndCount(elem) {',
                'renderer.render(<DealArea getAvailableMoves={ function() {} }',
                'moveCards={ function() {} }',
                'handleBeginDragDrop={function() {} }',
                'export default function configureStore(initialState) {',
                'function mapStateToProps(state) {',
                'function mapDispatchToProps(dispatch) {']
    });
    describe('semi', () => {
      let fix;
      before(() => {
        fix = fixes.semi;
      });
      it('should place a semicolon at the end of the line', () => {
        let testLines = lines.map(line => applyFix(line, fix));
        let linesExpected = lines.map(line => line + ';');
        testLines.forEach((line, index) => {
          expect(line).to.equal(linesExpected[index]);
        });
      });
    });
    
    describe('spaceBeforeFunctionParen', () => {
      let fix;
      before(() => {
        fix = fixes.spaceBeforeFunctionParen;
      });

      it('should place a space before function parenthesis', () => {
          let linesExpected = [ 'export default function dragdrop (state = initialState, action) {',
                'function makeDeck () {',
                'function shuffle (array) {',
                'function deal (cards) {',
                'function card (state = initialState, action) {',
                'function pointInsideRect (rX, rY, width, height, ptX, ptY) {',
                'function locationFilter (location) {',
                'return function (elem) {',
                'function getCardSuit (card) {',
                'function getCardColor (card) {',
                'function getCardValue (card) {',
                'export function beginDrag (cards) {',
                'export function endDrag () {',
                'export function shuffleCards () {',
                'export function moveCards (cards, destination) {',
                'export function flipCard (card) {',
                'export function undoMove () {',
                'export function redoMove () {',
                'handleBeginDragDrop={ function () {} }',
                'getAvailableMoves={ function () {} }',
                'moveCards={ function () {} }',
                'flipCard={ function () {} }',
                'function noop () {',
                'const deck = (function () {',
                'beginDrag={function () {}}',
                'endDrag={function () {}}',
                'moveCards={function () {}} />);',
                'function deepCheckForCardAndCount (elem) {',
                'function checkForCardAndCount (elem) {',
                'renderer.render(<DealArea getAvailableMoves={ function () {} }',
                'moveCards={ function () {} }',
                'handleBeginDragDrop={function () {} }',
                'export default function configureStore (initialState) {',
                'function mapStateToProps (state) {',
                'function mapDispatchToProps (dispatch) {'];

        let testLines = lines.map((line) => {
          return applyFix(line, fix); 
        });
        testLines.forEach((line, index) => {
          expect(line).to.equal(linesExpected[index]);
        });
      });
    });

    describe('noTrailingSpaces', () => {
      let fix;
      before(() => {
        fix = fixes.noTrailingSpaces;
      });
      it('should remove whitespace from end of line', () => {
        let lines = [ 'return function (elem) {  ',
                      'function getCardSuit (card) {  ',
                      'function getCardColor (card) {  ',
                      'function getCardValue (card) {  ',
                      'export function beginDrag (cards) {  ',
                      'export function endDrag () {  ',
                      'export function shuffleCards () {  ',
                      'export function moveCards (cards, destination) {  ',
                      'export function flipCard (card) {  ',
                      'export function undoMove () {  ',
                      'export function redoMove () {  ' ];
        let linesExpected = [ 'return function (elem) {',
                              'function getCardSuit (card) {',
                              'function getCardColor (card) {',
                              'function getCardValue (card) {',
                              'export function beginDrag (cards) {',
                              'export function endDrag () {',
                              'export function shuffleCards () {',
                              'export function moveCards (cards, destination) {',
                              'export function flipCard (card) {',
                              'export function undoMove () {',
                              'export function redoMove () {' ];
 
        let testLines = lines.map(line => applyFix(line, fix));
        testLines.forEach((line, index) => {
          expect(line).to.equal(linesExpected[index]);
        });
      });
    });
    describe('noFloatingDecimal', () => {
      let fix;
      before(() => {
        fix = fixes.noFloatingDecimal;
      });
      it('should add a decimal point to numbers', () => {
        let lines = [ 'let myNumber = .05;',
                      'x = .1;',
                      'y = .1594032134',
                      'parseInt(.99, 10);' ];
        let linesExpected = [ 'let myNumber = 0.05;',
                              'x = 0.1;',
                              'y = 0.1594032134',
                              'parseInt(0.99, 10);' ];
        let testLines = lines.map(line => applyFix(line, fix));
        testLines.forEach((line, index) => {
          expect(line).to.equal(linesExpected[index]);
        });
      });
    });
    describe('commaDangle', () => {
      let fix;
      before(() => {
        fix = fixes.commaDangle;
      });

      it('should remove dangling commas', () => {
        let lines = [ 'let myNumber = .05,',
                      'var arr = [ a, b, c, ]',
                      'nanana = [NaN, NaN, NaN,];',
                      'y = .1594032134, z = 500,',
                      '  ,  ,',
                      '{ "json": "object", "comma: "dangling" , }',
                      '{ text: \'Hello!\', id: 1, }' ];
        let linesExpected = [ 'let myNumber = .05',
                              'var arr = [ a, b, c ]',
                              'nanana = [NaN, NaN, NaN];',
                              'y = .1594032134, z = 500',
                              '  ,  ',
                              '{ "json": "object", "comma: "dangling"  }',
                              '{ text: \'Hello!\', id: 1 }' ];
        let testLines = lines.map(line => applyFix(line, fix));
        testLines.forEach((line, index) => {
          expect(line).to.equal(linesExpected[index]);
        });
      });
    });
    describe('spacedComment', () => {
      let fix;
      before(() => {
        fix = fixes.spacedComment;
      });

      it('should put a space after a double slash', () => {
        let lines = [ '//i\'m a comment',
                      '//me too',
                      'let cards = deck.map //map cards to deck',
                      'function yarr(im, a, pirate) { //pirate things',
                      'module.exports = app //export teh app',
                      ' /*i don\'t work */',
                      ' /*i do work now! */' ]
        let linesExpected = [ '// i\'m a comment',
                              '// me too',
                              'let cards = deck.map // map cards to deck',
                              'function yarr(im, a, pirate) { // pirate things',
                              'module.exports = app // export teh app',
                              ' /* i don\'t work */',
                              ' /* i do work now! */' ]
        let testLines = lines.map(line => applyFix(line, fix));
        testLines.forEach((line, index) => {
          expect(line).to.equal(linesExpected[index]);
        });
      });
    });

  });


});


