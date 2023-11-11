// export const url = "https://wms.hisoft.vn";
export const url = "http://192.168.40.83:8003";
export const urlServerSide = "http://192.168.40.83:8002";
// export const urlServerSide = "https://wmsapi.hisoft.vn";

const apiLinks = {
  user: {
    login: `${urlServerSide}/api/User/Login`,
  },
  language: {
    get: `${url}/api/Language`,
    getData: `${url}/api/Language/data`,
    create: `${url}/api/Language`,
    update: `${url}/api/Language`,
    delete: `${url}/api/Language`,

    getLanguagePublic: `${urlServerSide}/api/Language/Public`,
  },
  blog: {
    create: `${url}/api/Blog`,
    update: `${url}/api/Blog`,
    get: `${url}/api/Blog`,
    getBlogCategory: `${url}/api/Blog/BlogCategory`,
    assignCategory: `${url}/api/Blog/AssignCategory`,
    delete: `${url}/api/Blog`,

    getBlogPublic: `${urlServerSide}/api/Blog/Public`,
    getBlogContentPublic: `${urlServerSide}/api/Blog/Content/Public`,
  },
  blogTranslation: {
    create: `${url}/api/BlogTranslation`,
    update: `${url}/api/BlogTranslation`,
    delete: `${url}/api/BlogTranslation`,
  },
  category: {
    getTree: `${url}/api/Category/Tree`,
    create: `${url}/api/Category`,
    delete: `${url}/api/Category`,
    update: `${url}/api/Category`,
    getDetail: `${url}/api/Category/Detail`,
  },
  categoryTranslation: {
    create: `${url}/api/CategoryTranslation`,
    delete: `${url}/api/CategoryTranslation`,
    update: `${url}/api/CategoryTranslation`,
    getByCategoryId: `${url}/api/CategoryTranslation/ByCategoryId`,
  },
  menu: {
    get: `${url}/api/Blog`,
    getCategoryIds: `${url}/api/Menu/CategoryIds`,
    assignCategory: `${url}/api/Menu/AssignCategory`,

    getMenuPublic: `${urlServerSide}/api/Menu/Public`,
  },
};

export default apiLinks;
