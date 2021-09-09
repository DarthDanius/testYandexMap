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
    <header class="header">

    </header>
    
    <section class="main-title">
        <div class="container-fixed main-title__cont">
            <h1 class="main-title__title">Фильтр</h1>
        </div>
    </section>
    
    <section class="search-map">
        <div class="container-fixed search-map__cont">
            <label for="search-map__title">Поиск по карте</label>
            <input type="text" class="search-map__search" data-element="search-field">
            <button data-element="search-btn">Найти</button>
            <div class="search-map__result-cont" data-element="search-interface"></div>
        </div>
    </section>

    <section class="catalog">
        <div class="container-fixed catalog__cont">
            <div class="catalog__map" data-element="map">

            </div>

            <div class="catalog__content">

                <h3 class="catalog__title">Каталог недвижимости</h3>
                <select data-element="filter-select" id="">
                    <option selected value="commercial">Коммерческая недвижимость</option>
                    <option value="residential">Жилая недвижимость</option>
                </select>

                <form action="/" id="commercial" method="POST" class="catalog__filter filter hidden" data-element="filter">
                    <h2 class="filter__title">Фильтрация для коммерческой недвижимости:</h2>
                    <ul class="filter__commercial">
                        <li class="filter__option">
                            <label for="">район города</label>
                            <select name="district" id="">
                                <option>район 1</option>
                                <option>район 2</option>
                                <option>район 3</option>
                            </select>
                        </li>
                        <li class="filter__option">
                            <label for="">фильтр по площади (от / до м2)</label>
                            <input type="range" name="area" min="0" max="400">
                        </li>
                        <li class="filter__option">
                            <label for="">фильтр стоимости (от / до, ₽)</label>
                            <input type="range" name="price" min="0" max="400000">
                        </li>
                        <li class="filter__option">
                            <label for="">срок сдачи объекта</label>
                            <input type="date" name="date_completion">
                        </li>
                    </ul>
                </form>

                <form action="/" id="residential" method="POST" class="catalog__filter filter hidden" data-element="filter">
                    <h2 class="filter__title">Фильтрация для жилой недвижимости:</h2>
                    <ul class="filter__list">
                        <li class="filter__option">
                            <label for="">район города</label>
                            <select name="district" id="">
                                <option>район 1</option>
                                <option>район 2</option>
                                <option>район 3</option>
                            </select>
                        </li>
                        <li class="filter__option">
                            <label for="">фильтр по площади (от / до м2)</label>
                            <input type="range" name="area" min="0" max="400">
                        </li>
                        <li class="filter__option">
                            <label for="">количество комнат</label>
                            <select name="district" id="">
                                <option>1</option>
                                <option>2</option>
                                <option>3</option>
                            </select>
                        </li>
                        <li class="filter__option">
                            <label for="">фильтр стоимости (от / до, ₽)</label>
                            <input type="range" name="price" min="0" max="400000">
                        </li>
                        <li class="filter__option">
                            <label for="">срок сдачи объекта</label>
                            <input type="date" name="date_completion">
                        </li>
                    </ul>
                </form>

                <ul class="catalog__list">
                    <li class="filter__item">
                        
                    </li>
                    <li class="filter__item">
                        
                    </li>
                    <li class="filter__item">
                        
                    </li>
                    <li class="filter__item">
                        
                    </li>
                </ul>

            </div>
        </div>
    </section>
</body>
</html>