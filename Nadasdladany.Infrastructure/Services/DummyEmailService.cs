using Nadasdladany.Application.Interfaces.Common;
using Microsoft.Extensions.Logging;

namespace Nadasdladany.Infrastructure.Services;

public class DummyEmailService(ILogger<DummyEmailService> logger) : IEmailService
{
    public Task SendEmailAsync(string to, string subject, string body)
    {
        logger.LogInformation("Hírlevél küldése szimulálva ide: {To}. Tárgy: {Subject}", to, subject);
        return Task.CompletedTask;
    }
}