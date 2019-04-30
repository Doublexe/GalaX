import {$grid} from './dynamics.js';

/** Augmenting DOM:
 * https://stackoverflow.com/questions/3387427/remove-element-by-id
 */
Element.prototype.remove = function() {
 this.parentElement.removeChild(this);
}
NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
 for(var i = this.length - 1; i >= 0; i--) {
     if(this[i] && this[i].parentElement) {
         this[i].parentElement.removeChild(this[i]);
     }
 }
}


/** Event card */
function EventCard(event) {
 this.type = event.type;
 switch (event.type) {
  case 'self':
  this.icon = `<i class="fas fa-chess-queen position-absolute border border-dark bg-primary text-white rounded p-2 m-2 fa-x"></i>`;
  break;
  case 'hot':
  this.icon = `<i class="fas fa-fire-alt position-absolute border border-dark bg-danger text-white rounded p-2 m-2 fa-x"></i>`;
  break;
  // case 'repost':
  // this.icon = `<i class="fas fa-at position-absolute bg-success text-white rounded p-2 m-2 fa-x"></i>`;
  // break;
  default: alert("Wrong event type!");
 };
 this.event_id = event.id;
 this.user = event.user;
 this.remove = () => {
  document.getElementById(`${event.event_id}`).remove();
 };
 var add_event = () => { $grid.append(`
 <div id=${event.event_id} class="grid-item col-md-3 col-sm-4 col-xs-6">
  <div class="grid-content card mx-1 my-4">
    <div class="grid-sense">
      ${this.icon}
      <img class="card-img-top event-image" src=${event.imagesrc} alt="Card image cap" />
      <img class="card-profile event-profile" src="${event.profilesrc}" alt="profile-image" /> 
      <div class="event-display card-body card-body-up">
        <h5 class="card-title event-name">
          ${event.name}
        </h5>
        <p class="card-text event-summary">
          ${event.summary}
        </p>
        <div class="event-usual-hide">
          <div class="divider"></div>
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
            <button type="button" class="btn btn-outline-dark">Sumbit</button>
            <button type="button" class="btn btn-outline-dark">Cancel</button>
          </div>
      </div>
    </div>
  </div>
 </div>`)}

 add_event();
}


/** Repost card: repost is an event without a position */
function RepostCard(event) {
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
 };
 this.event_id = event.id;
 this.user = event.user;
 this.remove = () => {
  document.getElementById(`${event.event_id}`).remove();
 };
 var add_event = () => { $grid.append(`
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
</div>`)}

 add_event();
}


export {EventCard};