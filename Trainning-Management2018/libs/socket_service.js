
/**
 * udp_service.js
 * @authors dingwei (wding.cn@gmail.com)
 * @date    2015-05-26
 * @version $Id$
 */

var logger;
var util = require('util');
var mtype = ['BIN', 'JSON'];
var vtype = ['STRING', 'CHAR', 'UINT', 'INT', 'FLOAT', 'DOUBLE', 'BOOLEAN', 'ARRAY'];
var tlength = {
	FLOAT: 4,
	DOUBLE: 8,
	BOOLEAN: 1,
	CHAR: 1
};
var encoding = ['ascii', 'utf8', 'utf16le', 'ucs2', 'base64', 'binary', 'hex']

var unpackJSON = function(message, def) {

}

var findmessagedef = function(messages, head) {
	for (var i in messages) {
		if (messages[i].head == head) {
			return messages[i];
		}
	}
}

if (!(Buffer.prototype.readUIntLE)) {
	Buffer.prototype.readUIntLE = function(offset, byteLength, noAssert) {
		var r = 0;
		switch(byteLength) {
			case 1:
				return this.readUInt8(offset, noAssert);
			case 2:
				return this.readUInt16LE(offset, noAssert);
			case 4:
				return this.readUInt32LE(offset, noAssert);
			default:
				var base = 1;
				var r = 0;
				if (!noAssert || this.length >= offset + byteLength) {
					for (var i = 0; i < byteLength; i++) {
						var t = this.readUInt8(offset + i, noAssert);
						console.log(t);
						r = r + t * base;
						base = base * 256;
					}
				}
				return r;
		}
	}
}

if (!(Buffer.prototype.readUIntBE)) {
	Buffer.prototype.readUIntBE = function(offset, byteLength, noAssert) {
		var r = 0;
		switch(byteLength) {
			case 1:
				return this.readUInt8(offset, noAssert);
			case 2:
				return this.readUInt16BE(offset, noAssert);
			case 4:
				return this.readUInt32BE(offset, noAssert);
			default:
				var base = Math.pow(256, byteLength - 1);
				var r = 0;
				if (!noAssert || this.length >= offset + byteLength) {
					for (var i = 0; i < byteLength; i++) {
						r = r + this.readUInt8(offset + i, noAssert) * base;
						base = base / 256;
					}
				}
				return r;
		}
	}
}

if (!(Buffer.prototype.readIntLE)) {
	Buffer.prototype.readIntLE = function(offset, byteLength, noAssert) {
		var r = 0;
		switch(byteLength) {
			case 1:
				return this.readInt8(offset, noAssert);
			case 2:
				return this.readInt16LE(offset, noAssert);
			case 4:
				return this.readInt32LE(offset, noAssert);
			default:
				{
					var base = Math.pow(256, byteLength - 1);
					var r = 0;
					var neg = false;
					if (!noAssert || this.length >= offset + byteLength) {
						for (var i = 0; i < byteLength; i++) {
							var b = this.readUInt8(byteLength + offset - 1 - i, noAssert);
							if (i == 0 && b > 127) {
								neg = true;
							}
							r = r + (neg ? 255 - b : b) * base;
							base = base / 256;
						}
						if (neg) {
							r = -(r + 1);
						}
					}
					return r;
				}
		}
	}
}

if (!(Buffer.prototype.readIntBE)) {
	Buffer.prototype.readIntBE = function(offset, byteLength, noAssert) {
		var r = 0;
		switch(byteLength) {
			case 1:
				return this.readInt8(offset, noAssert);
			case 2:
				return this.readInt16BE(offset, noAssert);
			case 4:
				return this.readInt32BE(offset, noAssert);
			default:
				{
					var base = Math.pow(256, byteLength - 1);
					var r = 0;
					var neg = false;
					if (!noAssert || this.length >= offset + byteLength) {
						for (var i = 0; i < byteLength; i++) {
							var b = this.readUInt8(offset + i, noAssert);
							if (i == 0 && b > 127) {
								neg = true;
							}
							r = r + (neg ? 255 - b : b) * base;
							base = base / 256;
						}
						if (neg) {
							r = -(r + 1);
						}
					}
					return r;
				}
		}
	}
}

