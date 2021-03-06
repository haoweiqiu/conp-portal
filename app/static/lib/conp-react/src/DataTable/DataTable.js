import * as R from "ramda";
import React, { useState } from "react";
import PropTypes from "prop-types";

const DataTable = ({
  authorized,
  sortKeys,
  filterKeys,
  elements,
  imagePath,
  total,
  renderElement,
  query,
  setQuery
}) => {
  const [filters, setFilters] = useState([
    {
      key: "modalities",
      values: query.modalities || []
    },
    {
      key: "formats",
      values: query.formats || []
    }
  ]);

  const handleChange = (event) => {
    const e = event.target.value;
    const filter = e.split(".");
    const newFilters = filters;
    newFilters.forEach(f => {
      if (f.key === filter[0]) {
        if (f.values.includes(filter[1])) {
          f.values.splice(f.values.indexOf(filter[1]), 1);
        }
        else {
          f.values.push(filter[1])
        }
      }
    })
    setFilters(newFilters);
    setQuery({
      ...query,
      modalities: filters.filter(f => f["key"] === "modalities")[0].values,
      formats: filters.filter(f => f["key"] === "formats")[0].values,
      page: 1
    })
  }

  const handleMaxPerPageChange = (event) => {
    const value = event.target.value;
    console.log(value);
    setQuery({
      ...query,
      max_per_page: value,
      limit: value,
      page: 1
    })
  }

  return (
    <div className="search-dataset-table" cellSpacing={0}>
      <div className="searchbar col-12 d-flex p-2">
        <div className="d-flex dropdown">
          <label className="dropdown-label m-2">Sort By: </label>
          <select
            className="btn btn-outline-secondary dropdown-toggle dropdown-select"
            value={query.sortKey}
            onChange={e =>
              setQuery({ ...query, sortKey: e.currentTarget.value, page: 1 })
            }
          >
            {sortKeys.map(({ key: sortKey, label }, i) => (
              <option className="dropdown-item" key={i} value={sortKey}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div className="input-group m-2">
          <input
            className="form-control p-2"
            type="text"
            placeholder="Search"
            aria-label="Search"
            value={query.search}
            onChange={e =>
              setQuery({ ...query, search: e.currentTarget.value, page: 1 })
            }
          />
          <span className="input-group-append">
            <span className="input-group-text" id="basic-addon2">
              <i className="fa fa-search" />
            </span>
          </span>
        </div>
      </div>
      <div className="d-flex justify-content-between">
        <div className="d-flex p-2 justify-content-start align-items-center">
          {elements.length} results displayed of {total}. (Maximum results per page
              <span className="dropdown p-2">
            <button className="btn btn-secondary dropdown-toggle p-2" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              {query.max_per_page}
            </button>
            <div className="dropdown-menu" style={{ minWidth: '5rem' }}>
              <div key="max_per_page_5" className="dropdown-item p-0">
                <button type="button" className="btn btn-light p-1" value={5} id={"max_per_page." + 5} onClick={handleMaxPerPageChange}>
                  5
                    </button>
              </div>
              <div key="max_per_page_10" className="dropdown-item p-0">
                <button type="button" className="btn btn-light p-1" value={10} id={"max_per_page." + 10} onClick={handleMaxPerPageChange}>
                  10
                    </button>
              </div>
              <div key="max_per_page_15" className="dropdown-item p-0">
                <button type="button" className="btn btn-light p-1" value={15} id={"max_per_page." + 15} onClick={handleMaxPerPageChange}>
                  15
                    </button>
              </div>
              <div key="max_per_page_20" className="dropdown-item p-0">
                <button type="button" className="btn btn-light p-1" value={20} id={"max_per_page." + 20} onClick={handleMaxPerPageChange}>
                  20
                    </button>
              </div>
            </div>
          </span>)
          </div>
        {renderElement.name === "DatasetElement" ?
          <div className="d-flex p-2 justify-content-end">
            <div className="dropdown p-2">
              <button className="btn btn-secondary dropdown-toggle p-2" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" data-display="static">
                Modality:
              </button>
              <div className="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton">
                {filterKeys.filter(f => f["key"] === "modalities").length > 0 ?
                  filterKeys.filter(f => f["key"] === "modalities")[0]["values"].map(modality => (
                    modality !== '' ?
                      <div key={modality.id} className="dropdown-item ml-2">
                        <input className="form-check-input" type="checkbox" checked={filters.filter(f=>f["key"] === "modalities")[0]["values"].includes(modality)} value={"modalities." + modality} id={"filter" + modality} onChange={handleChange} />
                        <label className="form-check-label" htmlFor={"filter" + modality}>
                          {modality}
                        </label>
                      </div>
                      : null
                  ))
                  : null}
              </div>
            </div>
            <div className="dropdown p-2">
              <button className="btn btn-secondary dropdown-toggle p-2" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" data-display="static">
                File Format:
              </button>
              <div className="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton">
                {filterKeys.filter(f => f["key"] === "formats").length > 0 ?
                  filterKeys.filter(f => f["key"] === "formats")[0]["values"].map(format => (
                    format !== '' ?
                      <div key={format.id} className="dropdown-item ml-2">
                        <input className="form-check-input" type="checkbox" checked={filters.filter(f=>f["key"] === "formats")[0]["values"].includes(format)} value={"formats." + format} id={"filter" + format} onChange={handleChange} />
                        <label className="form-check-label" htmlFor={"filter" + format}>
                          {format}
                        </label>
                      </div>
                      : null
                  ))
                  : null}
              </div>
            </div>
          </div>
          : null}
      </div>
      {elements.map((element, i) => (
        <div key={"" + element.id}>
          {React.createElement(renderElement, { ...element, authorized, imagePath })}
        </div>
      ))}
      <div className="search-dataset-footer d-flex align-items-center p-2">
        <div className="btn-group">
          <div className="btn btn-outline-dark"
            onClick={e =>
              setQuery({ ...query, page: 1 })
            }>&lt;&lt;</div>
          <div className="btn btn-outline-dark"
            onClick={e =>
              setQuery({ ...query, page: Math.max(1, query.page - 1) })
            }> &lt; </div>
          {R.range(1, Math.ceil(total / query.max_per_page) + 1).map(
            (page, i) => (
              <div className={page === query.page ? "btn btn-dark" : "btn btn-outline-dark"}
                onClick={e =>
                  setQuery({ ...query, page: page })
                }
                key={i}>
                {page}
              </div>
            )
          )}
          <div className="btn btn-outline-dark"
            onClick={e =>
              setQuery({ ...query, page: Math.min(query.page + 1, Math.ceil(total / query.max_per_page)) })
            }
          >
            &gt;
          </div>
          <div className="btn btn-outline-dark"
            onClick={e =>
              setQuery({ ...query, page: Math.ceil(total / query.max_per_page) })
            }
          >
            &gt;&gt;
          </div>
        </div>
      </div>
    </div>
  );
};


DataTable.propTypes = {
  authorized: PropTypes.bool,
  sortKeys: PropTypes.arrayOf(
    PropTypes.shape({ key: PropTypes.string, label: PropTypes.string })
  ),
  elements: PropTypes.arrayOf(PropTypes.object),
  imagePath: PropTypes.string,
  total: PropTypes.number,
  renderElement: PropTypes.func,
  query: PropTypes.shape({
    search: PropTypes.string,
    sortKey: PropTypes.string,
    page: PropTypes.number,
    max_per_page: PropTypes.number,
    sortComparitor: PropTypes.string,
    cursor: PropTypes.number,
    limit: PropTypes.number
  }),
  setQuery: PropTypes.func
};

DataTable.defaultProps = {
  sortKeys: [],
  filterKeys: [
    {
      key: "modalities",
      values: []
    },
    {
      key: "formats",
      values: []
    }
  ],
  elements: [],
  total: 0,
  imagePath: 'static/img/'
};

export default DataTable;
