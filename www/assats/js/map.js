const CLASSNAME_HIDDEN = 'hidden'
const BOUNDS = [ [55.142226, 36.803268], [56.021286, 37.967799] ]

let MapCont            = null
let FilterSelect       = null
let SearchField        = null
let SearchInterface    = null
let SearchBtn          = null

jQuery(()=>{

    // присваиваем переменным DOM-элементы
    MapCont            = document.querySelector('[data-element="map"]')
    FilterSelect       = document.querySelector('[data-element="filter-select"]')
    SearchField        = document.querySelector('[data-element="search-field"]')
    SearchInterface    = document.querySelector('[data-element="search-interface"]')
    SearchBtn          = document.querySelector('[data-element="search-btn"]')
    
    // инициализируем фильтр
    filterInit()

    // присваиваем обработчики
    FilterSelect.addEventListener('change', function(e) {
        filterSelect()
    })

    ymaps.ready(function(e){
        const Map = mapInit(MapCont)
        const SuggestView = searchInit(SearchField)
        if (typeof Map !== "object" && typeof SuggestView !== "object") return false

        let coords = getRandomCoordinate(3, BOUNDS)
        
        addPlacemarks(Map, coords)
    });

})

function addPlacemarks(map, coords) {

    let myGeoObjects = []
    let myPlacemarks = []

    let count = 1
    for (let i of coords) {
        let geoObject = new ymaps.GeoObject({
            geometry: {
                type: "Point",
                coordinates: i
            }
        });
        myGeoObjects.push(geoObject)

        let name = 'name'+count
        let price = 'price'+count
        let placemark = new ymaps.Placemark(i, {
            hintContent: 'hint-'+count,
            balloonContent:
                `
                <a class="item-map" href="google.com">
                    <div class="item-map__img-cont">
                        <img class="item-map__img" src="/assats/img/no-image.svg"
                    </div>
                    <p class="item-map__name">${name}</p>
                    <p class="item-map__price">${price}</p>
                </a>
                `,
            // balloonContent: 'ballon-'+count
        })
        myPlacemarks.push(placemark)

        count++
    }

    let myCluster = new ymaps.Clusterer();
    // myCluster.add(myGeoObjects);
    myCluster.add(myPlacemarks);
    map.geoObjects.add(myCluster);
}

function filterInit() {
    filterSelect()
}

function mapInit(contElement) {
    // Создание карты.
    if ( typeof contElement !== "object" ) return false
    console.log(typeof contElement)

    const myMap = new ymaps.Map(contElement, {
        behaviors: ['drag'],
        bounds: BOUNDS,
        zoom: 7
    });

    return myMap
}

function searchInit(inputElement) {
    if ( typeof inputElement !== "object" ) return false
    console.log(typeof inputElement)

    var suggestView = new ymaps.SuggestView(inputElement, {
        boundedBy: BOUNDS,
    });
    suggestView.events.add(['optionschange'], (e)=>{console.log('optionschange');console.log(e);})
    suggestView.events.add(['select'], (e)=>{
        console.log('select')
        console.log(e.get('item'))
        let item = e.get('item')
        if ( !item ) return false
        
    })

    console.log(suggestView)

    return suggestView
}

function directGeocoding(coord) {
    
}

function reverseGeocoding(address) {
    //определяем координаты по адресу
    ymaps.geocode(t, {results:1})
        .then((res) => {
            let MyGeoObj = res.geoObjects.get(0)
            console.log( MyGeoObj.geometry.getCoordinates() )
            let coord = MyGeoObj.geometry.getCoordinates()
        })
}

function filterSelect() {
    let filters = document.querySelectorAll('[data-element="filter"]')
    filters = Array.from(filters)
    filters.forEach( (item) => {
        item.classList.add(CLASSNAME_HIDDEN)
    })

    let visibleFilterName = FilterSelect.value
    let visibleFilter = filters.filter( (item)=> item.id === visibleFilterName )
    
    if ( !visibleFilter.length ) return false

    visibleFilter.forEach( item=>item.classList.remove(CLASSNAME_HIDDEN) )
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