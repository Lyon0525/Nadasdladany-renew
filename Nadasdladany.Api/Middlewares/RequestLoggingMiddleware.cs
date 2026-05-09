using System.Diagnostics;

namespace Nadasdladany.Api.Middlewares;

/// <summary>
/// Middleware to log every incoming HTTP request and its duration.
/// </summary>
public class RequestLoggingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<RequestLoggingMiddleware> _logger;

    public RequestLoggingMiddleware(RequestDelegate next, ILogger<RequestLoggingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        var sw = Stopwatch.StartNew();

        try
        {
            await _next(context);
            sw.Stop();

            var statusCode = context.Response.StatusCode;
            if (statusCode >= 400)
            {
                _logger.LogWarning("HTTP {Method} {Path} responded {StatusCode} in {Elapsed}ms",
                    context.Request.Method, context.Request.Path, statusCode, sw.ElapsedMilliseconds);
            }
            else
            {
                _logger.LogInformation("HTTP {Method} {Path} responded {StatusCode} in {Elapsed}ms",
                    context.Request.Method, context.Request.Path, statusCode, sw.ElapsedMilliseconds);
            }
        }
        catch (Exception)
        {
            sw.Stop();
            _logger.LogError("HTTP {Method} {Path} failed in {Elapsed}ms",
                context.Request.Method, context.Request.Path, sw.ElapsedMilliseconds);
            throw; // Re-throw to be caught by ExceptionHandlingMiddleware
        }
    }
}