import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import logoImg from './img/header-logo.png';
import Cart from './Cart';
import PropTypes from 'prop-types';
import { withRouter } from "react-router-dom";

class Header extends Component {
    constructor(props) {
        super(props);

        this.state = {
            activeCategory: null,
            activeSearch: false,
            activeProfile: false,
            activeCart: false,
            subcategories: [],
            search: this.props.getSearchParam('search') ? decodeURIComponent(this.props.getSearchParam('search')) : '',
        }
    }

    setActiveCategory(categoryId) {
        if (this.state.activeCategory === categoryId) 
            this.setState({activeCategory: null});
        else {
            this.setState({activeCategory: categoryId});
            this.props.fetchActiveSubcategories(categoryId)
                .then(res => this.setState({subcategories: res}))
        }
    }

    sliceArrayFilter(length) {
        return length > 21 ? 21 : (length < 8 ? length : (length - (length % 7)) );
    }

    handleSearch(searchStr) {
        this.setState({search: searchStr});
    }

    shutDownCart() {        
        this.setState({
            activeCategory: null,
            activeSearch: false,
            activeProfile: false,
            activeCart: false,
        });
    }

    submitSearch(event) {
        event.preventDefault();
        if (this.state.search !== '') {
            const filter = this.props.showFilter(['search'], [this.state.search], true);
            this.props.handleFilter(filter);
            this.props.history.push('/catalog' + filter);
        }
    }

    componentWillUpdate(nextProps) {
        if (nextProps.history.action === "PUSH" && (this.state.activeCategory || this.state.activeSearch || this.state.activeProfile || this.state.activeCart ))
            this.shutDownCart();
    }

    render() {
        const topMenuLinks = [{name:'Возврат', link:'#'}, {name:'Доставка и оплата', link:'#'}, {name:'О магазине', link:'#'}, {name:'Контакты', link:'#'}, {name:'Новости', link:'#'}],
            contacts = {
                phone: '+7 495 79 03 5 03',
                timework: ['09-00', '21-00'],
                days: ['Ежедневно']
            },
            description = 'Обувь и аксессуары для всей семьи',
            categories = this.props.categories;
        return (
            <header className="header">
                <div className="top-menu">
                    <div className="wrapper">
                        <ul className="top-menu__items">
                            {topMenuLinks.map(({name, link}, index) => 
                                <li className="top-menu__item" key={index}>
                                    <a href={link}>{name}</a>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
                <div className="header-main">
                    <div className="header-main__wrapper wrapper">
                        <div className="header-main__phone">
                            <a href={`tel:${contacts.phone.replace(/ /g, '-')}`}>{contacts.phone}</a>
                            <p>{contacts.days.join(',')}: с {contacts.timework[0]} до {contacts.timework[1]}</p>
                        </div>
                        <div className="header-main__logo">
                            <Link to="/">
                                <h1>
                                    <img src={logoImg} alt="logotype" />
                                </h1>
                            </Link>
                            <p>{description}</p>
                        </div>
                        <div className="header-main__profile">
                            <div className="header-main__pics">
                                <div className={`header-main__pic header-main__pic_search ${this.state.activeSearch ? 'header-main__pic_search_is-hidden' : ''}`} 
                                    onClick={() => this.setState({activeSearch: !this.state.activeSearch, activeCart: false, activeProfile: false})}>
                                </div>
                                <div className="header-main__pic_border"></div>
                                <div className="header-main__pic header-main__pic_profile" 
                                    onClick={() => this.setState({activeProfile: !this.state.activeProfile, activeCart: false, activeSearch: false})}>
                                    <div className={`header-main__pic_profile_menu ${this.state.activeProfile ? 'header-main__pic_profile_menu_is-active' : ''}`}></div>
                                </div>
                                <div className="header-main__pic_border"></div>
                                <div className="header-main__pic header-main__pic_basket" 
                                    onClick={() => this.setState({activeCart: !this.state.activeCart, activeProfile: false, activeSearch: false})}>
                                    <div className="header-main__pic_basket_full" style={{display: this.props.cart.length ? 'block' : 'none'}}>{this.props.cart.reduce((sum,{amount}) => sum + amount,0)}</div>
                                    <div className={`header-main__pic_basket_menu ${this.state.activeCart ? 'header-main__pic_basket_menu_is-active' : ''}`}></div>
                                </div>
                            </div>
                            <form className={`header-main__search ${this.state.activeSearch ? 'header-main__search_active' : ''}`} action="" onSubmit={(event) => this.submitSearch(event)}>
                                <input placeholder="Поиск" value={this.state.search} onChange={(event) => this.handleSearch(event.target.value)} />
                                <i className="fa fa-search" aria-hidden="true"></i>
                            </form>
                        </div>
                    </div>
                    <div className={`header-main__hidden-panel hidden-panel ${this.state.activeProfile || this.state.activeCart ? 'header-main__hidden-panel_visible' : ''}`}>
                        <div className="wrapper">
                            <div className={`hidden-panel__profile ${this.state.activeProfile ? 'hidden-panel__profile_visible' : ''}`}>
                                <a href="#">Личный кабинет</a>
                                <Link to="/favorite">
                                    <i className="fa fa-heart-o" aria-hidden="true"></i>Избранное
                                </Link>
                                <a href="#">Выйти</a>
                            </div>
                            <div className={`hidden-panel__basket basket-dropped ${this.state.activeCart ? 'hidden-panel__basket_visible' : ''}`}>
                                <Cart {...this.props} shutDownCart={this.shutDownCart.bind(this)} />                                
                            </div>
                        </div>
                    </div>
                </div>
                <nav className="main-menu">
                    <div className="wrapper">
                        <ul className="main-menu__items">
                            {categories.map(
                                ({id, title}) => 
                                <li key={id} className={`main-menu__item ${this.state.activeCategory === id ? 'main-menu__item_active' : ''}`} onClick={() => this.setActiveCategory(id)} >
                                    <a href="#">{title}</a>
                                </li>
                            )}
                        </ul>
                    </div>    
                </nav>
                <div className={`dropped-menu ${this.state.activeCategory ? 'dropped-menu_visible' : ''}`}>
                    <div className="wrapper">
                        {this.state.subcategories.map(
                            ({sort, name, cls, children}, index) =>
                            <div className={`dropped-menu__lists${cls? ' ' + cls : ''}`} key={index} >
                                <h3 className="dropped-menu__list-title">{name}:</h3>
                                <ul className="dropped-menu__list">
                                    {children.map(
                                        (item, index) =>
                                        <li className="dropped-menu__item" key={index} >
                                            <Link to={`/catalog?categoryId=${this.state.activeCategory}&${sort}=${item}`} onClick={() => this.props.handleFilter(`?categoryId=${this.state.activeCategory}&${sort}=${item}`)} >{decodeURIComponent(item)}</Link>
                                        </li>
                                    )}
                                </ul>
                            </div>
                        )}                    
                    </div>
                </div>
            </header>
        );
    }
}

Header.propTypes = {
    fetchActiveSubcategories: PropTypes.func.isRequired,
    categories: PropTypes.array.isRequired,
    handleFilter: PropTypes.func.isRequired,
    showFilter: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    getSearchParam: PropTypes.func.isRequired
}

export default withRouter(Header);