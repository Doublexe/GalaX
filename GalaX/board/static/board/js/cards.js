import { $grid } from './dynamics.js';


/** Get base64 image reference url */
function generate_imagesrc_from_base64(imagebase64) {
  return 'data:image/png;base64,' + imagebase64;
};

/** Augmenting DOM:
 * https://stackoverflow.com/questions/3387427/remove-element-by-id
 */
Element.prototype.remove = function () {
  this.parentElement.removeChild(this);
}
NodeList.prototype.remove = HTMLCollection.prototype.remove = function () {
  for (var i = this.length - 1; i >= 0; i--) {
    if (this[i] && this[i].parentElement) {
      this[i].parentElement.removeChild(this[i]);
    }
  }
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
    this.onwer_id = event.onwer_id;
    this.type = event.type;
    switch (this.type) {
      case 'self':
        this.icon = `<div class="event-icon position-absolute bg-primary text-white rounded border border-dark px-1 py-0 m-2">
  <i class="fa fa-chess-queen fa-sm"></i>
</div>`;
        break;
      case 'hot':
        this.icon = `<div class="event-icon position-absolute bg-primary text-white rounded border border-dark px-1 py-0 m-2">
  <i class="fas fa-fire-alert fa-sm"></i>
</div>`;
        break;
      // case 'repost':
      // this.icon = `<i class="fas fa-at position-absolute bg-success text-white rounded p-2 m-2 fa-x"></i>`;
      // break;
      case 'none':
        this.icon = ``;
        break;
      default: alert("Wrong event type!");
    }
    ;
    this.event_id = event.id;
    //this.user = event.user;
    this.remove = () => {
      document.getElementById(`${this.event_id}`).remove();
    };
    var add_event = () => {
      var $new_event = $(`
 <div id=${this.event_id} class="grid-item col-md-3 col-sm-4 col-xs-6">
  <div class="grid-content card mx-1 my-4">
    <div class="grid-sense">
      <div class="event-meta" style="visibility:hidden; height:0;">
        <!-- Hidden event META here -->
      </div>
      <!-- icon -->
      ${this.icon}
      <div class="event-icon position-absolute bg-primary text-white rounded border border-dark px-1 py-0 m-2">
        <i class="fa fa-chess-queen fa-sm"></i>
      </div><img class="card-img-top event-image"
        src=${generate_imagesrc_from_base64(event.imagebase64)}
        alt="Card image cap" />
      <img class="card-profile event-profile mt-n5 mx-4" src=${generate_imagesrc_from_base64(event.profilebase64)}
        alt="profile-image" />
      <div class="event-display card-body">
        <h5 class="card-title event-name">
          <!-- Name here -->
          ${event.name}
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
          
          <div class="event-comment-hide mt-2">
            <textarea class="event-comment-content form-control" rows="6" placeholder="请输入评论"></textarea>
          </div>
        </div>

      </div>
    </div>
    <div class='grid-control card-footer card-hide'>
      <button type="button" class="grid-like btn btn-outline-warning" data-toggle="button" aria-pressed="false"
        autocomplete="off">
        <div class="grid-like-number d-inline">${event.likes}</div><i class="fa fa-star"></i>
      </button>
      <button type="button" class="grid-expand event-card btn btn-outline-dark" data-toggle="button"
        aria-pressed="false" autocomplete="off"><i class="fa fa-plus"></i></button>
      <button type="button" class="grid-comment-hide btn btn-outline-dark" data-toggle="button" aria-pressed="false"
        autocomplete="off"><i class="fa fa-comments"></i></button>
      <div class="event-usual-hide btn-group float-right" role="group" aria-label="Basic example">
        <div class="grid-comment-control-hide">
          <button type="button" class="event-comment-repost btn btn-outline-dark">Repost</button>
          <button type="button" class="event-comment-submit btn btn-outline-dark">Sumbit</button>
          <button type="button" class="event-comment-cancel btn btn-outline-dark">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</div>`);
      // Mansonry add new item: https://masonry.desandro.com/methods.html
      $grid.append($new_event).masonry('appended', $new_event);;
    };
    add_event();
  }
}


/** Repost card: repost is an event without a position */
class RepostCard {
  constructor(event) {
    this.type = event.type;
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
      default: alert("Wrong event type!");
    }
    ;
    this.event_id = event.id;
    this.user = event.user;
    this.remove = () => {
      document.getElementById(`${event.event_id}`).remove();
    };
    var add_event = () => {
      $grid.append(`
 <!-- Templates -->
<div id=${event.event_id} class="grid-item col-md-3 col-sm-4 col-xs-6">
  <div class="grid-content card mx-1 my-4">
    <div class="grid-sense">
      ${this.icon}
      <!-- two image -->
      <img class="card-img-top event-image" src=${event.imagesrc} alt="Card image cap" />
      <img class="card-profile event-profile" src=${event.profilesrc} alt="profile-image" /> 
      <div class="event-display card-body card-body-up">
        <h5 class="card-title event-name">
          ${event.name}
        </h5>
        <div class="rounded border border-secondary mb-1">
         <!-- clearfix to allow stopping consecutive text to be around -->
         <div class="event-repost clearfix"> 
           <!-- image -->
           <img class="card-profile-normal pull-left" src=${event.repostersrc} alt="profile-image" /> 
           <p class="card-text event-summary">
            ${event.summary}
           </p>
         </div>
         <div class="block" style="display:none"></div>
        </div>
        <div class="event-usual-hide">
          <p class="card-text event-content-hide">
           ${event.content}
          </p>
          <div class="event-comment-hide mt-2">
              <textarea class="event-comment-content form-control" rows="6" placeholder="请输入评论"></textarea>
          </div>
        </div>
      </div>
    </div>
    <div class='grid-control card-footer card-hide'>
      <button type="button" class="grid-like btn btn-outline-warning" data-toggle="button" aria-pressed="false" autocomplete="off"><i class="fa fa-star"></i></button>
      <button type="button" class="grid-expand event-card btn btn-outline-dark" data-toggle="button" aria-pressed="false" autocomplete="off"><i class="fa fa-plus"></i></button>
      <button type="button" class="grid-comment-hide btn btn-outline-dark" data-toggle="button" aria-pressed="false" autocomplete="off"><i class="fa fa-comments"></i></button>
      <div class="event-usual-hide btn-group float-right" role="group" aria-label="Basic example">
          <div class="grid-comment-control-hide">
          ${this.repost_html}
            <button type="button" class="btn btn-outline-dark">Sumbit</button>
            <button type="button" class="btn btn-outline-dark">Cancel</button>
          </div>
      </div>
    </div>
  </div>
</div>`);
    };
    add_event();
  }
}





/** Given comments from server, present comments block.
 * 
 * TODO:
 */
function get_comments(comments) {

}


export { EventCard };