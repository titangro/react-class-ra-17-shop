import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

class Similar extends Component {
    _isMounted = false;
  
    constructor(props) {
      super(props);
  
      this.state = {
        products: [],
        position: 0,
      }
    }
    
    componentWillMount() {
      this._isMounted = true;
      
      this.props.fetchProductsByParams([{key: 'type', params: this.props.type}, {key: 'color', params: this.props.color}])
        .then(res => {
          if (this._isMounted) {
            this.setState({products: res.data})
          }
        })
    }
  
    componentWillUnmount() {
      this._isMounted = false;
    }

    changePosition(operator, length) {
        if (operator === '+') {
            if (this.state.position < length - 3)
                this.setState({position: this.state.position + 1})
        } else {
            if (this.state.position > 0)
                this.setState({position: this.state.position - 1})
        }
    }

    render() {        
        const products = this.state.products.filter(product => product.id !== this.props.productId);

        return products.length ? (
            <section className="product-card__similar-products-slider">
                <h3>Похожие товары:</h3>
                <div className="similar-products-slider">
                    {products.length > 3 && this.state.position !== 0 ? <div className="similar-products-slider__arrow similar-products-slider__arrow_left arrow" onClick={() => this.changePosition('-')} ></div> : ''}
                    {products.slice(this.state.position, this.state.position + 3).map(
                        product =>
                        <div key={product.id} className="similar-products-slider__item-list__item-card item">
                            <div className="similar-products-slider__item">
                                <Link to={`/product_card/${product.id}`} onClick={() => this.props.fetchProduct ? this.props.fetchProduct(product.id) : ''} style={{
                                    backgroundImage: `url(${product.images[0]})`,
                                    backgroundSize: 'contain',
                                    backgroundPosition: 'center',
                                    backgroundRepeat: 'no-repeat',
                                    height: '99%',
                                    width: '99%'
                                    }} alt={product.title} >
                                </Link>
                            </div>
                            <div className="similar-products-slider__item-desc">
                                <h4 className="similar-products-slider__item-name">{product.title}</h4>
                                <p className="similar-products-slider__item-producer">Производитель: <span className="producer">{product.brand}</span></p>
                                <p className="similar-products-slider__item-price">{product.price.toLocaleString('ru-RU')}</p>
                            </div>    
                        </div>
                    )}                    
                    {products.length > 3 && this.state.position !== products.length - 3 ? <div className="similar-products-slider__arrow similar-products-slider__arrow_right arrow" onClick={() => this.changePosition('+', products.length)} ></div> : ''}
                </div>
            </section>
        ) : '';
    }
}

Similar.propTypes = {
    fetchProductsByParams: PropTypes.func.isRequired,
    fetchProduct: PropTypes.func,
    productId: PropTypes.number.isRequired,
    type: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
}

export default Similar;