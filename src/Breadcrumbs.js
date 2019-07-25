import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const Breadcrumbs = ({categoryId, categoryName, handleFilter, getSearchParam, productId, productType, productTitle}) => {
    
    const links = [{name: 'Главная', link: '/'}];
    let categoryLink;
    if (categoryId) {
        categoryLink = `/catalog?categoryId=${categoryId}`;
        links.push({name: categoryName, link: categoryLink});
    }

    /* Карточка товаров */
    if (productId) {
        /* Подкатегория в каталоге */
        links.push({name: productType, link: `${categoryLink}&type=${productType}`});
        /* Ссылка на товар */
        links.push({name: productTitle, link: `/product_card/${productId}`});
    }

    /* Каталог */
    if (categoryName === 'Каталог') {
        links.push({name: categoryName, link: '/catalog'});
    }

    /* Результаты поиска */
    if (categoryName === 'Результаты поиска') {
        links.push({name: categoryName, link: `/catalog?search=${getSearchParam('search')}`});
    }

    /* Избранное */
    if (categoryName === 'Избранное') {
        links.push({name: categoryName, link: '/favorite'});
    }

    /* Офомление заказа */
    if (categoryName === 'Оформление заказа') {
        links.push({name: categoryName, link: '/order'});
    }
    
    /* Подкатегория в каталоге */
    let searchParams;
    if (typeof getSearchParam === 'function') {
        searchParams = getSearchParam();
        //console.log(searchParams)
        if (Object.keys(searchParams).length > 1) {
            const subcategoriesType = Object.keys(searchParams)[1];
            const subcategoriesName = decodeURIComponent(searchParams[subcategoriesType]);
            const subcategoriesLink = `${categoryLink}&${subcategoriesType}=${subcategoriesName}`;
            //console.log(subcategoriesType)
            if (subcategoriesType === 'reason' || subcategoriesType === 'season' || subcategoriesType === 'brand' || subcategoriesType === 'type')
                links.push({name: subcategoriesName, link: subcategoriesLink});
        }
    }

    return (
        <div className="site-path">
            <ul className="site-path__items">
                {links.map(({name, link}, index) => 
                    <li className="site-path__item" key={index}><Link to={link} onClick={() => {
                        if (typeof handleFilter === 'function') {
                            if (name !== productTitle)
                                handleFilter( link.slice(link.indexOf('?')) );
                        }
                    }}>{name}</Link></li>
                )}
            </ul>
        </div>
    );
}

Breadcrumbs.defaultProps = {
    categoryName: 'Каталог'
}

Breadcrumbs.propTypes = {
    categoryId: PropTypes.number,
    categoryName: PropTypes.string,
    handleFilter: PropTypes.func,
    getSearchParam: PropTypes.func,
    productId: PropTypes.number,
    productType: PropTypes.string,
    productTitle: PropTypes.string
}

export default Breadcrumbs;