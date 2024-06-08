export const url = "https://imsapi.hisoft.vn";
export const urlNoti = "https://ims.hisoft.vn";

export const urlServerSide = "http://192.168.40.83:8001";
// chạy deploy thì sài url trên

// chạy local thì sài url dưới
// export const urlServerSide = "https://imsapi.hisoft.vn";

export const urlImageLinkHost = "https://imsapi.hisoft.vn/";

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
    getAllUserByAdmin: `${url}/api/Admin/User/All`,
    banAccount: `${url}/api/Admin/User/BanAccount`,
    unBanAccount: `${url}/api/Admin/User/UnBanAccount`,
    createDriver: `${url}/api/Admin/Driver/Register`,
    createStaff: `${url}/api/Admin/Staff/Register`,
    updatePriority: `${url}/api/Admin/UpdateUserPriorityById`,
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
    changeToPause: `${url}/api/Support/ChangeStatusToPause`,
  },

  emergency: {
    getById: `${url}/api/Emergency`,
    getAll: `${url}/api/Emergency`,
    changeToProcessing: `${url}/api/Emergency/Processing`,
    changeToSolved: `${url}/api/Emergency/Solved`,
  },

  statistics: {
    getOverview: `${url}/api/Admin/Statistic/GetAdminOverview`,
    getAdminRevenueMonthlyIncome: `${url}/api/Admin/Statistic/GetAdminRevenueMonthlyIncome`,
    getAdminProfitMonthlyIncome: `${url}/api/Admin/Statistic/GetAdminProfitMonthlyIncome`,
  },

  booking: {
    getAllBookingByAdmin: `${url}/api/Admin/Booking/All`,
    getAllCheckInBookingImage: `${url}/api/BookingImage/CheckInImage`,
    getAllCheckOutBookingImage: `${url}/api/BookingImage/CheckOutImage`,
    getBookingCancelByBookingId: `${url}/api/Admin/BookingCancel`,
  },

  configuration: {
    getPriceConfiguration: `${url}/api/PriceConfiguration`,
    updatePriceConfiguration: `${url}/api/Admin/PriceConfiguration`,
  },

  transaction: {
    getAllWalletTransactionByAdmin: `${url}/api/Wallet/WalletTransaction`,
  },

  request: {
    getAllRequestWithdrawFundsByAdmin: `${url}/api/Admin/WithdrawFundsRequest`,
    acceptWithdrawFundsRequest: `${url}/api/Wallet/AcceptWithdrawFundsRequest`,
    rejectWithdrawFundsRequest: `${url}/api/Wallet/RejectWithdrawFundsRequest`,
  },

  identityCard: {
    getIdentityCard: `${url}/api/Admin/IdentityCard`,
    createIdentityCardByAdmin: `${url}/api/Admin/IdentityCard`,
    getIdentityCardImage: `${url}/api/Admin/IdentityCard/IdentityCardImage`,
    addIdentityCardImageByAdmin: `${url}/api/Admin/IdentityCard/IdentityCardImage`,
  },

  drivingLicense: {
    getDrivingLicense: `${url}/api/Admin/DrivingLicense`,
    createDrivingLicenseByAdmin: `${url}/api/Admin/DrivingLicense`,
    getDrivingLicenseImage: `${url}/api/Admin/DrivingLicense/DrivingLicenseImage`,
    addDrivingLicenseImageByAdmin: `${url}/api/Admin/DrivingLicense/DrivingLicenseImage`,
  },

  linkedAccount: {
    getLinkedAccountByAdmin: `${url}/api/Admin/User/GetLinkedAccount`,
    getAllBank: `https://api.vietqr.io/v2/banks`,
  },

  car: {
    //brand
    addNewBrand: `${url}/api/BrandVehicle`,
    getAllBrand: `${url}/api/BrandVehicle`,
    deleteSelectedBrand: `${url}/api/BrandVehicle`,
    updateSelectedBrand: `${url}/api/BrandVehicle`,
    //model
    addNewModel: `${url}/api/ModelVehicle`,
    getAllModelByBrandVehicleId: `${url}/api/ModelVehicle/BrandVehicle`,
    deleteSelectedModelByModelVehicleId: `${url}/api/ModelVehicle`,
    updateSelectedModelByBrandVehicleId: `${url}/api/ModelVehicle`,
  },
};

export default apiLinks;
