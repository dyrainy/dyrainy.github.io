function getPosTop(i, j) {
    return 20 + i * 120;
}

function getPosLeft(i, j) {
    return 20 + j * 120;
}

function getScore(score) {
    document.getElementById("score").innerHTML = score;
}

//在随机生成数字的时候判断16宫格中是否还有空间：true没有空间 false还有空间
function nospace(board) {
    for (let i = 0; i < 4; i++)
        for (let j = 0; j < 4; j++)
            if (board[i][j].number === 0)
                return false;
    return true;
}

//实现功能判断：true能移动 false不能
function canMoveLeft(board) {
    for (let i = 0; i < 4; i++)
        for (let j = 0; j < 4; j++)
            if (board[i][j].number !== 0 && j !== 0)
                if (board[i][j - 1].number === 0 || board[i][j - 1].number === board[i][j].number)
                    return true;

    return false;
}

function canMoveRight(board) {
    for (let i = 0; i < 4; i++)
        for (let j = 0; j < 4; j++)
            if (board[i][j].number !== 0 && j !== 3)
                if (board[i][j + 1].number === 0 || board[i][j + 1].number === board[i][j].number)
                    return true;

    return false;
}

function canMoveUp(board) {
    for (let i = 0; i < 4; i++)
        for (let j = 0; j < 4; j++)
            if (board[i][j].number !== 0 && i !== 0)
                if (board[i - 1][j].number === 0 || board[i - 1][j].number === board[i][j].number)
                    return true;
    return false;
}

function canMoveDown(board) {
    for (let i = 0; i < 4; i++)
        for (let j = 0; j < 4; j++)
            if (board[i][j].number !== 0 && i !== 3)
                if (board[i + 1][j].number === 0 || board[i + 1][j].number === board[i][j].number)
                    return true;
    return false;
}

//判断水平方向是否有障碍物
function noBlockHorizontal(row, col1, col2, board) {
    for (let i = col1 + 1; i < col2; i++)
        if (board[row][i].number !== 0)
            return false;
    return true;
}

//判断竖直方向是否有障碍物
function noBlockVertical(col, row1, row2, board) {
    for (let i = row1 + 1; i < row2; i++)
        if (board[i][col].number !== 0)
            return false;
    return true;
}

//最后收尾
function nomove(board) {
    return !(canMoveLeft(board) || canMoveRight(board) || canMoveUp(board) || canMoveDown(board));
}