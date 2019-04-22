import {map} from './baidu_map/generation.js';
import {current_position, render_center_nearby} from './on_refresh.js';

/** This module contains functionalities for map interactions.
 *  TODO: Can only be coupled with utils.js
 */


/** Star animation: rotate, resize... */
function animate_star () {};


/** Check if the map is moved far away or scaled. If so, render new local events. */
map.addEventListener(
 'dragend',
 function () {
  var current_point = map.getCenter();
  var candidate_position = {
   lng: current_point.lng,
   lat: current_point.lat
  };
  if (is_far_away(candidate_position, current_position)) {
   assign_position(current_position, candidate_position);
   render_center_nearby(current_position);
  };
 }
);


function assign_position(position, new_position) {
 position.lng = new_position.lng;
 position.lat = new_position.lat;
};



var RADIUS = 0.1;
/** If the new position is far away from the old */
function is_far_away(new_position, old_position) {
 if (
  Math.abs(new_position.lng - old_position.lng)>=RADIUS/2
  ||
  Math.abs(new_position.lat - old_position.lat)>=RADIUS/2
 ) {
  return true;
 } else {
  return false;
 }
};

