import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

class Viewed extends Component {
    _isMounted = false;
  
    constructor(props) {
      super(props);
  
      this.state = {
        viewed: localStorage.viewed ? JSON.parse(localStorage.viewed) : [],
        products: [],
        position: 0,
      }
    }
    
    componentWillMount() {
      this._isMounted = true;
      
      if (this.state.viewed.length)
        this.props.fetchProductsByParams([{key:'id', params: localStorage.viewed ? JSON.parse(localStorage.viewed) : []}], true)
          .then(res => {
            if (this._isMounted) {
              this.setState({products: res.data})
            }
          })
    }

    componentWillUpdate(nextProps, nextState) {
      this._isMounted = true;

      if (localStorage.viewed && JSON.parse(localStorage.viewed).length !== nextState.products.length && this._isMounted) {
        this.props.fetchProductsByParams([{key:'id', params: localStorage.viewed ? JSON.parse(localStorage.viewed) : []}], true)
          .then(res => this.setState({products: res.data}))
      }
    }
  
    componentWillUnmount() {
      this._isMounted = false;
    }

    changePosition(operator) {
        if (operator === '+') {
            if (this.state.position < this.state.products.length - 5)
                this.setState({position: this.state.position + 1})
        } else {
            if (this.state.position > 0)
                this.setState({position: this.state.position - 1})
        }
    }

    render() {
        const products = this.state.products;

        return products.length ? (
            <section className={`product-${this.props.cls}__overlooked-slider`}>
                <h3>Вы смотрели:</h3>
                <div className="overlooked-slider">
                    {products.length > 5 && this.state.position !== 0 ? <div className="overlooked-slider__arrow overlooked-slider__arrow_left arrow" onClick={() => this.changePosition('-')}></div> : ''}
                    {products.slice(this.state.position, this.state.position + 5).map(
                        product => 
                        <div key={product.id} className="overlooked-slider__item" style={{backgroundImage: `url(${product.images[0]})`}}>
                            <Link to={`/product_card/${product.id}`} onClick={() => this.props.fetchProduct ? this.props.fetchProduct(product.id) : ''}></Link>
                        </div>
                    )}
                    {products.length > 5 && this.state.position !== this.state.products.length - 5 ? <div className="overlooked-slider__arrow overlooked-slider__arrow_right arrow" onClick={() => this.changePosition('+')}></div> : ''}
                </div>
            </section>
        ) : '';
    }
}

Viewed.propTypes = {
  fetchProductsByParams: PropTypes.func.isRequired,
  fetchProduct: PropTypes.func,
  cls: PropTypes.string.isRequired,
}

export default Viewed;