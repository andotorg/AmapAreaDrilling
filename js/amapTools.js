function loadArea(type, par){
	let areaObject;
	switch(type){
		case 0:
		default:
			areaObject = new AMap.DistrictLayer.World({
			    zIndex:10,
			    styles:{
			         'fill': function (props) {
		                if (props.SOC == 'CHN') {
		                    updateInfo(props);
		                    return nationFill;
		                } else {
		                    return nationStroke
		                }
		            }
			    }
			});
			break;
		case 1:
			areaObject = new AMap.DistrictLayer.Country({
		        zIndex: 10,
		        SOC:'CHN',
		        depth: 1,
		        styles: {
		            // 填充
		            'fill': function (props) {
		                if (props.SOC == 'CHN') {
		                    updateInfo(props);
		                    return nationStroke;
		                } else {
		                    return nationStroke
		                }
		            }
		        }
		    });
		    break;
		case 2: 
			areaObject = new AMap.DistrictLayer.Province({
			    zIndex: 12,
			    adcode:[param.adcode],
			    depth: param.depth,
			    styles:{
			        'fill':function(properties){
			            var adcode = properties.adcode;
			            return nationStroke;
			        },
			        'city-stroke': '#cccccc',   //中国地级市边界
    				'county-stroke': '#cccccc'  //中国区县边界  
			    }
			});
			break;
	}
	map = new AMap.Map('container', {
        zooms: [3, 18],
        showIndoorMap: false,
        center:[param.x, param.y],
        zoom: param.zoom,
        resizeEnable: true,  // 是否监控地图容器尺寸变化
        isHotspot: true,
        defaultCursor: 'pointer',
        touchZoomCenter: 1,
        pitch: 0,
        layers: [
            areaObject
        ], 
        viewMode: '3D',
    });
    map.on('click', function (ev) {
        var px = ev.pixel;
        // 拾取所在位置的行政区
        var props = areaObject.getDistrictByContainerPos(px);
        console.log(props)
        if (props) {
            var adcode = props.adcode;
            var SOC = props.SOC;
            // 重置行政区样式
			if(typeof(adcode) == "undefined" && SOC == "CHN"){
				loadArea(1, par);
				param.zoom = 4;
			}else if(typeof(adcode) != "undefined"){
				param.zoom = 7;
				param.x = props.x;
				param.y = props.y;
				param.adcode = adcode;
				console.log((adcode+"").replace("00", "").replace("00", ""))
				let num = (adcode+"").replace("00", "").replace("00", "").length/2;
				console.log(num)
				if(num == 2){
					param.zoom = 9;
					param.x = props.x;
					param.y = props.y;
				}else if(num == 3){
					param.zoom = 10;
					param.x = props.x;
					param.y = props.y;
				}
				param.depth = num
				loadArea(2, par);
			}else{
				areaObject.setStyles({
	                'fill': function (props) {
	                    return props.SOC == SOC ? nationFill : nationStroke;
	                }
	            });
			}
            updateInfo(props);
            map.setFitView()
       }
    });
    
    map.on('mousemove', function (ev) {
        var px = ev.pixel;
        // 拾取所在位置的行政区
        var props = areaObject.getDistrictByContainerPos(px);
        if (props) {
            var adcode = props.adcode;
            var SOC = props.SOC;
            // 重置行政区样式
			if(typeof(adcode) == "undefined" && SOC == "CHN"){
				areaObject.setStyles({
	                'fill': function (props) {
	                    return props.SOC == SOC ? nationFill : nationStroke;
	                }
	            });
			}else if(typeof(adcode) != "undefined"){
				areaObject.setStyles({
	                'fill': function (props) {
	                    return props.adcode == adcode ? nationFill : nationStroke;
	                },
			        'city-stroke': '#cccccc',   //中国地级市边界
    				'county-stroke': '#cccccc'  //中国区县边界  
	            });
			}else{
				areaObject.setStyles({
	                'fill': function (props) {
	                    return props.SOC == SOC ? nationFill : nationStroke;
	                }
	            });
			}
            updateInfo(props);
        }
   });
    
   return map;
}