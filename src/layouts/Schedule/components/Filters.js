import React, { useState } from "react";
import AsyncSelect from "react-select/async";
import Select from "react-select";
import Tooltip from "antd/lib/tooltip";
import DatePicker from "antd/lib/date-picker";
import moment from "moment";
import {
  onFilterStorageBySection,
  historyPushByName,
  groupsMinList,
} from "@actions";
import { InputLazy, Auth, Lang } from "fogito-core-ui";
import FilterBar from "fogito-core-ui/build/components/common/FilterBar";

export const Filters = ({ show, name, filters, state, setState }) => {

  const defaultModel = {
    range: { start: null, end: null, },
    receiver_type: null,
    archived: null,
    target_type: null,
    group: null,
    template_id: null
  };

  const [params, setParams] = React.useReducer(
    (prevState, newState) => ({ ...prevState, ...newState }),
    filters
  );
  const [list, setList] = React.useReducer(
    (prevState, newState) => ({ ...prevState, ...newState }),
    { used_currencies: [], type: [] }
  );


  const dateFilters = [
    {
      label: Lang.get("CreatedAt"),
      value: "created_at",
    },
    {
      label: Lang.get("OverdueAt"),
      value: "overdue_at",
    },
    {
      label: Lang.get("PaidAt"),
      value: "paid_at",
    },
  ];



  const archivedList = [
    { value: '0', label: Lang.get('Active') },
    { value: '1', label: Lang.get('Archived') },
  ]

  const targetTypeList = [
    { value: '1', label: Lang.get('Single lead') },
    { value: '2', label: Lang.get('Single user') },
    { value: '3', label: Lang.get('Leads') },
    { value: '4', label: Lang.get('Users') }
  ]



  const onSearch = () => {
    if (JSON.stringify(params) !== JSON.stringify(filters)) {
      setState("filters", params);
    }
    setState("filter", false);
  };


  React.useEffect(() => {
    if (show) {


    }
  }, [show]);

  React.useEffect(() => {
    setParams(filters);
  }, [filters]);

  React.useEffect(() => {
    setList(filters);
  }, [filters]);

  return (
    <FilterBar
      show={show}
      onClose={onSearch}
      onSearch={onSearch}
      onClear={() => {
        setParams(defaultModel);
        setState("filters", defaultModel);
        setState("filter", false);
        onFilterStorageBySection(name);
      }}
    >
      <div className='row'>
        {/* Date */}
        <div className='col-12 mb-2'>
          <label className='text-muted mb-1'>{Lang.get("Date")}</label>
          <div className='input-group input-group-alternative'>
            <div className='input-group-prepend'>
              <Tooltip
                title={<div className='fw-normal'>{Lang.get("Today")}</div>}
              >
                <div
                  className='input-group-text border__right cursor-pointer'
                  onClick={() => {
                    setParams({
                      range: {
                        start: moment().format("YYYY-MM-DD"),
                        end: moment().format("YYYY-MM-DD"),
                      },
                    });
                    historyPushByName(
                      {
                        label: "date",
                        value: `${moment().unix()}T${moment().unix() || ""}`,
                      },
                      name
                    );
                  }}
                >
                  <i className='feather feather-type text-primary fs-16' />
                </div>
              </Tooltip>
            </div>
            <DatePicker.RangePicker
              allowEmpty={[true, true]}
              value={[
                params.range.start
                  ? moment(params.range.start, "YYYY-MM-DD")
                  : "",
                params.range.end ? moment(params.range.end, "YYYY-MM-DD") : "",
              ]}
              onChange={(date, dateString) => {
                setParams({
                  range: {
                    start: dateString[0],
                    end: dateString[1],
                  },
                });
                if (dateString[0] !== "" && dateString[1] !== "") {
                  historyPushByName(
                    {
                      label: "date",
                      value: `${moment(dateString[0]).unix()}T${moment(dateString[1]).unix() || ""
                        }`,
                    },
                    name
                  );
                } else {
                  historyPushByName(
                    {
                      label: "date",
                      value: "",
                    },
                    name
                  );
                }
              }}
              placeholder={[Lang.get("StartDate"), Lang.get("EndDate")]}
              className='form-control'
            />
          </div>
        </div>


        {/*Type */}
        <div className='col-12 mb-2'>
          <label className='text-muted mb-1'>{Lang.get("Type")}</label>
          <div className='input-group input-group-alternative'>
            <Select
              isClearable
              components={{
                Control: ({ innerProps, children, innerRef }) => {
                  return (
                    <div
                      className='input-group-prepend m-1'
                      {...innerProps}
                      ref={innerRef}
                    >
                      {children}
                    </div>
                  );
                },
              }}
              value={archivedList.find((type) => type.value == params.archived)}
              className='form-control form-control-alternative'
              placeholder={Lang.get("Select")}
              onChange={(type) => {
                setParams({ archived: type?.value });
                historyPushByName(
                  {
                    label: "archived",
                    value: type?.value ? String(type?.value) : "",
                  },
                  name
                );
              }}
              options={archivedList}
            />
          </div>
        </div>

        {/*Target Type*/}
        <div className='col-12 mb-2'>
          <label className='text-muted mb-1'>{Lang.get("Target Type")}</label>
          <div className='input-group input-group-alternative'>
            <Select
              isClearable
              components={{
                Control: ({ innerProps, children, innerRef }) => {
                  return (
                    <div
                      className='input-group-prepend m-1'
                      {...innerProps}
                      ref={innerRef}
                    >
                      {children}
                    </div>
                  );
                },
              }}
              value={targetTypeList.find((type) => type.value == params.target_type)}
              className='form-control form-control-alternative'
              placeholder={Lang.get("Select")}
              onChange={(type) => {
                setParams({ target_type: type?.value });
                historyPushByName(
                  {
                    label: "target_type",
                    value: type?.value ? String(type?.value) : "",
                  },
                  name
                );
              }}
              options={targetTypeList}
            />
          </div>
        </div>

        {/* Group */}
        <div className='col-12 mb-2'>
          <label className='text-muted mb-1'>{Lang.get("Group")}</label>
          <div className='input-group input-group-alternative'>
            <Select
              isClearable
              components={{
                Control: ({ innerProps, children, innerRef }) => {
                  return (
                    <div
                      className='input-group-prepend m-1'
                      {...innerProps}
                      ref={innerRef}
                    >
                      {children}
                    </div>
                  );
                },
              }}
              value={state.group.find((type) => type.value == params.group)}
              className='form-control form-control-alternative'
              placeholder={Lang.get("Select")}
              onChange={(type) => {
                setParams({ group: type?.value });
                historyPushByName(
                  {
                    label: "group",
                    value: type?.value ? String(type?.value) : "",
                  },
                  name
                );
              }}
              options={state.group}
            />
          </div>
        </div>


        {/* Template */}
        <div className='col-12 mb-2'>
          <label className='text-muted mb-1'>{Lang.get("Template")}</label>
          <div className='input-group input-group-alternative'>
            <Select
              isClearable
              components={{
                Control: ({ innerProps, children, innerRef }) => {
                  return (
                    <div
                      className='input-group-prepend m-1'
                      {...innerProps}
                      ref={innerRef}
                    >
                      {children}
                    </div>
                  );
                },
              }}
              value={state.template.find((type) => type.value == params.template_id)}
              className='form-control form-control-alternative'
              placeholder={Lang.get("Select")}
              onChange={(type) => {
                setParams({ template_id: type?.value });
                historyPushByName(
                  {
                    label: "template",
                    value: type?.value ? String(type?.value) : "",
                  },
                  name
                );
              }}
              options={state.template}
            />
          </div>
        </div>




      </div>
    </FilterBar>
  );
};
