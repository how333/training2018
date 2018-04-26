$(function() {
			alert('abc');
            var _minute = parseInt("${exampaper.paperTime }");
            var _expiresHours = _minute * 60 * 1000;
               
            if(!hasSetCookie()){
                addCookie("${examinee.examineeId}", _expiresHours, _expiresHours);
            } 
            settime($("#remainTime")); 
        });
        function hasSetCookie(){
            var strCookie = document.cookie;
            var arrCookie = strCookie.split("; ");
            for (var i = 0; i < arrCookie.length; i++) {
                var arr = arrCookie[i].split("=");
                if (arr[0] == "${examinee.examineeId}") {
                    return true;
                }
            };
            return false;
        }
        //开始倒计时
        function settime(remainTime) {
            var _time = getCookieValue("871d31bacfd4451484c5f70f8860c2a9");
            var _countdown = parseInt(getCookieValue("${examinee.examineeId}")) / 1000;
             
            if (_countdown <= 0) {
                alert("考试时间到！");
                endExam();
            } else {
                var _second = _countdown % 60;
                var _minute = parseInt(_countdown / 60) % 60;
                var _hour = parseInt(parseInt(_countdown / 60) / 60);
 
                if (_hour < 10)
                    _hour = "0" + _hour.toString();
                if (_second < 10)
                    _second = "0" + _second.toString();
                if (_minute < 10)
                    _minute = "0" + _minute.toString();
 
                remainTime.html(_hour + ":" + _minute + ":" + _second);
                _countdown--;
                editCookie("${examinee.examineeId}", _countdown * 1000, _countdown * 1000);
            }
            //每1000毫秒执行一次
            setTimeout(function() {
                settime(remainTime);
            }, 1000);
        };
 
        //时添加cookie
        function addCookie(name, value, expiresHours) {
            var cookieString = name + "=" + escape(value); //escape() 函数可对字符串进行编码，这样就可以在所有的计算机上读取该字符串。
            //判断是否设置过期时间,0代表关闭浏览器时失效
            if (expiresHours > 0) {
                var date = new Date();
                date.setTime(date.getTime() + expiresHours * 1000);
                cookieString = cookieString + ";expires=" + date.toUTCString();
            }
            document.cookie = cookieString;
        }
 
        //修改cookie的值
        function editCookie(name, value, expiresHours) {
            var cookieString = name + "=" + escape(value);
            if (expiresHours > 0) {
                var date = new Date();
                date.setTime(date.getTime() + expiresHours * 1000); //单位是毫秒
                cookieString = cookieString + ";expires=" + date.toGMTString();
            }
            document.cookie = cookieString;
        }
 
        //根据名字获取cookie的值
        function getCookieValue(name) {
            var strCookie = document.cookie;
            var arrCookie = strCookie.split("; ");
            for (var i = 0; i < arrCookie.length; i++) {
                var arr = arrCookie[i].split("=");
                if (arr[0] == name) {
                    return unescape(arr[1]);
                    break;
                } else {
                    continue;
                };
            };
        }