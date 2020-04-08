class NumberCell {
    //宽高、坐标点的数字、距顶部距离、距左部距离、是否可合并、背景颜色、颜色
    number = 0;
    width = () => this.number === 0 ? '0px' : '100px';
    height = () => this.number === 0 ? '0px' : '100px';
    added = true;
    backgroundColor = () => {
        switch (this.number) {
            case 2:
                return "#eee4da";
                break;
            case 4:
                return "#eee4da";
                break;
            case 8:
                return "#f26179";
                break;
            case 16:
                return "#f59563";
                break;
            case 32:
                return "#f67c5f";
                break;
            case 64:
                return "#f65e36";
                break;
            case 128:
                return "#edcf72";
                break;
            case 256:
                return "#edcc61";
                break;
            case 512:
                return "#9c0";
                break;
            case 1024:
                return "#3365a5";
                break;
            case 2048:
                return "#09c";
                break;
            case 4096:
                return "#6bc";
                break;
            case 8192:
                return "#93c";
                break;
        }
        return "black";
    };
    color = () => this.number <= 4 ? "#776e65" : "white";
}

let score = 0;
let board = [];
$(document).ready(function (e) {
    newgame();
});

function newgame() {
    //初始化棋盘格
    init();
    //在随机两个各自声称的数字
    generateOneNumber();
    generateOneNumber();
}


function init() {
    let j;
    let i;
    score = 0;
    $("#score").html(score);
    $("#gameover").css('display', 'none');
    for (i = 0; i < 4; i++) {
        board[i] = [];
        for (j = 0; j < 4; j++) {
            let gridCell = $("#grid-cell-" + i + "-" + j);
            gridCell.css("top", getPosTop(i, j));
            gridCell.css("left", getPosLeft(i, j));

            board[i][j] = new NumberCell();//初始化网格类
        }
    }

    updateBoardView();//通知前端对board二位数组进行设定。
}


function updateBoardView() {//更新数组的前端样式
    $(".number-cell").remove();
    for (let i = 0; i < 4; i++)
        for (let j = 0; j < 4; j++) {
            $("#grid-container").append('<div class="number-cell" id="number-cell-' + i + '-' + j + '"></div>');
            let theNumberCell = $('#number-cell-' + i + '-' + j);
            theNumberCell.css('width', board[i][j].width());
            theNumberCell.css('height', board[i][j].height());
            theNumberCell.css('top', getPosTop(i, j));
            theNumberCell.css('left', getPosLeft(i, j));
            theNumberCell.css('background-color', board[i][j].backgroundColor());
            theNumberCell.css('color', board[i][j].color());
            if (board[i][j].number !== 0) {
                theNumberCell.text(board[i][j].number);
            }
        }
}

function generateOneNumber() {//生成随机的格子
    if (nospace(board))
        return false;

    //随机一个位置
    let randx = Math.floor(Math.random() * 4);
    let randy = Math.floor(Math.random() * 4);
    while (true) {
        if (board[randx][randy].number === 0)
            break;
        randx = Math.floor(Math.random() * 4);
        randy = Math.floor(Math.random() * 4);
    }
    //在随机位置显示随机数字
    board[randx][randy].number = Math.random() < 0.5 ? 2 : 4;
    showNumberWithAnimation(randx, randy, board[randx][randy]);
    return true;
}

//事件响应循环
$(document).keydown(function (event) {
    switch (event.keyCode) {
        case 37://left
            if (moveLeft()) {
                //setTimeout("generateOneNumber()",210);
                getScore(score);
                generateOneNumber();//每次新增一个数字就可能出现游戏结束
                setTimeout("isgameover()", 400);//300毫秒
            }
            break;
        case 38://up
            if (moveUp()) {
                getScore(score);
                generateOneNumber();//每次新增一个数字就可能出现游戏结束
                setTimeout("isgameover()", 400);
            }
            break;
        case 39://right
            if (moveRight()) {
                getScore(score);
                generateOneNumber();//每次新增一个数字就可能出现游戏结束
                setTimeout("isgameover()", 400);
            }
            break;
        case 40://down
            if (moveDown()) {
                getScore(score);
                generateOneNumber();//每次新增一个数字就可能出现游戏结束
                setTimeout("isgameover()", 400);
            }
            break;

    }
});

function isgameover() {
    if (nospace(board) && nomove(board)) $("#gameover").css('display', 'block');
}

function isaddedArray() {//将判断能否合并的数组值置为0
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            board[i][j].added = true;
        }
    }
}


