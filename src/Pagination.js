import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const Pagination = ({products, handleFilter, getSearchParam, showFilter }) => {
    let pages = [];
    for (let i = 1; i <= products.pages; i++) {
        pages.push(i);
    }
    const location = window.location.pathname.slice(window.location.pathname.lastIndexOf('/'));

    return products.status === "ok" && products.pages > 1 ? (
        <div className="product-catalogue__pagination">
            <div className="page-nav-wrapper">
                <div className="angle-back">
                    {products.page !== 1 ? <Link to={location + showFilter(['page'], [products.page - 1])} onClick={() => {
                            handleFilter(showFilter(['page'], [products.page - 1]));
                            window.scrollTo(0, 0)
                        }}></Link> : ''}
                </div>
                <ul>
                    {pages.map(
                        (page, index) =>
                        <li key={index} className={page === products.page ? 'active' : ''}>
                            <Link to={location + showFilter(['page'], [page])} onClick={() => {
                                handleFilter(showFilter(['page'], [page]));
                                window.scrollTo(0, 0)
                            }}>{page}</Link>
                        </li>
                    )}
                </ul>
                <div className="angle-forward">
                    {products.pages !== +getSearchParam('page') ? <Link to={location + showFilter(['page'], [products.page + 1])} onClick={() => {
                            handleFilter(showFilter(['page'], [products.page + 1]));
                            window.scrollTo(0, 0)
                        }}></Link> : ''}
                </div>
            </div>
        </div>
    ) : '';
}

Pagination.propTypes = {
    products: PropTypes.object.isRequired,
    handleFilter: PropTypes.func.isRequired,
    getSearchParam: PropTypes.func.isRequired,
    showFilter: PropTypes.func.isRequired,
}

export default Pagination;