// 计算某月多少天
let calcDays = function (year, month) {

    if (month == 2) {

        if ((year % 4 != 0) || (year % 100 == 0 && year % 400 != 0)) {
            return 28;
        } else {
            return 29;
        }

    } else {
        return [31, -1, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month - 1];
    }

};

// 计算某年处于的十年
export function calcYears(year) {
    let beginYear = +(Math.floor(year / 10) + "0");
    return [beginYear, beginYear + 1, beginYear + 2, beginYear + 3, beginYear + 4, beginYear + 5, beginYear + 6, beginYear + 7, beginYear + 8, beginYear + 9];
};

// 计算某月日历视图的天数组
export function calcDaysArray(year, month) {

    // 0->周日 1->周一 ... 6->周六
    let index = new Date(year + '/' + month + '/1').getDay();

    // 前置多少天
    let preNum = index - 1;
    if (preNum == -1) preNum = 7;

    // 本月多少天
    let curNum = calcDays(year, month);

    // 后置多少天
    let nextNum = 42 - preNum - curNum;

    let daysArray = {
        pre: [],
        cur: [],
        next: []
    };

    // 前置天数组
    let preMonthDays = calcDays(month == 1 ? year - 1 : year, month == 1 ? 12 : month - 1);
    for (let i = preNum; i > 0; i--) {
        daysArray.pre.push(preMonthDays - i + 1);
    }

    // 本月天数组
    for (let i = 1; i <= curNum; i++) {
        daysArray.cur.push(i);
    }

    // 后置天数组
    for (let i = 1; i <= nextNum; i++) {
        daysArray.next.push(i);
    }

    return daysArray;
};
