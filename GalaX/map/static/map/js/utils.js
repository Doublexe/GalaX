'use strict';

import {map} from './baidu_map/generation.js';
import {addBaiduMarker} from './baidu_map/api.js';

/** This module defines dunctions that are decoupled from map api. */

var image_url = "https://cdn3.iconfinder.com/data/icons/stars-5/512/gold_star-512.png";
function addMarker(lng, lat, index){
  var marker = addBaiduMarker(lng, lat, index, 32, 32, image_url);
  marker.lng = lng;
  marker.lat = lat;
  return marker;
}

function addCandidateMarker(lng, lat, index){
  var marker = addBaiduMarker(lng, lat, index, 64, 64, image_url);
  marker.enableDragging();
  marker.lng = lng;
  marker.lat = lat;
  marker.addEventListener(
    'dragend',
    ()=>{
      var point = marker.getPosition();
      marker.lng = point.lng;
      marker.lat = point.lat;
    }
  );
  return marker;
}


// Get current position point. If success, call back.
function getPosition(sucess) {
 var geo = new BMap.Geolocation();
 var result = geo.getCurrentPosition(
  sucess
 );
};


// Jump all avaliable markers for a while
var A_WHILE = 4000;
async function jump_all () {
  var markers = map.getOverlays();
  for (var i = 0; i < markers.length; i++) {
    if (is_my_marker(markers[i])) {
      jump(markers[i]);
    }
  }
};

async function jump (marker) {
  await sleep(randi(0, A_WHILE/2));
  marker.setAnimation(BMAP_ANIMATION_BOUNCE);
  await sleep(A_WHILE);
  marker.setAnimation();
}


// Check if is my marker, which has lng and lat attrs. TODO: only private usage
function is_my_marker(obj) {
  if (obj.lng != undefined) {
    return true;
  }
  return false;
};


// random integer
function randi (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}



// Sleep:
// https://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


// Anchor at a position
function map_anchor(lng, lat) {
  var point = new BMap.Point(lng,lat); // 创建点坐标
  map.panTo(point); // 初始化地图，设置中心点坐标和地图级别
};



/** Star (show icon) an event. 
 * 
 * Implementation: A wrapper for BMap.Marker
 * 
 * Return: 
 *  Anchor the event.
 *  Return the star obj. TODO:
 *
class Star {
  constructor (event) {
    this.id = event.id;
    this.event = event;
    this.lng = event.lng;
    this.lat = event.lat;
    this.point = new BMap.Point(event.lng, event.lat);
    this.marker = addMarker(this.point, event.id);
  };
  
  anchor () {map_anchor(this.lng, this.lat)};

}
*/




export {getPosition, map_anchor, addMarker ,addCandidateMarker, jump_all, sleep};


