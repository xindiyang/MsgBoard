/* 
时间格式的函数
*/
let time = () =>{
    var d = new Date();
    var year = d.getFullYear();
    var month = d.getMonth() + 1;
    month = month < 10 ? '0' + month : month;
    var day = d.getDate();
    day = day < 10 ? '0' + day : day;
    var hours = d.getHours();
    hours = hours < 10 ? '0' + hours : hours;
    var minutes = d.getMinutes();
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var secnd = d.getSeconds();
    secnd = secnd < 10 ? '0' + secnd : secnd;
    return year + '-' + month + '-' + day + '  ' + hours + ':' + minutes + ':' + secnd;
}
module.exports = time;