import React from 'react';
import { Link } from 'react-router-dom';
import Subscribe from './Subscribe'

const footerMenu = [
        {title:'О магазине', code:'about', children:['BosaNoga','Новости','Пресса']},
        {title:'Коллекции', code:'collection', children:['Обувь','Аксессуары','Для дома']},
        {title:'Помощь', code:'help', children:['Как купить?','Возврат','Контакты']}
    ],
    payment = {
        title: 'Принимаем к оплате',
        payments: ['paypal', 'master-card', 'visa', 'yandex', 'webmoney', 'qiwi']
    },
    social = {
        title: 'Мы в соц.сетях',
        socials: ['twitter', 'vk']
    },
    copyright = ['2009-2018 © BosaNoga.ru — модный интернет-магазин обуви', ' и аксессуаров. Все права защищены. Доставка по всей России!'],
    contacts = {
        phone: '+7 495 79 03 5 03',
        timework: ['09-00', '21-00'],
        days: ['Ежедневно'],
        mail: 'office@bosanoga.ru'
    }

const Footer = () => {

    const changeFooterStyle = (locationPath) => {
        let style = {};
        if (locationPath === '/favorite') {
            if (!localStorage.favorite) {
                //style = {'position': 'fixed','left': '0','right': '0','bottom': '0'};
            } else {
                //style = !JSON.parse(localStorage.favorite).length ? {'position': 'fixed','left': '0','right': '0','bottom': '0'} : {};
            }
        }
        return style;
    }
        
    const style = changeFooterStyle(window.location.pathname);
    return (
        <footer className="footer" style={style}>
            <Subscribe />                
            <div className="footer__bottom">
                <div className="wrapper">
                    <div className="footer__menus">
                        {footerMenu.map(
                            ({title, code, children}, index) =>
                            <div className={`footer__menu footer__menu_${code}`} key={index}>{title}
                                <ul>
                                    {children.map(
                                        (title, index) =>
                                        <li key={index}>
                                            <Link to="/catalog">{title}</Link>
                                        </li>
                                    )}
                                </ul>
                            </div>
                        )}                    
                    </div>
                    <div className="footer__info">
                        <h3 className="footer__info_title">{payment.title}:</h3>
                        <div className="footer__paid-systems">
                            {payment.payments.map(
                                (code, index) =>
                                <div className={`footer__paid footer__paid_${code}`} key={index}></div>
                            )}
                        </div>
                        <div className="footer__social-links">
                            <h3 className="footer__social-links_title">{social.title}:</h3>                        
                            {social.socials.map(
                                (code, index) =>
                                <div className={`footer__social-link footer__social-link_${code}`} key={index}></div>
                            )}
                        </div>
                        <div className="footer__copyright">{copyright[0]}<br />{copyright[1]}</div>
                    </div>
                    <div className="footer__contacts">
                        <a className="footer__phone" href={`tel:${contacts.phone.replace(/ /g, '-')}`}>{contacts.phone}</a>
                        <p className="footer__phone_text">{contacts.days.join(',')}: с {contacts.timework[0]} до {contacts.timework[1]}</p>
                        <a className="footer__email" href={`mailto:${contacts.mail}`}>{contacts.mail}</a>
                    </div>
                </div>
            </div>
        </footer>
    );    
}

export default Footer;