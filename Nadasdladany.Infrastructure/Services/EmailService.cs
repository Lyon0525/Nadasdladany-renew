using Microsoft.Extensions.Logging;
using Nadasdladany.Application.Interfaces.Common;

namespace Nadasdladany.Infrastructure.Services;

public class EmailService : IEmailService
{
    private readonly ILogger<EmailService> _logger;

    public EmailService(ILogger<EmailService> logger)
    {
        _logger = logger;
    }

    public Task SendEmailAsync(string to, string subject, string body)
    {
        // Mock implementation for now
        _logger.LogInformation("Sending email to {To} with subject {Subject}", to, subject);
        return Task.CompletedTask;
    }
}