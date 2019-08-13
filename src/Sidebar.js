import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import PriceSlider from './PriceSlider';
import BrandFilter from './BrandFilter';

const Sidebar = ({filters, productsWithoutFilters, activeFilter, handleFilter, getSearchParam, showFilter, history, changeCatalogHeight, categories}) => {  
    
    /* Открытие/закрытие фильтра */
    const toggleOpener = (node) => {
        const contentNode = node.parentElement.nextElementSibling;
        if (node.classList.contains('opener-down')) {
            node.classList = ['opener-up'];
            if (contentNode)
                contentNode.style.display = 'none';
        } else {
            node.classList = ['opener-down'];
            if (contentNode)
            contentNode.style.display = 'flex';
        }
        changeCatalogHeight();
    }

    /* Проверка выбран ли фильтр */
    const checkFilter = (event, filter) => {
        const node = event.target;
        if (node.classList.contains('chosen'))
            return event.preventDefault();
        node.parentElement.parentElement.querySelectorAll('a').forEach(node => node.classList.remove('chosen'));
        node.classList.add('chosen');
        handleFilter(filter);
    }

    /* вывод цвета по названию цвета */
    const showColor = (colorKey) => {
        const textColors = {
            'Черный': {backgroundColor: '#000000'},
            'Бежевый': {backgroundColor: '#E5DBC5'},
            'Серый': {backgroundColor: '#808080'},
            'Бардо': {backgroundColor: '#9B2D30'},
            'Белый': {backgroundColor: '#FFFFFF'},
            'Прозрачный': {backgroundColor: '#00000000'},
            'Синий': {backgroundColor: '#3A75C4'},
            'Красный': {backgroundColor: '#E32636'},
            'Темно-салатовый': {backgroundColor: '#679146'},
            'Фиолетовый': {backgroundColor: '#800080'},
            'Беж': {backgroundColor: '#F5F5DC'},
            'Оранжевый': {backgroundColor: '#FF4F00'},
            'Металлик': {backgroundColor: '#818B8E'},
            'Разноцветные': {backgroundImage: 'linear-gradient(to left, #e945a2, #d24bb1, #b752bd, #9859c6, #735fca, #5468ca, #336ec5, #0072bd, #0077ad, #007892, #007673, #1b7157)'},
            'Коричневый': {backgroundColor: '#964B00'},
            'Серебряный': {backgroundColor: '#C0C0C0'},
            'Черно-белый': {backgroundImage: 'linear-gradient(to right, #000000, #3b3b3b, #777777, #b9b9b9, #ffffff)'},
            'Розовый': {backgroundColor: '#FC0FC0'},
        }
        return textColors[colorKey] ? textColors[colorKey] : {backgroundColor: '#00000000'};
    }

    /* Переключение фильтра скидки */
    const handleDiscounte = () => {
        let value = getSearchParam('discounted') && getSearchParam('discounted') === 'true' ? true : false;
        const filter = showFilter(['discounted'], [!value], true);
        history.push(window.location.pathname + filter);
        handleFilter(filter);
    }

    /* Переключение фильтра размеров */
    const handleSize = (size, multipleSize) => {
        const filter = showFilter([multipleSize], [size], true);
        history.push(window.location.pathname + filter);
        handleFilter(filter);
    }    

    /* Подкомпонент для чекбоксов роазмеров */
    const Label = ({item, multipleSize}) => 
        <li>
            <label>
                <input type="checkbox"  onChange={() => handleSize(item, multipleSize)} defaultChecked={getSearchParam(multipleSize) && getSearchParam(multipleSize).includes('' + item) ? true : false} className="checkbox" name={`checkbox-${item}`} />
                <span className="checkbox-custom"></span>
                <span className="label">{item}</span>
            </label>
        </li>

    /* Подкомпонент для стобцов размеров */
    const FilterSize = ({filter}) => {
        const multipleSize = filter === 'sizes' ? 'size[]' : 'heelSize[]';
        return (
            <ul>                                     
                <div className="list-1">
                    {filters[filter] ? filters[filter].map(
                        (item, index) => {
                            if (index % 2 === 0) 
                                return <Label key={index} item={item} multipleSize={multipleSize} />  
                        }
                    ) : ''} 
                </div>
                <div className="list-2">
                    {filters[filter] ? filters[filter].map(
                        (item, index) => {
                            if (index % 2 !== 0) 
                                return <Label key={index} item={item} multipleSize={multipleSize}  />                                
                        }
                    ) : ''} 
                </div>
            </ul>
        )
    }
    
    /* Вывод фильтров до бренда */
    const renderSentence = (filter, title, filters, index) => {
        let cls;
        if (filter === 'type')
            cls = 'catalogue-list';
        else if (filter === 'sizes' || filter === 'heelSize')
            cls = 'size';
        else if (filter === 'reason' || filter === 'season')
            cls = 'occasion';
        else 
            cls = filter;
        const chosenFilter = decodeURIComponent(getSearchParam(filter));
        return <React.Fragment key={index}>
            <section className="sidebar__division">
                <div className={`sidebar__${cls}`}>
                    <div className="sidebar__division-title">
                        <h3>{title}</h3>
                        <div className={true ? 'opener-down' : 'opener-up'} onClick={(event) => toggleOpener(event.target)}></div>
                    </div>
                    {filter !== 'price' && filter !== 'sizes' && filter !== 'heelSize' ? <ul>
                        {filters[filter] ? filters[filter].map(
                            (item, index) =>
                            <li key={index} >
                                <Link className={chosenFilter === item ? 'chosen' : ''}
                                    to={`/catalog${showFilter([filter], [item], true)}`}
                                    onClick={(event) => {checkFilter(event, showFilter([filter], [item], true))}} >{
                                        filter === 'color' ? (
                                        <React.Fragment>
                                            <div className="color" style={showColor(item)}></div>
                                            <span className="color-name">{item}</span>
                                        </React.Fragment>) : item
                                    }</Link>
                            </li>
                        ) : ''}
                    </ul> : 
                    (filter === 'sizes' || filter === 'heelSize' ?
                    <FilterSize filter={filter} />
                    : activeFilter && productsWithoutFilters ? <PriceSlider productsWithoutFilters={productsWithoutFilters} getSearchParam={getSearchParam} showFilter={showFilter} handleFilter={handleFilter} history={history} /> : <div className="price-slider">
                        <div className="circle-container">
                            <div className="circle-1" style={{left: 0}}></div>
                            <div className="line-white"></div>
                            <div className="line-colored" style={{left: 0, width: '215px'}}></div>
                            <div className="circle-2" style={{right: 0}}></div>
                        </div>
                        <div className="counter">
                            <input type="text" className="input-1" value={0} onChange={() => {}} />
                            <div className="input-separator"></div>
                            <input type="text" className="input-2" value={0} onChange={() => {}} />
                        </div>
                    </div>)}
                </div>
            </section>
            <div className={`separator-150 separator-150-${index + 1}`}></div>
        </React.Fragment>
    }
    
    const filterSequence = [
        {filter: 'type', title: 'Каталог'},
        {filter: 'price', title: 'Цена'},
        {filter: 'color', title: 'Цвет'},
        {filter: 'sizes', title: 'Размер'},
        {filter: 'heelSize', title: 'Размер каблука'},
        {filter: 'reason', title: 'Повод'},
        {filter: 'season', title: 'Сезон'},
    ];

    return Object.keys(filters).length && productsWithoutFilters ? (
        <section className="sidebar">
            {filterSequence.map(({filter, title}, index) => renderSentence(filter, title, filters, index))}
            <section className="sidebar__division">
                <BrandFilter getSearchParam={getSearchParam} showFilter={showFilter} handleFilter={handleFilter} history={history} brands={filters.brand} />                
                <label>
                    <input type="checkbox" onChange={() => handleDiscounte()} defaultChecked={getSearchParam('discounted') && getSearchParam('discounted') === 'true' ? true : false} className="checkbox" name="checkbox-disc" />
                    <span className="checkbox-discount"></span>
                    <span className="text-discount">Со скидкой</span>
                </label>
                <div className="separator-240"></div>
            </section>      
            <section className="sidebar__division">
                <div className="drop-down">
                    <Link 
                        to={`/catalog${showFilter(['search','categoryId'], [getSearchParam('search'), getSearchParam('categoryId')], true, true)}`}
                        onClick={(event) => {checkFilter(event, showFilter(['search','categoryId'], [getSearchParam('search'), getSearchParam('categoryId')], true, true))}} >
                        <span className="drop-down-icon"></span>Сбросить
                    </Link>
                </div>
            </section>
        </section> 
    ) : <section className="sidebar"></section>
}

Sidebar.propTypes = {
    handleFilter: PropTypes.func.isRequired,
    getSearchParam: PropTypes.func.isRequired,
    showFilter: PropTypes.func.isRequired,
    categories: PropTypes.arrayOf(PropTypes.object).isRequired,
    filters: PropTypes.shape({
        brand: PropTypes.array.isRequired,
        color: PropTypes.array.isRequired, 
        heelSize: PropTypes.array.isRequired,
        reason: PropTypes.array.isRequired,
        season: PropTypes.array.isRequired,
        sizes: PropTypes.array.isRequired,
        type: PropTypes.array.isRequired
    }).isRequired,
    productsWithoutFilters: PropTypes.arrayOf(PropTypes.shape({
        price: PropTypes.nimber
    }))
}

export default Sidebar;