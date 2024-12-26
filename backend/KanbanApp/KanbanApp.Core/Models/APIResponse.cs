public class APIResponse<T>
{
    public bool Success { get; set; }
    public string Message { get; set; }
    public T Data { get; set; }

    public APIResponse(bool success, string message, T data = default)
    {
        Success = success;
        Message = message;
        Data = data;
    }

    public static APIResponse<T> SuccessResponse(T data, string message = "Request was successful")
    {
        return new APIResponse<T>(true, message, data);
    }

    public static APIResponse<T> ErrorResponse(string message)
    {
        return new APIResponse<T>(false, message);
    }
}