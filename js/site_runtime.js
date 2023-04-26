/* 站点运行时间 */
function runtime() {
    window.setTimeout("runtime()", 1000);
    /* 请修改这里的起始时间 */
    let startTime = new Date('04/16/2023 9:00:00');
    let endTime = new Date();
    let usedTime = endTime - startTime;
    let days = Math.floor(usedTime / (24 * 3600 * 1000));
    let leavel = usedTime % (24 * 3600 * 1000);
    let hours = Math.floor(leavel / (3600 * 1000));
    let leavel2 = leavel % (3600 * 1000);
    let minutes = Math.floor(leavel2 / (60 * 1000));
    let leavel3 = leavel2 % (60 * 1000);
    let seconds = Math.floor(leavel3 / (1000));
    let runbox = document.getElementById('run-time');
    runbox.innerHTML = '本站已运行'
        + '<span style="font-weight: bold; color: #16982b; font-size: 18px; font-style:italic;">' + ((days < 10) ? '0' : '') + days + '</span>' + ' 天 '
        + '<span style="font-weight: bold; color: #16982b; font-size: 18px; font-style:italic;">' +((hours < 10) ? '0' : '') + hours + '</span>' + ' 时 '
        + '<span style="font-weight: bold; color: #16982b; font-size: 18px; font-style:italic;">' +((minutes < 10) ? '0' : '') + minutes + '</span>' + ' 分 '
        + '<span style="font-weight: bold; color: #16982b; font-size: 18px; font-style:italic;">' +((seconds < 10) ? '0' : '') + seconds + '</span>' + ' 秒 ';
}
runtime();