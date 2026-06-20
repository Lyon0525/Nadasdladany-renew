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

        if (!_context.SiteSettings.Any())
        {
            _context.SiteSettings.Add(new SiteSetting
            {
                HistoryText = "Nádasdladány nevét az egykor itt elterülő hatalmas nádasokról és lápvidékről kapta. A település története szorosan összefonódott a gróf Nádasdy családdal, akik a 19. század második felében a község központjává tették birtokaikat, lendületet adva a térség ipari és kulturális fejlődésének. A lakosság évszázadokon át mezőgazdasággal és tőzegkitermeléssel foglalkozott.",

                CoatOfArmsText = "Községünk címere csücskös talpú, álló katonai pajzs. A kék mezőben zöld halmon egy jobbra lépő, arany csőrű és lábú, ezüst tollazatú kócsag látható, amely felemelt jobb lábával egy arany követ tart. A kócsag a települést egykor körülölelő mocsárvilág és természetvédelem jelképe, míg a kő az éberséget és az összetartozást szimbolizálja.",
                CoatOfArmsImageUrl = "/img/branding/coat-of-arms.png",

                LandmarksText = "A település büszkesége a historizáló, Tudor-stílusú Nádasdy-kastély, melyet gyönyörű tájképi kert övez. Ugyancsak kiemelkedő építészeti emlékünk a neogótikus Szent Ilona római katolikus templom, melyet Hauszmann Alajos tervezett, és a Nádasdy család mauzóleumaként is szolgál, de a falu utcáit járva számos hangulatos, régi hivatali épületet és emlékhelyet is felfedezhetünk."
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

        if (!_context.Elections.Any())
        {
            _context.Elections.AddRange(
                new ElectionResultEntity
                {
                    Year = 2026,
                    Type = "Országgyűlési Képviselő Választás (Fejér megye 5. sz. OEVK)",
                    RegisteredVoters = 1395,
                    VotedCount = 988,
                    TurnoutPercentage = 70.82,
                    CandidatesJson = "[{\"candidateName\":\"Törő Gábor\",\"organization\":\"FIDESZ - KDNP\",\"votesCount\":548,\"percentage\":55.46,\"isWinner\":true},{\"candidateName\":\"Horváth Ágnes\",\"organization\":\"DK - MSZP - Párbeszéd - LMP\",\"votesCount\":262,\"percentage\":26.51,\"isWinner\":false},{\"candidateName\":\"Végh Balázs\",\"organization\":\"Mi Hazánk Mozgalom\",\"votesCount\":112,\"percentage\":11.33,\"isWinner\":false},{\"candidateName\":\"Kovács Péter\",\"organization\":\"Magyar Kétfarkú Kutya Párt\",\"votesCount\":66,\"percentage\":6.70,\"isWinner\":false}]"
                },
                new ElectionResultEntity
                {
                    Year = 2024,
                    Type = "Helyi Önkormányzati Választások - Polgármester Választás",
                    RegisteredVoters = 1420,
                    VotedCount = 895,
                    TurnoutPercentage = 63.03,
                    CandidatesJson = "[{\"candidateName\":\"Pálfi Kristóf\",\"organization\":\"Független\",\"votesCount\":520,\"percentage\":58.10,\"isWinner\":true},{\"candidateName\":\"Kovács István\",\"organization\":\"Független\",\"votesCount\":375,\"percentage\":41.90,\"isWinner\":false}]"
                },
                new ElectionResultEntity
                {
                    Year = 2019,
                    Type = "Helyi Önkormányzati Választások - Polgármester Választás",
                    RegisteredVoters = 1445,
                    VotedCount = 785,
                    TurnoutPercentage = 54.33,
                    CandidatesJson = "[{\"candidateName\":\"Tőke László\",\"organization\":\"Független\",\"votesCount\":455,\"percentage\":57.96,\"isWinner\":true},{\"candidateName\":\"Nagy Sándor\",\"organization\":\"Független\",\"votesCount\":330,\"percentage\":42.04,\"isWinner\":false}]"
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
                    Content = "<p>Az Egészségház modern orvosi eszközökkel and felújított rendelőkkel várja a lakosságot. Sürgős esetekben, vagy rendelési időn kívül a központi ügyelet hívható.</p><h4>Központi Orvosi Ügyelet (Polgárdi):</h4><p>Telefonszám: +36 (22) 311-104 (Hétköznap 16:00-tól másnap 08:00-ig, hétvégén 24 órában).</p>",
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
                    Address = "8145 Nadasdladány, Fő utca 1.",
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

        if (!_context.Representatives.Any())
        {
            _context.Representatives.AddRange(
                new Representative
                {
                    Name = "Pálfi Kristóf",
                    Role = RepresentativeRole.Polgarmester,
                    CustomTitleOverride = "Polgármester",
                    Email = "polgarmester@nadasdladany.hu",
                    PhoneNumber = "+36 (22) 590-010",
                    Biography = "Tisztelt Nádasdladányiak! Polgármesterként elsődleges célom községünk folyamatos, fenntartható fejlődésének biztosítása, a történelmi örökségünk megőrzése és a lakossági jólét növelése. Fontosnak tartom az átlátható, modern közigazgatást és a civil közösségek támogatását. Forduljanak hozzám bizalommal a megadott hivatali elérhetőségeimen vagy személyesen a havi rendszerességű fogadóórákon.",
                    IsPublished = true,
                    DisplayOrder = 1
                },
                new Representative
                {
                    Name = "Kovács Árpád",
                    Role = RepresentativeRole.Alpolgarmester,
                    CustomTitleOverride = "Alpolgármester",
                    Email = "alpolgarmester@nadasdladany.hu",
                    PhoneNumber = "+36 (22) 590-012",
                    Biography = "Alpolgármesterként szorosan együttműködöm a polgármester úrral és a képviselő-testülettel a faluszépítési, infrastrukturális és kulturális projektek koordinációjában. Kiemelt feladatom a helyi pályázatok gyakorlati megvalósításának és kivitelezésének felügyelete.",
                    IsPublished = true,
                    DisplayOrder = 2
                },
                new Representative
                {
                    Name = "Kovács János",
                    Role = RepresentativeRole.Kepviselo,
                    CustomTitleOverride = "Pénzügyi Bizottság Elnöke",
                    Email = "kovacs.janos@nadasdladany.hu",
                    PhoneNumber = "+36 (30) 123-4567",
                    Biography = "Képviselőként és a Pénzügyi, Településfejlesztési és Szociális Bizottság elnökeként felelek az önkormányzat költségvetésének racionális tervezéséért és a szociális források igazságos elosztásáért. Emellett a helyi Polgárőr Egyesület elnökeként a falu közbiztonságának megőrzésén is dolgozom.",
                    IsPublished = true,
                    DisplayOrder = 3
                },
                new Representative
                {
                    Name = "Szabó Péter",
                    Role = RepresentativeRole.Kepviselo,
                    CustomTitleOverride = "Ügyrendi Bizottság Elnöke",
                    Email = "szabo.peter@nadasdladany.hu",
                    PhoneNumber = "+36 (22) 434-555",
                    Biography = "Az Ügyrendi és Kulturális Bizottság elnökeként a helyi rendeletek jogszabályi megfelelőségéért, valamint a falu kulturális programjainak szervezéséért felelek. Célom, hogy Nádasdladány egy pezsgő, összetartó és rendezett otthon legyen mindannyiunk számára.",
                    IsPublished = true,
                    DisplayOrder = 4
                },
                new Representative
                {
                    Name = "Nagy László",
                    Role = RepresentativeRole.Kepviselo,
                    CustomTitleOverride = "Települési Képviselő",
                    Email = "nagy.laszlo@nadasdladany.hu",
                    Biography = "Képviselő-testületi tagként aktívan támogatom a helyi civil kezdeményezéseket és a sportélet fellendítését. Fontosnak tartom, hogy a lakosság hangja és ötletei közvetlenül eljussanak a döntéshozók asztalára.",
                    IsPublished = true,
                    DisplayOrder = 5
                },
                new Representative
                {
                    Name = "Kiss Barna",
                    Role = RepresentativeRole.Kepviselo,
                    CustomTitleOverride = "Települési Képviselő",
                    Email = "reformatus@nadasdladany.hu",
                    Biography = "Helyi lelkészként és önkormányzati képviselőként a közösség lelki és kulturális megerősítéséért dolgozom. A testületi munkában a hagyományőrzés, a rászorulók támogatása és az oktatási-nevelési kérdések kapják nálam a legnagyobb hangsúlyt.",
                    IsPublished = true,
                    DisplayOrder = 6
                }
            );
            await _context.SaveChangesAsync();
        }

        if (!_context.Projects.Any())
        {
            _context.Projects.AddRange(
                new Project
                {
                    Title = "Belterületi utak burkolat-felújítása Nádasdladány községben",
                    Slug = "belteruleti-utak-felujitasa-2026",
                    Excerpt = "A Magyar Falu Program keretében megvalósuló beruházás során a falu több kritikus belterületi útszakasza kap teljesen új aszfaltburkolatot és modern csapadékvíz-elvezető rendszert.",
                    Content = "<h3>A projekt részletes bemutatása:</h3><p>Önkormányzatunk sikeresen pályázott az Iskola utca és a Petőfi Sándor utca egy részének teljes infrastrukturális megújítására. A munkálatok kiterjednek a meglévő elöregedett rétegek felmarására, az útalap megerősítésére, valamint két réteg új hengerelt aszfalt leterítésére.</p><h4>Várható lakossági hatások:</h4><p>A beruházás jelentősen növeli a közlekedésbiztonságot, csökkenti a gépjárművek zajterhelését és javítja az intézmények (Iskola, Óvoda) megközelíthetőségét. A munkálatok ideje alatt időszakos forgalomkorlátozásokra kell számítani, melyről folyamatosan tájékoztatjuk a tisztelt lakosságot.</p>",
                    ProjectCode = "MFP-UHK/2026-01",
                    TotalFunding = "45 000 000 Ft",
                    SupportRate = "100%",
                    FeaturedImageUrl = "/Nadasdladany-hero-banner.jpg",
                    IsPublished = true
                },
                new Project
                {
                    Title = "Energetikai korszerűsítés a Nádasdladányi Sün Balázs Óvodában",
                    Slug = "ovoda-energetikai-korszerusitese",
                    Excerpt = "Európai Uniós (TOP Plusz) forrásból megvalósuló projekt, melynek célja az óvoda épületének teljes hőszigetelése, nyílászáróinak cseréje és napelemes rendszer telepítése.",
                    Content = "<h3>Energetikai Hatékonyság Növelése:</h3><p>A projekt keretében az intézmény 15 cm-es homlokzati hőszigetelést kap, a régi ablakokat modern 3 rétegű hőszigetelt nyílászárókra cseréljük, valamint a tetőre een 12 kWp teljesítményű napelemrendszert szerelünk fel.</p><h4>Fenntarthatósági és pénzügyi előnyök:</h4><p>A felújítás befejeztével az óvoda fűtési és villamosenergia-költségei várhatóan több mint 65%-kal fognak csökkenni, miközben az épület szén-dioxid kibocsátása minimálisra csökken, példát mutatva a jövő nemzedékének.</p>",
                    ProjectCode = "TOP_PLUSZ-1.2.1-26-0045",
                    TotalFunding = "78 200 000 Ft",
                    SupportRate = "100%",
                    FeaturedImageUrl = "/Nadasdladany-hero-banner.jpg",
                    IsPublished = true
                }
            );
            await _context.SaveChangesAsync();
        }
    }
}