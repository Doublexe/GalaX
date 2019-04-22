import {map_anchor} from './utils.js';
import {addMarker} from './utils.js';


/** Render the info_block. Use an event:
 *  Function:
 *   1. image: onclick to event page
 *   2. summary
 *   3. content
 *   4. ancor event on the map
 * 
 * Required:
 *  event: must be Event() data model format. See map/model.py.
 *  web-side html tags: info_image, info_summary, info_content
 *  server-side: event page redirect
 * 
 */
var current_info_event;
function render_info(event) {
 render_resized_image_on_canvas("info_image",generate_imagesrc_from_base64(event.imagebase64));
 document.getElementById("info_image").onclick = function() {
     open_event_page(event);
 };
 $("#info_summary").html(event.summary);
 $("#info_content").html(event.content);
 current_info_event = event;
};


function render_info_and_anchor(event) {
    render_info(event);
    map_anchor(event.lng, event.lat);
};


function open_event_page (event) {
    window.open(generate_to_event_link(event.id), '_blank');
};



/** Make a marker
 *  1. map icon
 *  2. click to render and anchor
 */
function mark(event) {
    var marker = addMarker(event.lng, event.lat, event.id);
    marker.addEventListener('click', 
      function () {
        render_info(event);
      }
    ); 
    // marker.setAnimation(
    //   BMAP_ANIMATION_BOUNCE
    // );
    marker.setTitle(event.name);
  };


var MAX_MARKER_NUM = 20; //TODO: to be determined
function mark_all(events) {
    for (var i = 0; i < events.length; i++) {
        if (i <= MAX_MARKER_NUM) {
         mark(events[i]);
        }
    }
};


/** Render the info_block. Use the examplar event in some events.
 *  If events are empty, do nothing.
 * 
 * Required: 
 *  events: a json list [event1, event2,...]
 */
function render_example_to_info(events) {
        var example = pick_example(events);
        render_info(example);
};


/** Render the recom_block. Use some events. 
 *  When excede maximum size, stop rendering.
 *  Function:
 *   1. image
 *   2. name: when hover
 *   3. onclick: ancor event on the map
 * 
 * 
 * Required:
 *  events: can be empty.
 *  href in a: to the event page view.py.
 *  web-side html tags: recom_events
 * 
*/
var MAX_RECOM_SIZE = 20; // TODO: decide or make config module.
function render_recom(events) {
    for (var i = 0; i < events.length; i++) {
        if (i <= MAX_RECOM_SIZE) {
            render_single_recom(events[i]);
        }
    }
};


// Clear the recom block
function clear_recom() {
    $('#recom_events').html('');
};


/** Render a single recom block. Use an event. 
 * 
 * Required:
 *  href in a: to the event page view.py.
 *  web-side html tags: recom_events
 * 
 * Return: statisfy the spec of render_recom
*/
function render_single_recom(event) {
    var canvasId = `recom_canvas_${event.id}`;
    var single_event = 
    `<canvas title="${event.name}" id="${canvasId}" class="canvas_btn recom_page card my_card" style="height: 100%; margin-left: 5px">
    </canvas>`;

    $('#recom_events').append(single_event);
    
    render_resized_image_on_canvas(canvasId, generate_imagesrc_from_base64(event.imagebase64));

    // pitfall: https://stackoverflow.com/questions/44284455/javascript-addeventlistener-click-doesnt-work
    document.getElementById(canvasId).addEventListener(
        'click',
        function() {
            render_info_and_anchor(event);
        },
        false);
};


/** Generate url reference to event page, given the event id
 * 
 * Required:
 *  href in a: to the event page view.py.
 * 
 * TODO: not finished.
*/
function generate_to_event_link(event_id) {
    return "https://www.w3schools.com";
};


/** Pick an examplar event from events (array).
 * 
 * Required: 
 *  events: a json array [event1, event2,...]
*/
function pick_example(events) {
    return events[0] // simple pick the first in the array
};

/** Get base64 image reference url */
function generate_imagesrc_from_base64(imagebase64) {
    return 'data:image/png;base64,' + imagebase64;
};

/** Get base64 image from reference url */
function generate_base64_from_imagesrc(imagesrc) {
    var header = imagesrc.slice(0,30);
    header = header.replace('data:image/','');
    var image_type = header.split(';')[0];
    return {
        imagebase64: imagesrc.replace('data:image/'+image_type+';base64,',''),
        type: image_type
    };
    ;
};


/** Resize the image and render on a canvas 
 * 
 * Resize: https://stackoverflow.com/questions/19262141/resize-image-with-javascript-canvas-smoothly
 * Required:
 *  canvas_id: id string;
 *  img_src: url, can be data:image/png;base64=...; 
*/
function render_resized_image_on_canvas(canvas_id, img_src) {
    var canvas = document.getElementById(canvas_id);
    var ctx = canvas.getContext("2d");
    var img = new Image();

    img.onload = function () {
        // set size proportional to image
        canvas.height = canvas.width * (img.height / img.width);

        // step 1 - resize to 50%
        var oc = document.createElement('canvas'),
        octx = oc.getContext('2d');

        oc.width = img.width * 0.5;
        oc.height = img.height * 0.5;
        octx.drawImage(img, 0, 0, oc.width, oc.height);

        // step 2
        octx.drawImage(oc, 0, 0, oc.width * 0.5, oc.height * 0.5);

        // step 3, resize to final size
        ctx.drawImage(oc, 0, 0, oc.width * 0.5, oc.height * 0.5,
        0, 0, canvas.width, canvas.height);
        }
    img.src = img_src;
}

export {
    render_example_to_info, 
    render_recom, 
    clear_recom, 
    mark_all, 
    render_resized_image_on_canvas,
    generate_imagesrc_from_base64,
    current_info_event,
    render_info,
    generate_base64_from_imagesrc
}