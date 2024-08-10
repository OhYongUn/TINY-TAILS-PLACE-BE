export function createSuccessResponse<T>(
  data: T,
  statusCode: number = 200,
): {
  data: T;
  success: boolean;
  statusCode: number;
  error: null;
} {
  return {
    success: true,
    statusCode, // 상태 코드 포함
    data,
    error: null,
  };
}

export function createErrorResponse(
  code: string,
  message: string,
  statusCode: number,
): {
  data: null;
  success: boolean;
  statusCode: number;
  error: { code: string; message: string };
} {
  return {
    success: false,
    statusCode, // 상태 코드 포함
    data: null,
    error: { code, message },
  };
}
