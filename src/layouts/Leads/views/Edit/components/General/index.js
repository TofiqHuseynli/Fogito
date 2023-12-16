import React from "react";
import { ErrorBoundary, Lang, } from "fogito-core-ui";
import AsyncSelect from "react-select/async";
import Select from "react-select";
import Item from "antd/lib/list/Item";


export const GeneralEdit = ({ state, setState, loadGroups, genderList, loadStatus, }) => {



  return (
    <ErrorBoundary>
      <div className="row  px-2 py-3">
        <div className="col-lg-6 mb-4 col-md-12">
          <label className="form-control-label ">
            {Lang.get("First Name")}
          </label>
          <input
            className="form-control w-100"
            placeholder={Lang.get("First Name")}
            value={state.firstname}
            maxLength={30}
            onChange={(e) => setState({ firstname: e.target.value })}

          />
        </div>

        <div className="col-lg-6 mb-4 col-md-12">
          <label className="form-control-label ">
            {Lang.get("Last Name")}
          </label>
          <input
            className="form-control w-100"
            placeholder={Lang.get("Last Name")}
            value={state.lastname}
            maxLength={30}
            onChange={(e) => setState({ lastname: e.target.value })}

          />
        </div>

        <div className="col-lg-6 mb-4 col-md-12">
          <label className="form-control-label ">
            {Lang.get("Gender")}
          </label>
          <Select
            className='form-control'
            value={genderList.find((gender) => gender.value == state.gender_id)}
            onChange={(e) => { setState({ gender_id: e ? e.value : "" }) }}
            options={genderList}
          />

        </div>





        <div className="col-lg-6 mb-4 col-md-12">
          <label className="form-control-label ">
            {Lang.get("E-mail")}
          </label>
          <input
            className="form-control w-100"
            placeholder={Lang.get("E-mail")}
            value={state.email}
            maxLength={30}
            onChange={(e) => setState({ email: e.target.value })}

          />
        </div>

        <div className="col-lg-6 mb-4 col-md-12 ">
          <label className="form-control-label ">
            {Lang.get("Group")}
          </label>
          <AsyncSelect
            isMulti
            isClearable
            cacheOptions
            defaultOptions={state.grpList}
            loadOptions={loadGroups}
            placeholder={Lang.get("Group")}
            value={state.groups}
            className="form-control h-auto"
            onChange={(e) =>
              setState({ groups: e ? e : [] })
            }
          />
        </div>

        <div className="col-lg-6 mb-4 col-md-12">
          <label className="form-control-label ">
            {Lang.get("Phone")}
          </label>
          <input
            className="form-control w-100"
            placeholder={Lang.get("Phone")}
            value={state.phone}
            maxLength={30}
            onChange={(e) => setState({ phone: e.target.value })}

          />
        </div>



        <div className="col-lg-6 mb-4 col-md-12">
          <label className="form-control-label ">
            {Lang.get("Status")}
          </label>
          <AsyncSelect
            isClearable
            cacheOptions
            defaultOptions={state.statusList}
            loadOptions={loadStatus}
            placeholder={Lang.get("Status")}
            value={state.status}
            className="form-control"
            onChange={(e) =>
              setState({ status: e ? e : {} })
            }
          />
        </div>




      </div>
    </ErrorBoundary>
  );
};
