import { $grid } from './dynamics.js';


/** Get base64 image reference url */
function generate_imagesrc_from_base64(imagebase64) {
  return 'data:image/png;base64,' + imagebase64;
};

/** Augmenting DOM and use mansonry:
 * https://stackoverflow.com/questions/3387427/remove-element-by-id
 */
Element.prototype.remove = function () {
  $grid.masonry('remove', this);
  $grid.masonry();
  // this.parentElement.removeChild(this);
}
NodeList.prototype.remove = HTMLCollection.prototype.remove = function () {
  for (var i = this.length - 1; i >= 0; i--) {
    if (this[i] && this[i].parentElement) {
      $grid.masonry('remove', this[i]);
    }
  }
  $grid.masonry();
}


/** Event card
 *
 * Required:
 *  server-side:
 *    event: option, id(event), imagesrc, profilesrc, name,
 *           summary, content, comments
*/
class EventCard {
  constructor(event) {
    this.owner_id = event.owner_id;
    this.type = event.type;
    this.event_id = event.id;

    this.repost_html = `<button type="button" class="event-comment-repost btn btn-outline-dark">Repost</button>`;

    if (event.liked) { this.like_button = `active`; }
    else { this.like_button = ``; }

    switch (this.type) {
      case 'self':
        this.icon = `<div class="event-icon position-absolute bg-primary text-white rounded border border-dark px-1 py-0 m-2">
  <i class="fa fa-chess-queen fa-sm"></i>
</div>`;
        this.repost_html = ``;
        break;
      case 'hot':
        this.icon = `<div class="event-icon position-absolute bg-primary text-white rounded border border-dark px-1 py-0 m-2">
  <i class="fas fa-fire-alert fa-sm"></i>
</div>`;
        break;
      case 'none':
        this.icon = ``;
        break;
      default: alert("Wrong event type: " + this.type);
    }

    if (!event.imagebase64) {
      this.image_top = ``;
    } else {
      this.image_top = `
      <!-- icon -->
      ${this.icon}
      <div class="event-icon position-absolute bg-primary text-white rounded border border-dark px-1 py-0 m-2">
        <i class="fa fa-chess-queen fa-sm"></i>
      </div><img class="card-img-top event-image" data-toggle="tooltip" title="${event.name}"
        src=${generate_imagesrc_from_base64(event.imagebase64)}
        alt="Card image cap" />
      `;
    }

    if (!event.profilebase64) {
      this.image_profile = ``;
    } else {
      if (!event.imagebase64) {
        this.image_profile = `
      <img class="card-profile event-profile m-3" src=${generate_imagesrc_from_base64(event.profilebase64)}
        data-toggle="tooltip" title="${event.ownername}"
        alt="profile-image" />
      `;
      } else {
        this.image_profile = `
      <img class="card-profile event-profile mt-n5 mx-4" src=${generate_imagesrc_from_base64(event.profilebase64)}
        data-toggle="tooltip" title="${event.ownername}"  
        alt="profile-image" />
      `;
      }
    }

    this.remove = () => {
      // this.$html.remove();
      $grid.masonry('remove', this.$html);
    };
    var add_event = () => {
      var $new_event = $(`
 <div id=${this.event_id} class="grid-item col-md-3 col-sm-4 col-xs-6">
  <div class="grid-content card mx-1 my-4">
    <div class="grid-sense">
      <div class="event-meta" style="visibility:hidden; height:0;">
        <!-- Hidden event META here -->
      </div>
      ${this.image_top}
      ${this.image_profile}
      <div class="event-display card-body pt-0">
        <h5 class="card-title event-name">
          <!-- Name here -->
          ${event.name} <small class="text-muted">@ ${event.ownername}</small>
        </h5>
        <p class="card-text event-summary">
          <!-- Summary here -->
          ${event.summary}
        </p>
        <div class="event-usual-hide">
          <div class="divider"></div>
          <div class="block" style="display:none"></div>
          <p class="card-text event-content-hide">
            <!-- Content here -->
            ${event.content}
          </p>

          <div class="grid-comment mt-2">
            ${get_comment_blocks(event.comments)}
          </div>
          
          <div class="event-comment-hide mt-2">
            <textarea class="event-comment-content form-control" rows="6" placeholder="请输入评论"></textarea>
          </div>
        </div>

      </div>
    </div>
    <div class='grid-control card-footer card-hide'>
      <button type="button" class="grid-like btn btn-outline-warning ${this.like_button}" data-toggle="button" aria-pressed="false"
        autocomplete="off">
        <div class="grid-like-number d-inline">${event.likes}</div><i class="fa fa-star"></i>
      </button>
      <button type="button" class="grid-expand event-card btn btn-outline-dark" data-toggle="button"
        aria-pressed="false" autocomplete="off"><i class="fa fa-plus"></i></button>
      <button type="button" class="grid-comment-hide btn btn-outline-dark" data-toggle="button" aria-pressed="false"
        autocomplete="off"><i class="fa fa-comments"></i></button>
      <div class="event-usual-hide btn-group float-right" role="group" aria-label="Basic example">
        <div class="grid-comment-control-hide">
          ${this.repost_html}
          <button type="button" class="event-comment-submit btn btn-outline-dark">Sumbit</button>
          <button type="button" class="event-comment-cancel btn btn-outline-dark">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</div>`);
      // bind this
      $new_event.data(this);
      // Mansonry add new item: https://masonry.desandro.com/methods.html
      $grid.append($new_event).masonry('appended', $new_event);
      return $new_event;
    };
    this.$html = add_event();
  }
}


