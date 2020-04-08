function showNumberWithAnimation(i, j, nc) {//实现随机数字的样式变动

    let numberCell = $('#number-cell-' + i + '-' + j);
    numberCell.css("background-color", nc.backgroundColor());
    numberCell.css("color", nc.color());
    numberCell.text(nc.number);
    numberCell.animate({
        width: nc.width(),
        height: nc.height(),
        top: getPosTop(i, j),
        left: getPosLeft(i, j)
    }, 50);
}

function showMoveAnimation(fromx, fromy, tox, toy) {//实现移动格子的样式变动

    let numberCell = $('#number-cell-' + fromx + '-' + fromy);
    numberCell.animate({
        top: getPosTop(tox, toy),
        left: getPosLeft(tox, toy)
    }, 200);
}