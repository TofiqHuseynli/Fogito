import Swal from "sweetalert2";

export const useToast = (props) => {
  const toast = Swal.mixin({
    toast: true,
    position: "top-right",
    showConfirmButton: false,
    timer: 2000,
    ...props,
  });

  return toast;
};
