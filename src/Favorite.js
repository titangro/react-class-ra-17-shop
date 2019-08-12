import React, { Component } from 'react';
import Breadcrumbs from './Breadcrumbs';
import Products from './Products';
import Sorting from './Sorting';
import Pagination from './Pagination';
import PropTypes from 'prop-types';
//import './css/style-favorite.css';
//import { BrowserRouter, Route, Switch } from 'react-router-dom';

class Favorite extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);

    this.state ={
      favorite: localStorage.favorite ? JSON.parse(localStorage.favorite) : [],
      products: null
    }
  }

  componentDidMount() {
    require('./css/style-order.css');
    require('./css/style-catalogue.css');
    require('./css/style-favorite.css');
  }
  
  componentWillMount() {
    this._isMounted = true;
    
    this.fetchFavoriteProducts(this.state.favorite)
  }

  componentWillUpdate() {
    const newFavorite = localStorage.favorite ? JSON.parse(localStorage.favorite) : [];
    if (this.state.favorite.length !== newFavorite.length) {
      this.fetchFavoriteProducts(newFavorite)
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  fetchFavoriteProducts(favoriteIds) {
    const page = this.props.getSearchParam('page') ? this.props.getSearchParam('page') : 1;
    const sortBy = this.props.getSearchParam('sortBy') ? this.props.getSearchParam('sortBy') : 'price';
    Promise.all(favoriteIds.map(
      productId =>
      this.props.fetchSingleProduct(productId)
    ))
      .then(res => res.map(item => item.data))
      .then(res => {
        this.setState({
          products: {
            status: 'ok',
            data: res.sort((a, b) => a[sortBy] - b[sortBy]).slice((page - 1) * 12, page * 12),
            goods: res.length,
            page: +page,
            pages: Math.ceil(res.length / 12)
          }
        })
      })
  }

  render() {
    return this.state.favorite.length ? (
      <React.Fragment>
        <Breadcrumbs {...this.props} categoryName={'Избранное'} />
        <main className="product-catalogue product-catalogue_favorite">
          {this.state.products ?
            <React.Fragment>
              <section className="product-catalogue__head product-catalogue__head_favorite">
                <div className="product-catalogue__section-title">
                  <h2 className="section-name">В вашем избранном</h2><span className="amount amount_favorite"> {this.state.favorite.length} товаров</span>
                </div>
                <div className="product-catalogue__sort-by">
                  <p className="sort-by">Сортировать</p>
                  <Sorting {...this.props} />
                </div>
              </section>
              <section className="product-catalogue__item-list product-catalogue__item-list_favorite" style={{width: '1200px'}}>
                <Products products={this.state.products.data} fetchSizes={this.props.fetchSizes} handleFavorite={(id) => {
                  this.props.handleFavorite(id);
                  this.setState({favorite: localStorage.favorite ? JSON.parse(localStorage.favorite) : []})
                }} />
              </section>
              <Pagination {...this.props} products={this.state.products} />
            </React.Fragment> : ''}           
        </main>
      </React.Fragment>
    ) : (
      <React.Fragment>
        <Breadcrumbs categoryName={'Избранное'} />
        <main className="product-catalogue product-catalogue_favorite" style={{minHeight: '600px'}}>
          <section className="product-catalogue__head product-catalogue__head_favorite">
            <div className="product-catalogue__section-title">
              <h2 className="section-name">В вашем избранном пока ничего нет</h2>
            </div>
          </section>
        </main>
      </React.Fragment>
    )
  }
}

Favorite.propTypes = {
  fetchProductsByParams: PropTypes.func.isRequired,
  fetchSizes: PropTypes.func.isRequired,
  handleFavorite: PropTypes.func.isRequired,
}

export default Favorite;