/* 
Created by Ayush Shah
Word Search Puzzle
Using React-Native with Expo on snack.expo.io
 */

import React, { Component } from 'react';
import { StyleSheet, View, Alert, TouchableOpacity, Text } from 'react-native';
import {
  Cell,
  Table,
  Row,
  Rows,
  TableWrapper,
} from 'react-native-table-component';
import AwesomeAlert from 'react-native-awesome-alerts';

//GLOBAL VARIABLES

//Message to display in the info popup about game-play
const info =
  ' a) Find:  \n1. OBJECTIVEC   \n2. SWIFT  \n3. KOTLIN  \n4. JAVA  \n5. VARIABLE  \n6. MOBILE  \n7. SHOPIFY \n \n b) Tap on first and last letter';
//String acessed by index to place random characters in puzzles at empty position
const allAlphabets = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
//2-D square array of characters rendered as our puzzle
var puzzle;
//length of puzzle i.e. numbers of rows or columns
var puzzleLength;
//2-D square array that stores the color of each cell(or character) in the puzzle
var colorGrid;
// Array that consists of the words to be placed in the puzzle
const wordList = [
  'OBJECTIVEC',
  'SWIFT',
  'KOTLIN',
  'JAVA',
  'VARIABLE',
  'MOBILE',
  'SHOPIFY',
];
//Array that consists of various orientation in which the words can be placed in the puzzle
const orientations = [
  'horizontal', //a-b-c-d
  'horizontalBack', //d-c-b-a

  //a
  //b
  //c
  'vertical',

  //c
  //b
  //d
  'verticalUp',

 /*  a
        b
           c  
  */
  'diagonal',

   /*     c
        b
      a
  */
  'diagonalUp',

   /*      a
        b
     c  
  */
  'diagonalBack',

   /* a
        b
           c  
  */
  'diagonalUpBack',
];
//Array that consists of colors to highlight the answers
const colors = [
  'red',
  '#BB2CD9',
  '#0f8011',
  '#0a75f0',
  '#f207ac',
  '#14961e',
  'blue',
];
//A 2x2 array stores co-ordinates of the first and last letter tapped
var wordCoord = [[0, 0], [0, 0]];
//The word selected by the user
var wordSelec;
//start used to know the index to begin iteration in for loop for forming wordSelec in case of vertical or horizontal orientation
var start = 0;
//end used to know the index to end iteration in for loop for forming wordSelec in case of vertical or horizontal orientation
var end = 0;
//startDiag used to store co-ordinate of starting point in for loop for forming wordSelec in case of diagnol orientation
var startDiag;
//endDiag used to store co-ordinate of ending point in for loop for forming wordSelec in case of diagnol orientation
var endDiag;
//length of word selected used in iteration in the for loop for forming wordSelec
var length;
//stores thenumber of words found by player
var points;
//boolean value to see if tapped letter is first letter of word or end
var isStart;
//array used to store the words already found used in preventing increment of points in case of selecting words already found
var wordsDone;
//when tapped on first letter color changes, in case when tapped on second letter and word selected is not valid it restores the letter to original color
var ogColor;

/* 
Resets the global variables
@param: length of puzzle
*/
function main(puzzleLen) {
  points = 0;
  isStart = true;
  wordsDone = [];
  ogColor = '';
  puzzleLength = puzzleLen;
  puzzle = new Array(puzzleLength);
  colorGrid = new Array(puzzleLength);
  init(puzzleLength);
  for (let i = 0; i < wordList.length; i++) {
    placeWordsInPuzzle(wordList[i]);
  }
  console.log(puzzle);
  fillBlank();
}

/* 
Initializes the puzzle and color grid 
@param: Puzzle length  
*/
function init(puzzleLength) {
  for (let i = 0; i < puzzleLength; i++) {
    puzzle[i] = new Array(puzzleLength);
    colorGrid[i] = new Array(puzzleLength);
    for (let j = 0; j < puzzleLength; j++) {
      puzzle[i][j] = 0;
      colorGrid[i][j] = 'black';
    }
  }
}

/* 
Generates random positive interger less than equal to parameter passed in 
*/
function randomInteger(maxValue) {
  return Math.floor(Math.random() * maxValue);
}

