import React, { Component } from 'react';
import productImg from './img/product-list__pic_1.jpg';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';


class Cart extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            products: []
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
                    this.setState({products: res})
                })
        }
    }

    render() {
        //console.log(this.state)
        return this.props.cart.length ? (
            <React.Fragment>
                <div className="basket-dropped__title">В вашей корзине:</div>
                <div className="basket-dropped__product-list product-list">
                    <div className="product-list__item">
                        <a className="product-list__pic">
                            <img src={productImg} alt="product" />
                        </a>
                        <a href="#" className="product-list__product">Ботинки женские, Baldinini</a>
                        <div className="product-list__fill"></div>
                        <div className="product-list__price">12 360
                        <i className="fa fa-rub" aria-hidden="true"></i>
                        </div>
                        <div className="product-list__delete">
                        <i className="fa fa-times" aria-hidden="true"></i>
                        </div>
                    </div>    
                    <div className="product-list__item">
                        <a className="product-list__pic">
                            <img src={productImg} alt="product" />
                        </a>
                        <a href="#" className="product-list__product">Ботинки женские, Baldinini</a>
                        <div className="product-list__fill"></div>
                        <div className="product-list__price">12 360
                            <i className="fa fa-rub" aria-hidden="true"></i>
                        </div>
                        <div className="product-list__delete">
                            <i className="fa fa-times" aria-hidden="true"></i>
                        </div>
                    </div>
                    <div className="product-list__item">
                        <a className="product-list__pic">
                            <img src={productImg} alt="product" />
                        </a>
                        <a href="#" className="product-list__product">Ботинки женские, Baldinini</a>
                        <div className="product-list__fill"></div>
                        <div className="product-list__price">12 360
                        <i className="fa fa-rub" aria-hidden="true"></i>
                        </div>
                        <div className="product-list__delete">
                        <i className="fa fa-times" aria-hidden="true"></i>
                        </div>
                    </div>
                    <div className="product-list__item">
                        <a className="product-list__pic">
                        <img src={productImg} alt="product" /> </a>
                        <a href="#" className="product-list__product">Ботинки женские, Baldinini</a>
                        <div className="product-list__fill"></div>
                        <div className="product-list__price">12 360
                        <i className="fa fa-rub" aria-hidden="true"></i>
                        </div>
                        <div className="product-list__delete">
                        <i className="fa fa-times" aria-hidden="true"></i>
                        </div>
                    </div>    
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
    history: PropTypes.object.isRequired,
    getSearchParam: PropTypes.func.isRequired
}        

export default Cart;