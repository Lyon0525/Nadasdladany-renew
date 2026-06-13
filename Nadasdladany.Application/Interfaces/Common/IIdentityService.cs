namespace Nadasdladany.Application.Interfaces.Common;

public interface IIdentityService
{
    Task<string?> GetUserNameAsync(string userId);
    Task<bool> IsInRoleAsync(string userId, string role);
    Task<bool> AuthorizeAsync(string userId, string policyName);
    Task<bool> DeleteUserAsync(string userId);
}