/*!
 * Calendar Dialog - 一个日历弹框，可以通过此日历组件选择日期、时间和标记日程等，支持多种主体，可配置化的设计思想；代码采用模块化开发，易于理解，可以很方便的进行二次开发。 
 * git+https://github.com/hai2007/calendar-dialog.git
 *
 * author 你好2007 < https://hai2007.gitee.io/sweethome >
 *
 * version 0.1.0-alpha.0
 *
 * Copyright (c) 2021 hai2007 走一步，再走一步。
 * Released under the MIT license
 *
 * Date:Wed Dec 01 2021 10:05:59 GMT+0800 (中国标准时间)
 */
(function () {
  'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  var CalendarDialog = function CalendarDialog() {}; // 判断当前环境，如果不是浏览器环境


  if ((typeof module === "undefined" ? "undefined" : _typeof(module)) === "object" && _typeof(module.exports) === "object") {
    module.exports = CalendarDialog;
  } // 浏览器环境下
  else {
    window.CalendarDialog = CalendarDialog;
  }

}());
