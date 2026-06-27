using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Nadasdladany.Domain.Entities;
using Nadasdladany.Infrastructure.Identity;

namespace Nadasdladany.Infrastructure.Persistence;

public class NadasdladanyDbContextInitialiser(
    ILogger<NadasdladanyDbContextInitialiser> logger,
    NadasdladanyDbContext context,
    UserManager<ApplicationUser> userManager,
    RoleManager<IdentityRole> roleManager)
{
    public async Task InitialiseAsync()
    {
        try
        {
            if (context.Database.IsSqlServer())
            {
                await context.Database.MigrateAsync();
            }
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Hiba az adatbázis inicializálása során.");
            throw;
        }
    }

    public async Task SeedAsync()
    {
        try { await TrySeedAsync(); }
        catch (Exception ex)
        {
            logger.LogError(ex, "Hiba a seeding során.");
            throw;
        }
    }

    private async Task TrySeedAsync()
    {
        var adminRole = new IdentityRole("Administrator");
        if (roleManager.Roles.All(r => r.Name != adminRole.Name))
        {
            await roleManager.CreateAsync(adminRole);
        }

        var adminUser = new ApplicationUser { UserName = "admin@nadasdladany.hu", Email = "admin@nadasdladany.hu", EmailConfirmed = true, MustChangePassword = false };
        if (userManager.Users.All(u => u.UserName != adminUser.UserName))
        {
            await userManager.CreateAsync(adminUser, "Admin123!");
            await userManager.AddToRoleAsync(adminUser, adminRole.Name!);
        }

        if (!context.Categories.Any())
        {
            context.Categories.AddRange(
                new Category { Name = "Önkormányzati Hírek", Slug = "onkormanyzati-hirek" },
                new Category { Name = "Közösségi Események", Slug = "kozossegi-esemenyek" },
                new Category { Name = "Kastély Hírek", Slug = "kastely-hirek" }
            );
            await context.SaveChangesAsync();
        }

        if (!context.DocumentCategories.Any())
        {
            context.DocumentCategories.AddRange(
                new DocumentCategory { Name = "Önkormányzati rendeletek", Slug = "onkormanyzati-rendeletek" },
                new DocumentCategory { Name = "Hivatali nyomtatványok / Űrlapok", Slug = "hivatali-nyomtatvanyok" },
                new DocumentCategory { Name = "Pályázati dokumentációk", Slug = "palyazati-dokumentaciok" },
                new DocumentCategory { Name = "Közérdekű adatok / Jegyzőkönyvek", Slug = "kozerdeku-adatok" },
                new DocumentCategory { Name = "Választási közlemények és határozatok", Slug = "valasztasok" }
            );
            await context.SaveChangesAsync();
        }
    }
}