var exam_obj = [];

// DOM Ready =============================================================
$(document).ready(function() {
    
    //alert('radio select');
      $(":radio").click(function(){
       //alert("您是..." + $(this).val());
       var videoname = $(this).val();

      $.getJSON( '/learn/get_ip_addr', function( ip_addr ) {
        //alert(ip_addr);
        //videoname = 'Clip_1080_5sec_10mbps_h264.mp4';
        var url = "http://" + ip_addr +  ':8000/' + videoname;
        
        //alert(url);
        window.open(url);
      });
      });


});