/* 
@param: word from wordlist to be placed in the puzzle
*/
function placeWordsInPuzzle(word) {
  //chooses random starting co-ordinates for the word
  let startingCoordinates = [
    randomInteger(puzzleLength),
    randomInteger(puzzleLength),
  ];
  //chooses random orientation for the word
  let orientation = orientations[randomInteger(8)];
  //if checkfeasibility returns trues places the word in the puzzle
  if (checkfeasibility(orientation, word, startingCoordinates)) {
    addWordToPuzzle(orientation, word, startingCoordinates);
  } else {
    //repeat
    placeWordsInPuzzle(word);
  }
}

/* 
returns true if the word is feasible to place with co-oordinates and orientation
It checks the all the blocks from the starting co-ordinates to the ending co-ordinates
to see if they are empty unoccupied i.e. 0 and if occupied the the character is same
as the character of the word that would be occupy the block else returns false
@param3: starting co-ordinates
*/
function checkfeasibility(orientation, word, coordinates) {
  let wordLength = word.length;
  switch (orientation) {
    case 'horizontal':
      if (!(coordinates[1] + wordLength < puzzleLength)) {
        return false;
      } else {
        for (
          let i = coordinates[1];
          i < coordinates[1] + wordLength && i < puzzleLength;
          i++
        ) {
          if (
            !(
              puzzle[coordinates[0]][i] === 0 ||
              puzzle[coordinates[0]][i] === word[i - coordinates[1]]
            )
          ) {
            return false;
          }
        }
      }
      return true;
    case 'horizontalBack':
      if (!(coordinates[1] - wordLength > 0)) {
        return false;
      } else {
        for (
          let i = coordinates[1];
          i >= coordinates[1] - wordLength + 1 && i < puzzleLength;
          i--
        ) {
          if (
            !(
              puzzle[coordinates[0]][i] === 0 ||
              puzzle[coordinates[0]][i] === word[i - coordinates[1]]
            )
          ) {
            return false;
          }
        }
      }
      return true;
    case 'vertical':
      if (!(coordinates[0] + wordLength < puzzleLength)) {
        return false;
      } else {
        for (
          let i = coordinates[0];
          i < coordinates[0] + wordLength && i < puzzleLength;
          i++
        ) {
          if (
            !(
              puzzle[i][coordinates[1]] === 0 ||
              puzzle[i][coordinates[1]] === word[i - coordinates[0]]
            )
          ) {
            return false;
          }
        }
      }
      return true;
    case 'verticalUp':
      if (!(coordinates[0] >= wordLength - 1)) {
        return false;
      } else {
        for (
          let i = coordinates[0];
          i >= coordinates[0] - wordLength + 1 && i < puzzleLength;
          i--
        ) {
          if (
            !(
              puzzle[i][coordinates[1]] === 0 ||
              puzzle[i][coordinates[1]] === word[i - coordinates[0]]
            )
          ) {
            return false;
          }
        }
      }
      return true;
    case 'diagonal':
      if (
        !(
          coordinates[0] + wordLength < puzzleLength &&
          coordinates[1] + wordLength < puzzleLength
        )
      ) {
        return false;
      } else {
        let i = coordinates[0];
        let j = coordinates[1];
        for (let k = 0; k < wordLength; k++) {
          if (!(puzzle[i][j] === 0 || puzzle[i][j] === word[k])) {
            return false;
          }
          i++;
          j++;
        }
      }
      return true;
    case 'diagonalUp':
      if (
        !(
          coordinates[0] + wordLength < puzzleLength &&
          coordinates[1] >= wordLength - 1
        )
      ) {
        return false;
      } else {
        let i = coordinates[0];
        let j = coordinates[1];
        for (let k = 0; k < wordLength; k++) {
          if (
            !(puzzle[i][j] === 0 || puzzle[i][j] === word[wordLength - k - 1])
          ) {
            return false;
          }
          i++;
          j--;
        }
      }
      return true;
    case 'diagonalBack':
      if (
        !(
          coordinates[1] + wordLength < puzzleLength &&
          coordinates[0] >= wordLength - 1
        )
      ) {
        return false;
      } else {
        let i = coordinates[0];
        let j = coordinates[1];
        for (let k = 0; k < wordLength; k++) {
          if (
            !(puzzle[i][j] === 0 || puzzle[i][j] === word[wordLength - k - 1])
          ) {
            return false;
          }
          i--;
          j++;
        }
      }
      return true;
    case 'diagonalUpBack':
      if (
        !(coordinates[1] >= wordLength - 1 && coordinates[0] >= wordLength - 1)
      ) {
        return false;
      } else {
        let i = coordinates[0];
        let j = coordinates[1];
        for (let k = 0; k < wordLength; k++) {
          if (!(puzzle[i][j] === 0 || puzzle[i][j] === word[k])) {
            return false;
          }
          i--;
          j--;
        }
      }
      return true;
  }
}

