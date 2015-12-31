
function _endsWith(text, suffix) {
    return text.indexOf(suffix, text.length - suffix.length) !== -1;
}
exports.endsWith = _endsWith;

function _replaceText(text, target, replacement) {
    return text.replace(target, replacement);
}
exports.replaceText = _replaceText;

function _parseFullyQualifiedClass(text) {
    if(!text) {
        return null;
    }
    var n = text.lastIndexOf('.');
    if(n < 0) {
        return {
            'className' : text,
            'packageName' : '',
            'packageDir' : ''
        };
    } else {
        var className = text.substring(n+1),
            packageName = text.substring(0,n);
        var packageDir = packageName.replace(/\./g, '/');
        return {
            'className' : className,
            'packageName' : packageName,
            'packageDir' : packageDir + '/'
        };
    }
}
exports.parseFullyQualifiedClass = _parseFullyQualifiedClass;
