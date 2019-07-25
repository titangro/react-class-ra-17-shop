import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const OrderProrgess = ({validateForm, sumOrder, handleQuantity, cart, products, error, isActiveForm, sendForm}) => {    
    
    /* Убираем недопустимые символы для ввода, валидация формы при наборе для активации кнопки подтверждения заказа */
    const checkName = (node) => {
        node.value = node.value.replace(/[^a-zA-ZА-Яа-яЁё]/gi,'');
        validateForm(new FormData(node.parentElement.parentElement.parentElement.parentElement), false);
    }

    const checkPhone = (node) => {
        node.value = node.value.replace(/[a-zA-ZА-Яа-яЁё!@#$%^&*\\|/`~_\[\]{}.<>?,]/gi,'');
        validateForm(new FormData(node.parentElement.parentElement.parentElement.parentElement), false);
    }

    const checkDelivery = (node) => {
        node.value = node.value.replace(/[!@#$%^&*\\|/`~_\[\]{}<>?]/gi,'');
        validateForm(new FormData(node.parentElement.parentElement.parentElement.parentElement), false);
    }

    const checkEmail = (node) => {
        validateForm(new FormData(node.parentElement.parentElement.parentElement.parentElement), false);
    }

    return (
        <section className="order-process">
          <h2 className="order-process__title">Оформление заказа</h2>
          <div className="order-process__basket order-basket">
            <div className="order-basket__title">в вашей корзине:</div>
            <div className="order-basket__item-list">
                {cart.map(
                    product => {
                        const good = products.filter(item => item.id === product.id)[0];
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
                                onClick={() => handleQuantity(product.id, product.size, product.amount - 1)}>-</div>
                                {product.amount}
                                <div className="basket-item__quantity-change basket-item-list__quantity-change_plus" 
                                onClick={() => handleQuantity(product.id, product.size, product.amount + 1)}>+</div>
                            </div>
                            <div className="basket-item__price">
                                {(product.amount * good.price).toLocaleString('RU-ru')}
                                <i className="fa fa-rub" aria-hidden="true"></i>
                            </div>
                            </div>
                        )
                    }
                )}
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
            <form action="" onSubmit={(event) => sendForm(event, sumOrder)}>
              <div className="order-process__delivery">
                <h3 className="h3">кому и куда доставить?</h3>
                <div className="order-process__delivery-form">
                  <label className="order-process__delivery-label">
                    <div className="order-process__delivery-text">Имя</div>
                    <input className="order-process__delivery-input" type="text" name="name" placeholder="Представьтесь, пожалуйста" onChange={(event) => checkName(event.target)} />
                  </label>
                  <label className="order-process__delivery-label">
                    <div className="order-process__delivery-text">Телефон</div>
                    <input className="order-process__delivery-input" type="tel" name="phone" placeholder="Номер в любом формате" onChange={(event) => checkPhone(event.target)} />
                  </label>
                  <label className="order-process__delivery-label">
                    <div className="order-process__delivery-text">E-mail</div>
                    <input className="order-process__delivery-input" type="email" name="email" placeholder="Укажите E-mail" onChange={(event) => checkEmail(event.target)} />
                  </label>
                  <label className="order-process__delivery-label order-process__delivery-label_adress">
                    <div className="order-process__delivery-text">Адрес</div>
                    <input className="order-process__delivery-input order-process__delivery-input_adress" type="text" name="delivery" placeholder="Ваша покупка будет доставлена по этому адресу" 
                      onChange={(event) => checkDelivery(event.target)} />
                  </label>
                </div>
                <p>Все поля обязательны для заполнения. Наш оператор свяжется с вами для уточнения деталей заказа.</p>
                {error.length ? 
                  <p className="error" style={{color: 'red', position: 'absolute'}}>{error}</p>
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
              <button className={`order-process__form-submit order-process__form-submit_click${!isActiveForm ? ' order-process__form-submit_disabled' : ''}`}>Подтвердить заказ</button>
            </form>
          </div>
        </section>
    )
}        

OrderProrgess.propTypes = {
    validateForm: PropTypes.func.isRequired,
    sumOrder: PropTypes.number.isRequired,
    handleQuantity: PropTypes.func.isRequired,
    cart: PropTypes.arrayOf(
        PropTypes.object.isRequired
    ).isRequired,
    products: PropTypes.arrayOf(
        PropTypes.object.isRequired
    ).isRequired,
    error: PropTypes.string.isRequired,
    isActiveForm: PropTypes.bool.isRequired,
    sendForm: PropTypes.func.isRequired
}

export default OrderProrgess;