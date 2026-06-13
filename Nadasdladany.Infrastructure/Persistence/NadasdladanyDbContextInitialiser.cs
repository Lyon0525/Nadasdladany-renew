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

        var adminUser = new ApplicationUser { UserName = "admin@nadasdladany.hu", Email = "admin@nadasdladany.hu", EmailConfirmed = true };
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

        if (!_context.Events.Any())
        {
            _context.Events.Add(new Event
            {
                Title = "Nádasdladányi Falunap és Kulturális Fesztivál",
                Slug = "nadasdladanyi-falunap-2026",
                Description = "Szeretettel várunk minden kedves helyi lakost és idelátogató vendéget az év legnagyobb közösségi rendezvényére a Kastélypark melletti rendezvénytéren!",
                Location = "8145 Nádasdladány, Rendezvénytér (Kastélypark mellett)",
                StartDate = DateTime.UtcNow.AddDays(30),
                IsAllDay = true,
                Organizer = "Önkormányzat",
                IsPublished = true
            });

            await _context.SaveChangesAsync();
        }

        if (!_context.Organizations.Any())
        {
            _context.Organizations.AddRange(
                new Organization
                {
                    Name = "Nádasdladányi Polgárőr Egyesület",
                    Slug = "nadasdladanyi-polgaror-egyesulet",
                    Description = "A település közbiztonságának és rendjének fenntartásáért tevékenykedő, önkéntes lakossági szervezet. Szorosan együttműködnek a rendőrséggel és a katasztrófavédelemmel a helyi rendezvények biztosításában és a járőrszolgálatok ellátásában.",
                    LeaderName = "Kovács János - Egyesületi Elnök",
                    Address = "8145 Nádasdladány, Fő utca 1.",
                    PhoneNumber = "+36 (30) 123-4567",
                    Email = "polgarorseg@nadasdladany.hu",
                    WebsiteUrl = null,
                    Type = Domain.Enums.OrganizationType.CivilSzervezet,
                    DisplayOrder = 1,
                    IsPublished = true
                },
                new Organization
                {
                    Name = "Nádasdladányi Nyugdíjas Klub",
                    Description = "Közösségünk szépkorú tagjait tömörítő, rendkívül aktív klub. Céljuk az időskori magány megelőzése, a kulturális hagyományok ápolása, kirándulások, nótaestek szervezése és a falu közösségi életében való aktív részvétel.",
                    Slug = "nadasdladanyi-nyugdijas-klub",
                    LeaderName = "Nagy Lászlóné - Klubvezető",
                    Address = "8145 Nádasdladány, Fő utca 12. (Művelődési Ház)",
                    PhoneNumber = null,
                    Email = null,
                    WebsiteUrl = null,
                    Type = Domain.Enums.OrganizationType.CivilSzervezet,
                    DisplayOrder = 2,
                    IsPublished = true
                },
                new Organization
                {
                    Name = "Nádasdladányért Környezetvédelmi és Faluszépítő Egyesület",
                    Slug = "nadasdladanyert-kornyezetvedelmi-egyesulet",
                    Description = "A helyi épített és természeti környezet védelméért, a Kastélypark és a közterületek tisztaságáért, valamint a fenntartható falufejlesztésért dolgozó civil összefogás. Rendszeresen szerveznek szemétszedési akciókat és faültetéseket.",
                    LeaderName = "Szabó Péter - Egyesületi Elnök",
                    Address = "8145 Nádasdladány, Petőfi Sándor utca 32.",
                    PhoneNumber = "+36 (22) 434-555",
                    Email = "faluszepitok@nadasdladany.hu",
                    WebsiteUrl = null,
                    Type = Domain.Enums.OrganizationType.CivilSzervezet,
                    DisplayOrder = 3,
                    IsPublished = true
                },

                new Organization
                {
                    Name = "Római Katolikus Plébánia - Nádasdladány",
                    Slug = "romai-katolikus-plebania",
                    Description = "A történelmi Szent Ilona templom és a helyi katolikus hívők szellemi és közösségi otthona. A szentmisék mellett keresztelők, esküvők, hitoktatás és közösségi programok helyszíne.",
                    LeaderName = "Tóth Ferenc - Plébános",
                    Address = "8145 Nádasdladány, Templom tér 1.",
                    PhoneNumber = "+36 (22) 434-009",
                    Email = "katolikus@nadasdladany.hu",
                    WebsiteUrl = null,
                    Type = Domain.Enums.OrganizationType.Egyhaz,
                    DisplayOrder = 4,
                    IsPublished = true
                },
                new Organization
                {
                    Name = "Református Egyházközség",
                    Slug = "reformatus-egyhazkozseg",
                    Description = "A nádasdladányi református gyülekezet közösségi bázisa. Rendszeres istentiszteletekkel, bibliaórákkal és a református hagyományok méltó megőrzésével szolgálják a falu lakóit.",
                    LeaderName = "Kiss Barna - Református Lelkész",
                    Address = "8145 Nádasdladány, Szabadság utca 15.",
                    PhoneNumber = null,
                    Email = "reformatus@nadasdladany.hu",
                    WebsiteUrl = null,
                    Type = Domain.Enums.OrganizationType.Egyhaz,
                    DisplayOrder = 5,
                    IsPublished = true
                }
            );

            await _context.SaveChangesAsync();
        }

        if (!_context.Institutions.Any())
        {
            _context.Institutions.AddRange(
                new Institution
                {
                    Name = "Nádasdladányi Sün Balázs Óvoda és Mini Bölcsőde",
                    Slug = "sun-balazs-ovoda-es-mini-bolcsode",
                    Description = "Önkormányzati fenntartású, családias hangulatú nevelési intézmény, amely biztosítja a legkisebbek harmonikus fejlődését és biztonságos gondozását.",
                    LeaderName = "Szabóné Varga Krisztina - Intézményvezető",
                    Address = "8145 Nádasdladány, Iskola utca 4.",
                    PhoneNumber = "+36 (22) 434-123",
                    Email = "ovoda@nadasdladany.hu",
                    WebsiteUrl = null,
                    OpeningHours = "Hétfő - Péntek: 06:30 - 17:00\nSzombat - Vasárnap: Zárva",
                    Content = "<h3>Kedves Szülők!</h3><p>Óvodánk és bölcsődénk kiemelt figyelmet fordít a gyermekek környezettudatos nevelésére, a mozgásfejlesztésre és a játékos tanulásra. Modern, jól felszerelt udvarunk és barátságos csoportszobáink ideális környezetet biztosítanak.</p><h4>Beiratkozási információk:</h4><p>A beiratkozás minden év áprilisában történik, melynek pontos részleteit és a szükséges nyomtatványokat a Hivatali Dokumentumtárban és a hírek között tesszük közzé.</p>",
                    DisplayOrder = 1,
                    IsPublished = true
                },
                new Institution
                {
                    Name = "Nádasdy Ferenc Általános Iskola",
                    Slug = "nadasdy-ferenc-altalanos-iskola",
                    Description = "A Székesfehérvári Tankerületi Központ fenntartásában működő alapfokú oktatási intézmény, amely korszerű tudással készíti fel a diákokat a középiskolai tanulmányokra.",
                    LeaderName = "Molnár Lászlóné - Intézményvezető",
                    Address = "8145 Nádasdladány, Iskola utca 2.",
                    PhoneNumber = "+36 (22) 434-015",
                    Email = "iskola@nadasdladany.hu",
                    WebsiteUrl = "https://iskolanadasdladany.hu",
                    OpeningHours = "Hétfő - Péntek: 07:30 - 16:00 (Tanítási napokon)",
                    Content = "<p>Iskolánk büszke a nagy múltú oktatási hagyományaira. Diákjaink számára biztosítjuk az alapfokú művészetoktatást, a sportolási lehetőségeket, valamint a modern informatikai eszközök használatának elsajátítását.</p><h4>Hitvallásunk:</h4><p>Olyan támogató és elfogadó közeget teremteni, ahol minden gyermek kibontakoztathatja a tehetségét.</p>",
                    DisplayOrder = 2,
                    IsPublished = true
                },
                new Institution
                {
                    Name = "Egészségház - Orvosi és Védőnői Rendelő",
                    Slug = "egeszseghaz",
                    Description = "A település egészségügyi központja, amely helyet biztosít a háziorvosi rendelésnek, a fogorvosi ellátásnak, valamint a csecsemő- és gyermekvédelmi védőnői tanácsadásnak.",
                    LeaderName = "dr. Szabó Gábor - Háziorvos",
                    Address = "8145 Nádasdladány, Petőfi Sándor utca 12.",
                    PhoneNumber = "+36 (22) 434-002",
                    Email = "rendelo@nadasdladany.hu",
                    WebsiteUrl = null,
                    OpeningHours = "Háziorvosi rendelés:\nHétfő, Szerda, Péntek: 08:00 - 12:00\nKedd, Csütörtök: 13:00 - 16:00\n\nVédőnői tanácsadás:\nKedd: 09:00 - 11:00",
                    Content = "<p>Az Egészségház modern orvosi eszközökkel és felújított rendelőkkel várja a lakosságot. Sürgős esetekben, vagy rendelési időn kívül a központi ügyelet hívható.</p><h4>Központi Orvosi Ügyelet (Polgárdi):</h4><p>Telefonszám: +36 (22) 311-104 (Hétköznap 16:00-tól másnap 08:00-ig, hétvégén 24 órában).</p>",
                    DisplayOrder = 3,
                    IsPublished = true
                },
                new Institution
                {
                    Name = "Családsegítő és Gyermekjóléti Szolgálat",
                    Slug = "csaladsegito-es-gyermekjoleti-szolgalat",
                    Description = "Személyes szociális szolgáltatást nyújtó intézmény, amely segítséget nyújt a krízishelyzetbe került családok, egyének és gyermekek számára.",
                    LeaderName = "Kovács Anna - Családsegítő koordinátor",
                    Address = "8145 Nádasdladány, Fő utca 1.",
                    PhoneNumber = "+36 (22) 590-015",
                    Email = "csaladsegito@nadasdladany.hu",
                    WebsiteUrl = null,
                    OpeningHours = "Ügyfélfogadás a Polgármesteri Hivatalban:\nHétfő: 13:00 - 16:00\nSzerda: 08:00 - 12:00",
                    Content = "<p>A szolgálat feladata a szociális és mentálhigiénés problémák megelőzése, a krízishelyzetek kezelése, valamint az anyagi vagy életvezetési nehézségekkel küzdő lakosok támogatása, hivatalos ügyeik intézésének segítése.</p>",
                    DisplayOrder = 4,
                    IsPublished = true
                },
                new Institution
                {
                    Name = "Nádasdladány-Sárkeszi Köznevelési Intézményi Társulás",
                    Slug = "koznevelesi-intezmenyi-tarsulas",
                    Description = "A környező települések összefogásával működő társulás, amely az oktatási és nevelési intézmények hatékony, jogszerű és stabil gazdasági fenntartásáért felel.",
                    LeaderName = "Pálfi Kristóf - Társulási Elnök",
                    Address = "8145 Nádasdladány, Fő utca 1.",
                    PhoneNumber = "+36 (22) 590-010",
                    Email = "tarsulas@nadasdladany.hu",
                    WebsiteUrl = null,
                    OpeningHours = "Munkarend: Hétfő - Péntek: 08:00 - 16:00 (Hivatali rend szerint)",
                    Content = "<p>A társulás biztosítja a közös fenntartású intézmények működtetését, koordinálja a költségvetési források elosztását, és ellátja a jogszabályokban rögzített kistérségi köznevelési feladatokat.</p>",
                    DisplayOrder = 5,
                    IsPublished = true
                }
            );

            await _context.SaveChangesAsync();
        }

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
                FeaturedImageUrl = "/img/castle/DJI_0143_retus2.jpg"
            });
            await _context.SaveChangesAsync();
        }

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