import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';


class Cart extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            products: [],
            cart: this.props.cart
        }
    }

    componentWillMount() {
        if (this.state.cart.length)
        this.fetchCartProducts(this.state.cart);
    }

    componentWillUpdate(nextProps, nextState) {
        if (nextProps.cart.length === 0 && this.state.cart.length !== 0) {
            this.setState({cart: [], products: []})
        }
        if (nextProps.cart.length && this.props.cart.reduce((sum,{amount}) => sum + amount,0) !== nextProps.cart.reduce((sum,{amount}) => sum + amount,0)) {     
            this.fetchCartProducts(nextProps.cart);
        }
    }

    fetchCartProducts(cart) {
        Promise.all(
            cart.map(
                item => 
                this.props.fetchSingleProduct(item.id)
            )
        )
            .then(res => Array.from(res).map(item => item.data))
            .then(res => {
                this.setState({products: res, cart: cart})
            })
    }

    render() {
        const style = this.state.cart.length > 3 ? {overflowY: 'auto'} : {overflowY: 'hidden'};
        return this.state.products.length ? (
            <React.Fragment>
                <div className="basket-dropped__title">В вашей корзине:</div>
                <div className="basket-dropped__product-list product-list" style={style}>
                    {this.state.cart.map(
                        product => {
                            const good = this.state.products.filter(item => item.id === product.id)[0];
                            return (                            
                                <div className="product-list__item" key={product.id + '_' + product.size}>
                                    <Link className="product-list__pic" 
                                        to={`/product_card/${product.id}`} 
                                        alt={good.title}
                                        style={{
                                            backgroundImage: `url(${good.images[0]})`,
                                            backgroundRepeat: 'no-repeat',
                                            backgroundSize: 'contain',
                                            backgroundPosition: 'center'
                                        }}>
                                    </Link>
                                    <Link className="product-list__product" to={`/product_card/${product.id}`}>
                                        {`${good.title} (размер: ${product.size})${product.amount > 1 ? `, ${product.amount} шт` : ''}`}
                                    </Link>
                                    <div className="product-list__fill"></div>
                                    <div className="product-list__price">
                                        {(product.amount * good.price).toLocaleString('RU-ru')}
                                        <i className="fa fa-rub" aria-hidden="true"></i>
                                    </div>
                                    <div className="product-list__delete" onClick={() => this.props.deleteGoodFromCart(product.id, product.size)}>
                                        <i className="fa fa-times" aria-hidden="true"></i>
                                    </div>
                                </div>
                            )
                        }
                    )}
                </div>
                <Link className="basket-dropped__order-button" to="/order">Оформить заказ</Link>
            </React.Fragment>
        ) : <div className="basket-dropped__title" style={{fontWeight: 'normal'}}>В корзине пока ничего нет. Не знаете, с чего начать? Посмотрите наши <Link to="/" style={{color: '#fff'}}>новинки</Link>!</div>
    }
}

Cart.propTypes = {
    fetchActiveSubcategories: PropTypes.func.isRequired,
    categories: PropTypes.array.isRequired,
    handleFilter: PropTypes.func.isRequired,
    showFilter: PropTypes.func.isRequired,
    getSearchParam: PropTypes.func.isRequired,
    deleteGoodFromCart: PropTypes.func.isRequired,
    cart: PropTypes.array.isRequired
}        

export default Cart;