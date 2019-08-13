import React, { Component } from 'react';
import Breadcrumbs from './Breadcrumbs';
import Products from './Products';
import Sorting from './Sorting';
import Pagination from './Pagination';
import Viewed from './Viewed';
import Sidebar from './Sidebar';
import PropTypes from 'prop-types';

class Catalog extends Component {
  _isMounted = false;

  constructor(props) {
      super(props);

      this.state = {
        categoryId: +this.props.getSearchParam('categoryId'),
        productsWithoutFilters: [],
        activeFilter: false,
        minHeight: 0
      }
  }

  componentDidMount() {
    require('./css/style-catalogue.css');

    this.changeCatalogHeight();
  }

  changeCatalogHeight() {
    this.setState({minHeight: document.querySelector('.sidebar').clientHeight});
  }

  componentWillMount() {
    this._isMounted = true;
    const filterParams = this.props.getSearchParam();
    let queryArray = [];
    for (const key of Object.keys(filterParams)) {
        if (key !== 'minPrice' && key !== 'maxPrice' && key !== 'page' && key !== 'sortBy' && key !== 'color') {
            queryArray.push({key: key, params: filterParams[key]});
        }
    }
    
    this.props.fetchProductsByParams(queryArray)
        .then(res => {
            if (this._isMounted) {
              this.setState({
                  productsWithoutFilters: res.data,
                  activeFilter: true
                })
            }
        });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  shouldComponentUpdate(nextProps) {
    return nextProps !== this.props;
  }

  componentWillReceiveProps(nextProps) {
    if (+nextProps.getSearchParam('categoryId') !== this.state.categoryId)
      this.setState({categoryId: +nextProps.getSearchParam('categoryId')})
  }

  render() {
    const curCategory = this.props.categories.filter(cat => cat.id === this.state.categoryId);
    let categoryName;
    if (this.props.getSearchParam('search')) {
      categoryName = 'Результаты поиска'
    } else if (this.props.categories.length) {
      categoryName = curCategory.length ? curCategory[0].title : 'Каталог';
    }
    return (
      <React.Fragment>
        <Breadcrumbs categoryId={this.state.categoryId} categoryName={categoryName} {...this.props} />
        <main className="product-catalogue" style={{minHeight: this.state.minHeight}}>
          {/* Сайдбар */}
          <Sidebar {...this.props} {...this.state} changeCatalogHeight={this.changeCatalogHeight.bind(this)} />
          {/*  Основной контент каталога */}
          <section className="product-catalogue-content">
            {/*  Голова каталога с названием раздела и сортировкой */}
            <section className="product-catalogue__head">
              <div className="product-catalogue__section-title">
                <h2 className="section-name">{categoryName}</h2><span className="amount"> {this.props.products.goods} товара</span>
              </div>
              <div className="product-catalogue__sort-by">
                <p className="sort-by">Сортировать</p>
                <Sorting {...this.props} />
              </div>
            </section>
            {/* Список товаров каталога */}
            <section className="product-catalogue__item-list" style={{position: 'relative'}}>
              {/* Товары */}
              <Products {...this.props} products={this.props.products ? this.props.products.data : {}} />
            </section>
            {/* Пагинация под каталогом */}            
            <Pagination {...this.props} /> 
          </section>
        </main>
        <Viewed cls={'catalogue'} fetchProductsByParams={this.props.fetchProductsByParams} />
      </React.Fragment>
    )
  }
}

Catalog.propTypes = {
  products: PropTypes.object.isRequired,
  handleFilter: PropTypes.func.isRequired,
  getSearchParam: PropTypes.func.isRequired,
  showFilter: PropTypes.func.isRequired,
  fetchProductsByParams: PropTypes.func.isRequired,
}

export default Catalog;