if (!(Buffer.prototype.toArray)) {
	Buffer.prototype.toArray = function() {
		var len = this.length;
		var ret = [];
		for (var i = 0; i < len; i++) {
			ret.push(this[i]);
		}
		return ret;
	}
}



var unpackBIN = function(message, def, noAssert) {
	var result = {};
	var r = {};
	var point = 0;
	// console.log(message.readUIntLE(0,1));
	var ld = def.headLittleEndian;
	var head = ld ? message.readUIntLE(0, def.headlength) : message.readUIntBE(0, def.headlength);

	r.head = head;
	point = point + def.headlength;
	var msgdef = findmessagedef(def.messages, head);
	if (msgdef) {	
		var ld = msgdef.littleEndian;
		var fields = msgdef.fields;
		for (var i in fields) {
			var fi = fields[i];
			switch (fi.type) {
				case 'STRING':
					var value = message.toString(fi.encoding, point, point + fi.length);
					value = value.replace(/\u0000/g, '');
					break;
				case 'UINT':
					var value = ld ? message.readUIntLE(point, fi.length) : message.readUIntBE(point, fi.length, noAssert);
					break;
				case 'INT':
					var value = ld ? message.readIntLE(point, fi.length) : message.readIntBE(point, fi.length, noAssert);
					break;
				case 'BOOLEAN':
					var value = message.readUInt8(point) > 0;
					break;
				case 'CHAR':
					var value = message.slice(point, point + fi.length).toString('ascii');
					break;
				case 'FLOAT':
					var value = ld ? message.readFloatLE(point) : message.readFloatBE(point, noAssert);
					break;
				case 'DOUBLE':
					var value = ld ? message.readDoubleLE(point) : message.readDoubleBE(point, noAssert);
					break;
				case 'ARRAY':
					var value = message.slice(point, point + fi.length).toArray();
					break;
			}
			r[fi.name] = value;
			point = point + fi.length;
		}
		result.obj = r;
		if (msgdef.received && typeof msgdef.received == 'function') {
			result.callback = msgdef.received;
		}
	}
	return result;
}

if (!(Buffer.prototype.writeUIntLE)) {
	Buffer.prototype.writeUIntLE = function(value, offset, byteLength, noAssert) {
		if (value < 0 && noAssert) {
			this.writeIntLE(value, offset, byteLength, noAssert);
		}
		switch(byteLength) {
			case 1:
				this.writeUInt8(value, offset, noAssert);
				break;
			case 2:
				this.writeUInt16LE(value, offset, noAssert);
				break;
			case 4:
				this.writeUInt32LE(value, offset, noAssert);
				break;
			default:
				if (!noAssert || this.length >= offset + byteLength) {
					for (var i = 0; i < byteLength; i++) {
						var v = value % 256;
						this.writeUInt8(v, offset + i, noAssert);
						value = Math.floor(value / 256);
					}
				}
		}
	}
}

if (!(Buffer.prototype.writeUIntBE)) {
	Buffer.prototype.writeUIntBE = function(value, offset, byteLength, noAssert) {
		if (value < 0 && noAssert) {
			this.writeIntBE(value, offset, byteLength, noAssert)
		}
		switch(byteLength) {
			case 1:
				this.writeUInt8(value, offset, noAssert);
				break;
			case 2:
				this.writeUInt16BE(value, offset, noAssert);
				break;
			case 4:
				this.writeUInt32BE(value, offset, noAssert);
				break;
			default:
				if (!noAssert || this.length >= offset + byteLength) {
					for (var i = 0; i < byteLength; i++) {
						var v = value % 256;
						value = Math.floor(value / 256);
						this.writeUInt8(v, byteLength + offset - 1 - i, noAssert);
					}
				}
		}
	}
}

