import React, { useEffect } from "react";
import {
  ErrorBoundary,
  Lang,
  Popup,
  Loading,
  useToast,
  Picker,
  Auth,
  InputCheckbox,
} from "fogito-core-ui";
import { Spinner, Tab, TabPanel, Tabs } from "@components";
import moment from "moment";
import "../../../../assets/documentation/_custom.scss";

import {
  historyPushByName,
  getFilterToLocal,
  minList,
  usersSearch,
  groupsMinList,
  templateMinList,
  timezones,
  scheduleCreate,
  snippetsParameter,
} from "@actions";
import AsyncSelect from "react-select/async";
import Select from "react-select";
import { DatePicker } from "antd";

export const Add = ({ onClose, reload, match }) => {
  const toast = useToast();

  const [state, setState] = React.useReducer(
    (prevState, newState) => ({ ...prevState, ...newState }),
    {
      loading: true,
      saveLoading: false,
      leads: [],
      users: [],
      groups: [],
      group: [],
      template: [],
      gender_id: "",
      lead_id: "",
      user_id: "",
      user_type_id: "",
      template_id: "",
      timezones: [],
      snippets: [],
      subject: "",
      message: "",
      repeatCheck: true,
      target_type: getFilterToLocal(name, "target_type") || "1",
      send_date: {
        timezone: Auth.get("timezone") || null,
      },
      repeat: {
        every: "2",
        type: "day",
        end: {
          type: "never",
          value: "",
        },
        days: [],
      },
    }
  );

  const onSubmit = async () => {
    setState({ saveLoading: true });

    if (state.saveLoading) {
      return;
    }

    let repeatModify = state.repeat.days.map((item) => item.value);

    let response = await scheduleCreate({
      target_type_id: state.target_type,
      lead_id: state.lead_id,
      user_id: state.user_id,
      group_ids: state.group,
      gender_id: state.gender_id,
      user_type_id: state.user_type_id,
      template_id: state.template_id,
      send_date: state.send_date,
      subject: state.subject,
      repeat: state.repeatCheck ? { ...state.repeat, days: repeatModify } : {},
      message: state.message,
    });
    if (response) {
      setState({ saveLoading: false });
      toast.fire({
        icon: response.status,
        title: response.description,
      });
      if (response.status === "success") {
        await reload();
        onClose();
      }
    }
  };

  const setSendDate = (newState) => {
    setState({
      send_date: {
        ...state.send_date,
        ...newState,
      },
    });
  };

  const genderList = [
    { value: "1", label: Lang.get("Male") },
    { value: "2", label: Lang.get("Female") },
    { value: "3", label: Lang.get("Other") },
  ];

  const targetTypeList = [
    { value: "1", label: Lang.get("Single lead") },
    { value: "2", label: Lang.get("Single user") },
    { value: "3", label: Lang.get("Leads") },
    { value: "4", label: Lang.get("Users") },
  ];

  const userType = [
    { value: "1", label: Lang.get("Moderator") },
    { value: "2", label: Lang.get("Employee") },
    { value: "3", label: Lang.get("Customer") },
    { value: "4", label: Lang.get("Partner") },
  ];

  const typeList = [
    { value: "day", label: Lang.get("Day") },
    { value: "week", label: Lang.get("Week") },
    { value: "month", label: Lang.get("Month") },
  ];

  const daysList = [
    { value: "1", label: Lang.get("Monday") },
    { value: "2", label: Lang.get("Tuesday") },
    { value: "3", label: Lang.get("Wednesday") },
    { value: "4", label: Lang.get("Thursday") },
    { value: "5", label: Lang.get("Friday") },
    { value: "6", label: Lang.get("Saturday") },
    { value: "7", label: Lang.get("Sunday") },
  ];

  const endList = [
    { value: "never", label: Lang.get("Never") },
    { value: "date", label: Lang.get("Date") },
    { value: "after", label: Lang.get("After") },
  ];

  const loadData = async () => {
    let leadsRes = await loadLeads();
    let usersRes = await loadUsers();
    let groupRes = await loadGroups();
    let templateRes = await loadTemplate();
    let snippetsRes = await loadSnippets();

    let timezonesRes = await timezones({
      limit: 20,
    });

    if (timezonesRes.status !== "success") {
      toast.fire({ icon: "error", title: timezonesRes.description });
    }

    setState({
      loading: false,
      leads: leadsRes,
      timezones: timezonesRes.data,
      users: usersRes,
      groups: groupRes,
      template: templateRes,
      snippets: snippetsRes,
    });
  };

  const loadLeads = async (title = "") => {
    let response = await minList({
      title,
      skip: 0,
      limit: 20,
    });

    if (response?.status === "success") {
      return response.data;
    } else {
      toast.fire({ icon: response?.status, title: response.description });
    }
    return [];
  };

  const loadUsers = async (title = "") => {
    let response = await usersSearch({
      title,
      skip: 0,
      limit: 20,
    });

    if (response?.status === "success") {
      return response.data?.map((item) => ({
        value: item.id,
        label: item.fullname,
      }));
    } else {
      toast.fire({ icon: response?.status, title: response.description });
    }
    return [];
  };

  const loadGroups = async (title = "") => {
    let response = await groupsMinList({
      title,
      skip: 0,
      limit: 20,
    });

    if (response?.status === "success") {
      return response.data;
    } else {
      toast.fire({ icon: response?.status, title: response.description });
    }

    return [];
  };

  const loadTemplate = async (title = "") => {
    let response = await templateMinList({
      title,
      skip: 0,
      limit: 20,
    });

    if (response?.status === "success") {
      return response.data;
    } else {
      toast.fire({ icon: response?.status, title: response.description });
    }
    return [];
  };

  const loadSnippets = async () => {
    let response = await snippetsParameter({
      key: "snippets",
    });
    if (response?.status === "success") {
      return response.data.snippets;
    } else {
      toast.fire({ icon: response?.status, title: response.description });
    }
    return [];
  };

  useEffect(() => {
    loadData();
  }, []);

  function today() {
    var d = new Date();
    var curr_date = d.getDate();
    var curr_month = d.getMonth() + 1;
    var curr_year = d.getFullYear();
    document.write(curr_date + "-" + curr_month + "-" + curr_year);
  }

  return (
    <ErrorBoundary>
      <Popup
        size="xl"
        show
        onClose={onClose}
        header={
          <div className="d-flex justify-content-between align-items-center w-100">
            <div>
              <button
                onClick={() => onClose()}
                className="btn btn-primary btn-block"
              >
                <i className="feather feather-chevron-left" />
              </button>
            </div>
            <h5 className="title fs-16">
              {Lang.get("Create Template")} {Lang.get(match?.params?.type)}
            </h5>
            <div>
              <button onClick={onSubmit} className="btn btn-primary px-4">
                {state.saveLoading ? (
                  <Spinner color="#fff" style={{ width: 30 }} />
                ) : (
                  Lang.get("Save")
                )}
              </button>
            </div>
          </div>
        }
      >
        {state.loading && <Loading />}

        <div style={{ minHeight: 400 }}>
          {/* Content */}

          
          <div className="row  px-2 py-3 mb-3">
            {/* Title */}
            <div className="col-lg-6 mb-4 col-md-12">
                <label className="text-muted mb-1">{Lang.get("Title")}</label>
                <input
                  className="form-control w-100"
                  placeholder={Lang.get("Title")}
                  value={state.subject}
                  maxLength={30}
                  onChange={(e) => setState({ subject: e.target.value })}
                />
              </div>

            {/*User*/}
              <div className="col-lg-6 mb-4 col-md-12">
                <label className="text-muted mb-1">{Lang.get("User")}</label>
                <div className="input-group input-group-alternative">
                  <Select
                    isClearable
                    components={{
                      Control: ({ innerProps, children, innerRef }) => {
                        return (
                          <div
                            className="input-group-prepend m-1"
                            {...innerProps}
                            ref={innerRef}
                          >
                            {children}
                          </div>
                        );
                      },
                    }}
                    value={state.users.value}
                    className="form-control form-control-alternative"
                    placeholder={Lang.get("Select")}
                    onChange={(type) => {
                      setState({ user_id: type?.value });
                      historyPushByName(
                        {
                          label: "type",
                          value: type?.value ? String(type?.value) : "",
                        },
                        name
                      );
                    }}
                    options={state.users}
                  />
                </div>
              </div>

              {/* Subject */}
              <div className="col-lg-6 mb-4 col-md-12">
                <label className="text-muted mb-1">{Lang.get("Subject")}</label>
                <input
                  className="form-control w-100"
                  placeholder={Lang.get("Subject")}
                  value={state.subject}
                  maxLength={30}
                  onChange={(e) => setState({ subject: e.target.value })}
                />
              </div>

              {/* Snippets */}
              <div className="col-12 mb-4">
              <div className="d-flex flex-column">
                <div
                  className="d-flex align-items-center mb-4 form-control-label m-0"
                  id="id_5roqfpq48"
                >
                  <label className="m-0">Snippets</label>
                  <i className="feather feather-info cursor-pointer ml-2 text-muted" />
                </div>
                <div className="d-flex justify-content-start align-items-center snippets">
                  {state.snippets.map((item, index) => (
                    <div className="snip_item" key={index}>
                      <div className="title">{item.title}</div>
                      <div className="icon">
                        <i className="feather feather-copy" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

             {/* Message */}
                <div className="col-12 pb-3">
                  <label>Message</label>
                  <textarea
                    className="form-control"
                    rows={7}
                    onChange={(e) => {
                      setState({ message: e.target.value });
                    }}
                  ></textarea>
                </div>
          </div>
        </div>
      </Popup>
    </ErrorBoundary>
  );
};
