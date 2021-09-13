const CLASSNAME_HIDDEN = 'hidden'
// const BOUNDS = [ [55.142226, 36.803268], [56.021286, 37.967799] ]
const BOUNDS = [[55.27947461751806,36.839317121093764],[56.201357452667416,38.58888987500001]]
const STORE = {
    user: null,
    circle: null,
    coords: [],
    objects: []
}

let MapCont            = null
let SearchField        = null
let SearchRadius       = null
let CenterBtn          = null

let placemarkObject = {
    properties: {
        hintContent: 'hint',
        balloonContent:
            `
            <a class="item-map" href="google.com">
                <div class="item-map__img-cont">
                    <img class="item-map__img" src="/assats/img/no-image.svg"
                </div>
                <p class="item-map__name">имя</p>
                <p class="item-map__price">дена</p>
            </a>
            `,
    },
    options: {
        visible: false
    }
}

let placemarkUser = {
    properties: {
        hintContent: false,
        balloonContent: false,
    },
    options: {
        // Опции.
        draggable: true,
        // Необходимо указать данный тип макета.
        iconLayout: 'default#image',
        // Своё изображение иконки метки.
        iconImageHref: '/assats/img/icon-user.svg',
        // Размеры метки.
        iconImageSize: [30, 30],
        // Смещение левого верхнего угла иконки относительно
        // её "ножки" (точки привязки).
        iconImageOffset: [-15, -15]            
    }
}

document.addEventListener('DOMContentLoaded', ()=>{

    // присваиваем переменным DOM-элементы
    MapCont            = document.querySelector('[data-element="map"]')
    SearchField        = document.querySelector('[data-element="search-field"]')
    SearchRadius       = document.querySelector('[data-element="search-radius"]')
    CenterBtn          = document.querySelector('[data-element="center-btn"]')

    // получаем список координат из базы
    STORE.coords = getRandomCoordinate(50, BOUNDS)

    ymaps.ready(function(e){
        const Map = mapInit(MapCont)
        const SuggestView = searchInit(SearchField, Map)
        if (typeof Map !== "object" && typeof SuggestView !== "object") return false

        STORE.objects = addPlacemarks(Map, STORE.coords, placemarkObject)

        // присваиваем обработчики карты
        SearchRadius.addEventListener('change', function(e) {
            let radius = getRadius()        
            setCircle(Map, null, radius)
        })
        CenterBtn.addEventListener('click', function(e) {    
            let {center, zoom} = ymaps.util.bounds.getCenterAndZoom( BOUNDS, [MapCont.clientWidth, MapCont.clientHeight] )
            Map.setCenter(center, zoom)
        })
    });

})

function mapInit(contElement) {

    // console.log(contElement.clientWidth)
    // console.log(contElement.clientHeight)
    // Создание карты.
    if ( typeof contElement !== "object" ) return false

    let {center, zoom} = ymaps.util.bounds.getCenterAndZoom( BOUNDS, [contElement.clientWidth, contElement.clientHeight] )

    const myMap = new ymaps.Map(contElement, {
        behaviors: ['drag', 'scrollZoom'],
        controls: [],
        bounds: BOUNDS,
        center,
        zoom
    });

    myMap.events.add('click', function (e) {
        let coord = e.get('coords');
        setUser(myMap, coord, placemarkUser)
        let radius = getRadius()
        setCircle(myMap, coord, radius)
    });

    return myMap
}

function searchInit(inputElement, map) {
    if ( typeof inputElement !== "object" ) return false

    var suggestView = new ymaps.SuggestView(inputElement, {
        boundedBy: BOUNDS,
    });
    suggestView.events.add(['select'], (e)=>{
        let item = e.get('item')
        if ( !item ) return false
        let address = item.value
        reverseGeocoding(address)
        .then((coord)=>{
            setUser(map, coord, placemarkUser)
            let radius = getRadius()
            setCircle(map, coord, radius)
        })        
    })
}

function getRadius(min=1, max=10) {
    let radiusRaw = parseInt(SearchRadius.value)
    if (radiusRaw < min) radiusRaw = min
    if (radiusRaw > max) radiusRaw = max
    return radiusRaw * 1000    
}

