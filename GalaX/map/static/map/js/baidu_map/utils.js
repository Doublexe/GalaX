// Get current position point, else return null
function getPosition() {
 var geo = new BMap.Geolocation();
 var point = null;
 var result = geo.getCurrentPosition(
  // if success: success anyway TODO
  function (result) {
    point = result.point;
    // alert(point);
  }
 );
//  alert(result);
 return point;
};


export {getPosition};


