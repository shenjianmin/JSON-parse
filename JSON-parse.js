/*
  传入 JSON 字符串，并初始化指针，解析 JSON 对象
  @param  {[string]}  [传入的 JSON 字符串]
  @return {[object]}  [解析后的 JOSN 对象]
 */
function jsonParse(jsonString) {
    //定义必要的全局变量
    let theJson = '',
        index = 0,
        onOff = false
    /*
      处理空格
    */
    for (var i = 0; i < jsonString.length; i++) {
        if (jsonString[i] == '"') {
            onOff = onOff ? false : true
        }
    //当指针遇到空格，换行，tab时将跳出当前循环，执行下一个循环
        if (!onOff && (jsonString[i] == ' ' || jsonString[i] == '\n' || jsonString[i] == '\r' || jsonString[i] == '\t')) {
            continue
        }
        theJson = theJson + jsonString[i]
    }
    return parse()

    /*
      [指针指向合适的位置时进行的解析函数，根据字符串不同的表现返回不同的值]
      @param  {[string]} [当前需要解析的字符串]
      @param  {[number]} index)  var indexChar [指针]
      @return {[*]}            [解析后的值]
     */
    function parse() {
        var indexChar = theJson[index]
        //解析对象
        if (indexChar == '{') {
            return parseObject()
        }
        //解析数组
        if (indexChar == '[') {
            return parseArray()
        }
        //解析布尔值
        if (indexChar == 't') {
            return parseTrue()
        }
        //解析布尔值
        if (indexChar == 'f') {
            return parseFalse()
        }
        //解析null
        if (indexChar == 'n') {
            return parseNull()
        }
        //解析字符串
        if (indexChar == '"') {
            return parseString()
        }
        //解析数字
        if (isDigit(indexChar)) {
            return parseNumber()
        }
    }
    /*
      [parseNumber 解析值为数字的 value]
      @return {[type]} [数字]
     */
    function parseNumber() {
        for (var i = index + 1;; i++) {
            if (!isDigit(theJson[i])) {
                break
            }
        }
        var num = theJson.slice(index, i)
        index = i
        return parseInt(num)
    }
    /*
      [判断一个字符能否转换为数字]
      @param  {[string]}  char [传入的单个字符]
      @return {Boolean}      [如果能转换为数字，返回true]
     */
    function isDigit(char) {
        //指针位置是零，直接返回false
        if (!char) {
            return false
        }
        //拿到'0'，'9'和当前字符串的unicode编码
        let the0 = '0'.charCodeAt(0)
        let the9 = '9'.charCodeAt(0)
        let theChar = char.charCodeAt(0)
        //利用判断此字符串的unicode编码是否在'0'和'9'之间，如果在范围内则是数字
        if (the0 <= theChar && theChar <= the9) {
            return true
        } else {
            return false
        }
    }
    /*
      [parseString 解析值为字符串的value值]
      @return {[string]} [返回作为值的字符串]
     */
    function parseString() {
        var theEnd = theJson.indexOf('"', index + 1)
        var theString = theJson.slice(index + 1, theEnd)
        index = theEnd + 1
        return theString
    }
    /*
      [parseNull 解析 值为null的value值]
      @return {[type]} [返回null]
     */
    function parseNull() {
        index += 4
        return null
    }
    /*
      [parseFalse 解析值为 false 的 value 值]
      @return {[boolean]} [返回false]
     */
    function parseFalse() {
        index += 5
        return false
    }
    /*
     [parseFalse 解析值为 true 的 value 值]
      @return {[boolean]} [返回true]
     */
    function parseTrue() {
        index += 4
        return true
    }
    /*
      [parseArray 递归解析数组]
      @return {[array]} [返回一个数组]
     */
    function parseArray() {
        var result = [],
            product
        index++
        for (;;) {
            //这里利用递归，因为数组里可以嵌套数组
            product = parse()
            result.push(product)
            if (theJson[index] === ',') {
                index++
                continue
            }
            if (theJson[index] === ']') {
                break
            }
        }
        index++
        return result
    }
    /*
      [parseObject 递归解析对象]
      @return {[object]} [返回对象]
     */
    function parseObject() {
        var result = {},
            key,
            value
        index++
        for (;;) {
            key = parseString()
            index++
        //这里利用递归，因为对象里可以嵌套对象
            value = parse()
            result[key] = value
            if (theJson[index] === "}") {
                break
            }
            if (theJson[index] === ",") {
                index++
                continue
            }
        }
        index++
        return result
    }
}