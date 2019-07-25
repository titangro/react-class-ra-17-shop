import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const OrderDone = ({order, email, sumOrder}) => {
  /* Расшифровка для ключа оплаты */
  const paidObj = {
    'onlineCard': 'Картой онлайн',
    'offlineCard': 'Картой курьеру',
    'offlineCash': 'Наличными курьеру'
  }

  const relocateToCatalog = () => window.location.pathname = '/catalog';

  return (
    <section className="order-done">
      <h2 className="order-done__title order-process__title">Заказ принят, спасибо!</h2>
      <div className="order-done__information order-info">
        <div className="order-info__item order-info__item_summ"> 
          <h3>Сумма заказа:</h3>
          <p>{sumOrder.toLocaleString('RU-ru')}&nbsp;<i className="fa fa-rub" aria-hidden="true"></i></p>
        </div>
        <div className="order-info__item order-info__item_pay-form"> 
          <h3>Способ оплаты:</h3>
          <p>{paidObj[order.paymentType]}</p>
        </div>
        <div className="order-info__item order-info__item_customer-name"> 
          <h3>Имя клиента:</h3>
          <p>{order.name}</p>
        </div>
        <div className="order-info__item order-info__item_adress">
          <h3>Адрес доставки:</h3>
          <p>{order.address}</p>
        </div>
        <div className="order-info__item order-info__item_phone">
          <h3>Телефон:</h3>
          <p>{order.phone}</p>
        </div>
      </div>
      <p className="order-done__notice">Данные о заказе отправлены на адрес <span>{email}.  </span></p>
      <button className="order-done__continue" onClick={() => relocateToCatalog()}>продолжить покупки</button>
    </section>
  )
}

OrderDone.propTypes = {
  order: PropTypes.shape({
    name: PropTypes.string.isRequired,
    phone: PropTypes.any.isRequired,
    address: PropTypes.string.isRequired,
    paymentType: PropTypes.string.isRequired,
    cart: PropTypes.string.isRequired,
  }),
  sumOrder: PropTypes.number.isRequired,
  email: PropTypes.string.isRequired
}

export default OrderDone;