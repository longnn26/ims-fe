import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { url } from '../utils/api-links';

var connection: HubConnection;
const connectionServer = (token: string) => {
  const newConnection = new HubConnectionBuilder()
    .withUrl(`${url}/notificationHub`, {
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
