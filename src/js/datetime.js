function _nowFormatted() {
    var d = new Date();
    d = d.getFullYear() + "-" + ('0' + (d.getMonth() + 1)).slice(-2) + "-"
        + ('0' + d.getDate()).slice(-2) + " " + ('0' + d.getHours()).slice(-2)
        + ":" + ('0' + d.getMinutes()).slice(-2) + ":" + ('0' + d.getSeconds()).slice(-2);
    return d;
}
exports.nowFormatted = _nowFormatted;