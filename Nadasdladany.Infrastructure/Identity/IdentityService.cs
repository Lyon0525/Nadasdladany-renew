using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Nadasdladany.Application.Interfaces.Common;

namespace Nadasdladany.Infrastructure.Identity;

public class IdentityService(UserManager<ApplicationUser> userManager) : IIdentityService
{
    public async Task<string?> GetUserNameAsync(string userId)
    {
        var user = await userManager.Users.FirstOrDefaultAsync(u => u.Id == userId);
        return user?.UserName;
    }

    public async Task<bool> IsInRoleAsync(string userId, string role)
    {
        var user = await userManager.Users.FirstOrDefaultAsync(u => u.Id == userId);
        return user != null && await userManager.IsInRoleAsync(user, role);
    }

    public async Task<bool> AuthorizeAsync(string userId, string policyName)
    {
        var user = await userManager.Users.FirstOrDefaultAsync(u => u.Id == userId);
        return user != null;
    }

    public async Task<bool> DeleteUserAsync(string userId)
    {
        var user = await userManager.Users.FirstOrDefaultAsync(u => u.Id == userId);
        if (user != null)
        {
            var result = await userManager.DeleteAsync(user);
            return result.Succeeded;
        }
        return false;
    }
}