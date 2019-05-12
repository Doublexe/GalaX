import {
    current_info_event,
    render_info,
    render_resized_image_on_canvas,
    generate_imagesrc_from_base64,
    generate_base64_from_imagesrc
} from './render.js';

import { render_nearby, current_position, render_center_nearby } from './on_refresh.js';
import { map } from './baidu_map/generation.js';
import { addCandidateMarker, map_anchor, jump_all, sleep } from './utils.js';

/** This module contains functionalities for map nav bar */

/** On search: display all matched events */
function map_search() { };


/** On click: render and anchor the specific event */
function map_choose() { };


/** Given name string, from server get matched events */
function match_name(name) { };

/** Check if login. If so, do the func. Else alert. */
function on_login(func) {
    $.ajax({
        url: "/board/is_login",
        method: 'GET',
        dataType: 'json', // Assign json will automatically parse json response.
        success: function (msg) {
            if (msg.login == 1) {
                func();
            } else {
                alert("请先登录");
            }
        },
    });
}

var DEFAULT_ZOOM = 15;
// On refresh button, load nearby events data and anchor this position.
document.getElementById('map_relocate').addEventListener(
    'click',
    () => {
        render_nearby();
        map.setZoom(DEFAULT_ZOOM);
    },
    false
);


/** Add an event: map_add_event is the button */
document.getElementById('map_add_event').addEventListener(
    'click',
    add_event,
    false
);


/** Default image for add_event_image_canvas */
// TODO: font blury: https://stackoverflow.com/questions/15661339/how-do-i-fix-blurry-text-in-my-html5-canvas
var default_add_event_image = () => {
    var canvas = document.getElementById("add_event_image_canvas");
    var context = canvas.getContext("2d");
    context.fillStyle = "white";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "grey";
    context.font = "bold 16px SimHei";
    context.fillText("点击加入图片", (canvas.width / 2) - 50, (canvas.height / 2) + 8);
};
default_add_event_image();


/** Open add-event page. 
 *  1. drag and drop image: 
 * https://stackoverflow.com/questions/25092981/drag-drop-images-input-file-and-preview-before-upload
 *  2. summary input
 *  3. content input
 *  4. Activate draggable candidate star. 
 */
var DEFAULT_MARKER_ID = 0;
var add_event_candidate_marker;
function add_event() {
    $('#add_event_info').css({ 'visibility': 'visible' });
    if (add_event_candidate_marker == undefined) {
        add_event_candidate_marker =
            addCandidateMarker(current_position.lng, current_position.lat, DEFAULT_MARKER_ID);
    } else {
        add_event_candidate_marker.show();
        add_event_candidate_marker.enableDragging();
        map_anchor(add_event_candidate_marker.lng, add_event_candidate_marker.lat);
    }
};


/** default image */
var DEFAULT_IMAGESRC = generate_imagesrc_from_base64('');


/** Drag and drop image 
 * https://stackoverflow.com/questions/25092981/drag-drop-images-input-file-and-preview-before-upload
*/
var add_event_imagesrc_file = DEFAULT_IMAGESRC;
document.getElementById('filePhoto').addEventListener('change', handleImage, false);
function handleImage(e) {
    var reader = new FileReader(); // Open the explorer
    reader.readAsDataURL(e.target.files[0]); // parameter is the "input"

    reader.onload = function (input) {
        render_resized_image_on_canvas('add_event_image_canvas', input.target.result);
        add_event_imagesrc_file = input.target.result;
    };

    reader.onloadend = function () {
        if (reader.error != null) {
            alert(reader.error.message);
        }
    };
}
document.getElementById('add_event_image').onclick = () => {
    document.getElementById('filePhoto').click();
};
// Edit for multiple images
// I didn't try but it should work.
// Also you need write some CSS code to see all images in container properly.
function handleImages(e) {
    $('.uploader img').remove();
    for (var i = 0; i < e.target.files.length; i++) {
        var reader = new FileReader();
        reader.onload = function (input) {
            var $img = $('<img/>');
            $img.attr('src', input.target.result);
            $('.uploader').append($img);
        }
        reader.readAsDataURL(e.target.files[i]);
    }
}


// Cancel the sumbit (add event). Clear the contents.
document.getElementById('add_event_info_cancel').addEventListener(
    'click',
    cancel_event,
    false
)

// Hide the sumbit (add event). Don't clear the contents. 
document.getElementById('add_event_info_hide').addEventListener(
    'click',
    () => {
        $('#add_event_info').css({ 'visibility': 'hidden' });
        add_event_candidate_marker.hide();
    },
    false
)


function cancel_event() {
    var r = confirm('您确定要清除这次提交吗？');
    if (r) {
        silent_cancel_event();
    };
};

function silent_cancel_event() {
    $('#add_event_info').css({ 'visibility': 'hidden' });
    default_add_event_image();
    add_event_imagesrc_file = DEFAULT_IMAGESRC;
    $('#add_event_summary_file').val('');
    $('#add_event_content_file').val('');
    map.removeOverlay(add_event_candidate_marker);
    add_event_candidate_marker = undefined;
};


// Complete the submit.
document.getElementById('add_event_info_submit').addEventListener(
    'click',
    () => { on_login(submit_event) },
    false
)


function submit_event() {
    var r = confirm('您确定要提交吗？');
    var checked = check_sumbit();
    if (!checked) {
        alert('请完整填写信息');
    }
    if (r && checked) {
        $.ajax({
            url: "/map/upload",
            method: 'POST',
            dataType: 'json', // Assign json will automatically parse json response.
            data: JSON.stringify({
                event: {
                    imagebase64_and_type: generate_base64_from_imagesrc(add_event_imagesrc_file),
                    summary: $('#add_event_summary_file').val(),
                    content: $('#add_event_content_file').val(),
                    name: $('#add_event_name_file').val(),
                    lng: add_event_candidate_marker.lng,
                    lat: add_event_candidate_marker.lat,
                }
            }),
            success: function (msg) {
                if (msg.status == 1) {
                    alert('提交失败.');
                } else {
                    alert('提交成功');
                    render_center_nearby(add_event_candidate_marker.lng, add_event_candidate_marker.lat);
                    sleep(200);
                    map_anchor(add_event_candidate_marker.lng, add_event_candidate_marker.lat);
                    silent_cancel_event();
                    jump_all();
                }
            },
            failure: function (msg) {
                alert('提交失败. 网络连接问题.');
            }
        });
    };
};

/** Check if the sumbission is valid.
 *  1. Image
 *  2. text
 *  3. marker
 */
function check_sumbit() {
    var result = true;
    if (
        add_event_candidate_marker == undefined
        ||
        add_event_imagesrc_file == undefined
        ||
        bad_textarea_by_id('add_event_summary_file')
        ||
        bad_textarea_by_id('add_event_content_file')
        ||
        bad_textarea_by_id('add_event_name_file')
    ) {
        result = false;
    }
    return result;
};


function bad_textarea_by_id(textarea_id) {
    if ($.trim($('#' + textarea_id).val()) == "") {
        return true;
    } else {
        return false;
    }
};