/** Repost card: repost is an event without a position */
class RepostCard {
  constructor(repost) {
    var event = repost.repost_from;
    this.type = event.type;
    this.event_id = event.id;
    this.user = event.user;


    this.repost_html = '';
    switch (event.type) {
      case 'self':
        this.icon = `<i class="fas fa-chess-queen position-absolute border border-dark bg-primary text-white rounded p-2 m-2 fa-x"></i>`;
        this.repost_html = `<button type="button" class="event-comment-repost btn btn-outline-dark">Repost</button>`;
        break;
      case 'hot':
        this.icon = `<i class="fas fa-fire-alt position-absolute border border-dark bg-danger text-white rounded p-2 m-2 fa-x"></i>`;
        break;
      // case 'repost':
      // this.icon = `<i class="fas fa-at position-absolute bg-success text-white rounded p-2 m-2 fa-x"></i>`;
      // break;
      case 'none':
        this.icon = ``;
        break
      default: alert("Wrong event type: " + this.type);
    };
    
    if (!event.imagebase64) {
      this.image_top = ``;
    } else {
      this.image_top = `
      <!-- icon -->
      ${this.icon}
      <div class="event-icon position-absolute bg-primary text-white rounded border border-dark px-1 py-0 m-2">
        <i class="fa fa-chess-queen fa-sm"></i>
      </div><img class="card-img-top event-image" data-toggle="tooltip" title="${event.name}"
        src=${generate_imagesrc_from_base64(event.imagebase64)}
        alt="Card image cap" />
      `;
    }

    if (!event.profilebase64) {
      this.image_profile = ``;
    } else {
      if (!event.imagebase64) {
        this.image_profile = `
      <img class="card-profile event-profile m-3" src=${generate_imagesrc_from_base64(event.profilebase64)}
        data-toggle="tooltip" title="${event.ownername}"
        alt="profile-image" />
      `;
      } else {
        this.image_profile = `
      <img class="card-profile event-profile mt-n5 mx-4" src=${generate_imagesrc_from_base64(event.profilebase64)}
        data-toggle="tooltip" title="${event.ownername}"  
        alt="profile-image" />
      `;
      }
    }

    this.remove = () => {
      // this.$html.remove();
      $grid.masonry('remove', this.$html);
    };
    var add_event = () => {
      var $new_event = $(`
      <div id=${this.event_id} class="grid-item col-md-3 col-sm-4 col-xs-6">
      <div class="grid-content card mx-1 my-4">
        <div class="grid-sense">
          <div class="event-meta" style="visibility:hidden; height:0;">
            <!-- Hidden event META here -->
          </div>
          ${this.image_top}
          ${this.image_profile}
          <div class="event-display card-body pt-0">
            <h5 class="card-title event-name">
              <!-- Name here -->
              ${event.name} <small class="text-muted">@ ${event.ownername}</small>
            </h5>
            ${get_comment_blocks(repost.repost_comment)}
            <p class="card-text event-summary">
              <!-- Summary here -->
              ${event.summary}
            </p>
            <div class="event-usual-hide">
              <div class="divider"></div>
              <div class="block" style="display:none"></div>
              <p class="card-text event-content-hide">
                <!-- Content here -->
                ${event.content}
              </p>
    
              <div class="grid-comment mt-2">
                ${get_comment_blocks(repost.comments)}
              </div>
              
              <div class="event-comment-hide mt-2">
                <textarea class="event-comment-content form-control" rows="6" placeholder="请输入评论"></textarea>
              </div>
            </div>
    
          </div>
        </div>
        <div class='grid-control card-footer card-hide'>
          <button type="button" class="grid-like btn btn-outline-warning ${this.like_button}" data-toggle="button" aria-pressed="false"
            autocomplete="off">
            <div class="grid-like-number d-inline">${event.likes}</div><i class="fa fa-star"></i>
          </button>
          <button type="button" class="grid-expand event-card btn btn-outline-dark" data-toggle="button"
            aria-pressed="false" autocomplete="off"><i class="fa fa-plus"></i></button>
          <button type="button" class="grid-comment-hide btn btn-outline-dark" data-toggle="button" aria-pressed="false"
            autocomplete="off"><i class="fa fa-comments"></i></button>
          <div class="event-usual-hide btn-group float-right" role="group" aria-label="Basic example">
            <div class="grid-comment-control-hide">
              ${this.repost_html}
              <button type="button" class="event-comment-submit btn btn-outline-dark">Sumbit</button>
              <button type="button" class="event-comment-cancel btn btn-outline-dark">Cancel</button>
            </div>
          </div>
        </div>
      </div>
    </div>`);
      $new_event.data(this);
      $grid.append($new_event).masonry('appended', $new_event);
      return $new_event;
    };
    this.$html = add_event();
  }
}

