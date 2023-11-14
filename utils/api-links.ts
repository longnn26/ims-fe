export const url = "https://imsapi.hisoft.vn";
export const urlServerSide = "http://192.168.40.83:8001";
// export const urlServerSide = "https://imsapi.hisoft.vn";

const apiLinks = {
  user: {
    login: `${urlServerSide}/api/User/Login`,
  },

  serverAllocation: {
    get: `${url}/api/ServerAllocation`,
    getById: `${url}/api/ServerAllocation`,
    create: `${url}/api/ServerAllocation`,
    update: `${url}/api/ServerAllocation`,
    delete: `${url}/api/ServerAllocation`,
  },

  serverHardwareConfig: {
    get: `${url}/api/ServerHardwareConfig`,
    create: `${url}/api/ServerHardwareConfig`,
    update: `${url}/api/ServerHardwareConfig`,
    delete: `${url}/api/ServerHardwareConfig`,
  },

  component: {
    get: `${url}/api/component`,
    create: `${url}/api/component`,
    update: `${url}/api/component`,
    delete: `${url}/api/component`,
  },
};

export default apiLinks;
