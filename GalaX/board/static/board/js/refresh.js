import { local_buffer, render } from './render.js';


// On document refresh, load nearby events data.
$(document).ready(
 () => {
  buffer_nearby();
  var option = $("#event-filter option:selected").text();
  render(local_buffer, option);
 }
);

// On reselect filter, render.
// Get selected content from <select>: https://stackoverflow.com/questions/1643227/get-selected-text-from-a-drop-down-list-select-box-using-jquery
$("#event-filter").change(function () {
 var option = $("#event-filter option:selected").text();
 buffer_category(option);
 render(local_buffer, option);
}
)




// On scrolling down to bottom: TODO:
// https://stackoverflow.com/questions/3898130/check-if-a-user-has-scrolled-to-the-bottom
// Temporarily disable the event:
// https://stackoverflow.com/questions/1263042/how-to-temporarily-disable-a-click-handler-in-jquery
// var NEAR_BOTTOM = 10;
// var SCROLL_FLAG = 0;
// $(window).scroll(async function () {
//  if (
//   $(window).scrollTop() + $(window).height() > $(document).height() - NEAR_BOTTOM
//   &&
//   SCROLL_FLAG == 0
//  ) {
//   SCROLL_FLAG = 1;
//   buffer_expand(local_buffer, option);
//   SCROLL_FLAG = 0;
//  }
// });


// Sleep:
// https://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep
function sleep(ms) {
 return new Promise(resolve => setTimeout(resolve, ms));
}


/** Buffer:
 * 
 *  0. nearby events
 *  1. hot events
 *  2. self events
 *  3. friends events 
 */

// Buffer nearby
function buffer_nearby() {
 window.navigator.geolocation.getCurrentPosition(success, error);
};

// Buffer based on category
function buffer_category(option) {
 if (option == "这里") {
  buffer_nearby();
 } else {
  $.ajax({
   url: "/map/others",
   method: 'POST',
   dataType: 'json', // Assign json will automatically parse json response.
   data: JSON.stringify({
    'this_position': current_position
   }),
   success: function (events) {
    if (events == null || events.length == 0) {
     // no events
     local_buffer[option].clear();
    } else {
     local_buffer[option].clear();
     local_buffer[option].extend(events);
    }
   },
  });
 }
}


/** Expand the buffer on sepecific category 
 * 
 * TODO:
*/
function buffer_expand(buffer, option) {

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
function buffer_center_nearby(current_position) {
 // Ajax GET request. Get nearby events
 $.ajax({
  url: "/map/nearby",
  method: 'POST',
  dataType: 'json', // Assign json will automatically parse json response.
  data: JSON.stringify({
   'this_position': current_position
  }),
  success: function (events) {
   if (events == null || events.length == 0) {
    // no events
    local_buffer["这里"].clear();
   } else {
    local_buffer["这里"].clear();
    local_buffer["这里"].extend(events);
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
 buffer_center_nearby(current_position);
};


//获取地理信息失败时的回调函数
function error(msg) {
 alert("获取您的地理信息失败");
};