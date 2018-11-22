// 时间格式处理(YYYY-MM-DD)
export const toDate = (num=new Date()) => {
    num = num + "";
    var date = "";
    var month = new Array();
    month["Jan"] = 1; month["Feb"] = 2; month["Mar"] = 3; month["Apr"] = 4; month["May"] = 5; month["Jun"] = 6;
    month["Jul"] = 7; month["Aug"] = 8; month["Sep"] = 9; month["Oct"] = 10; month["Nov"] = 11; month["Dec"] = 12;
    var week = new Array();
    week["Mon"] = "一"; week["Tue"] = "二"; week["Wed"] = "三"; week["Thu"] = "四"; week["Fri"] = "五"; week["Sat"] = "六"; week["Sun"] = "日";
    var str = num.split(" ");
    date = str[3] + "-";
    date = date + month[str[1]] + "-" + str[2];
    return date;
}
//时间戳处理
export const timestamp = (day) => {
    let date = new Date();
    date.setTime(Date.parse(new Date(day)));
    return date.toString();
}
// 文字过长显示省略处理
export const omits = (str,length=10) => {
    if (str) {
        if (str.length > length) {
            return str.substring(0, length) + "...";
        } else {
            return str;
        }
    }
}
export const omitLength = (str,length=10) => {
    if (str) {
        if (str.length > length) {
            return false;
        } else {
            return true;
        }
    }
}
// 收起搜索条件
export const packUp = isPackUp => {
    if (isPackUp){
        $("#packUp").css({transform:"rotate(0deg)"})
    }else {
        $("#packUp").css({transform:"rotate(180deg)"})
    }
}
// 规格处理
export const  props_valuesC = (val) => {
    var str = '';
    if (val.rops_values) {
        for (var i = 0; i < val.rops_values.length; i++) {
            str = val.rops_values[i].prop_name + ' ' + val.rops_values[i].prop_value + ' '
        }
        return str
    }
}
// 路径处理
// export const setUrl = () => {
//     if (window.location.host == "testfonterp.kmjiu.com") {
//         return 'https://testfonterp.kmjiu.com';
//     } else {
//         return 'https://fonterp.kmjiu.com';
//     }
// }