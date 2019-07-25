import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Breadcrumbs from './Breadcrumbs'

class Order extends Component {
  _isMounted = false;

  constructor(props) {
    super(props)

    this.state = {
      products: [],
      cart: [],
      error: '',
      isActiveForm: false
    }
  }
  
  componentWillMount() {
    this._isMounted = true;
    
    if (this.props.cart.length !== this.state.cart.length) {
      this.updateCartProducts(this.props);
    }
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextProps.cart.length && this.props.cart.reduce((sum,{amount}) => sum + amount,0) !== nextProps.cart.reduce((sum,{amount}) => sum + amount,0))
      this.updateCartProducts(nextProps);    
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
          this.setState({products: res, cart: props.cart})
      })
  }
  
  validateForm(form, isForm = true) {
    if (!form.get('name') || form.get('name') === '' ||
      !form.get('phone') || form.get('phone') === '' || form.get('phone').replace(/\D+/g, '') === '' ||
      !form.get('email') || form.get('email') === '' ||
      !form.get('delivery') || form.get('delivery') === '') {
        if (isForm)
          this.setState({error: 'Не заполены обязательные поля'});
        return false;
    }
    if (form.get('name').length <= 1) {
      if (isForm)
        this.setState({error: 'Ваше имя слишком короткое'});
      return false;
    }
    if (form.get('phone').length < 7) {
      if (isForm)
        this.setState({error: 'Телефон должен содержать не менее 7 цифр'});
      return false;
    }
    if (form.get('delivery').length < 15) {
      if (isForm)
        this.setState({error: 'Адрес должен содержать не менее 15 симфолов'});
      return false;
    }
    if (this.state.error !== '') {
      this.setState({error: '', isActiveForm: true});
    } else {
      this.setState({isActiveForm: true});
    }
    return true;
  }

  sendForm(event) {
    event.preventDefault();

    const formData = new FormData(event.target);

    if (this.validateForm(formData)) {
      console.log('Успешный заказ');
    } else {
      console.log('Ошибки при валидации формы');
    }
  }

  /* Убираем недопустимые символы для ввода, валидация формы при наборе для активации кнопки подтверждения заказа */
  checkName(node) {
    node.value = node.value.replace(/[^a-zA-ZА-Яа-яЁё]/gi,'');
    this.validateForm(new FormData(node.parentElement.parentElement.parentElement.parentElement), false);
  }

  checkPhone(node) {
    node.value = node.value.replace(/[a-zA-ZА-Яа-яЁё!@#$%^&*\\|/`~_\[\]{}.<>?,]/gi,'');
    this.validateForm(new FormData(node.parentElement.parentElement.parentElement.parentElement), false);
  }

  checkDelivery(node) {
    node.value = node.value.replace(/[!@#$%^&*\\|/`~_\[\]{}<>?]/gi,'');
    this.validateForm(new FormData(node.parentElement.parentElement.parentElement.parentElement), false);
  }

  checkEmail(node) {
    this.validateForm(new FormData(node.parentElement.parentElement.parentElement.parentElement), false);
  }

  /* Изменение количества данного товара на лету */
  handleQuantity(productId, size, newAmount) {
    if (newAmount === 0)
      return false;
    this.props.addCart(productId, size, newAmount)
      .then(res => {
        if (res.status === 'ok') {
          this.props.fetchCart(res.data.id);
        } else {
          this.setState({error: res.message })
        }
      })
  }

  render() {
    const sumOrder = this.state.cart.length ? this.state.cart.reduce(
        (sum, good) => 
        sum + good.amount * this.state.products.filter(item => item.id === good.id)[0].price, 0
      ) : 0;
    return this.props.cart ? (
      <React.Fragment>
        <Breadcrumbs {...this.props} categoryName={'Оформление заказа'} />
        <section className="order-process">
          <h2 className="order-process__title">Оформление заказа</h2>
          <div className="order-process__basket order-basket">
            <div className="order-basket__title">в вашей корзине:</div>
            <div className="order-basket__item-list">
              {this.state.cart.length ?
                this.state.cart.map(
                  product => {
                    const good = this.state.products.filter(item => item.id === product.id)[0];
                    return (
                      <div className="basket-item" key={product.id + '_' + product.size}>
                        <Link to={`/product_card/${product.id}`}>
                          <div className="basket-item__pic" style={{
                            backgroundImage: `url(${good.images[0]})`,
                            backgroundRepeat: 'no-repeat',
                            backgroundSize: 'contain',
                            backgroundPosition: 'center'
                          }}>
                          </div>
                        </Link>
                        <div className="basket-item__product">
                          <div className="basket-item__product-name">
                            <Link to={`/product_card/${product.id}`}>{good.title}</Link>
                          </div>
                          <div className="basket-item__product-features">
                            <div className="basket-item__size">Размер: <span>{product.size}</span></div>
                            <div className="basket-item__producer">Производитель: <span>{good.brand}</span></div>
                            <div className="basket-item__color">Цвет: <span>{good.color}</span></div>
                          </div>
                        </div>
                        <div className="basket-item__quantity">
                          <div className="basket-item__quantity-change basket-item-list__quantity-change_minus" 
                            onClick={() => this.handleQuantity(product.id, product.size, product.amount - 1)}>-</div>
                          {product.amount}
                          <div className="basket-item__quantity-change basket-item-list__quantity-change_plus" 
                            onClick={() => this.handleQuantity(product.id, product.size, product.amount + 1)}>+</div>
                        </div>
                        <div className="basket-item__price">
                          {(product.amount * good.price).toLocaleString('RU-ru')}
                          <i className="fa fa-rub" aria-hidden="true"></i>
                        </div>
                      </div>
                    )
                  }
                )
              : ''}
            </div>
            <div className="order-basket__summ">
              Итого:&nbsp;
              <span>
                {sumOrder.toLocaleString('RU-ru')}
                <i className="fa fa-rub" aria-hidden="true"></i>
              </span>
            </div>
          </div>
          <div className="order-process__confirmed">
            <form action="" onSubmit={(event) => this.sendForm(event)}>
              <div className="order-process__delivery">
                <h3 className="h3">кому и куда доставить?</h3>
                <div className="order-process__delivery-form">
                  <label className="order-process__delivery-label">
                    <div className="order-process__delivery-text">Имя</div>
                    <input className="order-process__delivery-input" type="text" name="name" placeholder="Представьтесь, пожалуйста" onChange={(event) => this.checkName(event.target)} />
                  </label>
                  <label className="order-process__delivery-label">
                    <div className="order-process__delivery-text">Телефон</div>
                    <input className="order-process__delivery-input" type="tel" name="phone" placeholder="Номер в любом формате" onChange={(event) => this.checkPhone(event.target)} />
                  </label>
                  <label className="order-process__delivery-label">
                    <div className="order-process__delivery-text">E-mail</div>
                    <input className="order-process__delivery-input" type="email" name="email" placeholder="Укажите E-mail" onChange={(event) => this.checkEmail(event.target)} />
                  </label>
                  <label className="order-process__delivery-label order-process__delivery-label_adress">
                    <div className="order-process__delivery-text">Адрес</div>
                    <input className="order-process__delivery-input order-process__delivery-input_adress" type="text" name="delivery" placeholder="Ваша покупка будет доставлена по этому адресу" 
                      onChange={(event) => this.checkDelivery(event.target)} />
                  </label>
                </div>
                <p>Все поля обязательны для заполнения. Наш оператор свяжется с вами для уточнения деталей заказа.</p>
                {this.state.error.length ? 
                  <p className="error" style={{color: 'red', position: 'absolute'}}>{this.state.error}</p>
                 : ''}
              </div>
              <div className="order-process__paid">
                <h3 className="h3">хотите оплатить онлайн или курьеру при получении?</h3>
                <div className="order-process__paid-form">
                  <label className="order-process__paid-label">
                    <input className="order-process__paid-radio" type="radio" name="paid" value="card-online" /><span className="order-process__paid-text">Картой онлайн</span>
                  </label>
                  <label className="order-process__paid-label">
                    <input className="order-process__paid-radio" type="radio" name="paid" value="card-courier" defaultChecked /><span className="order-process__paid-text">Картой курьеру</span>
                  </label>
                  <label className="order-process__paid-label">
                    <input className="order-process__paid-radio" type="radio" name="paid" value="cash" /><span className="order-process__paid-text">Наличными курьеру</span>
                  </label>
                </div>
              </div>
              <button className={`order-process__form-submit order-process__form-submit_click${!this.state.isActiveForm ? ' order-process__form-submit_disabled' : ''}`}>Подтвердить заказ</button>
            </form>
          </div>
        </section>
      </React.Fragment>
    ) : 'Ваша корзина пуста'
  }
}

Order.propTypes = {
  fetchSingleProduct: PropTypes.func.isRequired,
  cart: PropTypes.array.isRequired,
  addCart: PropTypes.func.isRequired,
  fetchCart: PropTypes.func.isRequired
}

export default Order;