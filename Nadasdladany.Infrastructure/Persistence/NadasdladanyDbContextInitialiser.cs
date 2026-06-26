using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Nadasdladany.Domain.Entities;
using Nadasdladany.Domain.Enums;
using Nadasdladany.Infrastructure.Identity;

namespace Nadasdladany.Infrastructure.Persistence;

public class NadasdladanyDbContextInitialiser
{
    private readonly ILogger<NadasdladanyDbContextInitialiser> _logger;
    private readonly NadasdladanyDbContext _context;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly RoleManager<IdentityRole> _roleManager;

    public NadasdladanyDbContextInitialiser(
        ILogger<NadasdladanyDbContextInitialiser> logger,
        NadasdladanyDbContext context,
        UserManager<ApplicationUser> userManager,
        RoleManager<IdentityRole> roleManager)
    {
        _logger = logger;
        _context = context;
        _userManager = userManager;
        _roleManager = roleManager;
    }

    public async Task InitialiseAsync()
    {
        try
        {
            if (_context.Database.IsSqlServer())
            {
                await _context.Database.MigrateAsync();
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Hiba az adatbázis inicializálása során.");
            throw;
        }
    }

    public async Task SeedAsync()
    {
        try { await TrySeedAsync(); }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Hiba a seeding során.");
            throw;
        }
    }

    private async Task TrySeedAsync()
    {
        var adminRole = new IdentityRole("Administrator");
        if (_roleManager.Roles.All(r => r.Name != adminRole.Name))
        {
            await _roleManager.CreateAsync(adminRole);
        }

        var adminUser = new ApplicationUser { UserName = "admin@nadasdladany.hu", Email = "admin@nadasdladany.hu", EmailConfirmed = true, MustChangePassword = false };
        if (_userManager.Users.All(u => u.UserName != adminUser.UserName))
        {
            await _userManager.CreateAsync(adminUser, "Admin123!");
            await _userManager.AddToRoleAsync(adminUser, adminRole.Name!);
        }

        if (!_context.Categories.Any())
        {
            _context.Categories.AddRange(
                new Category { Name = "Önkormányzati Hírek", Slug = "onkormanyzati-hirek" },
                new Category { Name = "Közösségi Események", Slug = "kozossegi-esemenyek" },
                new Category { Name = "Kastély Hírek", Slug = "kastely-hirek" }
            );
            await _context.SaveChangesAsync();
        }

        if (!_context.DocumentCategories.Any())
        {
            _context.DocumentCategories.AddRange(
                new DocumentCategory { Name = "Önkormányzati rendeletek", Slug = "onkormanyzati-rendeletek" },
                new DocumentCategory { Name = "Hivatali nyomtatványok / Űrlapok", Slug = "hivatali-nyomtatvanyok" },
                new DocumentCategory { Name = "Pályázati dokumentációk", Slug = "palyazati-dokumentaciok" },
                new DocumentCategory { Name = "Közérdekű adatok / Jegyzőkönyvek", Slug = "kozerdeku-adatok" },
                new DocumentCategory { Name = "Választási közlemények és határozatok", Slug = "valasztasok" }
            );
            await _context.SaveChangesAsync();
        }
    }
}