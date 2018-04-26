
/**
 * bonjour_service.js
 * @authors dingwei (wding.cn@gmail.com)
 * @date    2015-04-16
 * @version $Id$
 */

var mdns = require('mdns');
var browser = exports.browser = function(type, upCallBack, downCallBack, changedCallBack) {
    var _b = mdns.createBrowser(type);

    if (upCallBack && typeof upCallBack == 'function') {
        _b.on('serviceUp', upCallBack);
    }

    if (downCallBack && typeof downCallBack == 'function') {
        _b.on('serviceDown', downCallBack);
    }

    if (changedCallBack && typeof changedCallBack == 'function') {
        _b.on('serviceChanged', changedCallBack);
    }

    _b.on('error', function(ex) {
        // console.log(ex);
        // throw ex;
    })
    _b.start();
};

var type = exports.type = function(name, protocal, subtypes) {
    if (arguments.length < 1) {
        throw 'needs more arguments.'
    }
    protocal = ['tcp', 'udp'].indexOf(protocal && protocal.toLowerCase()) >= 0 ? protocal.toLowerCase() : 'tcp';
    if (protocal == 'tcp') {
        return subtypes ? mdns.tcp(name, subtypes) : mdns.tcp(name);
    }
    if (protocal == 'udp') {
        return subtypes ? mdns.udp(name, subtypes) : mdns.udp(name);
    }
}
