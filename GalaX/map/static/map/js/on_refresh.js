import {getPosition} from './baidu_map/utils.js';
import {render_example_to_info, render_recom} from './render.js';

// On document refresh, load nearby events data.
$(document).ready(
    function () {
        window.navigator.geolocation.getCurrentPosition(success,error);
    }
)


//获取地理信息成功时的回调函数
function success(position) {
    // alert("成功获取您的地理信息");

    //获取经度维度信息
    //coords属性
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;
    var position = {
        this_position: [longitude, latitude],
    }
    //打印纬度,经度信息
    // console.log(latitude);
    // console.log(longitude);

    // Ajax GET request. Get nearby events
    $.ajax({
        url: "/map/nearby",
        method: 'POST',
        dataType: 'json', // Assign json will automatically parse json response.
        data: JSON.stringify(position) ,
        // 
        success: function (events) {
            render_example_to_info(events);
            render_recom(events);
        },
    });
}


//获取地理信息失败时的回调函数
function error(msg) {
    alert("获取您的地理信息失败");
}