function setCircle(map, coord, radius) {

    if (!STORE.circle) {
        if ( !coord || !radius ) return false

        STORE.circle = new ymaps.Circle([
            coord,
            // Радиус круга в метрах.
            radius
        ], null,
        {
            zIndexHover: false,
            cursor: 'grab',
        })
        map.geoObjects.add(STORE.circle);
    } else {
        if (coord) STORE.circle.geometry.setCoordinates(coord)
        if (radius) STORE.circle.geometry.setRadius(radius)
    }
    let inBounds = getItemsInbounds( STORE.objects, STORE.circle.geometry.getBounds() )
    hidePlacemarks(map, [STORE.user, STORE.circle])
    showPlacemarksInCircle(STORE.circle, inBounds)
}

function setUser(map, coord, placemarkType=null) {

    if (!STORE.user) {
        let properties  = (placemarkType) ? placemarkType.properties : {}
        let options     = (placemarkType) ? placemarkType.options : {}

        STORE.user = new ymaps.Placemark(coord, properties, options)

        STORE.user.events.add('dragstart', (e) => {
            STORE.circle.options.set('visible', false)
        })
        STORE.user.events.add('dragend', (e) => {
            let coord = e.get('target').geometry.getCoordinates()
            setCircle(map, coord, getRadius())            
            STORE.circle.options.set('visible', true)
        })

        map.geoObjects.add(STORE.user);
    } else {
        STORE.user.geometry.setCoordinates(coord)
    }
}

function addPlacemarks(map, coords, placemarkType=null, clusterer=false) {

    let objects = []
    for (let coord of coords) {
        let properties  = (placemarkType) ? placemarkType.properties : {}
        let options     = (placemarkType) ? placemarkType.options : {}

        let placemark = new ymaps.Placemark(coord, properties, options)
        objects.push(placemark)
        if (!clusterer) {
            map.geoObjects.add(placemark);
        }
    }

    if (clusterer) {
        let myCluster = new ymaps.Clusterer();
        myCluster.add(objects);
        map.geoObjects.add(myCluster);        
    }

    return objects
}

function directGeocoding(coord) {
    
}

function reverseGeocoding(address) {
    //определяем координаты по адресу
    return ymaps.geocode(address, {results:1})
        .then((res) => {
            let MyGeoObj = res.geoObjects.get(0)
            let coord = MyGeoObj.geometry.getCoordinates()
            return coord
        })
}

function hidePlacemarks(map, blackList=[]) {
    map.geoObjects.each((item)=>{
        
        if ( !blackList.includes(item) ) {
            item.options.set('visible', false)
        } else {

        }
    })
}

function showPlacemarksInCircle(circle, items) {
    
    for ( let item of items ) {
        coord = item.geometry.getCoordinates()
        if ( circle.geometry.contains(coord) ) {
            item.options.set('visible', true)
        }
    }
}

function getItemsInbounds(items, bounds) {
    // [ [Longitude[0], Latitude[0]], [Longitude[1], Latitude[1]] ]
    let inBounds = []
    for (let item of items) {
        coord = item.geometry.getCoordinates()
        if (
            (coord[0] >= bounds[0][0] && coord[0] <= bounds[1][0]) &&
            (coord[1] >= bounds[0][1] && coord[1] <= bounds[1][1])
        ) {
            inBounds.push(item)
        }
    }

    return inBounds
}

function getRandomCoordinate(count = 1, bounds = []) {
    const Longitude = [0, 180] // Долгота
    const Latitude = [0, 90] // Широта
    if ( !bounds.length ) bounds = [ [Longitude[0], Latitude[0]], [Longitude[1], Latitude[1]] ]

    let minLongitude    = null
    let maxLongitude    = null
    let minLatitude     = null
    let maxLatitude     = null

    if ( bounds.length ) {
        minLongitude    = bounds[0][0]
        maxLongitude    = bounds[1][0]
        minLatitude     = bounds[0][1]
        maxLatitude     = bounds[1][1]
    } else {
        minLongitude    = Longitude[0]
        maxLongitude    = Longitude[1]
        minLatitude     = Latitude[0]
        maxLatitude     = Latitude[1]
    }

    const randomPoints = []

    for (let i = count; i > 0; i--) {
        let randomLongitude = getRandomArbitrary(minLongitude, maxLongitude)
        randomLongitude = randomLongitude.toFixed(6)
        let randomLatitude  = getRandomArbitrary(minLatitude, maxLatitude)
        randomLatitude = randomLatitude.toFixed(6)
        randomPoints.push([randomLongitude, randomLatitude])
    }

    return randomPoints
}

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}