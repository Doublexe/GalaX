/** Render the info_block. Use an event:
 *   1. image
 *   2. summary
 *   3. content
 *   4. ancor event on the map
 * 
 * Required:
 *  web-side html tags: info_image, info_summary, info_content
 */
function render_info(event) {
 render_resized_image_on_canvas("info_image",get_imagesrc_from_base64(event.imagebase64));
 $("#info_summary").html(event.summary);
 $("#info_content").html(event.content);
};


/** Render the info_block. Use the examplar event in some events.
 * 
 * Required: 
 *  events: a json list [event1, event2,...]
 */
function render_example_to_info(events) {
 var example = pick_example(events);
 render_info(example);
};


/** Render the recom_block. Use some events. 
 *   1. image
 *   2. url: to event page
 *   3. name: when hover
 *   4. onclick: ancor event on the map
*/
function render_recom(events) {

};


/** Render a single recom block. Use an event:
 * 
 */
function render_single_recom(event) {};


/** Pick an examplar event to render. 
 * 
 * Required: 
 *  events: a json list [event1, event2,...]
*/
function pick_example(events) {
    return events[0] // simple pick the first in the list
};

/** Get base64 image reference url */
function get_imagesrc_from_base64(image_base64) {
    return 'data:image/png;base64,' + image_base64;
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

export {render_example_to_info, render_recom}