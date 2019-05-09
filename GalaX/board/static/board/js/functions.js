import {on_login, local_buffer} from './render.js';

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
$('.grid-like').on('click', ()=>{on_login(click_like)});
function click_like () {
 var LIKE = true;
 var UNLIKE = false;
 if (!$(this).hasClass('active')) {
  // Liked request
  like($(this).parents('.grid-item'), LIKE);
 } else {
  // Unliked request
  like($(this).parents('.grid-item'), UNLIKE);
 }
}

function like($grid_item, flag) {
 $.ajax({
  url: "/board/like",
  method: 'POST',
  dataType: 'json', // Assign json will automatically parse json response.
  data: JSON.stringify({
   'event': null,
   'user': null,
   'like': flag,
  }),
  success: function (msg) {
   if (msg.status==0) {
    // TODO: Change number of likes: msg.num_like
    // Pseudo number: just add 1
    // Get integer from html: https://stackoverflow.com/questions/31767771/get-integer-from-html-text-to-javascript
    var like_num = $grid_item.find('.grid-like-number');
    if (flag) {
     like_num.html(parseInt(like_num.html(), 10)+1);
    } else {
     like_num.html(parseInt(like_num.html(), 10)-1);
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
$('.event-comment-cancel').on('click', function () {
 var r = confirm("您确定要取消吗?");
 if (r) {
  $(this).parents('.grid-content').find('.event-comment-content').val('');
  $(this).parents('.grid-control').find('.grid-comment-hide').trigger('click');
 }
});


/** Submit and hide comment form */
$('.event-comment-submit').on('click', () => {on_login(click_submit)});
function click_submit () {
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
$('.event-comment-repost').on('click', () => {on_login(click_repost)});
function click_repost () {
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

function repost($grid_item) {
 $.ajax({
  url: "/board/repost",
  method: 'POST',
  dataType: 'json', // Assign json will automatically parse json response.
  data: JSON.stringify({
   'event_id': $grid_item.attr('id'),
   'comment': $grid_item.find('.event-comment-content').val(),
  }),
  success: function (msg) {
   if (msg.status) {
    // TODO: add repost card
    local_buffer["const"]
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

