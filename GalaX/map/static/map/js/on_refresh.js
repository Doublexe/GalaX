import {getPosition, map_anchor, jump_all} from './utils.js';
import {render_example_to_info, render_recom, clear_recom, mark_all} from './render.js';
import { map } from './baidu_map/generation.js';

// On document refresh, load nearby events data.
$(document).ready(
    render_nearby
);


/** Render nearby events and recommendations. */
function render_nearby () {
    window.navigator.geolocation.getCurrentPosition(success,error);
};

/** Render nearby events of a position */
function render_center_nearby (position) {
    // Ajax GET request. Get nearby events
    $.ajax({
        url: "/map/nearby",
        method: 'POST',
        dataType: 'json', // Assign json will automatically parse json response.
        data: JSON.stringify({
            'this_position': current_position
        }),
        success: function (events) {
            var not_repost = [];
            events.forEache( function (item, index) {
                if (item.mode != 'repost') {
                    not_repost.push(item)
                }
            }) // TODO: repost has no lng, lat. does this matter?
            if (not_repost == null || not_repost.length == 0) {  
                clear_recom();
                map.clearOverlays();
                alert("附近没有活动");
            } else {
                render_example_to_info(not_repost);
                clear_recom();
                map.clearOverlays();
                render_recom(not_repost); // these shouldn't be nearbys, but here assume nearby=recommend
                mark_all(not_repost);
                jump_all();
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
    //打印纬度,经度信息
    // console.log(latitude);
    // console.log(longitude);

    // Anchor the map
    map_anchor(longitude, latitude);
    current_position = {
        lng: longitude,
        lat: latitude
    };

    // Ajax GET request. Get nearby events
    render_center_nearby(current_position);
};


//获取地理信息失败时的回调函数
function error(msg) {
    alert("获取您的地理信息失败");
};

export {current_position, render_center_nearby, render_nearby};













