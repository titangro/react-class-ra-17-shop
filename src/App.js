import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { createBrowserHistory, createHashHistory } from 'history';
import Header from './Header';
import Homepage from './Homepage';
import Footer from './Footer';
import Catalog from './Catalog';
import Order from './Order';
import ProductCard from './ProductCard';
import Favorite from './Favorite';
import Preloader from './Preloader';
import './css/normalize.css';
import './css/font-awesome.min.css';
import './css/style.css';

class App extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);

    this.state = {
      categories: [],
      products: {},
      filters: {},
      activeFilter: window.location.search,
      featured: [],
      cart: [],
      order: null,
      isLoading: true,
      errors: [],
    }

    this.fetchCart.bind(this);
  }

  componentWillMount() {
    this.fetchProps();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.activeFilter !== prevState.activeFilter)
      this.fetchProducts();
  }

  componentDidMount() {
    const history = createBrowserHistory({
      basename: process.env.PUBLIC_URL
    });
    this.unlisten = history.listen((location) => {
      if (location.search !== this.state.activeFilter)
        this.setState({activeFilter: location.search})
    });
  }

  componentUnMount() {
    this.unlisten();
  }

  fetchProps() {
    let categories = [], featured = [], filters = {}, products = {}, errors = [];
    Promise.all([
      /* загрузка категорий */
      this.getFetch('https://api-neto.herokuapp.com/bosa-noga/categories',
        (data) => categories = data,
        (error) => errors[errors.length] = error
      ),
      /* загрузка новинок */
      this.getFetch('https://api-neto.herokuapp.com/bosa-noga/featured',
        (data) => featured = data,
        (error) => errors[errors.length] = error
      ),
      /* загрузка фильтров */
      this.getFetch('https://api-neto.herokuapp.com/bosa-noga/filters',
        (data) => filters = data,
        (error) => errors[errors.length] = error
      ),
      /* загрузка товаров */
      this.getFetch(`https://api-neto.herokuapp.com/bosa-noga/products${this.state.activeFilter ? this.state.activeFilter : ''}`,
        (data) => products = data,
        (error) => errors[errors.length] = error,
        true
      ),
      localStorage.cart ? this.fetchCart(localStorage.cart) : []
    ])
    /* обновление state после всех запросов */
      .then(() => {
        if (categories.data.length || featured.data.length ||  Object.keys(filters.data).length || products.status === "ok")
          this.setState({categories: categories.data, featured: featured.data, filters: filters.data, products: products, isLoading: false });
        if (errors.length)
          this.setState({isLoading: false, errors: [...this.state.errors, ...errors] })
      })
  }

  fetchProducts() {
    this.setState({isLoading: true});
    let products = [], errors = [];
    //console.log(this.state.activeFilter);
    this.getFetch(`https://api-neto.herokuapp.com/bosa-noga/products${this.state.activeFilter ? this.state.activeFilter : ''}`,
      (data) => products = data,
      (error) => errors[errors.length] = error
    )
    .then(() => {
      if (products.status === "ok") {
        //console.log(22);
        this.setState({products: products, isLoading: false});
      }
      if (errors.length) {
        //console.log(23);
        this.setState({isLoading: false, errors: [...this.state.errors, ...errors] });
      }
    })
  }

  fetchActiveSubcategories(categoryId) {
    const categories = this.state.categories;    
    this.setState({isLoading: true});
    let reasons = [], types = [], seasons = [], brands = [];    
    return Promise.all(
      this.state.filters.reason.map(
        reason =>
        fetch(`https://api-neto.herokuapp.com/bosa-noga/products?categoryId=${categoryId}&reason=${reason}`)
          .then(res => res.json())
          .then(res => res.data.length ? reasons.push(reason) : '')
      )
        .concat(
          this.state.filters.type.map(
            type =>
            fetch(`https://api-neto.herokuapp.com/bosa-noga/products?categoryId=${categoryId}&type=${type}`)
              .then(res => res.json())
              .then(res => res.data.length ? types.push(type) : '')
          ),
          this.state.filters.season.map(
            season =>
            fetch(`https://api-neto.herokuapp.com/bosa-noga/products?categoryId=${categoryId}&season=${season}`)
              .then(res => res.json())
              .then(res => res.data.length ? seasons.push(season) : '')
          ),
          this.state.filters.brand.map(
            brand => {
            return fetch(`https://api-neto.herokuapp.com/bosa-noga/products?categoryId=${categoryId}&brand=${encodeURIComponent(brand)}`)
              .then(res => res.json())
              .then(res => res.data.length ? brands.push(encodeURIComponent(brand)) : '')
            }
          )          
        )
      ) .then (
        () => {
        //console.log(reasons, types, seasons, brands);
        this.setState({isLoading: false});
        return categories.length ? [
            {sort: 'reason', name: 'Повод', cls: reasons.length > 13 ? 'dropped-menu__lists_three-coloumns' : '', children: reasons},
            {sort: 'type', name: 'Категории', cls: types.length > 13 ? 'dropped-menu__lists_three-coloumns' : '', children: types},
            {sort: 'season', name: 'Сезон', cls: seasons.length > 13 ? 'dropped-menu__lists_three-coloumns' : '', children: seasons},
            {sort: 'brand', name: 'Бренды', cls: brands.length > 13 ? 'dropped-menu__lists_three-coloumns' : '', children: brands},
          ] : [];
        }
      )
  }

  fetchSizes(id) {
    let sizes;
    return this.getFetch(`https://api-neto.herokuapp.com/bosa-noga/products/${id}`,
      (data) => sizes = data.sizes,
      (error) => console.log(error)
    )
      .then(() => sizes);
  }

  fetchProductsByParams(arrayParams, withoutPaginationSortBy = false) {
    let products, errors = [];
    //console.log(arrayParams);
    const query = arrayParams.map(({key, params}) => {      
      if (Array.isArray(params))
        return params.map(param => `${key}[]=${param}`).join('&')
      else 
        return `${key}=${params}`
    });
    //console.log(query);
    const page = withoutPaginationSortBy ? '' : this.getSearchParam('page');
    const sortBy = withoutPaginationSortBy ? '' : this.getSearchParam('sortBy');
    return this.getFetch(`https://api-neto.herokuapp.com/bosa-noga/products?${query.join('&')}${sortBy ? `&sortBy=${sortBy}` : ''}${page ? `&page=${page}` : ''}`,
      (data) => products = data,
      (error) => errors[errors.length] = error
    )
      .then(() => products)
  }
  
  fetchSingleProduct(id) {
    //this.setState({isLoading: true})
    let product;
    return this.getFetch(`https://api-neto.herokuapp.com/bosa-noga/products/${id}`,
      (data) => product = data,
      (error) => console.log(error)
    )
      .then(() => {
        //this.setState({isLoading: false})
        return product
      })
  }

  fetchCart(cartId) {
    let res;
    return this.getFetch(`https://api-neto.herokuapp.com/bosa-noga/cart/${cartId}`,
      (data) => res = data,
      (error) => console.log(error)
    )
      .then(() => {
        if (res.status === 'ok') {
          this.setState({cart: res.data.products})
        } else {
          console.log(res.message);
        }     
      })
  }

  fetchOrder(cartId, formData, sumOrder) {
    const paidObj = {
      'card-online': 'onlineCard',
      'card-courier': 'offlineCard',
      'cash': 'offlineCash'
    }    

    return fetch('https://api-neto.herokuapp.com/bosa-noga/order',{
      method: 'POST',
      mode: 'cors',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: formData.get('name'),
        phone: formData.get('phone'),
        address: formData.get('delivery'),
        paymentType: paidObj[formData.get('paid')],
        cart: cartId
      })
    })
      .then(res => res.json())
      .then(res => {
        if (res.status === 'ok') {
          this.setState({cart: [], order: {data: res.data, email: formData.get('email'), sumOrder: sumOrder}});
          localStorage.cart = '';
        } else {
          console.log(res.message);
        }     
      })
  }

  handleFavorite(id) {
    const favorite = localStorage.favorite;
    let changedFavorite = [];
    if (favorite) {
      const arrayFavorites = JSON.parse(favorite);
      if (arrayFavorites.includes(id)) {
        changedFavorite = arrayFavorites.filter(item => item !== id);
      } else {
        arrayFavorites.push(id);
        changedFavorite = arrayFavorites;
      }
    } else {
      changedFavorite.push(id);
    }
    localStorage.favorite = JSON.stringify(changedFavorite);
  }

  addCart(id, size, amount) {
    if (id === 'undefined' || size === 'undefined' || amount === 'undefined')
      return console.log(`Не указан один из обязательный параметров. id:${id}, size:${size}, amount:${amount}`);
    if (localStorage.cart && localStorage.cart !== 'undefined') {
      return fetch(`https://api-neto.herokuapp.com/bosa-noga/cart/${localStorage.cart}`)
      .then(res => res.json())
      .then(
        cart => {
          if (cart.status === "ok"){
            const curProduct = cart.data.products.filter(product => product.id === id && product.size === size)[0];
            //console.log(curProduct, curProduct && amount !== 0 ? (curProduct.size === size ? curProduct.amount + amount : amount) : amount)
            return fetch(`https://api-neto.herokuapp.com/bosa-noga/cart/${localStorage.cart}`,{
              method: 'POST',
              mode: 'cors',
              credentials: 'same-origin',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                id: id,
                size: size,
                amount: curProduct && amount !== 0 ? (curProduct.size === size ? curProduct.amount + amount : amount) : amount
              })
            })
              .then(res => res.json())
              .then(res => res)
          } else {
            console.log(cart.message);
          }          
        }
      )
    } else {
      return fetch('https://api-neto.herokuapp.com/bosa-noga/cart/',{
        method: 'POST',
        mode: 'cors',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: id,
          size: size,
          amount: amount
        })
      })
        .then(res => res.json())
        .then(res => res)
    }    
  }

  deleteGoodFromCart(productId, size) {
    this.addCart(productId, size, 0)
      .then(res => {
        if (res.status === 'ok') {
          this.fetchCart(res.data.id);
        } else {
          localStorage.cart = '';
          this.setState({cart: []});
          //console.log(res.message);                
        }
      })
  }

  addViewed(id) {
    const viewed = localStorage.viewed;
    let changedViewed = [];
    if (viewed) {
      const arrayViewed = JSON.parse(viewed);
      if (!arrayViewed.includes(id)) {
        if (arrayViewed.length < 10) {
          arrayViewed.push(id);
        } else {
          arrayViewed.shift();
          arrayViewed.push(id);
        }
      }      
      changedViewed = arrayViewed;
    } else {
      changedViewed.push(id);
    }
    localStorage.viewed = JSON.stringify(changedViewed);
  }

  handleFilter(filter) {
    this.setState({activeFilter: filter ? filter : ''})
  }

  getSearchParam(param) {
    let searchParams = {};
    let keys = [];
    const arrFilter = window.location.search.slice(1).split('&').map(item => item.split('=')).filter(item => item.length > 1);

    arrFilter.forEach(item => {
      if (item[0] === 'size[]' || item[0] === 'heelSize[]') {
        if (!searchParams[item[0]])
          searchParams[item[0]] = [item[1]]
        else
          searchParams[item[0]].push(item[1]);
      } else {
        searchParams[item[0]] = item[1];
      }
      if (!keys.includes(item[0])) 
        keys.push(item[0]);
    });
    if (param === 'keys')
      return keys;
    return param && param !== undefined ? searchParams[param] : searchParams;
  }

  showFilter(paramKeys, values, withoutPaginationSortBy = false, withoutFilters = false) {
    const params = paramKeys.map(paramKey => this.getSearchParam(paramKey)).filter(item => item !== undefined && item !== null);
    const searchParams = this.getSearchParam();
    let searchKeys = !withoutPaginationSortBy ? this.getSearchParam('keys') 
      : !withoutFilters ? this.getSearchParam('keys').filter(item => item !== 'page' && item !== 'sortBy')
      : this.getSearchParam('keys').filter(item => item === 'categoryId' || item === 'search');
    searchKeys = [...searchKeys.slice(searchKeys.indexOf("search"), searchKeys.indexOf("search") + 1),...searchKeys.filter(item => item !== 'search')];
    //console.log(searchParams, params)
    if (params.length) {      
      let index = 0;
      for (const paramKey of paramKeys) {   
        if (paramKey === 'size[]' || paramKey === 'heelSize[]') {
          if( searchParams[paramKey].includes('' + values[index]) ) 
            searchParams[paramKey] = searchParams[paramKey].filter(item => +item !== values[index])
          else
            searchParams[paramKey].push('' + values[index]);
        } else {
          searchParams[paramKey] = values[index];
        }
        index++;
      }
      return `?${searchKeys.filter(key => searchParams[key] !== false).map(
          key => {
            if (key === 'size[]' || key === 'heelSize[]') {
              if (searchParams[key].length && searchParams[key][0] !== "" && searchParams[key][0])
                return `${searchParams[key].join(',').split(',').map(item => `${key}=${item}`).join('&')}`;              
            } else
              return `${key}=${searchParams[key]}`;
          }  
      ).join('&')}`
      ;
    }
    return searchKeys.length ? '?' + searchKeys.map(key => `${key}=${searchParams[key]}`).join('&') + `&${paramKeys.map((paramKey, index) => `${paramKey}=${values[index]}`).join('&')}` : `?${paramKeys.map((paramKey, index) => `${paramKey}=${values[index]}`).join('&')}`
  }

  getFetch(url, func, errFunc) {
    return fetch(url)
      .then(res => res.json())
      .then(res => {
          if (res.status === 'ok' && typeof func === 'function')
            func(res);
          else
            errFunc(res.message);
        }
      )
      .catch(err => {
        this.setState({isLoading: false, errors: [...this.state.errors, err] })
      });
  }
  
  withWrapper(Component, cls='') {
    return class extends React.Component {
      render() {
        return this.props ?
        <div className={`wrapper ${cls}`}>
          <Component {...this.props} />
        </div> :
        <div className={`wrapper ${cls}`}>
          <Component />
        </div>
      }
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    const history = createBrowserHistory({
      basename: process.env.PUBLIC_URL
    });
    const FavoriteWithWrapper = this.withWrapper(Favorite);
    const OrderWithWrapper = this.withWrapper(Order, 'order-wrapper');
    return (
      <BrowserRouter basename={process.env.PUBLIC_URL} history={history}>
        <div className="container" >
          <Preloader hidden={!this.state.isLoading} />
          <Header {...this.state} fetchSingleProduct={this.fetchSingleProduct.bind(this)} handleFilter={this.handleFilter.bind(this)} fetchActiveSubcategories={this.fetchActiveSubcategories.bind(this)} showFilter={this.showFilter.bind(this)} history={history} getSearchParam={this.getSearchParam.bind(this)} deleteGoodFromCart={this.deleteGoodFromCart.bind(this)} />                         
          <Switch>
            <Route exact path="/">
              <Homepage {...this.state} handleFavorite={this.handleFavorite} />
            </Route>
            {!this.state.isLoading ? <Route path="/catalog" history={history}>
              <Catalog {...this.state} history={history} getSearchParam={this.getSearchParam} handleFilter={this.handleFilter.bind(this)} handleFavorite={this.handleFavorite} fetchProductsByParams={this.fetchProductsByParams.bind(this)} fetchSizes={this.fetchSizes.bind(this)} showFilter={this.showFilter.bind(this)} />
            </Route> : ''}
            <Route path="/order">
              <OrderWithWrapper {...this.state} fetchSingleProduct={this.fetchSingleProduct.bind(this)} addCart={this.addCart.bind(this)} fetchCart={this.fetchCart.bind(this)} fetchOrder={this.fetchOrder.bind(this)} history={history} />
            </Route>
            <Route path="/product_card/:id">
              <ProductCard {...this.state} fetchSingleProduct={this.fetchSingleProduct.bind(this)} addCart={this.addCart.bind(this)} fetchProductsByParams={this.fetchProductsByParams.bind(this)} handleFilter={this.handleFilter.bind(this)} handleFavorite={this.handleFavorite} addViewed={this.addViewed} fetchCart={this.fetchCart.bind(this)} />
            </Route>
            {!this.state.isLoading ? <Route path="/favorite" history={history}>
              <FavoriteWithWrapper {...this.state} history={history} fetchProductsByParams={this.fetchProductsByParams.bind(this)} handleFavorite={this.handleFavorite} fetchSizes={this.fetchSizes.bind(this)} handleFilter={this.handleFilter.bind(this)} getSearchParam={this.getSearchParam} showFilter={this.showFilter.bind(this)} />
            </Route> : ''}
          </Switch>
          <Footer />
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
