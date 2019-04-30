/** Global control over the map-board duality.
 * 
 * Scale:
 *  Three fixed scales: city -> district -> local
 * 
 * Filter:
 *  0. default: time + geo filter
 *  1. hot: new / hot
 *  2. social: friends (include group)
 *  3. collection: collection buffer -> no time filter
 * 
 * On map dragged far:
 *  change local buffer
 */