/* 
Assigns the co-ordinates of the 2D array puzzle with the 
characters of the puzzle depending on the orientation and starting co-ordinates
*/
function addWordToPuzzle(orientation, word, coordinates) {
  let wordLength = word.length;
  switch (orientation) {
    case 'horizontal':
      for (
        let i = coordinates[1];
        i < coordinates[1] + wordLength && i < puzzleLength;
        i++
      ) {
        puzzle[coordinates[0]][i] = word[i - coordinates[1]];
      }
      break;
    case 'horizontalBack':
      for (
        let i = coordinates[1];
        i >= coordinates[1] - wordLength + 1 && i < puzzleLength;
        i--
      ) {
        puzzle[coordinates[0]][i] = word[coordinates[1] - i];
      }
      break;
    case 'vertical':
      for (
        let i = coordinates[0];
        i < coordinates[0] + wordLength && i < puzzleLength;
        i++
      ) {
        puzzle[i][coordinates[1]] = word[i - coordinates[0]];
      }
      break;
    case 'verticalUp':
      for (
        let i = coordinates[0];
        i >= coordinates[0] - wordLength + 1 && i < puzzleLength;
        i--
      ) {
        puzzle[i][coordinates[1]] = word[coordinates[0] - i];
      }
      break;
    case 'diagonal':
      {
        let i = coordinates[0];
        let j = coordinates[1];
        for (let k = 0; k < wordLength; k++) {
          puzzle[i][j] = word[k];
          i++;
          j++;
        }
      }
      break;
    case 'diagonalUp':
      {
        let l = coordinates[0];
        let m = coordinates[1];
        for (let k = wordLength - 1; k >= 0; k--) {
          puzzle[l][m] = word[k];
          l++;
          m--;
        }
      }
      break;
    case 'diagonalBack':
      {
        let a = coordinates[0];
        let b = coordinates[1];
        for (let k = wordLength - 1; k >= 0; k--) {
          puzzle[a][b] = word[k];
          a--;
          b++;
        }
      }
      break;
    case 'diagonalUpBack': {
      let q = coordinates[0];
      let r = coordinates[1];
      for (let k = 0; k < wordLength; k++) {
        puzzle[q][r] = word[k];
        q--;
        r--;
      }
    }
  }
}

/* 
Called after all words are placed in the puzzle and fills them 
with random aplhabets
*/
function fillBlank() {
  for (let i = 0; i < puzzleLength; i++) {
    for (let j = 0; j < puzzleLength; j++) {
      let charIndex = randomInteger(26);
      if (puzzle[i][j] == 0) {
        puzzle[i][j] = allAlphabets[charIndex];
      }
    }
  }
}

//To load 12x12 puzzle by default
main(12);

