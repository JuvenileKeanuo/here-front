function Regular(str, reg) {
  if (reg.test(str))
    return true;
  return false;
}

//是否为中文
function IsChinese(str) {
  var reg = /^[\u0391-\uFFE5]+$/;
  return Regular(str, reg);
}

function CNDateString(date) {
  var s = ''
  var YY = date.getFullYear().toString()
  s += YY
  s += '年'
  var MM = date.getMonth().toString()
  MM++
  s += MM
  s += '月'
  var DD = date.getDate().toString()
  s += DD
  s += '日\n'
  var HH = date.getHours().toString()
  s += HH
  s += ':'
  var MM = date.getMinutes().toString()
  if (MM.length == 1) {
    s += '0'
  }
  s += MM
  s += ':'
  var SS = date.getSeconds().toString()
  if (SS.length == 1) {
    s += '0'
  }
  s += SS
  return s
}

function compareFunction_s(propertyName) {
  return function (src, tar) {
    var v1 = src[propertyName];
    var v2 = tar[propertyName];
    if (v1 < v2) {
      return 1;
    }
    if (v1 > v2) {
      return -1;
    }
    return 0;
  };
}

function compareFunctionLess(propertyName) {
  return function (src, tar) {
    //获取比较的值
    var v1 = src[propertyName];
    var v2 = tar[propertyName];
    if (v1 < v2) {
      return 1;
    }
    if (v1 > v2) {
      return -1;
    }
    return 0;
  };
}

function compareFunctionGreater(propertyName) {
  return function (src, tar) {
    //获取比较的值
    var v1 = src[propertyName];
    var v2 = tar[propertyName];
    if (v1 > v2) {
      return 1;
    }
    if (v1 < v2) {
      return -1;
    }
    return 0;
  };
}

module.exports = {
  IsChinese: IsChinese,
  CNDateString: CNDateString,
  compareFunction_s: compareFunction_s,
  compareFunctionLess: compareFunctionLess,
  compareFunctionGreater: compareFunctionGreater,
}