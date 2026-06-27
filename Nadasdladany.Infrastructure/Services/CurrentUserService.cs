using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using Nadasdladany.Application.Interfaces.Common;

namespace Nadasdladany.Infrastructure.Services;

public class CurrentUserService(IHttpContextAccessor httpContextAccessor) : ICurrentUserService
{
    public string? UserId => httpContextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.NameIdentifier);
}