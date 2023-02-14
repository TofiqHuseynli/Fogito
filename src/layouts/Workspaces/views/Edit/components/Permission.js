import React from 'react';
import {
  ErrorBoundary,
  InputCheckbox,
  Loading,
  useToast,
} from 'fogito-core-ui';
import {permissionsList, permissionsSet} from '@actions';

export const Permission = React.memo(({ workspace_id, tab }) => {
  const toast = useToast();
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  const loadData = async () => {
    setLoading(true);
    let response = await permissionsList({ workspace_id });
    if (response) {
      setLoading(false);
      if (response?.status === 'success') {
        setData(response.data);
      } else {
        toast.fire({ icon: 'error', title: response?.description });
      }
    }
  };

  const onChange = async (field, value) => {
    let response = await permissionsSet({ workspace_id, value, field });
    if (response) {
      if (response?.status === 'success') {
        setData(
          data.map((item) => {
            if (field === 'set_permission' && value) {
              item.value = value;
            } else {
              if (item.key === field) {
                item.value = value;
              }
            }
            return item;
          })
        );
      } else {
        toast.fire({ icon: 'error', title: response?.description });
      }
    }
  };

  React.useEffect(() => {
    if (tab === 'permission' && workspace_id && data.length === 0){
      loadData();
    }
  }, [tab, workspace_id]);


  if (loading){
    return (
        <div className="p-4">
          <Loading />
        </div>
    )
  }

  return (
    <ErrorBoundary>
      <div className="row">
        {data?.map((item, key) => (
          <div
              key={key}
              className={`col-md-6 ${key > 1 ? 'mt-3' : ''}`}
          >
            <InputCheckbox
              label={item.title}
              checked={item.value || false}
              onChange={(e) => onChange(item.key, e.target.checked)}
            />
          </div>
        ))}
      </div>
    </ErrorBoundary>
  );
});
