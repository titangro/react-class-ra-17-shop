import React, { Component } from 'react';
import Breadcrumbs from './Breadcrumbs';
import { Link } from 'react-router-dom';
import favoriteImage from './img/product-card-pics/product-card__favorite-fill.png';
import Viewed from './Viewed';
import Similar from './Similar';
import PropTypes from 'prop-types';
//import { BrowserRouter, Route, Switch } from 'react-router-dom';

class ProductCard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      product: null,
      curImage: null,
      activeSize: null,
      cartBtn: 'В корзину',
      favorite: null,
      quantity: 1,
      error: null,
    }
  }

  componentWillMount() {
    this.fetchProduct();
  }

  /* загрузка товара по id из адресной строки */
  fetchProduct(id = null) {
    const productId = id ? id : window.location.pathname.slice(window.location.pathname.lastIndexOf('/') + 1);    
    this.props.fetchSingleProduct(productId)
      .then(({data}) => this.setState({
        product: data,
        curImage: data.images[0],
        favorite: localStorage.favorite ? (JSON.parse(localStorage.favorite).filter(id => +id === data.id).length ? true : false) : false,
        quantity: 1
      }))
  }

  componentWillUpdate(nextProps, nextState) {
    if (this.state.product && nextState.product.id !== this.state.product.id)
      this.props.addViewed(nextState.product.id);
  }

  componentWillUnmount() {
    this.props.addViewed(this.state.product.id);
  }

  /* изменение количества */
  handleQuantity(operator) {
    const quantity = this.state.quantity;
    if (operator === '+') {
      this.setState({quantity: quantity + 1})
    } else {
      if (quantity > 1)
        this.setState({quantity: quantity - 1})
    }
  }

  /* выставление выбранного размера */
  handleSize(event, item) {
    event.preventDefault();
    if (!this.state.activeSize || this.state.activeSize.size !== item.size)
      this.setState({activeSize: item, cartBtn: 'В корзину', error: null});
  }

  /* увеличение картинки товара */
  zoomImage(event) {
    event.preventDefault();
    const image = event.currentTarget.parentElement.querySelector('img');
    image.classList.toggle('hidden');
    image.style.display = image.style.display === 'none' ? 'block' : 'none';
  }

  /* Скрол наверх */
  upToCart() {
    let t;
    const top = Math.max(document.body.scrollTop, document.documentElement.scrollTop);
    if(top > 0) {
      window.scrollBy(0, ((top + 100) / -10));
      t = setTimeout(() => this.upToCart(), 20);
    } else clearTimeout(t);
    return false;
  }

  /* Мигание кнопки корзины */
  blinkingCartBtn() {
    const basketIcon = document.querySelector('.header-main__pic_basket_full');  
    let tic = 1;  
    const hiddenBlock = () => {
      basketIcon.style.display = tic === 4 ? 'block' : 'none';
    }
    const blickBlock = () => {
      basketIcon.style.display = 'block';
      setTimeout(() => hiddenBlock(), 300);
      if (tic === 4) {
        clearInterval(block);
        basketIcon.style.display = 'block';
      } else {
        tic++;
      }
    }
    hiddenBlock();
    let block = setInterval(() => blickBlock(), 600);    
  }

  handleCartBtn() {
    if (!this.state.activeSize) {
      this.setState({cartBtn: 'Выберите размер!'})
    } else {
      this.props.addCart(this.state.product.id, this.state.activeSize.size, this.state.quantity)
        .then(res => {
          console.log(res)
          if (res.status === 'ok') {
            localStorage.cart = res.data.id;
            this.props.fetchCart(res.data.id);
            this.upToCart();           
            this.blinkingCartBtn();
          } else {
            this.setState({error: res.message })
          }
        })
    }    
  }

  render() {    
    if (this.state.product) {
      const product = this.state.product;
      const categoryName = this.props.categories.length ? this.props.categories.filter(cat => cat.id === product.categoryId)[0].title : null;
      return (
      <React.Fragment>
        <Breadcrumbs categoryId={product.categoryId} handleFilter={this.props.handleFilter} categoryName={categoryName} productId={product.id} productType={product.type} productTitle={product.title} />        
        <main className="product-card">
          <section className="product-card-content">
            <h2 className="section-name">{product.title}</h2>
            <section className="product-card-content__main-screen">
              {/* Слайдер выбранного товара */}
              <section className="main-screen__favourite-product-slider">
                {product.images.length === 1 ? '' :
                <div className="favourite-product-slider">
                  {product.images.length > 3 ? 
                    <div className="favourite-product-slider__arrow favourite-product-slider__arrow_up arrow-up"></div>
                    : ''}
                  {product.images.map(
                    (image, index) => 
                    <div className="favourite-product-slider__item" key={index} style={{
                      backgroundImage: `url(${image})`,
                      backgroundSize: 'contain',
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'center'
                    }} data-image={image}>
                      <a href="#" onClick={(event) => {
                        event.preventDefault();
                        this.setState({curImage: event.currentTarget.parentElement.dataset.image})
                      }}></a>
                    </div>
                  )}
                  {product.images.length > 3 ?
                    <div className="favourite-product-slider__arrow favourite-product-slider__arrow_down arrow-down"></div>
                    : ''}
                </div>}
              </section>
              {/* Изображение выбранного товара */}
              <div className="main-screen__favourite-product-pic" style={{
                backgroundImage: `url(${this.state.curImage})`,
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center'
              }}>
                <a href="#" onClick={(event) => this.zoomImage(event)}>
                  <img src={this.state.curImage} alt={product.title} className="hidden" style={{zIndex: 1, display: 'none'}} />
                </a>
                <a href="#" onClick={(event) => this.zoomImage(event)} className="main-screen__favourite-product-pic__zoom" ></a>
              </div>
              {/* Блок информации о товаре */}
              <div className="main-screen__product-info">
                <div className="product-info-title">
                  <h2>{product.title}</h2>
                  {this.state.activeSize ? <div className="in-stock">{this.state.activeSize.available ? 'В наличии' : 'Нет в наличии'}</div> : ''}
                </div>
                <div className="product-features">
                  <table className="features-table">
                    <tbody>
                      <tr>
                        <td className="left-col">Артикул:</td>
                        <td className="right-col">{product.sku}</td>
                      </tr>
                      <tr>
                          <td className="left-col">Производитель:</td>
                          <td className="right-col"><Link to={`/catalog?categoryId=${product.categoryId}&brand=${product.brand}`} onClick={() => this.props.handleFilter(`?categoryId=${product.categoryId}&brand=${encodeURIComponent(product.brand)}`)}><span className="producer">{product.brand}</span></Link></td>
                      </tr>
                      <tr>
                          <td className="left-col">Цвет:</td>
                          <td className="right-col">{product.color}</td>
                      </tr>
                      <tr>
                          <td className="left-col">Материалы:</td>
                          <td className="right-col">{Array.isArray(product.material) ? product.material.join(', ') : product.material}</td>
                      </tr>
                      <tr>
                          <td className="left-col">Сезон:</td>
                          <td className="right-col">{product.season}</td>
                      </tr>
                      <tr>
                          <td className="left-col">Повод:</td>
                          <td className="right-col">{product.reason}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="size">Размер</p>
                <ul className="sizes">
                  {product.sizes.map(
                    (item, index) =>
                    <li className={this.state.activeSize && this.state.activeSize.size === item.size ? 'active' : ''} key={index}>
                      <a href="#" onClick={(event) => this.handleSize(event, item)}>{item.size}</a>
                    </li>
                  )}
                </ul>
                <div className="size-wrapper">
                  <a href="#"><span className="size-rule"></span><p className="size-table">Таблица размеров</p></a>
                </div>
                <a href="#" className="in-favourites-wrapper" onClick={event => {
                  event.preventDefault();
                  this.props.handleFavorite(product.id);
                  this.setState({favorite: !this.state.favorite})
                }}>
                  <div className="favourite" style={{backgroundImage: (this.state.favorite ? `url(${favoriteImage})` : '')}}></div>
                  <p className="in-favourites">{this.state.favorite ? 'В избранном' : 'В избранное'}</p>
                </a>
                <div className="basket-item__quantity">
                  <div className="basket-item__quantity-change basket-item-list__quantity-change_minus" onClick={() => this.handleQuantity('-')}>-</div>
                    {this.state.quantity}
                  <div className="basket-item__quantity-change basket-item-list__quantity-change_plus" onClick={() => this.handleQuantity('+')}>+</div>
                </div>
                <div className="price">{product.price.toLocaleString('ru-RU')} ₽</div>
                <button className={`in-basket in-basket-click ${this.state.activeSize ? '' : 'in-basket_disabled' }`} onClick={() => this.handleCartBtn()}>{this.state.cartBtn}</button>
                {this.state.error ? <div className="error" style={{position: 'relative', top: '76px', color: 'red', textAlign: 'center'}}>{this.state.error}</div> : ''}
              </div>
            </section>
          </section>
        </main>
        <Viewed cls={'card'} fetchProductsByParams={this.props.fetchProductsByParams} fetchProduct={this.fetchProduct.bind(this)} />
        <Similar productId={product.id} color={product.color} type={product.type} fetchProductsByParams={this.props.fetchProductsByParams} fetchProduct={this.fetchProduct.bind(this)} />
      </React.Fragment>
      )
    } else return <div>Данный товар не найден</div>
  }
}

ProductCard.propTypes = {
  addViewed: PropTypes.func.isRequired,
  fetchSingleProduct: PropTypes.func.isRequired,
  fetchProductsByParams: PropTypes.func.isRequired,
  handleFavorite: PropTypes.func.isRequired,
  handleFilter: PropTypes.func.isRequired,
  categories: PropTypes.arrayOf(PropTypes.object),
  addCart: PropTypes.func.isRequired
}

export default ProductCard;