import React from 'react';
import PropTypes from 'prop-types';

const Sorting = ({ handleFilter, getSearchParam, showFilter, history }) => {
    const handleSort = (sortValue) => {
        const filter = showFilter(['sortBy'], [sortValue]);
        history.push(window.location.pathname + filter);
        handleFilter(filter);
    }

    return (
        <select name="sorting" id="sorting" value={getSearchParam('sortBy')} onChange={(event) => handleSort(event.target.value)}>            
            <option value="price">по цене</option>
            <option value="popularity">по популярности</option>
        </select>
    )
}

Sorting.propTypes = {
    handleFilter: PropTypes.func.isRequired,
    getSearchParam: PropTypes.func.isRequired,
    showFilter: PropTypes.func.isRequired,
    history: PropTypes.object
}

export default Sorting;