$(function() {
    //alert('socket');
    var content = $('#content');
    var status = $('#status');
    var input = $('#input');
    var myName = false;
    var message_total = null;

    var self = {};
    self.uuid = Math.random().toString(36).slice(2);

    //建立websocket连接
    var url = location.origin.replace(/:(\d+)/, ':10080');
    var socket = self.socket = io.connect(url + '/mqtt');

    var pubMessage = function(topic, data) {
        data.timestamp = data.timestamp || (new Date()).valueOf();
        data.socketid = data.socketid || self.socket.id;
        socket.emit('publish', {
            topic: topic,
            message: data
        })
    }

    var subMessage = function(topics) {
        socket.emit('subscribe', {
            'topic': topics
        });
    }

    var unsubMessage = function(topics) {
        socket.emit('unsubscribe', {
            'topic': topics
        });
    }

    socket.on('connect',
    function() {

        //self.connectTime = new Date().valueOf();
        self.socketid = socket.id;

        status.text('connect success');

    });

    socket.on('connect',
    function() {
        status.text('connect success');
        self.connectTime = new Date().valueOf();
        self.socketid = socket.id;

    });

    $.getJSON('/learn/get_messages_content', {
        filename: 'message_normal.xml'
    },
    function(data) {

        message_total = data.Message;

    });

    //$(":radio").click(function() {
    $("#start_to_operation").click(function() {

        //var filename = $(this).val();
        var filename = $("[name='scenario']").val();
        //alert(filename);
        $.getJSON('/learn/get_scenario_content', {
            filename: filename
        },
        function(file_data) {
            var topic = '';
            var data = {};
            //alert('file_data');
            //alert(file_data);
            file_data.Scenario.operation.forEach(function(response_data) {
                //alert(response_data.topic);
                topic = response_data.topic;
                active = response_data.active;
                //alert(message_total[active].data);
                //r string = JSON.stringify(response_data.data);
               //lert(string);
                for (var para_name in message_total[active].data) {
                    //alert(para_name);

                    para_type = message_total[active].data[para_name];
                    //alert(response_data.data[para_name]);
                    //para_name_str = JSON.stringify(para_name);
                    //alert(para_name_str);
                    if (para_type == 'string') data[para_name] = response_data.data[para_name];
                    else if (para_type == 'int') data[para_name] = parseInt(response_data.data[para_name]);
                    //alert(JSON.stringify(data));
                }
                pubMessage(topic, data);
            });
        });
        var ip_addr = 'localhost';
        var url = "http://" + ip_addr +  ':3000/' ;
        
        //alert(url);
        window.open(url);

    })

        $("#submit_fake").click(function() {
            if(confirm("是否要提交试卷")){
               $("#submit_fake").hide();
               $("#submit").show();
               //$("#save").text('click the submit button to submit');
               alert('请再次点击提交按钮交卷');
                }  

        });

});