import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

class Newdeals extends Component {
    constructor(props) {
        super(props);

        this.state = {
            categoryId: null,
            featured: this.props.featured,
            featurePos: 0,
            favoriteCls: this.getFavoriteCls()
        }
    }

    handleSlider(pos) {
        this.setState({
            featurePos: pos,
            favoriteCls: this.getFavoriteCls(pos)
        });
    }
    
    showPrevGoodPos(pos, length) {
        return pos - 1 === -1 || (pos > length - 1) ? length - 1 : pos - 1;
    }

    showNextGoodPos(pos, length) {
        return pos + 1 === length || (pos > length - 1) ? 0 : pos + 1;
    }

    getFavoriteCls(pos) {
        if (localStorage.favorite) {
            if (JSON.parse(localStorage.favorite).includes(this.state ? this.state.featured[pos !== undefined ? pos : this.state.featurePos].id : this.props.featured[0].id)) {                
                return 'new-deals__product_favorite-chosen';
            }
        }
        return 'new-deals__product_favorite';
    }

    handleCategory(event, categoryId = 0) {
        event.preventDefault();        
        if  (categoryId) {
            this.setState({featured: this.props.featured.filter(feature => feature.categoryId === categoryId), featurePos: 0, categoryId: categoryId});
        } else
            this.setState({featured: this.props.featured, featurePos: 0, categoryId: null});
    }

    handleFavorite(id) {
        this.props.handleFavorite(id);
        this.setState({
            favoriteCls: this.getFavoriteCls()
        });
    }

    render() {
        const activeCategories = this.props.categories.filter(cat => this.props.featured.find(item => item.categoryId === cat.id));
        const firstGood = this.state.featured[this.showPrevGoodPos(this.state.featurePos, this.state.featured.length)];
        const nextGood = this.state.featured[this.showNextGoodPos(this.state.featurePos, this.state.featured.length)];
        const activeGood = this.state.featured[this.state.featurePos];
        
        return (
            <section className="new-deals wave-bottom">
                <h2 className="h2">Новинки</h2>
                <div className="new-deals__menu">
                    <ul className="new-deals__menu-items">
                        {activeCategories.map(({title, id}) =>
                        <li key={id} className={`new-deals__menu-item ${this.state.categoryId === id ? 'new-deals__menu-item_active' : ''}`}>
                            <a onClick={(event) => this.handleCategory(event, id) }>{title}</a>
                        </li>
                        )}
                    </ul>
                </div>
                <div className="new-deals__slider">
                    <div className="new-deals__arrow new-deals__arrow_left arrow" onClick={() => this.handleSlider(this.showPrevGoodPos(this.state.featurePos, this.state.featured.length))}></div>
                    <div className="new-deals__product new-deals__product_first" 
                        style={{
                            backgroundImage: `url(${firstGood.images[0]})`, 
                            backgroundSize: 'contain'
                        }}>
                        <Link to={`/product_card/${firstGood.id}`}></Link>
                    </div>
                    <div className="new-deals__product new-deals__product_active" 
                        style={{
                            backgroundImage: `url(${activeGood.images[0]})`, 
                            backgroundSize: 'contain'
                        }}>
                        <Link to={`/product_card/${activeGood.id}`}></Link>
                        <div className={this.state.favoriteCls}
                            onClick={() => this.handleFavorite(activeGood.id)}
                            ></div>
                    </div>
                    <div className="new-deals__product new-deals__product_last" 
                        style={{
                            backgroundImage: `url(${nextGood.images[0]})`, 
                            backgroundSize: 'contain'
                        }}>
                        <Link to={`/product_card/${nextGood.id}`}></Link>
                    </div>
                    <div className="new-deals__arrow new-deals__arrow_right arrow" onClick={() => this.handleSlider(this.showNextGoodPos(this.state.featurePos, this.state.featured.length))}></div>
                </div>
                <div className="new-deals__product-info">
                    <Link to={`/product_card/${activeGood.id}`} className="h3">{activeGood.title}</Link>
                    <p>Производитель:
                        <span>{activeGood.brand}</span>
                    </p>
                    <h3 className="h3">{`${activeGood.price.toLocaleString('ru-RU')} ₽`}</h3>
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