if (!(Buffer.prototype.writeIntLE)) {
	Buffer.prototype.writeIntLE = function(value, offset, byteLength, noAssert) {
		switch(byteLength) {
			case 1:
				this.writeInt8(value, offset, noAssert);
				break;
			case 2:
				this.writeInt16LE(value, offset, noAssert);
				break;
			case 4:
				this.writeInt32LE(value, offset, noAssert);
				break;
			default:
				if (!noAssert || this.length >= offset + byteLength) {
					var neg = false;
					if (value < 0) {
						value = Math.pow(2, 8 * byteLength) + value;
						neg = true;
					}
					for (var i = 0; i < byteLength; i++) {
						var v = value % 256;
						value = Math.floor(value / 256);
						if (value == 0 && neg == true) {
							v = 0xFF & v;
						}
						this.writeUInt8(v, offset + i, noAssert);
					}
				}
		}
	}
}

if (!(Buffer.prototype.writeIntBE)) {
	Buffer.prototype.writeIntBE = function(value, offset, byteLength, noAssert) {
		switch(byteLength) {
			case 1:
				this.writeInt8(value, offset, noAssert);
				break;
			case 2:
				this.writeInt16BE(value, offset, noAssert);
				break;
			case 4:
				this.writeInt32BE(value, offset, noAssert);
				break;
			default:
				if (!noAssert || this.length >= offset + byteLength) {
					var neg = false;
					if (value < 0) {
						value = Math.pow(2, 8 * byteLength) + value;
						neg = true;
					}
					for (var i = 0; i < byteLength; i++) {
						var v = value % 256;
						value = Math.floor(value / 256);
						if (value == 0 && neg == true) {
							v = 0xFF & v;
						}
						this.writeUInt8(v, byteLength + offset - 1 - i, noAssert);
					}
				}
		}
	}
}

var packBIN = function(message, def, noAssert) {
	var result = {};
	if (message.head == undefined) {
		return new Buffer([]);
	}
	var msgdef = findmessagedef(def.messages, message.head);
	var ld = msgdef.littleEndian;
	var fields = msgdef.fields;
	var tl = def.headlength;
	for (var i in fields) {
		var fi = fields[i];
		tl = fi.length + tl;
	}
	var buf = new Buffer(tl);
	buf.fill(0);
	var point = 0;

	ld ? buf.writeUIntLE(message.head, point, def.headlength, noAssert) : buf.writeUIntBE(message.head, point, def.headlength, noAssert);

	point = point + def.headlength;
	for (var i in fields) {
		var fi = fields[i];
		switch(fi.type) {
			case 'STRING':
				if (message[fi.name] != undefined || fi.value != undefined) {
					buf.write(message[fi.name] || fi.value, point, fi.length, fi.encoding);
				}
				break;
			case 'UINT':
				if (message[fi.name] != undefined || fi.value != undefined) {
					ld ? buf.writeUIntLE(message[fi.name] || fi.value, point, fi.length, noAssert) : buf.writeUIntBE(message[fi.name] || fi.value, point, fi.length, noAssert);
				}
				break;
			case 'INT':
				if (message[fi.name] != undefined || fi.value != undefined) {
					ld ? buf.writeIntLE(message[fi.name] || fi.value, point, fi.length, true, noAssert) : buf.writeIntBE(message[fi.name] || fi.value, point, fi.length, noAssert);
				}
				break;
			case 'BOOLEAN':
				if (message[fi.name] != undefined || fi.value != undefined) {
					buf.writeUInt8((message[fi.name] || fi.value) ? 1 : 0, point, fi.length);
				}
				break;
			case 'CHAR':
				if (message[fi.name] != undefined || fi.value != undefined) {
					buf.write(message[fi.name] || fi.value, point, fi.length, fi.encoding);
				}
				break;
			case 'FLOAT':
				if (message[fi.name] != undefined || fi.value != undefined) {
					lb ? buf.writeFloatLE(message[fi.name] || fi.value, point, noAssert) : buf.writeFLoatBE(message[fi.name] || fi.value, point, noAssert);
				}
				break;
			case 'DOUBLE':
				if (message[fi.name] != undefined || fi.value != undefined) {
					lb ? buf.writeDoubleLE(message[fi.name] || fi.value, point, noAssert) : buf.writeDoubleBE(message[fi.name] || fi.value, point, noAssert);
				}
				break;
			case 'ARRAY':
				if (message[fi.name] != undefined || fi.value != undefined) {
					var t = new Buffer(message[fi.name] || fi.value);
					t.copy(buf, point);
				}
				break;
		}
		point = point + fi.length;
	}
	result.obj = buf;
	if (msgdef.sended && typeof msgdef.sended == 'function') {
		result.callback = msgdef.sended;
	}
	return result;
}