export default class ExampleOne extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tableHead: [],
      c: colorGrid,
      tableData: puzzle,
      //used for alert 1 to display info
      showAlert: false,
      //used for alert 2 to popup when player completes game
      isGameComplete: false,
    };
  }

  reverseString = str => {
    return str
      .split('')
      .reverse()
      .join('');
  };

  /* 
Sets the start and end co-ordinate before the iteration begins 
depending on the orientation passed
*/
  startAndEnd = orientation => {
    switch (orientation) {
      case 'Horizontal':
        if (wordCoord[0][1] > wordCoord[1][1]) {
          start = wordCoord[1][1];
          end = wordCoord[0][1];
        } else {
          start = wordCoord[0][1];
          end = wordCoord[1][1];
        }
        break;
      case 'Vertical':
        if (wordCoord[1][0] > wordCoord[0][0]) {
          start = wordCoord[0][0];
          end = wordCoord[1][0];
        } else {
          start = wordCoord[1][0];
          end = wordCoord[0][0];
        }
        break;
      case 'Diagnol':
        if (wordCoord[0][1] > wordCoord[1][1]) {
          startDiag = wordCoord[1];
          endDiag = wordCoord[0];
        } else {
          startDiag = wordCoord[0];
          endDiag = wordCoord[1];
        }
        //length is only needed in case of diagnol as we are iterating over both indexes of the array
        length = endDiag[1] - startDiag[1];
        break;
    }
  };

  /* 
  Once the player has tapped on the first and last letter 
  the fucntion forms the word selected depending on orientation
  */
  wordSelected = orientation => {
    wordSelec = '';
    switch (orientation) {
      case 'Horizontal':
        for (let i = start; i <= end; i++) {
          wordSelec += this.state.tableData[wordCoord[0][0]][i];
        }
        return wordSelec;
      case 'Vertical':
        for (let i = start; i <= end; i++) {
          wordSelec += this.state.tableData[i][wordCoord[1][1]];
        }
        return wordSelec;
      /* 
        Diagnol1:
        a             d 
          b     or      c
            c             b
              d             a
         */
      case 'Diagnol1':
        for (let i = 0; i <= length; i++) {
          wordSelec += this.state.tableData[startDiag[0] + i][startDiag[1] + i];
        }
        return wordSelec;
      /* 
        Diagnol2:
              d            a
            c    or      b
          b            c
        a            d
         */
      case 'Diagnol2':
        for (let i = 0; i <= length; i++) {
          wordSelec += this.state.tableData[startDiag[0] - i][startDiag[1] + i];
        }
        return wordSelec;
    }
  };

  /* 
Checks if the word selected by player is there in the wordList
*/
  containsWord = wd => {
    return wordList.includes(wd) || wordList.includes(this.reverseString(wd));
  };

  /* 
Called if word selected is included in the wordList
and highlights the word selected with a different color
 */
  highlightWords = orientation => {
    switch (orientation) {
      case 'Horizontal':
        for (let i = start; i <= end; i++) {
          this.state.c[wordCoord[0][0]][i] = colors[points - 1];
          this.forceUpdate();
        }
        break;
      case 'Vertical':
        for (let i = start; i <= end; i++) {
          this.state.c[i][wordCoord[0][1]] = colors[points - 1];
          this.forceUpdate();
        }
        break;
      case 'Diagnol1':
        for (let i = 0; i <= length; i++) {
          this.state.c[startDiag[0] + i][startDiag[1] + i] = colors[points - 1];
          this.forceUpdate();
        }
        break;
      case 'Diagnol2':
        for (let i = 0; i <= length; i++) {
          this.state.c[startDiag[0] - i][startDiag[1] + i] = colors[points - 1];
          this.forceUpdate();
        }
        break;
    }
  };

  /* 
 Called if the word selected by the player is not included in the
 word select and hence undos the highlight of the first letter when tapped 
 */
  undoHighlight = () => {
    this.state.c[wordCoord[0][0]][wordCoord[0][1]] = ogColor;
    this.forceUpdate();
  };

  /* 
Checks whether to increase points and highlight the word or
undo the highlight of the first character tapped
 */
  updateScore = orientation => {
    if (this.containsWord(this.wordSelected(orientation))) {
      if (!wordsDone.includes(wordSelec)) {
        points++;
        wordsDone.push(wordSelec);
      }
      this.highlightWords(orientation);
      if (points == wordList.length) {
        this.setState({ isGameComplete: true });
      }
    } //undo the highlight of start
    else {
      this.undoHighlight();
    }
  };

  /* 
  Check if character selected by player are a word from word list by first 
  deciphering the orientation 
  */
  checkIfWord = () => {
    if (wordCoord[0][0] == wordCoord[1][0]) {
      this.startAndEnd('Horizontal');
      this.updateScore('Horizontal');
    } else if (wordCoord[0][1] == wordCoord[1][1]) {
      this.startAndEnd('Vertical');
      this.updateScore('Vertical');
    } else if (
      Math.abs(wordCoord[0][0] - wordCoord[1][0]) ==
      Math.abs(wordCoord[0][1] - wordCoord[1][1])
    ) {
      //Diagnol logic
      this.startAndEnd('Diagnol');
      if (
        wordCoord[0][0] - wordCoord[1][0] ==
        wordCoord[0][1] - wordCoord[1][1]
      ) {
        this.updateScore('Diagnol1');
      } else {
        this.updateScore('Diagnol2');
      }
    } else {
      this.undoHighlight();
    }
  };

  beginCheck = (i, j) => {
    if (points < wordList.length) {
      //checks if character tapped is begining
      if (isStart) {
        wordCoord[0] = [i, j];
        ogColor = this.state.c[i][j];
        this.state.c[i][j] = colors[points];
        this.forceUpdate();
        isStart = false;
      } else {
        wordCoord[1] = [i, j];
        this.checkIfWord();
        isStart = true;
      }
    }
  };

  /* 
To changes the block size
NOTE: The block can be changed to any size above 10 but restricted to 
10 and 12 due to UI  limitation of the render method written
*/
  changeBlock = () => {
    if (puzzleLength == 12) {
      puzzleLength = 10;
    } else {
      puzzleLength = 12;
    }
    this.newGame();
  };

  /* 
 Resets game 
 */
  newGame = () => {
    main(puzzleLength);
    this.setState({ tableData: puzzle, c: colorGrid });
  };

  render() {
    const { showAlert } = this.state;
    const { isGameComplete } = this.state;
    return (
      <View style={styles.container}>
        <Table>
          <TableWrapper style={{ backgroundColor: '#f7f0dc' }}>
            <Row data={this.state.tableHead} />
            {this.state.tableData.map((data, i) => (
              <TableWrapper key={i} style={styles.row}>
                {data.map((cell, j) => (
                  <TouchableOpacity
                    key={j}
                    style={styles.cell}
                    onPress={() => {
                      this.beginCheck(i, j);
                    }}>
                    <Cell
                      data={cell}
                      style={[{ backgroundColor: '#f7f0dc' }]}
                      textStyle={[
                        { marginLeft: 11 },
                        { color: this.state.c[i][j] },
                        { fontWeight: 'bold' },
                      ]}
                    />
                  </TouchableOpacity>
                ))}
              </TableWrapper>
            ))}
          </TableWrapper>
        </Table>

        <View style={styles.buttonView}>
          <TouchableOpacity
            onPress={() => {
              this.newGame();
            }}>
            <Text style={styles.buttonText}>New Game</Text>
          </TouchableOpacity>
          <Text style={styles.buttonText}>{points}</Text>
        </View>
        <View style={styles.buttonView}>
          <TouchableOpacity
            onPress={() => {
              this.changeBlock();
            }}>
            <Text style={styles.buttonText}>
              {puzzleLength == 12 ? 10 : 12} x {puzzleLength == 12 ? 10 : 12}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              this.setState({ showAlert: true });
            }}>
            <Text style={styles.buttonText}>info</Text>
          </TouchableOpacity>
        </View>
        <AwesomeAlert
          show={showAlert}
          showProgress={false}
          title="INFO"
          message={info}
          closeOnTouchOutside={true}
          showConfirmButton={true}
          confirmText="OK"
          confirmButtonStyle={styles.buttonText}
          confirmButtonTextStyle={{ color: 'black', fontWeight: 'bold' }}
          onConfirmPressed={() => {
            this.setState({
              showAlert: false,
            });
          }}
          onDismiss={() => {
            this.setState({
              showAlert: false,
            });
          }}
        />

        <AwesomeAlert
          show={isGameComplete}
          showProgress={false}
          title="Congrats! You win!"
          closeOnTouchOutside={true}
          showConfirmButton={true}
          confirmText="New Game"
          confirmButtonColor="#94f277"
          confirmButtonStyle={styles.buttonText}
          confirmButtonTextStyle={{ color: 'black', fontWeight: 'bold' }}
          onConfirmPressed={() => {
            this.newGame();
            this.setState({
              isGameComplete: false,
            });
          }}
          onDismiss={() => {
            this.setState({
              isGameComplete: false,
            });
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 35,
    backgroundColor: '#41aaf0',
  },
  row: { height: 30, flexDirection: 'row' },
  cell: { flex: 1 },
  buttonText: {
    margin: 15,
    color: 'black',
    fontWeight: 'bold',
    padding: 13,
    paddingHorizontal: 20,
    borderRadius: 100,
    borderWidth: 3,
    borderColor: 'black',
    backgroundColor: '#94f277',
    fontSize: 18,
  },
  buttonView: {
    flexDirection: 'row',
  },
});
