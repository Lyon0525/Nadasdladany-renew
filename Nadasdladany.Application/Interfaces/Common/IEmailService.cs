namespace Nadasdladany.Application.Interfaces.Common;

public interface IEmailService
{
    Task SendEmailAsync(string to, string subject, string body);
}