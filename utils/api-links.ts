export const url = "https://imsapi.hisoft.vn";
export const urlNoti = "https://ims.hisoft.vn";
// export const urlServerSide = "http://192.168.40.83:8001";
export const urlServerSide = "https://imsapi.hisoft.vn";

const apiLinks = {
  component: {
    get: `${url}/api/Component`,
    getAll: `${url}/api/Component/All`,
    create: `${url}/api/Component`,
    update: `${url}/api/Component`,
    delete: `${url}/api/Component`,
  },

  customer: {
    get: `${url}/api/Customer`,
    getProfile: `${url}/api/Customer/Profile`,
    create: `${url}/api/Customer`,
    update: `${url}/api/Customer`,
    delete: `${url}/api/Customer`,
    getServerAllocationById: `${url}/api/Customer`,
    login: `${urlServerSide}/api/Admin/Login`,
    changePassword: `${url}/api/Customer/ChangePassword`,
    changeStaffStatusOnline: `${url}/api/Admin/UpdateStaffStatusOnline`,
    changeStaffStatusOffline: `${url}/api/Admin/UpdateStaffStatusOffline`,
  },

  notification: {
    get: `${urlNoti}/api/Notification`,
    seenNotification: `${urlNoti}/api/Notification/SeenNotify`,
    seenAllNotification: `${urlNoti}/api/Notification/SeenAllNotify`,
  },

  support: {
    createSupport: `${url}/api/Support`,
    getById: `${url}/api/Support`,
    getAll: `${url}/api/Support`,
    changeToInProcess: `${url}/api/Support/ChangeStatusToInProcess`,
    changeToSolved: `${url}/api/Support/ChangeStatusToSolved`,
    changeToCantSolved: `${url}/api/Support/ChangeStatusToCantSolved`,
  },

  emergency: {
    getById: `${url}/api/Emergency`,
    getAll: `${url}/api/Emergency`,
    changeToProcessing: `${url}/api/Emergency/Processing`,
    changeToSolved: `${url}/api/Emergency/Solved`,
  },
};

export default apiLinks;
