import { calcYears, calcDaysArray } from './calc';
import xhtml from '@hai2007/browser/xhtml';

// 显示选择天视图
export function selectDayView(year, month) {

    let daysArray = calcDaysArray(year, month);

    let preTemplate = "";
    for (let i = 0; i < daysArray.pre.length; i++) {
        preTemplate += "<span class='gray'>" + daysArray.pre[i] + "</span>";
    }

    let curTemplate = "";
    for (let i = 0; i < daysArray.cur.length; i++) {
        curTemplate += "<span tag='" + daysArray.cur[i] + "'>" + daysArray.cur[i] + "</span>";
    }

    let nextTemplate = "";
    for (let i = 0; i < daysArray.next.length; i++) {
        nextTemplate += "<span class='gray'>" + daysArray.next[i] + "</span>";
    }

    let template = `
<div class="header">
    <button>&lt;</button>
    <h3>${year}年${month}月</h3>
    <button>&gt;</button>
</div>
<div class="title"><span>一</span><span>二</span><span>三</span><span>四</span><span>五</span><span>六</span><span>日</span></div>
<div class="items dayview">${preTemplate}${curTemplate}${nextTemplate}</div>`;

    document.getElementById('calendar-dialog_view').innerHTML = template;

    let viewDom = document.getElementById('calendar-dialog_view');

    // 前一个
    xhtml.bind(viewDom.getElementsByTagName('button')[0], 'click', () => {
        selectDayView(month == 1 ? year - 1 : year, month == 1 ? 12 : month - 1);
    });

    // 进入选择月视图
    xhtml.bind(viewDom.getElementsByTagName('h3')[0], 'click', () => {
        selectMonthView(year);
    });

    // 后一个
    xhtml.bind(viewDom.getElementsByTagName('button')[1], 'click', () => {
        selectDayView(month == 12 ? year + 1 : year, month == 12 ? 1 : month + 1);
    });

    // 选择天
    xhtml.bind(viewDom.getElementsByTagName('span'), 'click', event => {

        let tag = event.target.getAttribute('tag');

        if (tag !== null) {
            let dialog = document.getElementById('calendar-dialog');
            dialog.__doSelected__(year, month, +tag);
            dialog.style.display = 'none';
        }

    });

}

// 显示选择月视图
export function selectMonthView(year) {

    let curTemplate = "";
    for (let i = 1; i <= 12; i++) {
        curTemplate += "<span tag='" + i + "'>" + i + "月</span>";
    }

    let template = `
<div class="header">
    <button>&lt;</button>
    <h3>${year}年</h3>
    <button>&gt;</button>
</div>
<div class="items monthview">${curTemplate}</div>`;

    document.getElementById('calendar-dialog_view').innerHTML = template;

    let viewDom = document.getElementById('calendar-dialog_view');

    // 前一个
    xhtml.bind(viewDom.getElementsByTagName('button')[0], 'click', () => {
        selectMonthView(year - 1);
    });

    // 进入选择年视图
    xhtml.bind(viewDom.getElementsByTagName('h3')[0], 'click', () => {
        selectYearView(year);
    });

    // 后一个
    xhtml.bind(viewDom.getElementsByTagName('button')[1], 'click', () => {
        selectMonthView(year + 1);
    });

    // 选择月
    xhtml.bind(viewDom.getElementsByTagName('span'), 'click', event => {

        let tag = event.target.getAttribute('tag');

        if (tag !== null) {
            selectDayView(year, +tag);
        }

    });

}

// 显示选择年视图
export function selectYearView(year) {

    let years = calcYears(year);

    let minYears = years[0];
    let maxYears = years[years.length - 1];

    let curTemplate = "<span class='gray'>" + (minYears - 1) + "</span>";

    for (let i = 0; i < years.length; i++) {
        curTemplate += "<span tag='" + years[i] + "'>" + years[i] + "年</span>";
    }

    curTemplate += "<span class='gray'>" + (maxYears + 1) + "</span>";

    let template = `
<div class="header">
    <button>&lt;</button>
    <h3>${minYears}年 ~ ${maxYears}年</h3>
    <button>&gt;</button>
</div>
<div class="items yearview">${curTemplate}</div>`;

    document.getElementById('calendar-dialog_view').innerHTML = template;

    let viewDom = document.getElementById('calendar-dialog_view');

    // 前一个
    xhtml.bind(viewDom.getElementsByTagName('button')[0], 'click', () => {
        selectYearView(year - 10);
    });

    // 后一个
    xhtml.bind(viewDom.getElementsByTagName('button')[1], 'click', () => {
        selectYearView(year + 10);
    });

    // 选择年
    xhtml.bind(viewDom.getElementsByTagName('span'), 'click', event => {

        let tag = event.target.getAttribute('tag');

        if (tag !== null) {
            selectMonthView(+tag);
        }

    });

}
