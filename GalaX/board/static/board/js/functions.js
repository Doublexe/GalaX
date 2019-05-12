import { on_login } from './render.js';
import { local_buffer } from './refresh.js';

/** 
 * Event delegation: assign listener to all dynamically created classes:
 * https://stackoverflow.com/questions/34896106/attach-event-to-dynamic-elements-in-javascript
 * $(document).on(action, class, func)
 */

/** Like this event
 * 
 * Required:
 *  server-side: user LIKE event
 *  selected grid-item element and id
 * 
 * Return:
 *  number of liked -> grid-like html
 */
// Arrow function ()=>{} has no binding 'this' !
$(document).on('click', '.grid-like', function () { on_login(click_like, this) });
function click_like($grid_like) {
 var LIKE = 1;
 var UNLIKE = 0;
 if ($($grid_like).hasClass('active')) {
  // Liked request
  like($($grid_like).parents('.grid-item'), LIKE);
 } else {
  // Unliked request
  like($($grid_like).parents('.grid-item'), UNLIKE);
 }
}

function like($grid_item, flag) {
 var event_id = $grid_item.attr('id');
 $.ajax({
  url: "/board/like",
  method: 'POST',
  async: false,
  dataType: 'json', // Assign json will automatically parse json response.
  data: JSON.stringify({
   'event': event_id,
   'like': flag, // 1: like; 0: unlike
  }),
  success: function (msg) {
   if (msg.status == 0) {
    // Locally Change number of likes: msg.num_like
    // Pseudo number: just add 1
    // Get integer from html: https://stackoverflow.com/questions/31767771/get-integer-from-html-text-to-javascript
    var like_num = $grid_item.find('.grid-like-number');
    if (flag==1) {
     like_num.html(parseInt(like_num.html(), 10) + 1);
    } else {
     like_num.html(parseInt(like_num.html(), 10) - 1);
    };

   } else {
    alert("点赞/取消点赞失败"); //TODO: reason?
    $grid_item.find('.grid-like').toggleClass('active');
   }
  },
  failure: function (msg) {
   alert("点赞/取消点赞失败"); //TODO: reason?
   $grid_item.find('.grid-like').toggleClass('active');
  },
 });
}



/** Discard and hide comment form 
 * 
 * Required:
 *  server-side: user COMMENT event
*/
$(document).on('click', '.event-comment-cancel', function () {
 var r = confirm("您确定要取消吗?");
 if (r) {
  $(this).parents('.grid-content').find('.event-comment-content').val('');
  $(this).parents('.grid-control').find('.grid-comment-hide').trigger('click');
 }
});


/** Submit and hide comment form */
$(document).on('click', '.event-comment-submit', () => { on_login(click_submit) });
function click_submit() {
 submit($(this).parents('.grid-item'));
 $(this).parents('.grid-content').find('.event-comment-content').val('');
 $(this).parents('.grid-control').find('.grid-comment-hide').trigger('click');
}

function submit($grid_item) {
 $.ajax({
  url: "/board/submit",
  method: 'POST',
  dataType: 'json', // Assign json will automatically parse json response.
  data: JSON.stringify({
   'event_id': $grid_item.attr('event_id'),
   'comment': $grid_item.find('.event-comment-content').val(),
  }),
  success: function (msg) {
   if (msg.status) {
    // TODO: add comment block
   } else {
    alert("提交失败"); //TODO: reason?
   }
  },
  failure: function (msg) {
   alert("提交失败"); //TODO: reason?
  },
 });
}


/** Repost
 * 
 * Required:
 *  server-side: event REPOST event
 */
$(document).on('click', '.event-comment-repost', () => { on_login(click_repost) });
function click_repost() {
 var r = confirm("您确定要转发吗?");
 if (r) {
  var success = repost($(this).parents('.grid-item'));
  if (success) {
   $(this).parents('.grid-content').find('.event-comment-content').val('');
   $(this).parents('.grid-control').find('.grid-comment-hide').trigger('click');
  } else {
   alert("转发失败！");
  }
 }
}

//Clone utils: https://stackoverflow.com/questions/728360/how-do-i-correctly-clone-a-javascript-object
function clone(obj) {
 if (null == obj || "object" != typeof obj) return obj;
 var copy = obj.constructor();
 for (var attr in obj) {
  if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
 }
 return copy;
}

function repost($grid_item) {
 var event_id = $grid_item.attr('id');
 var comment = $grid_item.find('.event-comment-content').val();
 $.ajax({
  url: "/board/repost",
  method: 'POST',
  async: false,
  dataType: 'json', // Assign json will automatically parse json response.
  data: JSON.stringify({
   'event_id': event_id,
   'comment': comment,
  }),
  success: function (msg) {
   if (msg.status) {
    /**
     * Server-side: format repost like this.
     */
    var event = clone(local_buffer.find_event(event_id));
    event['mode'] = 'repost';
    event['repost_comment'] = comment;
    local_buffer["自己"].append(
     event
    );
    return true;
   } else {
    alert("提交失败"); //TODO: reason?
    return false;
   }
  },
  failure: function (msg) {
   alert("提交失败"); //TODO: reason?
   return false;
  },
 });
}


// right click menus
// JQcontextmenu: https://github.com/swisnl/jQuery-contextMenu
// This module is an event delegation!
$.contextMenu({
 // define which elements trigger this menu
 selector: ".card-profile-normal",
 // define the elements of the menu
 items: {
  goto: { name: "前往", callback: menu_goto },
  reply: { name: "回复", callback: menu_reply }
 }
 // there's more, have a look at the demos and docs...
});

function menu_goto(key, opt) {
 var $img = $(this);
 var owner_id = $img.attr('id');
 // Go to the owner page: TODO:
 window.open()
}

// Change comment block to reply mode
function menu_reply(key, opt) {

}