import React, { Component } from 'react';
import PropTypes from 'prop-types';

class BrandFilter extends Component {
    constructor(props) {
        super(props);        

        this.state = {
            search: this.props.getSearchParam('brand') ? decodeURIComponent(this.props.getSearchParam('brand')) : '',
            brands: []
        }        
    }

    handleSearch(searchStr) {
        this.setState({
            search: searchStr,
            brands: searchStr === '' ? [] : this.props.brands.filter(item => item.toLowerCase().indexOf(searchStr.toLowerCase()) !== -1).slice(0, 5)
        });
    }

    submitSearch(event) {
        event.preventDefault();
        const filter = this.props.showFilter(['brand'], [this.state.search], true);
        this.props.history.push(window.location.pathname + filter);
        this.props.handleFilter(filter);
    }

    render() {
        return (
            <div className="sidebar__brand">
                <h3>Бренд</h3>
                <form action="" className="brand-search" onSubmit={(event) => this.submitSearch(event)}>
                    <input type="search" onChange={(event) => this.handleSearch(event.target.value)} value={this.state.search} className="brand-search" id="brand-search" placeholder="Поиск" />
                    {this.state.brands.length ? 
                        <ul style={{flexDirection: 'column', position: 'absolute', zIndex: 2, left: '21px', top: '41px'}}>
                            {this.state.brands.map(
                                (brand, index) =>
                                <li key={index} style={{margin: '10px 0', cursor: 'pointer'}} onClick={() => this.setState({search: brand, brands: []})}>{brand}</li>
                            )}                            
                        </ul>
                    : ''}                    
                    <input type="submit" value="" name="submit" className="submit" />
                </form>
            </div>
        )
    }
}

BrandFilter.propTypes = {
    getSearchParam: PropTypes.func.isRequired,
    showFilter: PropTypes.func.isRequired,
    handleFilter: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    brands: PropTypes.array.isRequired
}

export default BrandFilter;