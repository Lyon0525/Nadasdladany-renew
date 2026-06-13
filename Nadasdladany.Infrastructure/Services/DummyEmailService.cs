using Nadasdladany.Application.Interfaces.Common;
using Microsoft.Extensions.Logging;

namespace Nadasdladany.Infrastructure.Services;

public class DummyEmailService : IEmailService
{
    private readonly ILogger<DummyEmailService> _logger;

    public DummyEmailService(ILogger<DummyEmailService> logger)
    {
        _logger = logger;
    }

    public Task SendEmailAsync(string to, string subject, string body)
    {
        _logger.LogInformation("Hírlevél küldése szimulálva ide: {To}. Tárgy: {Subject}", to, subject);
        return Task.CompletedTask;
    }
}