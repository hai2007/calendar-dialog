// https://hai2007.github.io/browser.js/#/api/xhtml?fixed=top
import xhtml from '@hai2007/browser/xhtml';

import dragdrop from './dragdrop';
import { selectDayView } from './view';
import useStyle from './style';

let CalendarDialog = function (initDate) {

    let dialog = document.getElementById('calendar-dialog'), doit;

    // 如果弹框没有准备好
    if (!dialog) {
        useStyle();

        // 准备好模板后追加到页面中
        xhtml.append(document.body, `<div id='calendar-dialog'
                style='
                position: fixed;
                box-shadow: 0 0 7px 1px #9393a0;
                border-radius: 5px;
                background-color: white;
                user-select: none;
            '>
            <div id='calendar-dialog_move' style='
                font-size: 25px;
                text-align: center;
                cursor: move;
                border-radius: 5px 5px 0 0;
                line-height: 30px;
                background-color: #f1ecec;
                color: #938e8e;
                padding: 10px 0;
                margin-bottom: 10px;
                font-weight: 800;
            '>日历</div>
            <div id='calendar-dialog_view' style='
                padding:10px;
                width:265px;
            '></div>
            <div id='calendar-dialog_close' style='
                text-align: center;
                padding: 10px;
                background-color: #f1ecec;
                color: #9e9e9e;
                cursor: pointer;
            '>关闭</div>
        </div>`);
        dialog = document.getElementById('calendar-dialog');

        dragdrop();

        xhtml.bind(document.getElementById('calendar-dialog_close'), 'click', () => {
            dialog.style.display = 'none';
        });
    }

    dialog.style.display = 'block';
    selectDayView(initDate.year, initDate.month);

    let winSize = {
        width: window.innerWidth,
        height: window.innerHeight
    };

    dialog.style.left = (winSize.width * 0.5 - 125) + "px";
    dialog.style.top = (winSize.height * 0.5 - 150) + "px";

    dialog.__doSelected__ = (year, month, day) => {
        doit({
            year,
            month,
            day
        });
    };

    return {
        then(callback) {
            doit = callback;
        }
    };

};

// 判断当前环境，如果不是浏览器环境
if (typeof module === "object" && typeof module.exports === "object") {
    module.exports = CalendarDialog;
}

// 浏览器环境下
else {
    window.CalendarDialog = CalendarDialog;
}
