export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface ApiError {
  success: false;
  error: {
    statusCode: number;
    message: string;
    timestamp: string;
    path: string;
  };
}
