import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

class Product extends Component {
    _isMounted = false;

    constructor(props) {
        super(props);

        this.state = {
            curImagePos: 0,
            sizes: []
        }
    }

    componentDidMount() {
        this._isMounted = true;

        if (!this.props.product.sizes) {
            this.props.fetchSizes(this.props.product.id)
                .then(sizes => {
                    if (this._isMounted)
                        this.setState({sizes: sizes})
                })
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    handleImage(arrow) {
        if (arrow === 'left')
            this.setState({curImagePos: this.changePosImage('decrease')})
        else
            this.setState({curImagePos: this.changePosImage('increase')})
    }
    
    changePosImage(selector) {
        const length = this.props.product.images.length;
        const curImagePos = this.state.curImagePos;          
        //console.log(length, curImagePos, (curImagePos + 1) === length);
        if (length === 1) 
            return curImagePos;
        if (selector === 'increase') {          
            return (curImagePos + 1 === length) ? 0 : curImagePos + 1;
        } else {
            return curImagePos === 0 ? (length - 1) : curImagePos - 1;
        }
    }

    getFavoriteCls(localStarogeFavorite) {
        return localStarogeFavorite ? 
            (JSON.parse(localStarogeFavorite).includes(this.props.product.id) ? 'product-catalogue__product_favorite-chosen' : 'product-catalogue__product_favorite')
            : 'product-catalogue__product_favorite';
    }

    clickProduct(event) {
        const activeBtn = event.target.classList.contains('product-catalogue__product_favorite-chosen') 
            || event.target.classList.contains('product-catalogue__product_favorite') 
            || event.target.parentElement.classList.contains('product-catalogue__product_favorite-chosen') 
            || event.target.parentElement.classList.contains('product-catalogue__product_favorite') 
            || event.target.classList.contains('arrow');
        if (activeBtn)
            event.preventDefault();
    }

    render() {
        const product = this.props.product;
        const sizes = product.sizes ? product.sizes : this.state.sizes;
        return (
            <Link key={product.id} to={`/product_card/${product.id}`} className="item-list__item-card item" onClick={(event) => this.clickProduct(event)}>
                <div className="item-pic" style={{
                        backgroundImage: `url(${product.images[this.state.curImagePos]})`, 
                        backgroundSize: 'contain', 
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center',
                }}>
                <div className={this.getFavoriteCls(localStorage.favorite)} onClick={(event) => {
                        this.props.handleFavorite(product.id);
                        event.currentTarget.classList = event.currentTarget.classList.contains('product-catalogue__product_favorite-chosen') ? ['product-catalogue__product_favorite'] : ['product-catalogue__product_favorite-chosen'];
                    }
                }>
                    <p></p>
                </div>
                {product.images.length > 1 ?
                    <React.Fragment>
                        <div className="arrow arrow_left" onClick={() => this.handleImage('left')}></div>
                        <div className="arrow arrow_right" onClick={() => this.handleImage('right')}></div>
                    </React.Fragment>
                     : ''}                
                </div>
                <div className="item-desc">
                    <h4 className="item-name">{product.title}</h4>
                    <p className="item-producer">Производитель: <span className="producer">{product.brand}</span></p>
                    <p className="item-price">{product.price.toLocaleString('ru-RU')}</p>
                    {sizes ? (
                        <div className="sizes" style={{top: 'auto', left: 'auto'}}>
                            <p className="sizes__title">Размеры в наличии:</p>
                            <p className="sizes__avalible">{sizes.filter(item => item.available).map(item => item.size).join(', ')}</p>
                        </div>
                    ) : ''}                    
                </div>
            </Link>
        )
    }
}

Product.propTypes = {
    product: PropTypes.shape({
        id: PropTypes.number.isRequired,
        categoryId: PropTypes.number.isRequired,
        title: PropTypes.string.isRequired,
        images: PropTypes.arrayOf(PropTypes.string),
        price: PropTypes.number.isRequired,
        brand: PropTypes.string.isRequired,
    }),
    fetchSizes: PropTypes.func.isRequired,
    handleFavorite: PropTypes.func.isRequired
}

export default Product;