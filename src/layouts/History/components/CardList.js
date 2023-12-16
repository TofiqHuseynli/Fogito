import React, { useEffect, useState } from "react";
import { Lang, useToast, ErrorBoundary } from "fogito-core-ui";
import moment from "moment";
import { historyEmailtotal, historyList, historyPushByName, invoiceTotals } from "@actions";

export const CardList = ({ state, setState }) => {
  const toast = useToast();

  const loadEmail = async () => {
    let response = await historyEmailtotal({
    });
    if (response?.status === "success") {
       return setState({emailTotal:response});
    } else {
        toast.fire({ icon: response?.status, title: response.description });
    }
    return {};
};

useEffect(()=>{
  loadEmail()
},[])
  

  
  const onAction = (target) => {
    if (state.filters.activeCard === target) {
      return false;
    }
    if (target === "0") {
      setState({
        filters: { ...state.filters, activeCard: target, opened: 0, delivered: 0, not_delivered: 0 },
      });
      historyPushByName(
        {
          label: "status",
          value: "",
        },
        "Invoices"
      );
    } else {
      setState({
        filters: {
          ...state.filters,
          activeCard: target,
          opened: target === "1" ? true : 0,
          delivered: target === "2" ? true : 0,
          not_delivered: target === "3" ? true : 0,
        },
      });
      historyPushByName(
        {
          label: "status",
          // value: String(
          //   state.statuses.find((status) => status.id == target)?.id
          // ),
        },
        "Invoices"
      );
    }
  };




  return (
    <ErrorBoundary>
      <div className='card-deck mb-3 total-cards'>
        {/* Total */}
        <div
          className={`card cursor-pointer ${state.filters.activeCard === "0"
            ? "border border-primary"
            : "border border-transparent"
            }`}
          onClick={() => {
            onAction("0");
          }}
        >
          <div className='card-body py-3 px-3'>
            <div className='w-100 d-flex justify-content-between align-items-center'>
              <div
                style={{
                  width: 45,
                  height: 45,
                  borderRadius: "50%",
                }}
                className='d-flex justify-content-center align-items-center'
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36"
                  fill="none"><path d="M33 18H24L21 22.5H15L12 18H3" stroke="#AB77E8" strokeWidth="3"
                    strokeLinecap="round" strokeLinejoin="round"></path>
                  <path d="M8.175 7.665L3 18V27C3 27.7956 3.31607 28.5587
                   3.87868 29.1213C4.44129 29.6839 5.20435 30 6 30H30C30.7956
                    30 31.5587 29.6839 32.1213 29.1213C32.6839 28.5587 33 27.7956
                     33 27V18L27.825 7.665C27.5766 7.16518 27.1938 6.74456 26.7194 
                     6.45042C26.2451 6.15628 25.6981 6.0003 25.14 6H10.86C10.3019 6.0003 
                     9.7549 6.15628 9.28057 6.45042C8.80624 6.74456 8.42337 7.16518 8.175 7.665Z"
                    stroke="#AB77E8"
                    strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"></path>
                </svg>
              </div>
              <div className="d-flex flex-column align-items-end"><div className="fs-18">{state.emailTotal?.count}</div>
                <span className="fs-13 text-muted">Total Emails</span></div>

            </div>

          </div>
        </div>
        {/* Opened */}
        <div
          className={`card cursor-pointer ${state.filters.activeCard === "1"
            ? "border border-primary"
            : "border border-transparent"
            }`}
          onClick={() => {
            onAction("1");

          }}
        >
          <div className='card-body py-3 px-3'>
            <div className='w-100 d-flex justify-content-between align-items-center'>
              <div
                style={{
                  width: 45,
                  height: 45,
                  borderRadius: "50%",
                }}
                className='d-flex justify-content-center align-items-center'
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 34 34" fill="none"><g clipPath="url(#clip0_2643_6852)"><path d="M31.8169 11.475L22.0079 2.07402C20.6786 0.758642 18.8851 0.019068 17.015 0.0150918C15.1449 0.0111156 13.3483 0.743057 12.0133 2.05277L2.18167 11.475C1.49404 12.1373 0.946563 12.9311 0.571779 13.8091C0.196995 14.6872 0.00255032 15.6317 0 16.5864L0 26.9167C0.00224946 28.7946 0.749249 30.595 2.07714 31.9229C3.40504 33.2508 5.20541 33.9978 7.08333 34H26.9167C28.7946 33.9978 30.595 33.2508 31.9229 31.9229C33.2508 30.595 33.9977 28.7946 34 26.9167V16.5864C33.9975 15.6315 33.8029 14.6869 33.4279 13.8088C33.0529 12.9307 32.505 12.137 31.8169 11.475ZM13.9952 4.07719C14.7986 3.28101 15.885 2.83621 17.016 2.84046C18.147 2.84471 19.2301 3.29767 20.0274 4.09985L29.5857 13.2572L20.0047 22.8395C19.1949 23.6115 18.1189 24.0422 17 24.0422C15.8811 24.0422 14.8051 23.6115 13.9952 22.8395L4.41292 13.2572L13.9952 4.07719ZM31.1667 26.9167C31.1667 28.0439 30.7189 29.1249 29.9219 29.9219C29.1248 30.7189 28.0438 31.1667 26.9167 31.1667H7.08333C5.95616 31.1667 4.87516 30.7189 4.07813 29.9219C3.2811 29.1249 2.83333 28.0439 2.83333 26.9167V16.5864C2.83476 16.3114 2.86275 16.0371 2.91692 15.7675L11.9921 24.8427C13.3248 26.1623 15.1245 26.9026 17 26.9026C18.8755 26.9026 20.6752 26.1623 22.0079 24.8427L31.0831 15.7675C31.1372 16.0371 31.1652 16.3114 31.1667 16.5864V26.9167Z" fill="#26A568"></path></g><defs><clipPath
                  id="clip0_2643_6852"><rect width="34" height="34" fill="white"></rect></clipPath></defs></svg>
              </div>
              <div className="d-flex flex-column align-items-end"><div className="fs-18">{state.emailTotal?.opened}</div><span className="fs-13 text-muted">Opened</span></div>
            </div>



          </div>
        </div>
        {/* Waiting */}
        <div
          className={`card cursor-pointer ${state.filters.activeCard === "2"
            ? "border border-primary"
            : "border border-transparent"
            }`}
          onClick={() => {
            onAction("2");
          }}
        >
          <div className='card-body py-3 px-3'>
            <div className='w-100 d-flex justify-content-between align-items-center'>
              <div
                style={{
                  width: 45,
                  height: 45,
                  borderRadius: "50%",
                }}
                className='d-flex justify-content-center align-items-center'
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 34 34" fill="none"><g clipPath="url(#clip0_2643_6856)"><path d="M34 14.1667V26.9167C34 30.8267 30.8267 34 26.9167 34H7.08333C3.17333 34 0 30.8267 0 26.9167V11.3333C0 7.42333 3.17333 4.25 7.08333 4.25H18.4167C19.1958 4.25 19.8333 4.8875 19.8333 5.66667C19.8333 6.44583 19.1958 7.08333 18.4167 7.08333H7.08333C5.45417 7.08333 4.05167 8.00417 3.32917 9.33583L13.9967 20.0033C15.6542 21.6608 18.3458 21.6608 20.0033 20.0033L25.415 14.5917C25.9675 14.0392 26.86 14.0392 27.4125 14.5917C27.965 15.1442 27.965 16.0367 27.4125 16.5892L22.0008 22.0008C20.6267 23.375 18.7992 24.0692 16.9858 24.0692C15.1725 24.0692 13.3592 23.375 11.9708 22.0008L2.83333 12.8492V26.9167C2.83333 29.2542 4.74583 31.1667 7.08333 31.1667H26.9167C29.2542 31.1667 31.1667 29.2542 31.1667 26.9167V14.1667C31.1667 13.3875 31.8042 12.75 32.5833 12.75C33.3625 12.75 34 13.3875 34 14.1667ZM22.6667 5.66667C22.6667 2.53583 25.2025 0 28.3333 0C31.4642 0 34 2.53583 34 5.66667C34 8.7975 31.4642 11.3333 28.3333 11.3333C25.2025 11.3333 22.6667 8.7975 22.6667 5.66667ZM25.5 5.66667C25.5 7.225 26.775 8.5 28.3333 8.5C29.8917 8.5 31.1667 7.225 31.1667 5.66667C31.1667 4.10833 29.8917 2.83333 28.3333 2.83333C26.775 2.83333 25.5 4.10833 25.5 5.66667Z" fill="#525F7F"></path></g><defs><clipPath id="clip0_2643_6856"><rect width="34" height="34" fill="white"></rect></clipPath></defs></svg>
              </div>
              <div className="d-flex flex-column align-items-end"><div className="fs-18">{state.emailTotal?.delivered}</div><span className="fs-13 text-muted">Delivered</span></div>

            </div>


          </div>
        </div>
        {/* Paid */}
        <div
          className={`card cursor-pointer ${state.filters.activeCard === "3"
            ? "border border-primary"
            : "border border-transparent"
            }`}
          onClick={() => {
            onAction("3");
          }}
        >
          <div className='card-body py-3 px-3'>
            <div className='w-100 d-flex justify-content-between align-items-center'>
              <div
                style={{
                  width: 45,
                  height: 45,
                  borderRadius: "50%",
                }}
                className='d-flex justify-content-center align-items-center'
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 34 34" fill="none"><g clipPath="url(#clip0_2643_6856)"><path d="M34 14.1667V26.9167C34 30.8267 30.8267 34 26.9167 34H7.08333C3.17333 34 0 30.8267 0 26.9167V11.3333C0 7.42333 3.17333 4.25 7.08333 4.25H18.4167C19.1958 4.25 19.8333 4.8875 19.8333 5.66667C19.8333 6.44583 19.1958 7.08333 18.4167 7.08333H7.08333C5.45417 7.08333 4.05167 8.00417 3.32917 9.33583L13.9967 20.0033C15.6542 21.6608 18.3458 21.6608 20.0033 20.0033L25.415 14.5917C25.9675 14.0392 26.86 14.0392 27.4125 14.5917C27.965 15.1442 27.965 16.0367 27.4125 16.5892L22.0008 22.0008C20.6267 23.375 18.7992 24.0692 16.9858 24.0692C15.1725 24.0692 13.3592 23.375 11.9708 22.0008L2.83333 12.8492V26.9167C2.83333 29.2542 4.74583 31.1667 7.08333 31.1667H26.9167C29.2542 31.1667 31.1667 29.2542 31.1667 26.9167V14.1667C31.1667 13.3875 31.8042 12.75 32.5833 12.75C33.3625 12.75 34 13.3875 34 14.1667ZM22.6667 5.66667C22.6667 2.53583 25.2025 0 28.3333 0C31.4642 0 34 2.53583 34 5.66667C34 8.7975 31.4642 11.3333 28.3333 11.3333C25.2025 11.3333 22.6667 8.7975 22.6667 5.66667ZM25.5 5.66667C25.5 7.225 26.775 8.5 28.3333 8.5C29.8917 8.5 31.1667 7.225 31.1667 5.66667C31.1667 4.10833 29.8917 2.83333 28.3333 2.83333C26.775 2.83333 25.5 4.10833 25.5 5.66667Z" fill="#525F7F"></path></g><defs><clipPath id="clip0_2643_6856"><rect width="34" height="34" fill="white"></rect></clipPath></defs></svg></div>
              <div className="d-flex flex-column align-items-end"><div className="fs-18">{state.emailTotal?.not_delivered}</div>
                <span className="fs-13 text-muted">Not Delivered</span></div>
            </div>

          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};
