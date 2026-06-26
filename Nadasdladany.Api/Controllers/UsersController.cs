using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Nadasdladany.Infrastructure.Identity;

namespace Nadasdladany.Api.Controllers;

[Authorize(Roles = "Administrator")]
[ApiController]
[Route("api/users")]
public class UsersController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;

    public UsersController(UserManager<ApplicationUser> userManager)
    {
        _userManager = userManager;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllUsers()
    {
        var users = await _userManager.Users
            .Select(u => new { u.Id, u.UserName, u.Email, u.MustChangePassword })
            .ToListAsync();

        return Ok(users);
    }

    [HttpPost("register")]
    public async Task<IActionResult> RegisterUser([FromBody] CreateUserDto model)
    {
        var existing = await _userManager.FindByEmailAsync(model.Email);
        if (existing != null) return BadRequest(new { message = "Ez az e-mail cím már használatban van!" });

        var user = new ApplicationUser
        {
            UserName = model.Email,
            Email = model.Email,
            EmailConfirmed = true,
            MustChangePassword = true
        };

        var result = await _userManager.CreateAsync(user, model.Password);
        if (!result.Succeeded)
            return BadRequest(new { message = string.Join(" ", result.Errors.Select(e => e.Description)) });

        await _userManager.AddToRoleAsync(user, "Administrator");

        return Ok(new { message = "Felhasználó sikeresen létrehozva!" });
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateUser(string id, [FromBody] UpdateUserDto model)
    {
        var user = await _userManager.FindByIdAsync(id);
        if (user == null) return NotFound();

        if (!string.IsNullOrWhiteSpace(model.Email) && model.Email != user.Email)
        {
            var existing = await _userManager.FindByEmailAsync(model.Email);
            if (existing != null && existing.Id != user.Id)
                return BadRequest(new { message = "Ez az e-mail cím már használatban van!" });

            user.Email = model.Email;
            user.UserName = model.Email;
            await _userManager.UpdateAsync(user);
        }

        if (!string.IsNullOrWhiteSpace(model.Password))
        {
            var token = await _userManager.GeneratePasswordResetTokenAsync(user);
            var result = await _userManager.ResetPasswordAsync(user, token, model.Password);
            if (!result.Succeeded)
                return BadRequest(new { message = string.Join(" ", result.Errors.Select(e => e.Description)) });

            user.MustChangePassword = true;
            await _userManager.UpdateAsync(user);
        }

        return Ok(new { message = "Felhasználó adatai frissítve!" });
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteUser(string id)
    {
        var user = await _userManager.FindByIdAsync(id);
        if (user == null) return NotFound();

        var currentUserId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (currentUserId == id) return BadRequest(new { message = "Saját magát nem törölheti az adminisztrátor!" });

        await _userManager.DeleteAsync(user);
        return NoContent();
    }
}

public class CreateUserDto
{
    public required string Email { get; set; }
    public required string Password { get; set; }
}

public class UpdateUserDto
{
    public string? Email { get; set; }
    public string? Password { get; set; }
}