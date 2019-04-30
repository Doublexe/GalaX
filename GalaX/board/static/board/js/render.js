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
var local_buffer = [];



function reqest_event (category) {}


/** Render the local buffer
 * 
 * Priority + Random TODO:
 */
function render (buffer, option) {}


export {local_buffer, render}