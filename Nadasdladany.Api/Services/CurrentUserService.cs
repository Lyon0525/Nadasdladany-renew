using System.Security.Claims;
using Nadasdladany.Application.Interfaces.Common;

namespace Nadasdladany.Api.Services;

public class CurrentUserService : ICurrentUserService
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public CurrentUserService(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    // A ClaimTypes.NameIdentifier tartalmazza a bejelentkezett User ID-ját
    public string? UserId => _httpContextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.NameIdentifier);
}