var checkmessagedef = function(msgdef) {
	msgdef.headlength = msgdef.headlength || 4;
	msgdef.headLittleEndian = msgdef.headLittleEndian == undefined ? true : msgdef.headLittleEndian;
	for (var i in msgdef.messages) {
		var mi = msgdef.messages[i];
		mi.littleEndian = mi.littleEndian == undefined ? true : mi.littleEndian;
		var fields = mi.fields;
		for (var j in fields) {
			var fi = fields[j];
			if (!(typeof fi.name === 'string')) {
				throw 'bad field name.'
			}
			if (typeof fi.type === 'string') {
				fi.type = fi.type.toUpperCase();
			}
			else {
				throw 'bad filed type.'
			}
			if (vtype.indexOf(fi.type) < 0) {
				throw 'bad filed type.'
			}
			if (fi.type in tlength) {
				fi.length = tlength[fi.type];
			}
			if (!(fi.length)) {
				throw 'bad filed length.'
			}
			if (fi.type === 'STRING') {
				fi.encoding = typeof fi.encoding == 'string' ? fi.encoding.toLowerCase() : 'ascii';
				fi.encoding = encoding.indexOf(fi.encoding) >= 0 ? fi.encoding : 'ascii';
			}
		}
	}
}

var udpserver = function(addinfo, messagedef) {
    var dgram = require('dgram');
    var self = this;
    this.endpoint = {};
    var udp = null;
    if (typeof addinfo == 'object') {
    	this.endpoint.ip = addinfo.ip || '0.0.0.0';
    	if (!(addinfo.port)) {
    		throw 'need port define.'
    	}
    	this.endpoint.port = addinfo.port;
    }
    if (typeof addinfo == 'number') {
    	this.endpoint.ip = '0.0.0.0';
    	this.endpoint.port = addinfo;
    }
    this.messagedef = messagedef;

    this.messagedef.type = typeof this.messagedef.type == 'string' && mtype.indexOf(this.messagedef.type.toUpperCase()) >= 0 ? this.messagedef.type.toUpperCase() : 'JSON';
    if (this.messagedef.type == 'BIN') {
    	checkmessagedef(this.messagedef);
    }

    if (JSON.stringify(this.endpoint) != '{}') {
    	udp = dgram.createSocket('udp4');
	    udp.bind(this.endpoint.port, this.endpoint.ip);
	    logger.info('[%s] udp server start at %s:%s.', logger.name, this.endpoint.ip, this.endpoint.port);
	    if (this.messagedef) {
		    udp.on('message', function(message, remote) {
		    	logger.debug('[%s] received message (%s) from %s:%s.', logger.name, message.toString('hex'), remote.address, remote.port);
		    	var m = null;
		    	switch(self.messagedef.type) {
		    		case "JSON":
		    			m = unpackJSON(message);
		    			break;
	    			case "BIN":
		    			m = unpackBIN(message, self.messagedef);
		    			break;
	    			default:
	    				m = unpackJSON(message, self.messagedef);
	    				break;
		    	}
		    	if (m.callback) {
		    		m.callback(m.obj);
		    	}
		    })
		}
    }
    
    this.send = function(obj, port, address) {
    	address = address || '0.0.0.0';
    	switch(this.messagedef.type) {
    		case "BIN":
	    		var m = packBIN(obj, this.messagedef, true);
    			break;
			case "JSON":
				break;
    	}
    	if (udp) {
    		udp.send(m.obj, 0, m.obj.length, port, address);
    		logger.debug('[%s] sended message (%s) to %s:%s.', logger.name, m.obj.toString('hex'), address, port);
    		if (m.callback) {
    			m.callback(m.obj);
    		}
    	}
    }
    return this;
};


module.exports = function(log) {
	logger = log || {
        info : console.log,
        debug : console.log,
        silly : console.log,
        verbose : console.log,
        warn : console.log,
        error : console.log
    }
	return {udpserver : udpserver};
};