function moveLeft() {//更多地细节信息
    //判断格子是否能够向左移动
    if (!canMoveLeft(board))
        return false;

    isaddedArray();
    //真正的moveLeft函数//标准
    for (let i = 0; i < 4; i++)
        for (let j = 1; j < 4; j++) {//第一列的数字不可能向左移动
            if (board[i][j].number !== 0) {
                //(i,j)左侧的元素
                for (let k = 0; k < j; k++) {
                    //落脚位置的是否为空 && 中间没有障碍物
                    if (board[i][k].number === 0 && noBlockHorizontal(i, k, j, board)) {
                        //move
                        showMoveAnimation(i, j, i, k);
                        board[i][k].number = board[i][j].number;
                        board[i][j].number = 0;
                    }
                    //落脚位置的数字和本来的数字相等 && 中间没有障碍物
                    else if (board[i][k].number === board[i][j].number && noBlockHorizontal(i, k, j, board)) {
                        //move
                        showMoveAnimation(i, j, i, k);
                        //add
                        if (board[i][k].added) {//目标落脚点可以合并
                            board[i][k].number += board[i][j].number;
                            board[i][j].number = 0;
                            board[i][k].added = false;
                            score += board[i][k].number;
                        } else {
                            board[i][k + 1].number = board[i][j].number;
                            board[i][j].number = 0;
                        }
                    }
                }
            }
        }
    setTimeout("updateBoardView()", 200);
    return true;
}

function moveRight() {//更多地细节信息
    //判断格子是否能够向右移动
    if (!canMoveRight(board))
        return false;

    isaddedArray();
    //真正的moveRight函数//标准
    for (let i = 0; i < 4; i++)
        for (let j = 2; j >= 0; j--) {//最后一列的数字不可能向右移动
            if (board[i][j].number !== 0) {
                //(i,j)右侧的元素
                for (let k = 3; k > j; k--) {
                    //落脚位置的是否为空 && 中间没有障碍物
                    if (board[i][k].number === 0 && noBlockHorizontal(i, j, k, board)) {
                        //move
                        showMoveAnimation(i, j, i, k);
                        board[i][k].number = board[i][j].number;
                        board[i][j].number = 0;
                    }
                    //落脚位置的数字和本来的数字相等 && 中间没有障碍物
                    else if (board[i][k].number === board[i][j].number && noBlockHorizontal(i, j, k, board)) {
                        //move
                        showMoveAnimation(i, j, i, k);
                        //add
                        if (board[i][k].added) {
                            board[i][k].number += board[i][j].number;
                            board[i][j].number = 0;
                            board[i][k].added = false;
                            score += board[i][k].number;
                        }else {
                            board[i][k-1].number = board[i][j].number;
                            board[i][j].number = 0;
                        }
                    }
                }
            }
        }
    setTimeout("updateBoardView()", 200);
    return true;
}

function moveUp() {//更多地细节信息
    //判断格子是否能够向上移动
    if (!canMoveUp(board))
        return false;

    isaddedArray();
    //真正的moveUp函数//标准
    for (let j = 0; j < 4; j++)
        for (let i = 1; i < 4; i++) {//第一行的数字不可能向上移动
            if (board[i][j].number !== 0) {
                //(i,j)上面的元素
                for (let k = 0; k < i; k++) {
                    //落脚位置的是否为空 && 中间没有障碍物
                    if (board[k][j].number === 0 && noBlockVertical(j, k, i, board)) {
                        //move
                        showMoveAnimation(i, j, k, j);
                        board[k][j].number = board[i][j].number;
                        board[i][j].number = 0;
                    }
                    //落脚位置的数字和本来的数字相等 && 中间没有障碍物
                    else if (board[k][j].number === board[i][j].number && noBlockVertical(j, k, i, board)) {
                        //move
                        showMoveAnimation(i, j, k, j);
                        //add
                        if (board[k][j].added) {
                            board[k][j].number += board[i][j].number;
                            board[i][j].number = 0;
                            board[k][j].added = false;
                            score += board[k][j].number;
                        } else {
                            board[k + 1][j].number = board[i][j].number;
                            board[i][j].number = 0;
                        }
                    }
                }
            }
        }
    setTimeout("updateBoardView()", 200);
    return true;
}

function moveDown() {//更多地细节信息
    //判断格子是否能够向下移动
    if (!canMoveDown(board))
        return false;

    isaddedArray();
    //真正的moveDown函数//标准
    for (let j = 0; j < 4; j++)
        for (let i = 2; i >= 0; i--) {//最后一行的数字不可能向下移动
            if (board[i][j].number !== 0) {
                //(i,j)下面的元素
                for (let k = 3; k > i; k--) {
                    //落脚位置的是否为空 && 中间没有障碍物
                    if (board[k][j].number === 0 && noBlockVertical(j, i, k, board)) {
                        //move
                        showMoveAnimation(i, j, k, j);
                        board[k][j].number = board[i][j].number;
                        board[i][j].number = 0;
                    }
                    //落脚位置的数字和本来的数字相等 && 中间没有障碍物
                    else if (board[k][j].number === board[i][j].number && noBlockVertical(j, i, k, board)) {
                        //move
                        showMoveAnimation(i, j, k, j);
                        //add
                        if (board[k][j].added) {
                            board[k][j].number += board[i][j].number;
                            board[i][j].number = 0;
                            board[k][j].added = false;
                            score += board[k][j].number;
                        } else {
                            board[k - 1][j].number = board[i][j].number;
                            board[i][j].number = 0;
                        }
                    }
                }
            }
        }
    setTimeout("updateBoardView()", 200);
    return true;
}