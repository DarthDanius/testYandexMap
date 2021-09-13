<?php
    $itemList = array(
        'name'          => '',
        'coordinates'   => '',
        'type'          => '',
    );
?>
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link rel='stylesheet' href='/assats/css/base.css?v=1.0.0'>
    <link rel='stylesheet' href='/assats/css/map.css?v=1.0.0'>
    <script src="/assats/libs/jquery/jquery-3.6.0.min.js" type="text/javascript"></script>
    <script src="https://api-maps.yandex.ru/2.1/?apikey=7d8c690c-ba95-46da-854e-460b694ee727&lang=ru_RU" type="text/javascript"></script>
    <script src="/assats/js/map.js?v=1.0.0"></script>
</head>

    <!-- 
    Каталог недвижимости
    В каталоге будут две основные категории верхнего уровня: коммерческая и жилая.
    Фильтрация для коммерческой недвижимости:
    •	район города
    •	фильтр по площади (от / до м2)
    •	фильтр стоимости (от / до, ₽)
    •	срок сдачи объекта
    Фильтрация для жилой недвижимости:
    •	район города
    •	фильтр по площади (от / до м2)
    •	количество комнат
    •	фильтр стоимости (от / до, ₽)
    •	срок сдачи объекта
    •	фильтрация по отдельным свойствам: тарраса, красивый вид, бассейн в доме и подобные.
    Конечный перечень свойств будет определён на этапе формирования каталога.
    Также должен быть предусмотрен поиск по ключевым словам.
    Каталог выводится на странице с картой. Карта занимает половину окна браузера.
    Внешний вид карты должен гармонировать с гаммой сайта.
    -->

<body>
    
    <section class="search-map">
        <div class="container-fixed search-map__cont">
            <input type="text" class="search-map__search" data-element="search-field" placeholder="Поиск по карте">
            <!-- <button data-element="search-btn">Найти</button> -->
            <input type="number" min="1" max="10" placeholder="Радиус поиска" data-element="search-radius" value='10' />
            <button data-element="center-btn">Отцентрировать</button>
        </div>
        
        <div class="search-map__map" data-element="map" width="100%" height="600">

        </div>
    </section>
</body>
</html>