import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const OrderDone = ({formData, sumOrder}) => {
  /* Получение данных из формы */
  const name = formData.get('name');
  const phone = formData.get('phone');
  const email = formData.get('email');
  const delivery = formData.get('delivery');
  const paid = formData.get('paid');

  /* Расшифровка для ключа оплаты */
  const paidObj = {
    'card-online': 'Картой онлайн',
    'card-courier': 'Картой курьеру',
    'cash': 'Наличными курьеру'
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
          <p>{paidObj[paid]}</p>
        </div>
        <div className="order-info__item order-info__item_customer-name"> 
          <h3>Имя клиента:</h3>
          <p>{name}</p>
        </div>
        <div className="order-info__item order-info__item_adress">
          <h3>Адрес доставки:</h3>
          <p>{delivery}</p>
        </div>
        <div className="order-info__item order-info__item_phone">
          <h3>Телефон:</h3>
          <p>{phone}</p>
        </div>
      </div>
      <p className="order-done__notice">Данные о заказе отправлены на адрес <span>{email}.  </span></p>
      <button className="order-done__continue" onClick={() => relocateToCatalog()}>продолжить покупки</button>
    </section>
  )
}

OrderDone.propTypes = {
  formData: PropTypes.object.isRequired,
  sumOrder: PropTypes.number.isRequired,
}

export default OrderDone;