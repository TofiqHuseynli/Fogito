//--------------Full reactive functional responsive Table component made by Rustam Fetullayev--------------//
import React from "react";
import classNames from "classnames";
import { inArray } from "@lib";
import { Lang } from "@plugins";
import { ErrorBoundary, InputCheckbox } from "@components";

export const Table = ({
    data = [],
    columns = [],
    pagination = {
      count: 0,
      skip: 0,
      limit: 10,
      limitArray: [],
      paginationItemLimit: 5,
    }, //If user will not send pagination property
    select = { selectable: false }, //If user will not send select property
    sortable = false, //If user will not send sort property
  }) => {
  let { selectable, selectedIDs, onSelect, onSelectAll } = select;
  let {
    count,
    skip,
    limit,
    limitArray,
    paginationItemLimit,
    onPaginate,
    onTake,
  } = pagination;
  let pageCount = Math.ceil(count / limit);
  let currentPage = skip / limit + 1;
  let limitCount = Math.round((paginationItemLimit - 1) / 2);

  const renderPaginationItem = (item) => {
    return (
        <li
            className={classNames("page-item", { active: item === currentPage })}
            key={item}
        >
          <a className="page-link" onClick={() => onPaginate(item - 1)}>
            {item}
          </a>
        </li>
    );
  };

  const showPagination = () => {
    if (pageCount > 1) {
      if (pageCount > paginationItemLimit) {
        if (currentPage + limitCount <= paginationItemLimit) {
          return generatePaginationArray(1, paginationItemLimit).map((item) =>
              renderPaginationItem(item)
          );
        } else if (
            currentPage + limitCount > paginationItemLimit &&
            currentPage + limitCount < pageCount
        ) {
          return generatePaginationArray(
              currentPage - limitCount,
              currentPage + limitCount
          ).map((item) => renderPaginationItem(item));
        } else if (currentPage + limitCount >= pageCount) {
          return generatePaginationArray(
              pageCount - paginationItemLimit + 1,
              pageCount
          ).map((item) => renderPaginationItem(item));
        }
      } else {
        return generatePaginationArray(1, pageCount).map((item) =>
            renderPaginationItem(item)
        );
      }
    }
  };

  const generatePaginationArray = (start, end) => {
    let arr = [];
    for (let i = start; i <= end; i++) {
      arr.push(i);
    }
    return arr;
  };

  const showRecord = () => {
    let from = parseInt(skip) + 1;
    let to = parseInt(skip) + parseInt(limit);
    return (
        <span className="text-muted ml-3">
        {Lang.get("TableShowsTotal")
            .replace("{start}", from)
            .replace("{to}", to < count ? to : count)
            .replace("{total}", count)}
      </span>
    );
  };

  const showLimitSelect = () => {
    if (limitArray && limitArray.length) {
      return (
          <select
              className="custom-select w-auto"
              value={limit}
              onChange={(e) => onTake(e.target.value)}
          >
            {limitArray.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
            ))}
          </select>
      );
    }
  };

  const showFirst = () => {
    return pageCount > paginationItemLimit &&
    currentPage >= paginationItemLimit - 1 ? (
        <li className="page-item">
          <a className="page-link" onClick={() => onPaginate(0)}>
            {Lang.get("First")}
          </a>
        </li>
    ) : null;
  };

  const showLast = () => {
    return pageCount > paginationItemLimit &&
    currentPage + limitCount < pageCount ? (
        <li className="page-item">
          <a className="page-link" onClick={() => onPaginate(pageCount - 1)}>
            {Lang.get("Last")}
          </a>
        </li>
    ) : null;
  };

  return (
      <ErrorBoundary>
        <div className="d-flex flex-wrap w-100">
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
              <tr>
                {select && selectable && (
                    <th className="text-center" style={{ width: 40 }}>
                      <InputCheckbox
                          theme="alternative"
                          checked={
                            selectedIDs.length &&
                            data.every((item) => inArray(item.id, selectedIDs))
                          }
                          onChange={onSelectAll}
                      />
                    </th>
                )}
                {columns.map((item, key) => (
                    <th
                        style={{
                          width: item.width || "auto",
                          ...(sortable && item.sort && { cursor: "pointer" }),
                        }}
                        {...(sortable &&
                            item.sort && {
                              onClick: () =>
                                  sortable.onSort({
                                    sort: item.sort,
                                    sort_type:
                                        sortable.sortType == "asc" ? "desc" : "asc",
                                  }),
                            })}
                        key={key}
                    >
                      <div
                          className={classNames("d-flex align-items-center", {
                            "justify-content-center": item.center,
                            "justify-content-start": !item.center,
                          })}
                      >
                        {item.name}
                        {sortable?.sort === item.sort && (
                            <i
                                className={classNames(
                                    "feather font-weight-bold ml-3",
                                    {
                                      "feather-arrow-up": sortable.sortType === "asc",
                                      "feather-arrow-down":
                                          sortable.sortType === "desc",
                                    }
                                )}
                            />
                        )}
                      </div>
                    </th>
                ))}
              </tr>
              </thead>
              <tbody>
              {data.length === 0 ? (
                  <tr>
                    <td colSpan={columns.length + 1} className="text-center">
                      {Lang.get("NoData")}
                    </td>
                  </tr>
              ) : (
                  data.map((item, key) => (
                      <tr key={key}>
                        {select && selectable && (
                            <td className="text-center">
                              <InputCheckbox
                                  theme="alternative"
                                  checked={inArray(item.id, selectedIDs)}
                                  onChange={() => onSelect(item.id)}
                              />
                            </td>
                        )}
                        {columns.map((column, key) => (
                            <td
                                className={classNames({
                                  "text-center p-0": column.center,
                                  "text-left p-0": !column.center,
                                })}
                                key={key}
                            >
                              {column.render
                                  ? column.render(
                                      column.key === "actions" ? item : item[column.key]
                                  )
                                  : item[column.key]}
                            </td>
                        ))}
                      </tr>
                  ))
              )}
              </tbody>
            </table>
          </div>
          {pagination && (
              <React.Fragment>
                <div className="col-md-6 d-flex align-items-center pl-0">
                  {showLimitSelect()}
                  {showRecord()}
                </div>
                <div className="col-md-6 d-flex align-items-center justify-content-end mt-3 mt-md-0 pr-0">
                  <ul className="pagination">
                    {showFirst()}
                    {showPagination()}
                    {showLast()}
                  </ul>
                </div>
              </React.Fragment>
          )}
        </div>
      </ErrorBoundary>
  );
};