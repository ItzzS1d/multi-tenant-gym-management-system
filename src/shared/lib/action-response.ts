export type ActionResponse<T> =
    | {
          type: "SUCCESS";
          message: string;
          data?: T;
          showNotification?: boolean;
      }
    | {
          type: "ERROR";
          message: string;
          statusCode: number;
          showNotification?: boolean;
      };
