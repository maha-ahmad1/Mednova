export interface PusherConnection {
  bind(event: string, callback: (data?: unknown) => void): void;
  unbind(event: string, callback?: (data?: unknown) => void): void;
}

export interface PusherConnector {
  pusher: {
    connection: PusherConnection;
  };
}

export type EchoConnector = PusherConnector;

