import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

class Newdeals extends Component {
    constructor(props) {
        super(props);

        this.state = {
            featuredId: null,
            featurePos: 0
        }
    }

    handleSlider(pos) {
        this.setState({featurePos: pos});
    }
    
    changeFirstPos(pos, length) {
        return pos - 1 === -1 || (pos > length - 1) ? length - 1 : pos - 1;
    }

    changeNextPos(pos, length) {
        return pos + 1 === length || (pos > length - 1) ? 0 : pos + 1;
    }

    getFavoriteCls(localStarogeFavorite, featured) {
        return localStarogeFavorite ? 
            (JSON.parse(localStarogeFavorite).includes(featured[this.state.featurePos].id) ? 'new-deals__product_favorite-chosen' : 'new-deals__product_favorite')
            : 'new-deals__product_favorite';
    }

    render() {
        const categories = this.props.categories.filter(category => this.props.featured.map(feature => feature.categoryId).includes(category.id));
        const featured = this.state.featuredId ? this.props.featured.filter(feature => feature.categoryId == this.state.featuredId) : this.props.featured;        
        
        const firstPos = this.changeFirstPos(this.state.featurePos, featured.length);
        const nextPos = this.changeNextPos(this.state.featurePos, featured.length);
        //console.log(featured.length, this.state.featurePos, (this.state.featurePos - 1 === -1 || (this.state.featurePos > featured.length - 1)), firstPos, nextPos);
        return !featured.length ?
        ( 
            <section className="new-deals wave-bottom">
                <h2 className="h2">Новинки</h2>
                <div className="new-deals__menu">
                    <ul className="new-deals__menu-items">
                        {categories.map(({title, id}) =>
                        <li key={id} className={`new-deals__menu-item ${this.state.featuredId === id ? 'new-deals__menu-item_active' : ''}`}>
                            <a onClick={(event) => {event.preventDefault(); this.setState({featuredId: id}); this.setState({featurePos: 0});} }>{title}</a>
                        </li>
                        )}
                    </ul>
                </div>
            </section>
        )
        : (
            <section className="new-deals wave-bottom">
                <h2 className="h2">Новинки</h2>
                <div className="new-deals__menu">
                    <ul className="new-deals__menu-items">
                        {categories.map(({title, id}) =>
                        <li key={id} className={`new-deals__menu-item ${this.state.featuredId === id ? 'new-deals__menu-item_active' : ''}`}>
                            <a onClick={(event) => {event.preventDefault(); this.setState({featuredId: id}); this.setState({featurePos: 0});} }>{title}</a>
                        </li>
                        )}
                    </ul>
                </div>
                <div className="new-deals__slider">
                    <div className="new-deals__arrow new-deals__arrow_left arrow" onClick={() => this.handleSlider(firstPos)}></div>
                    <div className="new-deals__product new-deals__product_first" 
                        style={{
                            backgroundImage: `url(${featured.length ? featured[firstPos].images[0] : ''})`, 
                            backgroundSize: 'contain'
                        }}>
                        <Link to={`/product_card/${featured[firstPos].id}`}></Link>
                    </div>
                    <div className="new-deals__product new-deals__product_active" 
                        style={{
                            backgroundImage: `url(${featured.length ? featured[this.state.featurePos].images[0] : ''})`, 
                            backgroundSize: 'contain'
                        }}>
                        <Link to={`/product_card/${featured[this.state.featurePos].id}`}></Link>
                        <div className={this.getFavoriteCls(localStorage.favorite, featured)}
                            onClick={(event) => {
                                this.props.handleFavorite(featured[this.state.featurePos].id);
                                event.target.classList = [this.getFavoriteCls(localStorage.favorite, featured)];
                            }}
                            ></div>
                    </div>
                    <div className="new-deals__product new-deals__product_last" 
                        style={{
                            backgroundImage: `url(${featured.length ? featured[nextPos].images[0] : ''})`, 
                            backgroundSize: 'contain'
                        }}>
                        <Link to={`/product_card/${featured[nextPos].id}`}></Link>
                    </div>
                    <div className="new-deals__arrow new-deals__arrow_right arrow" onClick={() => this.handleSlider(nextPos)}></div>
                </div>
                <div className="new-deals__product-info">
                    <Link to={`/product_card/${featured[this.state.featurePos].id}`} className="h3">{featured[this.state.featurePos].title}</Link>
                    <p>Производитель:
                        <span>{featured[this.state.featurePos].brand}</span>
                    </p>
                    <h3 className="h3">{`${featured[this.state.featurePos].price.toLocaleString('ru-RU')} ₽`}</h3>
                </div>
            </section>
        )
    }
}

Newdeals.propTypes = {
    categories: PropTypes.array.isRequired,
    featured: PropTypes.array.isRequired,
    handleFavorite: PropTypes.func.isRequired
}

export default Newdeals;
