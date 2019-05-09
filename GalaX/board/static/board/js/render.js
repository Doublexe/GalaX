import { EventCard } from "./cards.js";

// Galaxy: a card pool (EventCard)
class Galaxy {
 constructor() {
  this.stars = [];
 }

 clear() {
  for (var i = 0; i < this.stars.length; i++) {
   this.stars[i].remove();
  }
  this.stars = [];
 }

 extend(events) {
  for (var i = 0; i < events.length; i++) {
   this.stars.push(new EventCard(events[i]));
  }
 }

 append(event) {
  this.content.push(new EventCard(event));
 }
};
var galaxy = new Galaxy();


// A buffer utility
class Buffer {
 constructor(category) {
  this.category = category;
  this.content = [];
 }

 clear() {
  this.content = [];
 }

 extend(events) {
  this.content.push(...events);
 }

 append(event) {
  this.content.push(event);
 }
}

/** Local buffer for events ready to be rendered.
 * 
 * Event based on:
 * 1. geographical position
 * 2. recommendation
 * 3. friends (original / repost)
 * 4. self
 * 
 * Method:
 * 1. update(category, events)
 * 2. drop(event)
 * 3. get(category)
 * 
 * 
 * Implementation:
 * 1. auto-limited size
 */
var local_buffer = {
 '这里': new Buffer('nearby'),
 '热点': new Buffer('recom'),
 '朋友': new Buffer('friend'),
 '自己': new Buffer('like'),
};




/** Render the local buffer
 * 
 * Priority + Random TODO:
 */
function render(buffer, option) {
 galaxy.extend(buffer[option])
}


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

export { local_buffer, render, on_login }