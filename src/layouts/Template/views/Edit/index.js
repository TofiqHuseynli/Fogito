import React, { useEffect } from "react";
import {
  ErrorBoundary,
  Lang,
  Popup,
  Loading,
  useToast,
} from "fogito-core-ui";
import { Spinner, WYSIWYGEditor } from "@components";
import {
  usersSearch,
  timezones,
  snippetsParameter,
  templateInfo,
  templateUpdate,
} from "@actions";
import Select from "react-select";
import { Controller, useForm } from "react-hook-form";
import {useParams} from "react-router-dom";

export const Edit = ({ onClose, reload, match }) => {
  const toast = useToast();
  let urlParams = useParams();

  const [state, setState] = React.useReducer(
    (prevState, newState) => ({ ...prevState, ...newState }),
    {
      id: urlParams?.id,
      loading: true,
      saveLoading: false,
        owners: [],
        owner: {},
        snippets: [],
        title: "",
        subject: "",
        message: "",
        repeatCheck: true,
     
    }
  );

  const onSubmit = async () => {
    setState({ saveLoading: true });
    if (state.saveLoading) {
      return;
    }
    let response = await templateUpdate({
      id: state.id || null,
      owner: state.owner || null,
      title: state.title || "",
      subject: state.subject || "",
      message: state.message || "",
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

  const loadData = async () => {
    let snippetsRes = await loadSnippets();
    let ownersRes = await loadOwners();
    let response = await templateInfo({id: state.id});
    let timezonesRes = await timezones({
    
      limit: 20,
    });

    if (timezonesRes.status !== "success") {
      toast.fire({ icon: "error", title: timezonesRes.description });
    }
    if(response.status == "success"){
        setState({
            loading: false,
            snippets: snippetsRes,
            owners: ownersRes,
            title: response.data?.title,
            owner: response.data?.owner,
            subject: response.data?.subject,
            message: response.data?.message
          });
        
    }
  
  };

  const loadOwners = async (title = "") => {
    let response = await usersSearch({
      title,
      skip: 0,
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

  const { control } = useForm({
    mode: "onChange",
  });

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
          <div className="row  px-2 py-3 mb-3">
            {/* Title */}
            <div className="col-lg-6 mb-4 col-md-12">
              <label className="text-muted mb-1">{Lang.get("Title")}</label>
              <input
                className="form-control w-100"
                placeholder={Lang.get("Title")}
                value={state.title}
                maxLength={30}
                onChange={(e) => setState({ title: e.target.value })}
              />
            </div>

            {/*Owner*/}
            <div className="col-lg-6 mb-4 col-md-12">
              <label className="text-muted mb-1">{Lang.get("Owner")}</label>
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
                  value={state.owner}
                  className="form-control form-control-alternative"
                  placeholder={Lang.get("Owner")}
                  onChange={(owner) => {
                    setState({ owner });
                  }}
                  options={state.owners}
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
            <div className="form-group col-12">
              <label className="form-control-label">
                {Lang.get("Message")}
              </label>
              <Controller
                as={<WYSIWYGEditor defaultValue={state.message} />}
                name="editor_content"
                control={control}
                onChange={(data) =>
                  setState({  message: data[0] })
                }
              />
            </div>
          </div>
        </div>
      </Popup>
    </ErrorBoundary>
  );
};
