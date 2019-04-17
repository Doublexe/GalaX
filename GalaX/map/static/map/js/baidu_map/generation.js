var map = new BMap.Map("container"); // 创建地图实例
var point = new BMap.Point(104.0668,30.5728); // 创建点坐标
map.centerAndZoom(point, 15); // 初始化地图，设置中心点坐标和地图级别

export {map};