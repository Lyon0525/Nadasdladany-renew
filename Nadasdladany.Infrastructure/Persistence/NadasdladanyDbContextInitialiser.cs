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
        // 1. Szerepkörök
        var adminRole = new IdentityRole("Administrator");
        if (_roleManager.Roles.All(r => r.Name != adminRole.Name))
        {
            await _roleManager.CreateAsync(adminRole);
        }

        // 2. Admin felhasználó
        var adminUser = new ApplicationUser { UserName = "admin@nadasdladany.hu", Email = "admin@nadasdladany.hu", EmailConfirmed = true };
        if (_userManager.Users.All(u => u.UserName != adminUser.UserName))
        {
            await _userManager.CreateAsync(adminUser, "Admin123!");
            await _userManager.AddToRoleAsync(adminUser, adminRole.Name!);
        }

        // 3. Kategóriák
        if (!_context.Categories.Any())
        {
            _context.Categories.AddRange(
                new Category { Name = "Önkormányzati Hírek", Slug = "onkormanyzati-hirek" },
                new Category { Name = "Közösségi Események", Slug = "kozossegi-esemenyek" },
                new Category { Name = "Kastély Hírek", Slug = "kastely-hirek" }
            );
            await _context.SaveChangesAsync();
        }

        // 4. Mintahír a kastély képével
        if (!_context.Articles.Any())
        {
            var cat = await _context.Categories.FirstAsync();
            _context.Articles.Add(new Article
            {
                Title = "Megújult Nádasdladány digitális arca",
                Slug = "megujult-honlap",
                Excerpt = "Elindult a község modern, minden eszközön tökéletesen megjelenő weboldala.",
                Content = "<p>Nádasdladány Község Önkormányzata büszkén mutatja be új honlapját, mely a legmodernebb technológiával készült.</p>",
                PublishedDate = DateTime.Now,
                IsPublished = true,
                CategoryId = cat.Id,
                FeaturedImageUrl = "/img/castle/DJI_0143_retus2.jpg" // Meglévő kép használata
            });
            await _context.SaveChangesAsync();
        }

        // 5. Polgármester (Kép nélkül indítjuk, a React kezeli a fallback-et)
        if (!_context.Representatives.Any())
        {
            _context.Representatives.Add(new Representative
            {
                Name = "Pálfi Kristóf",
                Role = RepresentativeRole.Polgarmester,
                CustomTitleOverride = "Polgármester",
                Biography = "Üdvözlöm a község lakóit és az ide látogatókat!",
                IsPublished = true,
                DisplayOrder = 1
            });
            await _context.SaveChangesAsync();
        }

        // 6. Alapbeállítások
        if (!_context.SiteSettings.Any())
        {
            _context.SiteSettings.AddRange(
                new SiteSetting { SettingKey = "WelcomeTitle", SettingValue = "Tisztelt Látogatók!" },
                new SiteSetting { SettingKey = "MayorName", SettingValue = "Pálfi Kristóf" }
            );
            await _context.SaveChangesAsync();
        }
    }
}