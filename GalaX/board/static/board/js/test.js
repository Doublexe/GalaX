import { render, on_login } from './render.js';

var vgalaxy;

$("#event-filter").change(function () {
 var option = $("#event-filter option:selected").text();
 on_login(buffer_render_category, option);
 console.log(vgalaxy);
 
}
)

$(document).on('click', '.grid-item', function(){
 console.log(vgalaxy);
})



// Buffer nearby
function buffer_render_nearby() {
 window.navigator.geolocation.getCurrentPosition(success, error);
};

// Buffer based on category
function buffer_render_category(option) {
 if (option == "这里") {
  buffer_render_nearby();
 } else {
  $.ajax({
   url: "/board/category",
   method: 'POST',
   async: false,
   dataType: 'json', // Assign json will automatically parse json response.
   data: JSON.stringify({
    'this_position': current_position,
    'option': option
   }),
   success: function (events) {
    if (events == null || events.length == 0) {
     // no events
     vgalaxy = 'clear';
     // local_buffer[option].clear();
    } else {
     // The order of galaxy and local_buffer can't be reversed.
     vgalaxy = 'clear';
     // local_buffer[option].clear();
     // local_buffer[option].extend(events);
     vgalaxy = events;
    }
   },
  });
 }
}



/** Server-side requirement
 * 
 * Required:
 *  category: from server-side
 *  0. nearby: all
 *  1. recommend: hot icon
 *  2. friend: none icon
 *  3. self: crown
 *  
 * 
 * Return:
 *  modify local_buffer
 */
function buffer_render_center_nearby(current_position) {
 // Ajax GET request. Get nearby events
 $.ajax({
  url: "/map/nearby",
  method: 'POST',
  dataType: 'json', // Assign json will automatically parse json response.
  data: JSON.stringify({
   'this_position': current_position
  }),
  async: false,
  // The scope of success is viscious: https://blog.csdn.net/zxstone/article/details/7297284
  // TODO: VERY IMPORTANT
  success: function (events) {
   if (events == null || events.length == 0) {
    // no events
    vgalaxy = 'clear';
    // local_buffer["这里"].clear();
    alert("附近没有活动");
   } else {
    vgalaxy = 'clear';
    // local_buffer["这里"].clear();
    // local_buffer["这里"].extend(events);
    vgalaxy = events;
   }
  },
 });
};


// TODO: default
var current_position = {
 lng: 104.0668,
 lat: 30.5728
};
//获取地理信息成功时的回调函数
function success(position) {
 // alert("成功获取您的地理信息");

 //获取经度维度信息
 //coords属性
 var latitude = position.coords.latitude;
 var longitude = position.coords.longitude;
 current_position.lng = longitude;
 current_position.lat = latitude;
 //打印纬度,经度信息
 // console.log(latitude);
 // console.log(longitude);
 // Ajax GET request. Get nearby events
 buffer_render_center_nearby(current_position);
};


//获取地理信息失败时的回调函数
function error(msg) {
 alert("获取您的地理信息失败");
};

