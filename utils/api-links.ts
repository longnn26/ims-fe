export const url = "https://imsapi.hisoft.vn";
export const urlServerSide = "http://192.168.40.83:8001";
export const url3rdParty = "https://api.vietqr.io/v2/business";
// export const urlServerSide = "https://imsapi.hisoft.vn";

const apiLinks = {
  user: {
    login: `${urlServerSide}/api/User/Login`,
    getUserTech: `${url}/api/User/Tech`,
    seenCurrenNoticeCount: `${url}/api/User/SeenCurrenNoticeCount`,
    get: `${url}/api/User`,
    create: `${url}/api/User/Register`,
    update: `${url}/api/User/MyAccount`,
    updateRole: `${url}/api/User/Position`,
  },

  serverAllocation: {
    get: `${url}/api/ServerAllocation`,
    getById: `${url}/api/ServerAllocation`,
    create: `${url}/api/ServerAllocation`,
    update: `${url}/api/ServerAllocation`,
    delete: `${url}/api/ServerAllocation`,
    createMasterIp: `${url}/api/ServerAllocation`,
    getServerIpAddress: `${url}/api/ServerAllocation`,
  },

  serverHardwareConfig: {
    get: `${url}/api/ServerHardwareConfig`,
    create: `${url}/api/ServerHardwareConfig`,
    update: `${url}/api/ServerHardwareConfig`,
    delete: `${url}/api/ServerHardwareConfig`,
  },

  component: {
    get: `${url}/api/Component`,
    getAll: `${url}/api/Component/All`,
    create: `${url}/api/Component`,
    update: `${url}/api/Component`,
    delete: `${url}/api/Component`,
  },

  customer: {
    getByTax: `${url3rdParty}`,
    get: `${url}/api/Customer`,
    getById: `${url}/api/Customer`,
    create: `${url}/api/Customer`,
    update: `${url}/api/Customer`,
    delete: `${url}/api/Customer`,
    getServerAllocationById: `${url}/api/Customer`,
    login: `${urlServerSide}/api/Customer/Login`,
  },

  requestUpgrade: {
    get: `${url}/api/RequestUpgrade`,
    getById: `${url}/api/RequestUpgrade`,
    getAppointmentsById: `${url}/api/RequestUpgrade`,
    create: `${url}/api/RequestUpgrade`,
    update: `${url}/api/RequestUpgrade`,
    delete: `${url}/api/RequestUpgrade`,
    accept: `${url}/api/RequestUpgrade`,
    deny: `${url}/api/RequestUpgrade`,
    complete: `${url}/api/RequestUpgrade`,
    reject: `${url}/api/RequestUpgrade`,
  },

  area: {
    get: `${url}/api/Area`,
    getRacksById: `${url}/api/Area`,
    create: `${url}/api/Area`,
    update: `${url}/api/Area`,
    delete: `${url}/api/Area`,
    getAll: `${url}/api/Area/All`,
  },

  rack: {
    get: `${url}/api/Rack`,
    getMapById: `${url}/api/Rack`,
    create: `${url}/api/Rack`,
    update: `${url}/api/Rack`,
    delete: `${url}/api/Rack`,
  },

  companyType: {
    get: `${url}/api/CompanyType`,
  },

  appointment: {
    get: `${url}/api/Appointment`,
    getById: `${url}/api/Appointment`,
    getRequestUpgradesById: `${url}/api/Appointment`,
    getRequestExpandById: `${url}/api/Appointment`,
    upload: `${url}/api/Appointment`,
    accept: `${url}/api/Appointment`,
    deny: `${url}/api/Appointment`,
    complete: `${url}/api/Appointment`,
    fail: `${url}/api/Appointment`,
    create: `${url}/api/Appointment`,
    update: `${url}/api/Appointment`,
    delete: `${url}/api/Appointment`,
  },

  requestExpand: {
    get: `${url}/api/ServerAllocation`,
    getAppointmentsById: `${url}/api/RequestExpand`,
    update: `${url}/api/RequestExpand`,
    getSuggestLocation: `${url}/api/RequestExpand`,
    getById: `${url}/api/RequestExpand`,
    accept: `${url}/api/RequestExpand`,
    deny: `${url}/api/RequestExpand`,
    complete: `${url}/api/RequestExpand`,
    reject: `${url}/api/RequestExpand`,
    saveLocation: `${url}/api/RequestExpand`,
  },

  ipSubnet: {
    get: `${url}/api/IpSubnet`,
    getTree: `${url}/api/IpSubnet/Tree`,
    getById: `${url}/api/IpSubnet`,
    getIpAddresssById: `${url}/api/IpSubnet`,
    create: `${url}/api/IpSubnet`,
    getSuggestAdditional: `${url}/api/IpSubnet/SuggestAdditional`,
  },

  ipAddress: {
    get: `${url}/api/IpAddress`,
    getSuggestMaster: `${url}/api/IpAddress/SuggestMaster`,
  },

  requestHost: {
    get: `${url}/api/ServerAllocation`,
    getAll: `${url}/api/RequestHost`,
    getById: `${url}/api/RequestHost`,
    create: `${url}/api/RequestHost`,
    accept: `${url}/api/RequestHost`,
    deny: `${url}/api/RequestHost`,
    complete: `${url}/api/RequestHost`,
    reject: `${url}/api/RequestHost`,
    update: `${url}/api/RequestHost`,
    getIpAdress: `${url}/api/RequestHost`,
    upload: `${url}/api/RequestHost`,
  },

  notification: {
    get: `${url}/api/Notification`,
    seenNotification: `${url}/api/Notification/SeenNotification`,
  },
};

export default apiLinks;