// Given an event / repost, return the card
function get_card(obj) {
  if (obj.mode == 'normal') {
    return new EventCard(obj);
  }
  else if (obj.mode == 'repost') {
    return new RepostCard(obj);
  }
  else { alert("Wrong Object received: " + obj.mode) }

}



/** Given comments from server, present comments block.
 * 
 * Required:
 *  server-side: event.comments: list (can be empty): 
 *    [ item1, item2, ... ]
 * 
 *  item: 
 *  {
 *    'commenter_profilebase64'
 *    'commentername'
 *    'commenter_id'
 *    'commenter_comment' 
 *  }
 * 
 */
function get_comment_blocks(comments) {
  var comment_html = ``;
  comments.forEach(function (item, index) {
    if (!item.commenter_profilebase64) {
      var profile = ``;
    } else {
      var profile = `
      <img id="${item.commenter_id}" class="card-profile-normal" src="${generate_imagesrc_from_base64(item.commenter_profilebase64)}" alt="profile-image" />
      `;
    };
    comment_html = comment_html +
      `
    <!-- If top level comment: m-1 -->
    <div class="card grid-comment-item px-0" style="margin-bottom:5px">
      <div class="row no-gutters">
        <!-- image -->
        <div class="col-2">
          <!-- id = owner_id -->
          ${profile}
        </div>
        <div class="col-10 p-1">
          <p class="card-text event-summary">
            <!-- Repost comment here. No  -->
            <small class="text-muted">@${item.commentername}: </small>${item.commenter_comment}
          </p>
          <!-- sub comment -->
        </div>
      </div>
      <div class="block" style="display:none"></div>
    </div>
    `
  })
  return comment_html;
}


export { get_card, get_comment_blocks };