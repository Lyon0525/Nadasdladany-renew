using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Nadasdladany.Infrastructure.Identity;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Nadasdladany.Api.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly IConfiguration _configuration;

    public AuthController(UserManager<ApplicationUser> userManager, IConfiguration configuration)
    {
        _userManager = userManager;
        _configuration = configuration;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequestDto request)
    {
        var user = await _userManager.FindByEmailAsync(request.Email);
        if (user == null)
            return Unauthorized(new { message = "Helytelen e-mail cím vagy jelszó!" });

        var isPasswordValid = await _userManager.CheckPasswordAsync(user, request.Password);
        if (!isPasswordValid)
            return Unauthorized(new { message = "Helytelen e-mail cím vagy jelszó!" });

        return GenerateTokenForUser(user);
    }

    [HttpPost("change-password")]
    [Authorize]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequestDto request)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Unauthorized();

        var user = await _userManager.FindByIdAsync(userId);
        if (user == null) return Unauthorized();

        var result = await _userManager.ChangePasswordAsync(user, request.CurrentPassword, request.NewPassword);
        if (!result.Succeeded)
            return BadRequest(new { message = string.Join(", ", result.Errors.Select(e => e.Description)) });

        user.MustChangePassword = false;
        await _userManager.UpdateAsync(user);

        return GenerateTokenForUser(user);
    }

    [HttpPost("extend-session")]
    [Authorize]
    public async Task<IActionResult> ExtendSession()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId)) return Unauthorized();

        var user = await _userManager.FindByIdAsync(userId);
        if (user == null) return Unauthorized();

        return GenerateTokenForUser(user);
    }

    private IActionResult GenerateTokenForUser(ApplicationUser user)
    {
        var roles = _userManager.GetRolesAsync(user).Result;
        var primaryRole = roles.FirstOrDefault() ?? "Administrator";

        var jwtSettings = _configuration.GetSection("JwtSettings");
        var secretKey = jwtSettings.GetValue<string>("Key") ?? "ValamiNagyonHosszuEsTitkosKulcsMinimum32Karakter!";
        var issuer = jwtSettings.GetValue<string>("Issuer") ?? "NadasdladanyApi";
        var audience = jwtSettings.GetValue<string>("Audience") ?? "NadasdladanyReact";
        var durationInMinutes = jwtSettings.GetValue<double>("DurationInMinutes", 30);

        var authClaims = new List<Claim>
        {
            new(ClaimTypes.Name, user.UserName ?? string.Empty),
            new(ClaimTypes.Email, user.Email ?? string.Empty),
            new(ClaimTypes.NameIdentifier, user.Id),
            new(ClaimTypes.Role, primaryRole)
        };

        var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));

        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            expires: DateTime.UtcNow.AddMinutes(durationInMinutes),
            claims: authClaims,
            signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256)
        );

        return Ok(new
        {
            email = user.Email,
            token = new JwtSecurityTokenHandler().WriteToken(token),
            role = primaryRole,
            mustChangePassword = user.MustChangePassword
        });
    }
}

public class LoginRequestDto
{
    public required string Email { get; set; }
    public required string Password { get; set; }
}

public class ChangePasswordRequestDto
{
    public required string CurrentPassword { get; set; }
    public required string NewPassword { get; set; }
}