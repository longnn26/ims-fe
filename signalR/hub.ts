import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { urlNoti } from '../utils/api-links';

var connection: HubConnection;
const connectionServer = (token: string) => {
  const newConnection = new HubConnectionBuilder()
    .withUrl(`${urlNoti}/notificationHub`, {
      accessTokenFactory: () => token,
    })
    .withAutomaticReconnect()
    .build();
  connection = newConnection;
  return newConnection;
};

const signalR = {
  connectionServer,
};

export default signalR;
