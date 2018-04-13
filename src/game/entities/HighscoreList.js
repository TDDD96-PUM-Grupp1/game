import * as PIXI from 'pixi.js';

const BG_COLOR = '0xFFFFFF';
const TEXT_COLOR = '#000000';

class HighscoreList{
  constructor(scoreManager, game, x = 0, y = 0){
    this.scoreManager = scoreManager;
    this.scoreManager.addScoreListener(this);

    this.container = new PIXI.Container();
    this.container.x = x;
    this.container.y = y;

    this.rows = {};

    game.app.stage.addChild(this.container);
    this.update();
  }

  update() {
    const list = this.scoreManager.getList();
    const scores = this.scoreManager.getScores();

    const textStyle = new PIXI.TextStyle({
      fill: TEXT_COLOR,
      fontSize: 20,
    });

    // Reset painted variable
    Object.keys(this.rows).forEach((key, index) => {
      this.rows[key].painted = false;
    });

    list.forEach((val, index) => {
      // Background
      if(val.id in this.rows){
        // Row exists
        let curRow = this.rows[val.id];

        // Update needd scores
        scores.forEach((scoreName, scoreI) => {
          if(curRow[scoreName].text !== val[scoreName].toString()){
            console.log('updateing score:');
            console.log(scoreName);

            curRow[scoreName].text = val[scoreName];
          }
        });

        // Move box to right position
        curRow.row.y = 50*index;

        curRow.painted = true;
      } else {
        // New player
        let rowCont = new PIXI.Container();

        let bg = new PIXI.Graphics();
        bg.beginFill(BG_COLOR, 1);
        bg.drawRoundedRect(0, 50*index, 300, 50, 10);
        bg.endFill();

        let name = new PIXI.Text(val.name, textStyle);
        name.x = 0;
        name.y = 50*index;

        rowCont.addChild(bg);
        rowCont.addChild(name);

        let newRow = {
          painted: true,
          row: rowCont,
        };

        scores.forEach((scoreName, scoreI) => {
          let text = new PIXI.Text(val[scoreName], textStyle);
          text.x = 200 + (scoreI*20);
          text.y = 50*index;

          newRow[scoreName] = text;
          rowCont.addChild(text);
        });

        this.rows[val.id] = newRow;
        this.container.addChild(rowCont);
      }
    });

    Object.keys(this.rows).forEach((key, index) => {
      if(!this.rows[key].painted){
        this.container.removeChild(this.rows[key].row);
        delete this.rows[key];
      }
    });
  }
}

export default HighscoreList;