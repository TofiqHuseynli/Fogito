import React from "react";
import { ErrorBoundary, Lang, } from "fogito-core-ui";
import AsyncSelect from "react-select/async";
import Select from "react-select";


export const MembersEdit = React.memo(({ state, setState, loadGroups, genderList, loadStatus }) => {

  return (
    <ErrorBoundary>
      <div className=" px-2 py-3 border">
        <div className="row   ">
          <div className="col-lg-6 mb-4 col-md-12">
            <label className="form-control-label ">
              {Lang.get("Name")}
            </label>
            <input
              className="form-control w-100"
              placeholder={Lang.get("Name")}
              value={state.firstname}
              maxLength={30}
              onChange={(e) => setState({ firstname: e.target.value })}

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

          <div className="col-lg-6 mb-4 col-md-12">
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
      </div>

      <h2 className="mt-4 mb-3 ">Contact Person:</h2>
      <div className=" px-2 py-3 border">
        <div className="row">
          <div className="col-lg-6 mb-4 col-md-12">
            <label className="form-control-label ">
              {Lang.get("First Name")}
            </label>
            <input
              className="form-control w-100"
              placeholder={Lang.get("First Name")}
              value={state.contact_person.firstname}
              maxLength={30}
              onChange={(e) => setState({
                contact_person:
                {
                  ...state.contact_person,
                  firstname: e.target.value
                }
              })}

            />
          </div>

          <div className="col-lg-6 mb-4 col-md-12">
            <label className="form-control-label ">
              {Lang.get("Last Name")}
            </label>
            <input
              className="form-control w-100"
              placeholder={Lang.get("Last Name")}
              value={state.contact_person.lastname}
              maxLength={30}
              onChange={(e) => setState({
                contact_person:
                {
                  ...state.contact_person,
                  lastname: e.target.value
                }
              })}

            />
          </div>


          <div className="col-lg-6 mb-4 col-md-12">
            <label className="form-control-label ">
              {Lang.get("E-mail")}
            </label>
            <input
              className="form-control w-100"
              placeholder={Lang.get("E-mail")}
              value={state.contact_person.email}
              onChange={(e) => setState({
                contact_person:
                {
                  ...state.contact_person,
                  email: e.target.value
                }
              })}

            />
          </div>


          <div className="col-lg-6 mb-4 col-md-12">
            <label className="form-control-label ">
              {Lang.get("Phone")}
            </label>
            <input
              className="form-control w-100"
              placeholder={Lang.get("Phone")}
              value={state.contact_person.phone}
              onChange={(e) => setState({
                contact_person:
                {
                  ...state.contact_person,
                  phone: e.target.value
                }
              })}

            />
          </div>


        </div>
      </div>
    </ErrorBoundary>
  );
});
