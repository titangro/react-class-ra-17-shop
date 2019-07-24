import React from 'react';
import Product from './Product';
import PropTypes from 'prop-types';

const Products = ({products, handleFavorite, fetchSizes}) => {
    //console.log(products)
    return products ? products.map(product =>
        <Product key={product.id} product={product} handleFavorite={handleFavorite} fetchSizes={fetchSizes} />        
        )
        : <div>Нет товаров в данной категории</div>      
}

Products.propTypes = {
    products: PropTypes.array.isRequired,
    handleFavorite: PropTypes.func.isRequired,
    fetchSizes: PropTypes.func.isRequired
}

export default Products;