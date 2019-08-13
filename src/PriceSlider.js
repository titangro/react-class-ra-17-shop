import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { debounce } from "lodash";

class PriceSlider extends Component { 
    constructor(props) {
        super(props);

        this.state = {
            minPrice: this.props.getSearchParam('minPrice') ? +this.props.getSearchParam('minPrice') : 0,
            maxPrice: this.props.getSearchParam('maxPrice') && +this.props.getSearchParam('maxPrice') <= (this.props.productsWithoutFilters[0] ? this.props.productsWithoutFilters[0].price : 0) ? +this.props.getSearchParam('maxPrice') 
                : this.props.productsWithoutFilters.length ? Math.ceil(this.props.productsWithoutFilters[0].price / 100) * 100 : 0,
            max: this.props.productsWithoutFilters.length ? this.props.productsWithoutFilters[0].price : 0,
            activeCircle: false,
            circlePos: null
        }

        this.timeout = 200;
        this.activeTimeout = false;
        
        this.changeInput.bind(this);
        this.movePriceSlider.bind(this);
        this.changeInputFromMouse.bind(this);
        this.activateSlider.bind(this);
        this.deactivateSlider.bind(this);
    }

    componentWillUpdate(nextProps, nextState) {
        if ((!this.state.activeCircle && (this.state.minPrice !== nextState.minPrice || this.state.maxPrice !== nextState.maxPrice)) || this.state.activeCircle && this.state.activeCircle !== nextState.activeCircle) {
            this.updatePriceFilter(nextState);
        }
    }

    componentWillUnmount() {      
        this.updatePriceFilter.cancel();
        this.changeInputFromMouse.cancel();    
    }

    updatePriceFilter = debounce((nextState) => {
        const filter = this.props.showFilter(['minPrice', 'maxPrice'], [nextState.minPrice, nextState.maxPrice], true);
        this.props.history.push(window.location.pathname + filter);
        this.props.handleFilter(filter);
    }, 500)

    /* Событие при изменение значения инпута */
    changeInput(node, val = null) {
        const value = val ? val : node.value;
        if (node.classList.contains('input-1')) {
            if (value === '')
                this.setState({minPrice: 0});
            else if (+value.replace(/\D+/g, '') > this.state.maxPrice)
                this.setState({minPrice: this.state.maxPrice});
            else
                this.setState({minPrice: +value.replace(/\D+/g, '')});
        } else {
            if (value === '' || value > this.state.max)
                this.setState({maxPrice: this.state.max});
            else if (+value.replace(/\D+/g, '') < this.state.minPrice)
                this.setState({maxPrice: this.state.minPrice});
            else
                this.setState({maxPrice: +value.replace(/\D+/g, '')});
        }
    }

    /* Изменение слайдера цены относительно инпутов */
    movePriceSlider(side) {
        if (side === 'left')
            return this.state.max ? Math.floor(215 / this.state.max * this.state.minPrice) : 0;
        else
            return this.state.max ? Math.floor(215 / this.state.max * (this.state.max - this.state.maxPrice)) : 0;
    }

    /* Изменение слайдера цены по движению мыши */
    changeInputFromMouse = debounce((event) => {
        if (this.state.activeCircle) {
            const isFirstCircle = event.target.classList.contains('circle-1');
            const node = isFirstCircle ? this.input1 : this.input2;
            const delta = event.nativeEvent.x - this.state.circlePos;
            const curValue = isFirstCircle ? this.state.minPrice : this.state.maxPrice;

            this.changeInput(node, '' + (curValue + Math.round(delta * this.state.max / 240 / 4 / 100) * 100) );
        }
    }, this.timeout)

    activateSlider(event) {
        this.activeTimeout = true;
        this.setState({activeCircle: true, circlePos: event.nativeEvent.x});
    }

    deactivateSlider() {
        this.activeTimeout = false;
        this.setState({activeCircle: false});
    }

    render() {        
        const width = 240 - this.movePriceSlider('left') - this.movePriceSlider('right') - 25;
        return ( 
            <div className="price-slider"
                onMouseUp={() => this.deactivateSlider()}
                onMouseLeave={() => this.deactivateSlider()}>
                <div className="circle-container">
                    <div className="circle-1" style={{left: `${this.movePriceSlider('left')}px`}}
                        onMouseDown={(event) => this.activateSlider(event)}
                        onMouseMove={(event) => {
                            event.persist();
                            this.changeInputFromMouse(event);
                        }}                        
                        ></div>
                    <div className="line-white"></div>
                    <div className="line-colored" style={{left: `${this.movePriceSlider('left') + 25}px`, width: `${width}px`}}></div>
                    <div className="circle-2" style={{right: `${this.movePriceSlider('right')}px`}} 
                        onMouseDown={(event) => this.activateSlider(event)}
                        onMouseMove={(event) => {
                            event.persist();
                            this.changeInputFromMouse(event);
                        }}></div>
                </div>
                <div className="counter">
                    <input type="text" className="input-1" ref={(input) => { this.input1 = input; }} value={this.state.minPrice} onChange={(event) => this.changeInput(event.target)} />
                    <div className="input-separator"></div>
                    <input type="text" className="input-2" ref={(input) => { this.input2 = input; }} value={this.state.maxPrice} onChange={(event) => this.changeInput(event.target)} />
                </div>
            </div>
        )
    }
}

PriceSlider.propTypes = {
    handleFilter: PropTypes.func.isRequired,
    getSearchParam: PropTypes.func.isRequired,    
    showFilter: PropTypes.func.isRequired,
    productsWithoutFilters: PropTypes.arrayOf(PropTypes.shape({
        price: PropTypes.number
    })).isRequired,
    history: PropTypes.object.isRequired
}

export default PriceSlider;