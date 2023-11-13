export const url = "https://imsapi.hisoft.vn";
// export const url = "http://192.168.40.83:8001";
export const urlServerSide = "http://192.168.40.83:8001";
// export const urlServerSide = "https://imsapi.hisoft.vn";

const apiLinks = {
  user: {
    login: `${urlServerSide}/api/User/Login`,
  },

  serverAllocation: {
    get: `${url}/api/ServerAllocation`,
    create: `${url}/api/ServerAllocation`,
  },
};

export default apiLinks;
