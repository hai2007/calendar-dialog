/*!
 * Calendar Dialog - 一个日历弹框，可以通过此日历组件选择日期、时间和标记日程等，支持多种主体，可配置化的设计思想；代码采用模块化开发，易于理解，可以很方便的进行二次开发。 
 * git+https://github.com/hai2007/calendar-dialog.git
 *
 * author 你好2007 < https://hai2007.gitee.io/sweethome >
 *
 * version 0.1.0
 *
 * Copyright (c) 2021 hai2007 走一步，再走一步。
 * Released under the MIT license
 *
 * Date:Wed Dec 01 2021 14:43:47 GMT+0800 (中国标准时间)
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

  /*!
   * 🌐 - 提供常用的DOM操作方法
   * https://github.com/hai2007/browser.js/blob/master/xhtml.js
   *
   * author hai2007 < https://hai2007.gitee.io/sweethome >
   *
   * Copyright (c) 2021-present hai2007 走一步，再走一步。
   * Released under the MIT license
   */
  // 命名空间路径
  var namespace = {
    svg: "http://www.w3.org/2000/svg",
    xhtml: "http://www.w3.org/1999/xhtml",
    xlink: "http://www.w3.org/1999/xlink",
    xml: "http://www.w3.org/XML/1998/namespace",
    xmlns: "http://www.w3.org/2000/xmlns/"
  };
  /**
   * 结点操作补充
   */

  var xhtml = {
    // 阻止冒泡
    "stopPropagation": function stopPropagation(event) {
      event = event || window.event;

      if (event.stopPropagation) {
        //这是其他非IE浏览器
        event.stopPropagation();
      } else {
        event.cancelBubble = true;
      }
    },
    // 阻止默认事件
    "preventDefault": function preventDefault(event) {
      event = event || window.event;

      if (event.preventDefault) {
        event.preventDefault();
      } else {
        event.returnValue = false;
      }
    },
    // 判断是否是结点
    "isNode": function isNode(param) {
      return param && (param.nodeType === 1 || param.nodeType === 9 || param.nodeType === 11);
    },
    // 绑定事件
    "bind": function bind(dom, eventType, callback) {
      if (dom.constructor === Array || dom.constructor === NodeList || dom.constructor === HTMLCollection) {
        for (var i = 0; i < dom.length; i++) {
          this.bind(dom[i], eventType, callback);
        }

        return;
      }

      if (window.attachEvent) dom.attachEvent("on" + eventType, callback);else dom.addEventListener(eventType, callback, false);
    },
    // 去掉绑定事件
    "unbind": function unbind(dom, eventType, handler) {
      if (dom.constructor === Array || dom.constructor === NodeList || dom.constructor === HTMLCollection) {
        for (var i = 0; i < dom.length; i++) {
          this.unbind(dom[i], eventType, handler);
        }

        return;
      }

      if (window.detachEvent) dom.detachEvent('on' + eventType, handler);else dom.removeEventListener(eventType, handler, false);
    },
    // 在当前上下文context上查找结点
    // selectFun可选，返回boolean用以判断当前面对的结点是否保留
    "find": function find(context, selectFun, tagName) {
      if (!this.isNode(context)) return [];
      var nodes = context.getElementsByTagName(tagName || '*');
      var result = [];

      for (var i = 0; i < nodes.length; i++) {
        if (this.isNode(nodes[i]) && (typeof selectFun != "function" || selectFun(nodes[i]))) result.push(nodes[i]);
      }

      return result;
    },
    // 寻找当前结点的孩子结点
    // selectFun可选，返回boolean用以判断当前面对的结点是否保留
    "children": function children(dom, selectFun) {
      var nodes = dom.childNodes;
      var result = [];

      for (var i = 0; i < nodes.length; i++) {
        if (this.isNode(nodes[i]) && (typeof selectFun != "function" || selectFun(nodes[i]))) result.push(nodes[i]);
      }

      return result;
    },
    // 判断结点是否有指定class
    // clazzs可以是字符串或数组字符串
    // notStrict可选，boolean值，默认false表示结点必须包含全部class,true表示至少包含一个即可
    "hasClass": function hasClass(dom, clazzs, notStrict) {
      if (clazzs.constructor !== Array) clazzs = [clazzs];
      var class_str = " " + (dom.getAttribute('class') || "") + " ";

      for (var i = 0; i < clazzs.length; i++) {
        if (class_str.indexOf(" " + clazzs[i] + " ") >= 0) {
          if (notStrict) return true;
        } else {
          if (!notStrict) return false;
        }
      }

      return true;
    },
    // 删除指定class
    "removeClass": function removeClass(dom, clazz) {
      var oldClazz = " " + (dom.getAttribute('class') || "") + " ";
      var newClazz = oldClazz.replace(" " + clazz.trim() + " ", " ");
      dom.setAttribute('class', newClazz.trim());
    },
    // 添加指定class
    "addClass": function addClass(dom, clazz) {
      if (this.hasClass(dom, clazz)) return;
      var oldClazz = dom.getAttribute('class') || "";
      dom.setAttribute('class', oldClazz + " " + clazz);
    },
    // 字符串变成结点
    // isSvg可选，boolean值，默认false表示结点是html，为true表示svg类型
    "toNode": function toNode(template, isSvg) {
      var frame; // html和svg上下文不一样

      if (isSvg) frame = document.createElementNS(namespace.svg, 'svg');else {
        var frameTagName = 'div'; // 大部分的标签可以直接使用div作为容器
        // 部分特殊的需要特殊的容器标签

        if (/^<tr[> ]/.test(template)) {
          frameTagName = "tbody";
        } else if (/^<th[> ]/.test(template) || /^<td[> ]/.test(template)) {
          frameTagName = "tr";
        } else if (/^<thead[> ]/.test(template) || /^<tbody[> ]/.test(template)) {
          frameTagName = "table";
        }

        frame = document.createElement(frameTagName);
      } // 低版本浏览器svg没有innerHTML，考虑是vue框架中，没有补充

      frame.innerHTML = template;
      var childNodes = frame.childNodes;

      for (var i = 0; i < childNodes.length; i++) {
        if (this.isNode(childNodes[i])) return childNodes[i];
      }
    },
    // 主动触发事件
    "trigger": function trigger(dom, eventType) {
      //创建event的对象实例。
      if (document.createEventObject) {
        // IE浏览器支持fireEvent方法
        dom.fireEvent('on' + eventType, document.createEventObject());
      } // 其他标准浏览器使用dispatchEvent方法
      else {
        var _event = document.createEvent('HTMLEvents'); // 3个参数：事件类型，是否冒泡，是否阻止浏览器的默认行为


        _event.initEvent(eventType, true, false);

        dom.dispatchEvent(_event);
      }
    },
    // 获取样式
    "getStyle": function getStyle(dom, name) {
      // 获取结点的全部样式
      var allStyle = document.defaultView && document.defaultView.getComputedStyle ? document.defaultView.getComputedStyle(dom, null) : dom.currentStyle; // 如果没有指定属性名称，返回全部样式

      return typeof name === 'string' ? allStyle.getPropertyValue(name) : allStyle;
    },
    // 获取元素位置
    "offsetPosition": function offsetPosition(dom) {
      var left = 0;
      var top = 0;
      top = dom.offsetTop;
      left = dom.offsetLeft;
      dom = dom.offsetParent;

      while (dom) {
        top += dom.offsetTop;
        left += dom.offsetLeft;
        dom = dom.offsetParent;
      }

      return {
        "left": left,
        "top": top
      };
    },
    // 获取鼠标相对元素位置
    "mousePosition": function mousePosition(dom, event) {
      var bounding = dom.getBoundingClientRect();
      if (!event || !event.clientX) throw new Error('Event is necessary!');
      return {
        "x": event.clientX - bounding.left,
        "y": event.clientY - bounding.top
      };
    },
    // 删除结点
    "remove": function remove(dom) {
      dom.parentNode.removeChild(dom);
    },
    // 设置多个样式
    "setStyles": function setStyles(dom, styles) {
      for (var key in styles) {
        dom.style[key] = styles[key];
      }
    },
    // 获取元素大小
    "size": function size(dom, type) {
      var elemHeight, elemWidth;

      if (type == 'content') {
        //内容
        elemWidth = dom.clientWidth - (this.getStyle(dom, 'padding-left') + "").replace('px', '') - (this.getStyle(dom, 'padding-right') + "").replace('px', '');
        elemHeight = dom.clientHeight - (this.getStyle(dom, 'padding-top') + "").replace('px', '') - (this.getStyle(dom, 'padding-bottom') + "").replace('px', '');
      } else if (type == 'padding') {
        //内容+内边距
        elemWidth = dom.clientWidth;
        elemHeight = dom.clientHeight;
      } else if (type == 'border') {
        //内容+内边距+边框
        elemWidth = dom.offsetWidth;
        elemHeight = dom.offsetHeight;
      } else if (type == 'scroll') {
        //滚动的宽（不包括border）
        elemWidth = dom.scrollWidth;
        elemHeight = dom.scrollHeight;
      } else {
        elemWidth = dom.offsetWidth;
        elemHeight = dom.offsetHeight;
      }

      return {
        width: elemWidth,
        height: elemHeight
      };
    },
    // 在被选元素内部的结尾插入内容
    "append": function append(el, template) {
      var node = this.isNode(template) ? template : this.toNode(template);
      el.appendChild(node);
      return node;
    },
    // 在被选元素内部的开头插入内容
    "prepend": function prepend(el, template) {
      var node = this.isNode(template) ? template : this.toNode(template);
      el.insertBefore(node, el.childNodes[0]);
      return node;
    },
    // 在被选元素之后插入内容
    "after": function after(el, template) {
      var node = this.isNode(template) ? template : this.toNode(template);
      el.parentNode.insertBefore(node, el.nextSibling);
      return node;
    },
    // 在被选元素之前插入内容
    "before": function before(el, template) {
      var node = this.isNode(template) ? template : this.toNode(template);
      el.parentNode.insertBefore(node, el);
      return node;
    }
  };

  function dragdrop () {
    var el = document.getElementById('calendar-dialog_move'); //绑定鼠标左键按下事件

    xhtml.bind(el, 'mousedown', function mousedown(event) {
      //解决浏览器全选无法拖拽弹框
      el.setCapture && el.setCapture(); // 寻找窗口轮廓

      var _el = el.parentNode;
      var lf = event.clientX;
      var tp = event.clientY;
      var left = xhtml.getStyle(_el, 'left').replace('px', '');
      var top = xhtml.getStyle(_el, 'top').replace('px', ''); //绑定鼠标移动事件

      function mousemove(event) {
        _el.style.left = left - -event.clientX - lf + 'px';
        _el.style.top = top - -event.clientY - tp + 'px';
      }

      xhtml.bind(document, 'mousemove', mousemove); //绑定鼠标松开事件,清除鼠标移动绑定

      xhtml.bind(document, 'mouseup', function (event) {
        xhtml.unbind(document, 'mousemove', mousemove);
        _el.releaseCapture && _el.releaseCapture();
        return false;
      });
    });
  }

  // 计算某月多少天
  var calcDays = function calcDays(year, month) {
    if (month == 2) {
      if (year % 4 != 0 || year % 100 == 0 && year % 400 != 0) {
        return 28;
      } else {
        return 29;
      }
    } else {
      return [31, -1, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month - 1];
    }
  }; // 计算某年处于的十年


  function calcYears(year) {
    var beginYear = +(Math.floor(year / 10) + "0");
    return [beginYear, beginYear + 1, beginYear + 2, beginYear + 3, beginYear + 4, beginYear + 5, beginYear + 6, beginYear + 7, beginYear + 8, beginYear + 9];
  }

  function calcDaysArray(year, month) {
    // 0->周日 1->周一 ... 6->周六
    var index = new Date(year + '/' + month + '/1').getDay(); // 前置多少天

    var preNum = index - 1;
    if (preNum == -1) preNum = 7; // 本月多少天

    var curNum = calcDays(year, month); // 后置多少天

    var nextNum = 42 - preNum - curNum;
    var daysArray = {
      pre: [],
      cur: [],
      next: []
    }; // 前置天数组

    var preMonthDays = calcDays(month == 1 ? year - 1 : year, month == 1 ? 12 : month - 1);

    for (var i = preNum; i > 0; i--) {
      daysArray.pre.push(preMonthDays - i + 1);
    } // 本月天数组


    for (var _i = 1; _i <= curNum; _i++) {
      daysArray.cur.push(_i);
    } // 后置天数组


    for (var _i2 = 1; _i2 <= nextNum; _i2++) {
      daysArray.next.push(_i2);
    }

    return daysArray;
  }

  function selectDayView(year, month) {
    var daysArray = calcDaysArray(year, month);
    var preTemplate = "";

    for (var i = 0; i < daysArray.pre.length; i++) {
      preTemplate += "<span class='gray'>" + daysArray.pre[i] + "</span>";
    }

    var curTemplate = "";

    for (var _i = 0; _i < daysArray.cur.length; _i++) {
      curTemplate += "<span tag='" + daysArray.cur[_i] + "'>" + daysArray.cur[_i] + "</span>";
    }

    var nextTemplate = "";

    for (var _i2 = 0; _i2 < daysArray.next.length; _i2++) {
      nextTemplate += "<span class='gray'>" + daysArray.next[_i2] + "</span>";
    }

    var template = "\n<div class=\"header\">\n    <button>&lt;</button>\n    <h3>".concat(year, "\u5E74").concat(month, "\u6708</h3>\n    <button>&gt;</button>\n</div>\n<div class=\"title\"><span>\u4E00</span><span>\u4E8C</span><span>\u4E09</span><span>\u56DB</span><span>\u4E94</span><span>\u516D</span><span>\u65E5</span></div>\n<div class=\"items dayview\">").concat(preTemplate).concat(curTemplate).concat(nextTemplate, "</div>");
    document.getElementById('calendar-dialog_view').innerHTML = template;
    var viewDom = document.getElementById('calendar-dialog_view'); // 前一个

    xhtml.bind(viewDom.getElementsByTagName('button')[0], 'click', function () {
      selectDayView(month == 1 ? year - 1 : year, month == 1 ? 12 : month - 1);
    }); // 进入选择月视图

    xhtml.bind(viewDom.getElementsByTagName('h3')[0], 'click', function () {
      selectMonthView(year);
    }); // 后一个

    xhtml.bind(viewDom.getElementsByTagName('button')[1], 'click', function () {
      selectDayView(month == 12 ? year + 1 : year, month == 12 ? 1 : month + 1);
    }); // 选择天

    xhtml.bind(viewDom.getElementsByTagName('span'), 'click', function (event) {
      var tag = event.target.getAttribute('tag');

      if (tag !== null) {
        var dialog = document.getElementById('calendar-dialog');

        dialog.__doSelected__(year, month, +tag);

        dialog.style.display = 'none';
      }
    });
  } // 显示选择月视图

  function selectMonthView(year) {
    var curTemplate = "";

    for (var i = 1; i <= 12; i++) {
      curTemplate += "<span tag='" + i + "'>" + i + "月</span>";
    }

    var template = "\n<div class=\"header\">\n    <button>&lt;</button>\n    <h3>".concat(year, "\u5E74</h3>\n    <button>&gt;</button>\n</div>\n<div class=\"items monthview\">").concat(curTemplate, "</div>");
    document.getElementById('calendar-dialog_view').innerHTML = template;
    var viewDom = document.getElementById('calendar-dialog_view'); // 前一个

    xhtml.bind(viewDom.getElementsByTagName('button')[0], 'click', function () {
      selectMonthView(year - 1);
    }); // 进入选择年视图

    xhtml.bind(viewDom.getElementsByTagName('h3')[0], 'click', function () {
      selectYearView(year);
    }); // 后一个

    xhtml.bind(viewDom.getElementsByTagName('button')[1], 'click', function () {
      selectMonthView(year + 1);
    }); // 选择月

    xhtml.bind(viewDom.getElementsByTagName('span'), 'click', function (event) {
      var tag = event.target.getAttribute('tag');

      if (tag !== null) {
        selectDayView(year, +tag);
      }
    });
  } // 显示选择年视图

  function selectYearView(year) {
    var years = calcYears(year);
    var minYears = years[0];
    var maxYears = years[years.length - 1];
    var curTemplate = "<span class='gray'>" + (minYears - 1) + "</span>";

    for (var i = 0; i < years.length; i++) {
      curTemplate += "<span tag='" + years[i] + "'>" + years[i] + "年</span>";
    }

    curTemplate += "<span class='gray'>" + (maxYears + 1) + "</span>";
    var template = "\n<div class=\"header\">\n    <button>&lt;</button>\n    <h3>".concat(minYears, "\u5E74 ~ ").concat(maxYears, "\u5E74</h3>\n    <button>&gt;</button>\n</div>\n<div class=\"items yearview\">").concat(curTemplate, "</div>");
    document.getElementById('calendar-dialog_view').innerHTML = template;
    var viewDom = document.getElementById('calendar-dialog_view'); // 前一个

    xhtml.bind(viewDom.getElementsByTagName('button')[0], 'click', function () {
      selectYearView(year - 10);
    }); // 后一个

    xhtml.bind(viewDom.getElementsByTagName('button')[1], 'click', function () {
      selectYearView(year + 10);
    }); // 选择年

    xhtml.bind(viewDom.getElementsByTagName('span'), 'click', function (event) {
      var tag = event.target.getAttribute('tag');

      if (tag !== null) {
        selectMonthView(+tag);
      }
    });
  }

  var $RegExp = {
    // 空白字符:http://www.w3.org/TR/css3-selectors/#whitespace
    blankReg: new RegExp("[\\x20\\t\\r\\n\\f]"),
    blanksReg: /^[\x20\t\r\n\f]{0,}$/,
    // 标志符
    identifier: /^[a-zA-Z_$][0-9a-zA-Z_$]{0,}$/
  };

  // 比如一个注释就是一块，无论注释的内容有多少

  function analyseBlock (source) {
    var i = -1,
        // 当前面对的字符
    currentChar = null; // 获取下一个字符

    var next = function next() {
      currentChar = i++ < source.length - 1 ? source[i] : null;
      return currentChar;
    }; // 获取往后n个值


    var nextNValue = function nextNValue(n) {
      return source.substring(i, n + i > source.length ? source.length : n + i);
    };

    var blocks = [];
    var currentBlock = "";
    next();

    while (true) {
      // 先剔除空白字符
      // 保证正式开始的时候匹配的是有效的
      while ($RegExp.blankReg.test(currentChar)) {
        next();
      } // 如果匹配的字符没有了


      if (currentChar == null) break; // 如果是注释
      // /* 类型一 */

      if (nextNValue(2) == '/*') {
        next();
        next();
        currentBlock = "/*";

        while (nextNValue(2) != '*/' && currentChar != null) {
          currentBlock += currentChar;
          next();
        } // 对于注释 /* */
        // 如果到结尾都没有闭合，应该提示语法错误


        if (currentChar == null) {
          throw new Error('The comment is not closed.');
        }

        currentBlock += "*/";
        next();
        next();
        blocks.push({
          value: currentBlock,
          type: "comment-double"
        });
      } // 如果是注释
      // // 类型二
      else if (nextNValue(2) == '//') {
        currentBlock = '';

        while (currentChar != '\n' && currentChar != null) {
          currentBlock += currentChar;
          next();
        }

        blocks.push({
          value: currentBlock,
          type: "comment-single"
        });
      } // 如果是结束
      //  }
      else if (currentChar == '}') {
        blocks.push({
          value: "}",
          type: "end"
        });
        next();
      } // 余下，只有两种情况：
      // 1.如是是开始
      //  xxx {
      // 2.可能是一个语句
      //  xxx : xxx ;
      // 这两种都需要进一步匹配
      else {
        currentBlock = ''; // 目前先没有考虑下列情况：
        // 语句 content:";"

        while (currentChar != '{' && currentChar != ';' && currentChar != null) {
          currentBlock += currentChar;
          next();
        }

        if (currentChar == null) {
          throw new Error('Statement or code block missing closure.');
        }

        blocks.push({
          value: currentBlock + currentChar,
          type: {
            '{': "begin",
            ';': 'statement'
          }[currentChar]
        });
        next();
      }
    }

    return blocks;
  }

  function toSelector (preSelectorArray, deep) {
    var selectors = preSelectorArray[0],
        i,
        j,
        k; // 一层层深入

    for (i = 1; i < deep; i++) {
      var temp = []; // 前置循环

      for (j = 0; j < selectors.length; j++) {
        // 预选循环
        for (k = 0; k < preSelectorArray[i].length; k++) {
          temp.push(selectors[j] + preSelectorArray[i][k]);
        }
      }

      selectors = temp;
    } // 最后补充 {


    return "\n" + selectors.join(',') + "{\n";
  }

  /*!
   * 🔪 - 把 SCSS 解析成 CSS 的算法实现
   * https://github.com/hai2007/algorithm.js/blob/master/scss.js
   *
   * author hai2007 < https://hai2007.gitee.io/sweethome >
   *
   * Copyright (c) 2021-present hai2007 走一步，再走一步。
   * Released under the MIT license
   */
  function scssToCss (source) {
    // 分析出代码块
    var blocks = analyseBlock(source); // 根据代码块获得最终代码

    var i,
        j,
        cssCode = "",
        preSelectorArray = [],
        deep = 0;

    for (i = 0; i < blocks.length; i++) {
      // 注释 double
      if (blocks[i].type == 'comment-double') {
        cssCode += blocks[i].value;
      } // 注释 single
      else if (blocks[i].type == 'comment-single') {
        cssCode += "\n/* " + blocks[i].value + " */\n";
      } // 开始
      else if (blocks[i].type == 'begin') {
        var preSplit = blocks[i].value.split(',');
        var preSelect = [];

        for (j = 0; j < preSplit.length; j++) {
          // 去掉两端的空格
          preSelect[j] = preSplit[j].replace(/\{$/, '').trim(); // 判断拼接方式

          if (/^&/.test(preSelect[j])) {
            preSelect[j] = preSelect[j].replace(/^&/, '');
          } else {
            preSelect[j] = " " + preSelect[j];
          }
        } // 登记到前缀数组


        preSelectorArray[deep] = preSelect;
        deep += 1;
      } // 结束
      else if (blocks[i].type == 'end') {
        deep -= 1;
      } // 语句
      else if (blocks[i].type == 'statement') {
        // 如果是第一个
        j = 1;
        var preType = blocks[i - j].type;

        while (['comment-double', 'comment-single'].indexOf(preType) > -1) {
          j += 1;
          preType = blocks[i - j].type;
        }

        if (['end', 'begin'].indexOf(preType) > -1) {
          cssCode += toSelector(preSelectorArray, deep);
        }

        cssCode += "\n" + blocks[i].value + "\n"; // 如果是最后一个

        j = 1;
        var nextType = blocks[i + j].type;

        while (['comment-double', 'comment-single'].indexOf(nextType) > -1) {
          j += 1;
          nextType = blocks[i + j].type;
        }

        if (['end', 'begin'].indexOf(nextType) > -1) {
          cssCode += "\n}\n";
        }
      }
    }

    return cssCode;
  }

  function useStyle () {
    var styleElement = document.createElement('style');
    var head = document.head || document.getElementsByTagName('head')[0];
    styleElement.innerHTML = scssToCss("\n        #calendar-dialog{\n            .header {\n                text-align: center;\n                margin-bottom: 10px;\n                &>button {\n                    border: none;\n                    background-color: transparent;\n                    cursor: pointer;\n                    height: 20px;\n                    vertical-align: top;\n                }\n                &>h3 {\n                    display: inline-block;\n                    width: 150px;\n                    cursor: pointer;\n                }\n            }\n            .title>span,\n            .items>span {\n                display: inline-block;\n                width: 35px;\n                height: 35px;\n                line-height: 35px;\n                text-align: center;\n            }\n            .gray {\n                color: #c2bbbb;\n            }\n            [tag]{\n                cursor: pointer;\n            }\n            .items{\n                &.dayview>span {\n                    width: 35px;\n                }\n\n                &.monthview>span {\n                    width: 60px;\n                }\n\n                &.yearview>span {\n                    width: 80px;\n                }\n            }\n        }\n    ");
    styleElement.setAttribute('type', 'text/css');
    head.appendChild(styleElement);
  }

  var CalendarDialog = function CalendarDialog(initDate) {
    var dialog = document.getElementById('calendar-dialog'),
        doit; // 如果弹框没有准备好

    if (!dialog) {
      useStyle(); // 准备好模板后追加到页面中

      xhtml.append(document.body, "<div id='calendar-dialog'\n                style='\n                position: fixed;\n                box-shadow: 0 0 7px 1px #9393a0;\n                border-radius: 5px;\n                background-color: white;\n                user-select: none;\n            '>\n            <div id='calendar-dialog_move' style='\n                font-size: 25px;\n                text-align: center;\n                cursor: move;\n                border-radius: 5px 5px 0 0;\n                line-height: 30px;\n                background-color: #f1ecec;\n                color: #938e8e;\n                padding: 10px 0;\n                margin-bottom: 10px;\n                font-weight: 800;\n            '>\u65E5\u5386</div>\n            <div id='calendar-dialog_view' style='\n                padding:10px;\n                width:265px;\n            '></div>\n        </div>");
      dialog = document.getElementById('calendar-dialog');
      dragdrop();
    }

    dialog.style.display = 'block';
    selectDayView(initDate.year, initDate.month);
    var winSize = {
      width: window.innerWidth,
      height: window.innerHeight
    };
    dialog.style.left = winSize.width * 0.5 - 125 + "px";
    dialog.style.top = winSize.height * 0.5 - 150 + "px";

    dialog.__doSelected__ = function (year, month, day) {
      doit({
        year: year,
        month: month,
        day: day
      });
    };

    return {
      then: function then(callback) {
        doit = callback;
      }
    };
  }; // 判断当前环境，如果不是浏览器环境


  if ((typeof module === "undefined" ? "undefined" : _typeof(module)) === "object" && _typeof(module.exports) === "object") {
    module.exports = CalendarDialog;
  } // 浏览器环境下
  else {
    window.CalendarDialog = CalendarDialog;
  }

}());
