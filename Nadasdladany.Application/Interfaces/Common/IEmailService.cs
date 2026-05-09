namespace Nadasdladany.Application.Interfaces.Common;

/// <summary>
/// Simple service for sending emails.
/// </summary>
public interface IEmailService
{
    /// <summary>
    /// Sends an email message asynchronously.
    /// </summary>
    Task SendEmailAsync(string to, string subject, string body);
}