import { LoginResponse } from "@models/user";
import apiLinks from "@utils/api-links";
import httpClient from "@utils/http-client";

const login = async (
  username: string,
  password: string
): Promise<LoginResponse> => {
  const response = await httpClient.post({
    url: apiLinks.user.login,
    data: {
      username: username,
      password: password,
    },
  });
  return response.data;
};

const authService = {
  login,
};

export default authService;
