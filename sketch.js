let errie_black;
let ogre_odor;
let smoky_black;
let satin_gold;
let green;
var button;

function setup() {
  errie_black = color('#0E1519');
  ogre_odor = color('#FC5130');
  smoky_black = color('#100007');
  satin_gold = color('#CBA135');
  green = color('#1DC672');
  createCanvas(windowWidth, windowHeight);
  background(errie_black);
  console.log("Startup");
  size = min(width / bwid, height / bhei);
  createBoard();
  scale = 0.9;
  button = createButton('⟳');
  button.style("background-color", smoky_black);
  button.style("color", ogre_odor);
  button.style("border-color", green);
  button.style("opacity: 0.5");
  button.style("border-radius:" + 20 + "px");
  button.style("width:" + min(width, height) / 12 + "px");
  button.style("height:" + min(width, height) / 12 + "px");
  button.style("font-size:" + width / 50 + "px");
  button.position(10, 10);
  button.mousePressed(createBoard);
}
var board;
var bwid = 20;
var bhei = 7;
var scale;
var size;

function createBoard() {
  var pool = [11, 12, 13, 21, 22, 23, 31, 32, 33];
  board = [];
  for (var x = 0; x < bwid; x++) {
    board.push([]);
    for (var y = 0; y < bhei; y++) {
      board[x].push({
        "flag": false,
        "val": 0,
        "shown": false
      });
    }
  }
  var index = floor(random(pool.length));
  var value = pool[index];
  var used = [
    [floor(bwid / 2), floor(bhei / 2)]
  ];
  pool.splice(index, 1);
  board[floor(bwid / 2)][floor(bhei / 2)].val = value;
  board[floor(bwid / 2)][floor(bhei / 2)].flag = true;
  board[floor(bwid / 2)][floor(bhei / 2)].shown = true;
  while (pool.length > 0) {
    var space = floor(random(used.length));
    var dir = floor(random(4));
    var i;
    var j;
    switch (dir) {
      case 0:
        i = used[space][0] + 1;
        j = used[space][1];
        break;
      case 1:
        i = used[space][0] - 1;
        j = used[space][1];
        break;
      case 2:
        i = used[space][0];
        j = used[space][1] + 1;
        break;
      case 3:
        i = used[space][0];
        j = used[space][1] - 1;
        break;
    }
    if (i >= 0 && i < bwid && j >= 0 && j < bhei && !board[i][j].flag) {
      var works = pool.filter(function filt(item) {
        try {
          return pair(item, board[i + 1][j].val);
        } catch (error) {
          return true;
        }
      });
      works = works.filter(function filt(item) {
        try {
          return pair(item, board[i - 1][j].val);
        } catch (error) {
          return true;
        }
      });
      works = works.filter(function filt(item) {
        try {
          return pair(item, board[i][j + 1].val);
        } catch (error) {
          return true;
        }
      });
      works = works.filter(function filt(item) {
        try {
          return pair(item, board[i][j - 1].val);
        } catch (error) {
          return true;
        }
      });
      if (works.length != 0) {
        index = floor(random(works.length));
        value = works[index];
        if (pool.indexOf(value) != -1) {
          pool.splice(pool.indexOf(value), 1);
        }
        used.push([i, j]);
        board[i][j].val = value;
        board[i][j].flag = true;
        board[i][j].shown = true;
      }
    }
  }
  for (var i = 0; i < 6; i++) {
    var pick = floor(random(used.length));
    board[used[pick][0]][used[pick][1]].flag = false;
    board[used[pick][0]][used[pick][1]].val = 0;
    used.splice(pick, 1);
  }
  fix();
}

function fix() {
  for (var off = 0; off < board.length; off++) {
    if (empty(board[off])) {
      board.splice(off, 1);
    }
  }
  for (var hoff = 0; hoff < board[0].length; hoff++) {
    var row = [];
    for (var off = 0; off < board.length; off++) {
      row.push(board[off][hoff]);
    }
    if (empty(row)) {
      for (var off = 0; off < board.length; off++) {
        board[off].splice(hoff, 1);
      }
    }
  }
  var wid = board.length;
  var hei = board[0].length;
  size = min(width / wid, height / hei);
}

function empty(col) {
  for (var i = 0; i < col.length; i++) {
    if (col[i].shown) {
      return false;
    }
  }
  return true;
}

function pair(a, b) {
  var diff = 0;
  if (a == 0 || b == 0) {
    return true;
  }
  var temp1 = a;
  var temp2 = b;
  while (temp1 > 0 && temp2 > 0) {
    if (temp1 % 10 != temp2 % 10) {
      diff++;
    }
    temp1 = floor(temp1 / 10);
    temp2 = floor(temp2 / 10);
  }
  return diff == 1;
}

function showBoard() {
  rectMode(CENTER);
  textAlign(CENTER, CENTER);
  textSize(size / 3);
  for (var x = 0; x < board.length; x++) {
    for (var y = 0; y < board[x].length; y++) {
      if (board[x][y].shown) {
        if (board[x][y].flag) {
          fill(satin_gold)
        } else {
          fill(smoky_black);
        }
        rect(x * size, y * size, size * scale, size * scale, size / 4);
        if (!board[x][y].flag) {
          fill(satin_gold)
        } else {
          fill(smoky_black);
        }
        if (board[x][y].val != 0) {
          text(board[x][y].val, x * size, y * size);
        }
      }
    }
  }
}

function draw() {
  background(errie_black);
  translate((width - board.length * size + size) / 2, (height - board[0].length * size + size) / 2);
  showBoard();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  var wid = board.length;
  var hei = board[0].length;
  size = min(width / wid, height / hei);
}

function cut(x, scale) {
  let decimal = x - floor(x);
  if (decimal > (1 - scale) / 2 && decimal < (1 + scale) / 2) {
    return floor(x);
  }
  return -1;
}

function mousePressed() {
  //createBoard();
  let x = cut((mouseX - (width - board.length * size) / 2) / size, scale);
  let y = cut((mouseY - (height - board[0].length * size) / 2) / size, scale);
  if (x >= 0 && x < board.length && y >= 0 && y < board[0].length) {
    board[x][y].flag = !board[x][y].flag;
  }
}
