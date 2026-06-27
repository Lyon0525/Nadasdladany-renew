using System.Diagnostics;

namespace Nadasdladany.Api.Middlewares;

public class RequestLoggingMiddleware(RequestDelegate next, ILogger<RequestLoggingMiddleware> logger)
{
    public async Task InvokeAsync(HttpContext context)
    {
        var sw = Stopwatch.StartNew();

        try
        {
            await next(context);
            sw.Stop();

            var statusCode = context.Response.StatusCode;
            if (statusCode >= 400)
            {
                logger.LogWarning("HTTP {Method} {Path} responded {StatusCode} in {Elapsed}ms",
                    context.Request.Method, context.Request.Path, statusCode, sw.ElapsedMilliseconds);
            }
            else
            {
                logger.LogInformation("HTTP {Method} {Path} responded {StatusCode} in {Elapsed}ms",
                    context.Request.Method, context.Request.Path, statusCode, sw.ElapsedMilliseconds);
            }
        }
        catch (Exception)
        {
            sw.Stop();
            logger.LogError("HTTP {Method} {Path} failed in {Elapsed}ms",
                context.Request.Method, context.Request.Path, sw.ElapsedMilliseconds);
            throw;
        }
    }
}