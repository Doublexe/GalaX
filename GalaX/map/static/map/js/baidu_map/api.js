import {map} from './generation.js';

/** Add a marker on baidu map. 
 * 
 * Example:
 * var point = new BMap.Point(104.0668,30.5728); // 创建点坐标
 * addMarker(point, 0);
 * 
 */
function addBaiduMarker(lng, lat, index, size_x, size_y, image_url){  // 创建图标对象
    var point = new BMap.Point(lng, lat);
    var image_size = {x: size_x, y: size_y};
    var myIcon = new BMap.Icon(image_url, 
        new BMap.Size(image_size.x, image_size.y), 
        {
        // 指定定位位置。
        // 当标注显示在地图上时，其所指向的地理位置距离图标左上
        // 角各偏移10像素和25像素。您可以看到在本例中该位置即是
        // 图标中央下端的尖角位置。
        anchor: new BMap.Size(image_size.x/2, image_size.y/2),
        // // 设置图片偏移。
        // // 当您需要从一幅较大的图片中截取某部分作为标注图标时，您
        // // 需要指定大图的偏移位置，此做法与css sprites技术类似。
        // imageOffset: new BMap.Size(0, 0 - index * 25)   // 设置图片偏移
        }
    );
    myIcon.setImageSize(new BMap.Size(image_size.x, image_size.y));
    //创建标注对象并添加到地图
    var marker = new BMap.Marker(point , {icon: myIcon});
    marker.id = index;
    map.addOverlay(marker);
    return marker;
}

export {addBaiduMarker};

