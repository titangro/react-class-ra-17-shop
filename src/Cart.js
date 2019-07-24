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

    componentWillUpdate(nextProps, nextState) {
        if (nextProps.cart.length && this.props.cart.reduce((sum,{amount}) => sum + amount,0) !== nextProps.cart.reduce((sum,{amount}) => sum + amount,0)) {     
            Promise.all(
                nextProps.cart.map(
                    item => 
                    this.props.fetchSingleProduct(item.id)
                )
            )
                .then(res => Array.from(res).map(item => item.data))
                .then(res => {
                    this.setState({products: res, cart: nextProps.cart})
                })
        }
    }

    handleOrder() {
        const basketMenu = document.querySelector('.header-main__pic_basket_menu');
        const panel = document.querySelector('.header-main__hidden-panel');
        basketMenu.classList.remove('header-main__pic_basket_menu_is-active');
        panel.classList.remove('header-main__hidden-panel_visible');
    }

    render() {
        return this.state.products.length ? (
            <React.Fragment>
                <div className="basket-dropped__title">В вашей корзине:</div>
                <div className="basket-dropped__product-list product-list">
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
                <Link className="basket-dropped__order-button" to="/order" onClick={() => this.handleOrder()}>Оформить заказ</Link>
            </React.Fragment>
        ) : <div className="basket-dropped__title" style={{fontWeight: 'normal'}}>В корзине пока ничего нет. Не знаете, с чего начать? Посмотрите наши <Link to="/" style={{color: '#fff'}}>новинки</Link>!</div>
    }
}

Cart.propTypes = {
    fetchActiveSubcategories: PropTypes.func.isRequired,
    categories: PropTypes.array.isRequired,
    handleFilter: PropTypes.func.isRequired,
    showFilter: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    getSearchParam: PropTypes.func.isRequired,
    deleteGoodFromCart: PropTypes.func.isRequired,
    cart: PropTypes.array.isRequired
}        

export default Cart;