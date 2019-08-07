import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Breadcrumbs from './Breadcrumbs';
import OrderProgress from './OrderProgress';
import OrderDone from './OrderDone';
import { withRouter } from "react-router-dom";
//import './css/style-order.css';

class Order extends Component {
  _isMounted = false;

  constructor(props) {
    super(props)

    this.state = {
      products: [],
      cart: [],
      error: '',
      isActiveForm: false,
      sumOrder: 0,
    }
  }

  componentDidMount() {
    require('./css/style-order.css');
  }
  
  componentWillMount() {
    this._isMounted = true;
    if (this.props.cart.length !== this.state.cart.length) {
      this.updateCartProducts(this.props);
    }

    if (this.props.categories.length && !this.props.order && !this.props.cart.length) {
      this.props.history.push('/');
    }
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextProps.cart.length && this.props.cart.reduce((sum,{amount}) => sum + amount,0) !== nextProps.cart.reduce((sum,{amount}) => sum + amount,0))
      this.updateCartProducts(nextProps);

    if (!nextProps.cart.length && !nextProps.order) {
      this.props.history.push('/');
    }
  }
  
  componentWillUnmount() {
    this._isMounted = false;
  }

  updateCartProducts(props) {
    Promise.all(
      props.cart.map(
          item => 
          this.props.fetchSingleProduct(item.id)
      )
    )
      .then(res => Array.from(res).map(item => item.data))
      .then(res => {
        if (this._isMounted)
          this.setState({products: res, cart: props.cart, sumOrder: props.cart.reduce(
            (sum, good) => 
            sum + good.amount * res.filter(item => item.id === good.id)[0].price, 0
          )})
      })
  }
  
  /* Валидация формы */
  validateForm(form, isForm = true) {
    if (!form.get('name') || form.get('name') === '' ||
      !form.get('phone') || form.get('phone') === '' || form.get('phone').replace(/\D+/g, '') === '' ||
      !form.get('email') || form.get('email') === '' ||
      !form.get('delivery') || form.get('delivery') === '') {
        if (isForm)
          this.setState({error: 'Не заполены обязательные поля'});
        return this.setState({isActiveForm: false});
    }
    if (form.get('name').length <= 1) {
      if (isForm)
        this.setState({error: 'Ваше имя слишком короткое'});
      return this.setState({isActiveForm: false});
    }
    if (form.get('phone').length < 7) {
      if (isForm)
        this.setState({error: 'Телефон должен содержать не менее 7 цифр'});
      return this.setState({isActiveForm: false});
    }
    if (form.get('delivery').length < 15) {
      if (isForm)
        this.setState({error: 'Адрес должен содержать не менее 15 симфолов'});
      return this.setState({isActiveForm: false});
    }
    if (this.state.error !== '') {
      this.setState({error: '', isActiveForm: true});
    } else {
      this.setState({isActiveForm: true});
    }
    return true;
  }

  /* Отправка письма при успешной валидации, переключение на успешное оформление заказа, удаление корзины */
  sendForm = (event, sumOrder) => {
    event.preventDefault();

    const formData = new FormData(event.target);

    if (this.validateForm(formData)) {
      this.props.fetchOrder(localStorage.cart, formData, sumOrder)
        .then(() => {
          window.scrollTo(0, 300);
        });
    } else {
      console.log('Ошибки при валидации формы');
    }
}

  /* Изменение количества данного товара на лету */
  handleQuantity(productId, size, newAmount) {
    if (newAmount === 0)
      return false;
    this.props.addCart(productId, size, newAmount, true)
      .then(res => {
        if (res.status === 'ok') {
          this.props.fetchCart(res.data.id);
        } else {
          this.setState({error: res.message})
        }
      })
  } 

  render() {
    return this.state.sumOrder || this.props.order ? (
      <React.Fragment>
        <Breadcrumbs {...this.props} categoryName={'Оформление заказа'} />
        {!this.props.order ?
          <OrderProgress {...this.state} validateForm={this.validateForm.bind(this)} handleQuantity={this.handleQuantity.bind(this)} sendForm={this.sendForm.bind(this)} />
          : <OrderDone order={this.props.order.data.info} email={this.props.order.email} sumOrder={this.props.order.sumOrder} history={this.props.history} />
        }        
      </React.Fragment>
    ) : <div>
          <p>Ваша корзина пуста</p>
        </div>
  }
}

Order.propTypes = {
  fetchSingleProduct: PropTypes.func.isRequired,
  cart: PropTypes.array.isRequired,
  addCart: PropTypes.func.isRequired,
  fetchCart: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
}

export default withRouter(Order);