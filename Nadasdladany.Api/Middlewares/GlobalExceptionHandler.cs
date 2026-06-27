using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Nadasdladany.Application.Common.Exceptions;

namespace Nadasdladany.Api.Middlewares;

public class GlobalExceptionHandler(ILogger<GlobalExceptionHandler> logger) : IExceptionHandler
{
    public async ValueTask<bool> TryHandleAsync(HttpContext httpContext, Exception exception, CancellationToken cancellationToken)
    {
        logger.LogError(exception, "An unhandled exception occurred: {Message}", exception.Message);

        var problemDetails = new ProblemDetails
        {
            Instance = httpContext.Request.Path
        };

        switch (exception)
        {
            case ValidationException validationException:
                problemDetails.Title = "Validation Error";
                problemDetails.Status = StatusCodes.Status400BadRequest;
                problemDetails.Detail = "One or more validation errors occurred.";
                problemDetails.Extensions["errors"] = validationException.Errors;
                break;

            case NotFoundException notFoundException:
                problemDetails.Title = "Not Found";
                problemDetails.Status = StatusCodes.Status404NotFound;
                problemDetails.Detail = notFoundException.Message;
                break;

            case ForbiddenAccessException:
                problemDetails.Title = "Forbidden";
                problemDetails.Status = StatusCodes.Status403Forbidden;
                problemDetails.Detail = "Nincs jogosultsága ehhez a művelethez.";
                break;

            case UnauthorizedAccessException:
                problemDetails.Title = "Unauthorized";
                problemDetails.Status = StatusCodes.Status401Unauthorized;
                problemDetails.Detail = "A művelethez bejelentkezés szükséges.";
                break;

            default:
                problemDetails.Title = "Server Error";
                problemDetails.Status = StatusCodes.Status500InternalServerError;
                problemDetails.Detail = exception.Message;
                break;
        }

        httpContext.Response.StatusCode = problemDetails.Status.Value;

        await httpContext.Response.WriteAsJsonAsync(problemDetails, cancellationToken);
        return true;
    }
}