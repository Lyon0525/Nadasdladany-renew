using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Nadasdladany.Application.Common.Models;
using Nadasdladany.Application.Features.Articles.Commands;
using Nadasdladany.Application.Features.Articles.Queries;
using Nadasdladany.Application.Features.ContactMessages;
using Nadasdladany.Application.Features.Dashboard.Queries;
using Nadasdladany.Application.Features.Documents.Commands;
using Nadasdladany.Application.Features.Documents.Queries;
using Nadasdladany.Application.Features.Elections.Commands;
using Nadasdladany.Application.Features.Elections.Queries;
using Nadasdladany.Application.Features.Events.Commands;
using Nadasdladany.Application.Features.Events.Queries;
using Nadasdladany.Application.Features.Gallery.Commands;
using Nadasdladany.Application.Features.Gallery.Queries;
using Nadasdladany.Application.Features.Institutions.Commands;
using Nadasdladany.Application.Features.Institutions.Queries;
using Nadasdladany.Application.Features.JobPostings.Commands;
using Nadasdladany.Application.Features.JobPostings.Queries;
using Nadasdladany.Application.Features.Municipality.Commands;
using Nadasdladany.Application.Features.Municipality.Queries;
using Nadasdladany.Application.Features.Newsletter.Commands;
using Nadasdladany.Application.Features.Office.Commands;
using Nadasdladany.Application.Features.Office.Queries;
using Nadasdladany.Application.Features.Organizations.Commands;
using Nadasdladany.Application.Features.Organizations.Queries;
using Nadasdladany.Application.Features.Projects.Commands;
using Nadasdladany.Application.Features.Projects.Queries;
using Nadasdladany.Application.Features.PublicDataRequests.Commands;
using Nadasdladany.Application.Features.PublicDataRequests.Queries;
using Nadasdladany.Application.Features.SiteSettings.Commands;
using Nadasdladany.Application.Features.SiteSettings.Queries;
using Nadasdladany.Application.Features.VillageLocations.Commands;
using Nadasdladany.Application.Features.VillageLocations.Queries;
using Nadasdladany.Application.Interfaces.Common;
using Nadasdladany.Domain.Enums;
using Nadasdladany.Infrastructure.Identity;
using Nadasdladany.Infrastructure.Persistence;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Text.Json;

namespace Nadasdladany.Api.Endpoints;

public static class EndpointMapper
{
    public static void MapAllEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapAuthEndpoints();
        app.MapArticleEndpoints();
        app.MapContactEndpoints();
        app.MapDashboardEndpoints();
        app.MapDocumentEndpoints();
        app.MapElectionEndpoints();
        app.MapEventEndpoints();
        app.MapGalleryEndpoints();
        app.MapInstitutionEndpoints();
        app.MapJobPostingEndpoints();
        app.MapMunicipalityEndpoints();
        app.MapNewsletterEndpoints();
        app.MapOfficeEndpoints();
        app.MapOrganizationEndpoints();
        app.MapProjectEndpoints();
        app.MapPublicDataRequestEndpoints();
        app.MapSearchEndpoints();
        app.MapSiteSettingEndpoints();
        app.MapUserEndpoints();
        app.MapVillageLocationEndpoints();
    }

    private static void MapAuthEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/auth");

        group.MapPost("/login", async (LoginRequestDto request, UserManager<ApplicationUser> userManager, IConfiguration config, HttpContext ctx) =>
        {
            var user = await userManager.FindByEmailAsync(request.Email);
            if (user == null || !await userManager.CheckPasswordAsync(user, request.Password))
                return Results.Unauthorized();
            return await GenerateToken(user, userManager, config, ctx);
        });

        group.MapPost("/change-password", async (ChangePasswordRequestDto request, ClaimsPrincipal principal, UserManager<ApplicationUser> userManager, IConfiguration config, HttpContext ctx) =>
        {
            var userId = principal.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null) return Results.Unauthorized();
            var user = await userManager.FindByIdAsync(userId);
            if (user == null) return Results.Unauthorized();

            var result = await userManager.ChangePasswordAsync(user, request.CurrentPassword, request.NewPassword);
            if (!result.Succeeded) return Results.BadRequest(new { message = string.Join(", ", result.Errors.Select(e => e.Description)) });

            user.MustChangePassword = false;
            await userManager.UpdateAsync(user);
            return await GenerateToken(user, userManager, config, ctx);
        }).RequireAuthorization();

        group.MapPost("/extend-session", async (ClaimsPrincipal principal, UserManager<ApplicationUser> userManager, IConfiguration config, HttpContext ctx) =>
        {
            var userId = principal.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId)) return Results.Unauthorized();
            var user = await userManager.FindByIdAsync(userId);
            if (user == null) return Results.Unauthorized();
            return await GenerateToken(user, userManager, config, ctx);
        }).RequireAuthorization();

        group.MapPost("/logout", (HttpContext ctx) =>
        {
            ctx.Response.Cookies.Delete("X-Access-Token");
            return Results.Ok(new { message = "Sikeres kijelentkezés" });
        });
    }

    private static async Task<IResult> GenerateToken(ApplicationUser user, UserManager<ApplicationUser> userManager, IConfiguration config, HttpContext ctx)
    {
        var roles = await userManager.GetRolesAsync(user);
        var primaryRole = roles.FirstOrDefault() ?? "Administrator";

        var jwtSettings = config.GetSection("JwtSettings");
        var secretKey = jwtSettings.GetValue<string>("Key") ?? throw new InvalidOperationException("JWT Secret Key is missing.");
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

        var expiryDate = DateTime.UtcNow.AddMinutes(durationInMinutes);
        var token = new JwtSecurityToken(
            issuer: issuer, audience: audience, expires: expiryDate, claims: authClaims,
            signingCredentials: new SigningCredentials(new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey)), SecurityAlgorithms.HmacSha256)
        );

        ctx.Response.Cookies.Append("X-Access-Token", new JwtSecurityTokenHandler().WriteToken(token), new CookieOptions { HttpOnly = true, Secure = true, SameSite = SameSiteMode.Strict, Expires = expiryDate });

        return Results.Ok(new { email = user.Email, role = primaryRole, mustChangePassword = user.MustChangePassword, expiresAt = new DateTimeOffset(expiryDate).ToUnixTimeMilliseconds() });
    }

    private static void MapArticleEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/articles");
        group.MapGet("/", async ([AsParameters] GetArticlesWithPaginationQuery query, ISender mediator) => await mediator.Send(query)).CacheOutput(c => c.Expire(TimeSpan.FromSeconds(120)).SetVaryByQuery("pageNumber", "pageSize", "categoryId"));
        group.MapGet("/{slug}", async (string slug, ISender mediator) => await mediator.Send(new GetArticleBySlugQuery(slug))).CacheOutput(c => c.Expire(TimeSpan.FromSeconds(120)).SetVaryByRouteValue("slug"));
        group.MapPost("/", async ([FromForm] CreateArticleCommand command, ISender mediator) => await mediator.Send(command)).RequireAuthorization().DisableAntiforgery();
        group.MapPut("/{id}", async (int id, [FromForm] UpdateArticleCommand command, ISender mediator) => { if (id != command.Id) return Results.BadRequest(); await mediator.Send(command); return Results.NoContent(); }).RequireAuthorization().DisableAntiforgery();
        group.MapDelete("/{id}", async (int id, ISender mediator) => { await mediator.Send(new DeleteArticleCommand(id)); return Results.NoContent(); }).RequireAuthorization();
    }

    private static void MapContactEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/contact");
        group.MapPost("/", async (CreateContactMessageCommand command, ISender mediator) => await mediator.Send(command)).RequireRateLimiting("StrictSubmitPolicy");
        group.MapGet("/", async (ISender mediator) => await mediator.Send(new GetContactMessagesQuery())).RequireAuthorization();
        group.MapPut("/{id}/read", async (int id, ISender mediator) => { await mediator.Send(new MarkMessageAsReadCommand(id)); return Results.NoContent(); }).RequireAuthorization();
        group.MapDelete("/{id}", async (int id, ISender mediator) => { await mediator.Send(new DeleteContactMessageCommand(id)); return Results.NoContent(); }).RequireAuthorization();
    }

    private static void MapDashboardEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapGet("/api/dashboard/stats", async (ISender mediator) => await mediator.Send(new GetDashboardStatsQuery())).RequireAuthorization();
    }

    private static void MapDocumentEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/documents");
        group.MapGet("/", async ([AsParameters] GetDocumentsWithPaginationQuery query, ISender mediator) => await mediator.Send(query)).CacheOutput(c => c.Expire(TimeSpan.FromSeconds(120)).SetVaryByQuery("pageNumber", "pageSize", "categoryId", "searchTerm"));
        group.MapPost("/", async ([FromForm] CreateDocumentCommand command, ISender mediator) => await mediator.Send(command)).RequireAuthorization().DisableAntiforgery();
        group.MapPut("/{id}", async (int id, [FromForm] UpdateDocumentCommand command, ISender mediator) => { if (id != command.Id) return Results.BadRequest(); await mediator.Send(command); return Results.NoContent(); }).RequireAuthorization().DisableAntiforgery();
        group.MapDelete("/{id}", async (int id, ISender mediator) => { await mediator.Send(new DeleteDocumentCommand(id)); return Results.NoContent(); }).RequireAuthorization();
    }

    private static void MapElectionEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/elections");
        group.MapGet("/", async (ISender mediator) => await mediator.Send(new GetAllElectionsQuery())).RequireAuthorization();
        group.MapGet("/{year:int}", async (int year, NadasdladanyDbContext context) =>
        {
            var election = await context.Elections.AsNoTracking().FirstOrDefaultAsync(x => x.Year == year);
            if (election == null) return Results.NotFound(new { message = "Nincs adat." });
            return Results.Ok(new { id = election.Id, year = election.Year, type = election.Type, registeredVoters = election.RegisteredVoters, votedCount = election.VotedCount, turnoutPercentage = election.TurnoutPercentage, results = JsonSerializer.Deserialize<List<CandidateInput>>(election.CandidatesJson, new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase }) });
        }).CacheOutput(c => c.Expire(TimeSpan.FromSeconds(300)).SetVaryByRouteValue("year"));
        group.MapPost("/", async (CreateElectionResultCommand command, ISender mediator) => await mediator.Send(command)).RequireAuthorization();
        group.MapDelete("/{id}", async (int id, ISender mediator) => { await mediator.Send(new DeleteElectionCommand(id)); return Results.NoContent(); }).RequireAuthorization();
    }

    private static void MapEventEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/events");
        group.MapGet("/", async (ISender mediator) => await mediator.Send(new GetUpcomingEventsQuery())).CacheOutput(c => c.Expire(TimeSpan.FromSeconds(120)));
        group.MapGet("/upcoming", async (ISender mediator) => await mediator.Send(new GetUpcomingEventsQuery())).CacheOutput(c => c.Expire(TimeSpan.FromSeconds(120)));
        group.MapGet("/{slug}", async (string slug, ISender mediator) => await mediator.Send(new GetEventBySlugQuery(slug))).CacheOutput(c => c.Expire(TimeSpan.FromSeconds(120)).SetVaryByRouteValue("slug"));
        group.MapPost("/", async ([FromForm] CreateEventCommand command, ISender mediator) => await mediator.Send(command)).RequireAuthorization().DisableAntiforgery();
        group.MapPut("/{id}", async (int id, [FromForm] UpdateEventCommand command, ISender mediator) => { if (id != command.Id) return Results.BadRequest(); await mediator.Send(command); return Results.NoContent(); }).RequireAuthorization().DisableAntiforgery();
        group.MapDelete("/{id}", async (int id, ISender mediator) => { await mediator.Send(new DeleteEventCommand(id)); return Results.NoContent(); }).RequireAuthorization();
    }

    private static void MapGalleryEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/gallery");
        group.MapGet("/albums", async (ISender mediator) => await mediator.Send(new GetAlbumsQuery())).CacheOutput(c => c.Expire(TimeSpan.FromSeconds(120)));
        group.MapGet("/albums/{slug}", async (string slug, ISender mediator) => await mediator.Send(new GetGalleryImagesQuery(slug))).CacheOutput(c => c.Expire(TimeSpan.FromSeconds(120)).SetVaryByRouteValue("slug"));
        group.MapPost("/albums", async ([FromForm] CreateAlbumCommand command, ISender mediator) => await mediator.Send(command)).RequireAuthorization().DisableAntiforgery();
        group.MapPut("/albums/{id}", async (int id, UpdateAlbumCommand command, ISender mediator) => { if (id != command.Id) return Results.BadRequest(); await mediator.Send(command); return Results.NoContent(); }).RequireAuthorization();
        group.MapDelete("/albums/{id}", async (int id, ISender mediator) => { await mediator.Send(new DeleteAlbumCommand(id)); return Results.NoContent(); }).RequireAuthorization();
        group.MapPost("/albums/{albumId}/images", async (int albumId, [FromForm] UploadMultipleImagesCommand command, ISender mediator) => { if (albumId != command.AlbumId) command = command with { AlbumId = albumId }; await mediator.Send(command); return Results.Ok(); }).RequireAuthorization().DisableAntiforgery();
        group.MapDelete("/image/{id}", async (int id, ISender mediator) => { await mediator.Send(new DeleteImageCommand(id)); return Results.NoContent(); }).RequireAuthorization();
    }

    private static void MapInstitutionEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/institutions");
        group.MapGet("/", async (ISender mediator) => await mediator.Send(new GetInstitutionsQuery())).CacheOutput(c => c.Expire(TimeSpan.FromSeconds(120)));
        group.MapGet("/{slug}", async (string slug, ISender mediator) => await mediator.Send(new GetInstitutionBySlugQuery(slug))).CacheOutput(c => c.Expire(TimeSpan.FromSeconds(120)).SetVaryByRouteValue("slug"));
        group.MapPost("/", async ([FromForm] CreateInstitutionCommand command, ISender mediator) => await mediator.Send(command)).RequireAuthorization().DisableAntiforgery();
        group.MapPut("/{id}", async (int id, [FromForm] UpdateInstitutionCommand command, ISender mediator) => { if (id != command.Id) return Results.BadRequest(); await mediator.Send(command); return Results.NoContent(); }).RequireAuthorization().DisableAntiforgery();
        group.MapDelete("/{id}", async (int id, ISender mediator) => { await mediator.Send(new DeleteInstitutionCommand(id)); return Results.NoContent(); }).RequireAuthorization();
    }

    private static void MapJobPostingEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/jobpostings");
        group.MapGet("/", async (ISender mediator) => await mediator.Send(new GetActiveJobPostingsQuery())).CacheOutput(c => c.Expire(TimeSpan.FromSeconds(120)));
        group.MapPost("/", async (CreateJobPostingCommand command, ISender mediator) => await mediator.Send(command)).RequireAuthorization();
        group.MapPut("/{id}", async (int id, UpdateJobPostingCommand command, ISender mediator) => { if (id != command.Id) return Results.BadRequest(); await mediator.Send(command); return Results.NoContent(); }).RequireAuthorization();
        group.MapDelete("/{id}", async (int id, ISender mediator) => { await mediator.Send(new DeleteJobPostingCommand(id)); return Results.NoContent(); }).RequireAuthorization();
    }

    private static void MapMunicipalityEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/municipality/representatives");
        group.MapGet("/", async (ISender mediator) => await mediator.Send(new GetRepresentativesQuery())).CacheOutput(c => c.Expire(TimeSpan.FromSeconds(300)));
        group.MapGet("/{id:int}", async (int id, ISender mediator) => await mediator.Send(new GetRepresentativeByIdQuery(id))).CacheOutput(c => c.Expire(TimeSpan.FromSeconds(300)).SetVaryByRouteValue("id"));
        group.MapPost("/", async ([FromForm] CreateRepresentativeCommand command, ISender mediator) => await mediator.Send(command)).RequireAuthorization().DisableAntiforgery();
        group.MapPut("/{id}", async (int id, [FromForm] UpdateRepresentativeCommand command, ISender mediator) => { if (id != command.Id) return Results.BadRequest(); await mediator.Send(command); return Results.NoContent(); }).RequireAuthorization().DisableAntiforgery();
        group.MapDelete("/{id}", async (int id, ISender mediator) => { await mediator.Send(new DeleteRepresentativeCommand(id)); return Results.NoContent(); }).RequireAuthorization();
    }

    private static void MapNewsletterEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/newsletter");
        group.MapPost("/subscribe", async (SubscribeNewsletterCommand command, ISender mediator) => await mediator.Send(command));
        group.MapGet("/subscribers", async (IApplicationDbContext context) => await context.NewsletterSubscribers.CountAsync(x => x.IsActive)).RequireAuthorization();
        group.MapPost("/send", async (SendNewsletterCommand command, ISender mediator) => { await mediator.Send(command); return Results.Ok(new { message = "Nincs SMTP implementálva", isDummy = true }); }).RequireAuthorization();
    }

    private static void MapOfficeEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/office");
        group.MapGet("/details", async (ISender mediator) => await mediator.Send(new GetOfficeDetailsQuery())).CacheOutput(c => c.Expire(TimeSpan.FromSeconds(300)));
        group.MapPut("/details", async (UpdateOfficeDetailsCommand command, ISender mediator) => { await mediator.Send(command); return Results.NoContent(); }).RequireAuthorization();
    }

    private static void MapOrganizationEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/organizations");
        group.MapGet("/", async (OrganizationType? type, ISender mediator) => await mediator.Send(new GetOrganizationsQuery(type))).CacheOutput(c => c.Expire(TimeSpan.FromSeconds(120)).SetVaryByQuery("type"));
        group.MapPost("/", async ([FromForm] CreateOrganizationCommand command, ISender mediator) => await mediator.Send(command)).RequireAuthorization().DisableAntiforgery();
        group.MapPut("/{id}", async (int id, [FromForm] UpdateOrganizationCommand command, ISender mediator) => { if (id != command.Id) return Results.BadRequest(); await mediator.Send(command); return Results.NoContent(); }).RequireAuthorization().DisableAntiforgery();
        group.MapDelete("/{id}", async (int id, ISender mediator) => { await mediator.Send(new DeleteOrganizationCommand(id)); return Results.NoContent(); }).RequireAuthorization();
    }

    private static void MapProjectEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/projects");
        group.MapGet("/", async ([AsParameters] GetProjectsWithPaginationQuery query, ISender mediator) => await mediator.Send(query)).CacheOutput(c => c.Expire(TimeSpan.FromSeconds(120)).SetVaryByQuery("pageNumber", "pageSize"));
        group.MapPost("/", async ([FromForm] CreateProjectCommand command, ISender mediator) => await mediator.Send(command)).RequireAuthorization().DisableAntiforgery();
        group.MapPut("/{id}", async (int id, [FromForm] UpdateProjectCommand command, ISender mediator) => { if (id != command.Id) return Results.BadRequest(); await mediator.Send(command); return Results.NoContent(); }).RequireAuthorization().DisableAntiforgery();
        group.MapDelete("/{id}", async (int id, ISender mediator) => { await mediator.Send(new DeleteProjectCommand(id)); return Results.NoContent(); }).RequireAuthorization();
    }

    private static void MapPublicDataRequestEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/publicdatarequests");
        group.MapPost("/", async (CreateDataRequestCommand command, ISender mediator) => await mediator.Send(command)).RequireRateLimiting("StrictSubmitPolicy");
        group.MapGet("/", async (ISender mediator) => await mediator.Send(new GetPublicDataRequestsQuery())).RequireAuthorization();
        group.MapPut("/{id}/status", async (int id, UpdateDataRequestStatusCommand command, ISender mediator) => { if (id != command.Id) return Results.BadRequest(); await mediator.Send(command); return Results.NoContent(); }).RequireAuthorization();
    }

    private static void MapSearchEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapGet("/api/search", async (string? query, IApplicationDbContext context) =>
        {
            if (string.IsNullOrWhiteSpace(query) || query.Length < 2) return Results.Ok(new List<SearchResultDto>());
            var terms = query.ToLower().Split(new[] { ' ', ',', '.', '-' }, StringSplitOptions.RemoveEmptyEntries).Where(t => t.Length > 2).ToList();
            if (!terms.Any()) terms = new List<string> { query.ToLower() };

            var articlesQuery = context.Articles.Where(a => a.IsPublished).AsQueryable();
            var eventsQuery = context.Events.Where(e => e.IsPublished).AsQueryable();

            foreach (var term in terms)
            {
                articlesQuery = articlesQuery.Where(a => a.Title.Contains(term) || a.Content.Contains(term));
                eventsQuery = eventsQuery.Where(e => e.Title.Contains(term) || (e.Description != null && e.Description.Contains(term)));
            }

            var newsResults = await articlesQuery.Select(a => new SearchResultDto { Title = a.Title, Description = a.Excerpt ?? "", Url = $"/hirek/{a.Slug}", ResultType = "Hír" }).Take(5).ToListAsync();
            var eventResults = await eventsQuery.Select(e => new SearchResultDto { Title = e.Title, Description = e.Description ?? "", Url = $"/esemenyek/{e.Slug}", ResultType = "Esemény" }).Take(5).ToListAsync();

            return Results.Ok(newsResults.Concat(eventResults).ToList());
        }).CacheOutput(c => c.Expire(TimeSpan.FromSeconds(60)).SetVaryByQuery("query"));
    }

    private static void MapSiteSettingEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/sitesettings");
        group.MapGet("/", async (ISender mediator) => await mediator.Send(new GetSiteSettingQuery())).CacheOutput(c => c.Expire(TimeSpan.FromSeconds(300)));
        group.MapPut("/", async ([FromForm] UpdateSiteSettingCommand command, ISender mediator) => { await mediator.Send(command); return Results.NoContent(); }).RequireAuthorization().DisableAntiforgery();
    }

    private static void MapUserEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/users").RequireAuthorization(b => b.RequireRole("Administrator"));

        group.MapGet("/", async (UserManager<ApplicationUser> userManager) =>
            Results.Ok(await userManager.Users.Select(u => new { u.Id, u.UserName, u.Email, u.MustChangePassword }).ToListAsync()));

        group.MapPost("/register", async (CreateUserDto model, UserManager<ApplicationUser> userManager) =>
        {
            if (await userManager.FindByEmailAsync(model.Email) != null) return Results.BadRequest(new { message = "Ez az e-mail cím már használatban van!" });
            var user = new ApplicationUser { UserName = model.Email, Email = model.Email, EmailConfirmed = true, MustChangePassword = true };
            var result = await userManager.CreateAsync(user, model.Password);
            if (!result.Succeeded) return Results.BadRequest(new { message = string.Join(" ", result.Errors.Select(e => e.Description)) });
            await userManager.AddToRoleAsync(user, "Administrator");
            return Results.Ok(new { message = "Felhasználó sikeresen létrehozva!" });
        });

        group.MapPut("/{id}", async (string id, UpdateUserDto model, UserManager<ApplicationUser> userManager) =>
        {
            var user = await userManager.FindByIdAsync(id);
            if (user == null) return Results.NotFound();

            if (!string.IsNullOrWhiteSpace(model.Email) && model.Email != user.Email)
            {
                var existing = await userManager.FindByEmailAsync(model.Email);
                if (existing != null && existing.Id != user.Id) return Results.BadRequest(new { message = "Ez az e-mail cím már használatban van!" });
                user.Email = model.Email;
                user.UserName = model.Email;
                await userManager.UpdateAsync(user);
            }

            if (!string.IsNullOrWhiteSpace(model.Password))
            {
                var token = await userManager.GeneratePasswordResetTokenAsync(user);
                var result = await userManager.ResetPasswordAsync(user, token, model.Password);
                if (!result.Succeeded) return Results.BadRequest(new { message = string.Join(" ", result.Errors.Select(e => e.Description)) });
                user.MustChangePassword = true;
                await userManager.UpdateAsync(user);
            }
            return Results.Ok(new { message = "Felhasználó adatai frissítve!" });
        });

        group.MapDelete("/{id}", async (string id, ClaimsPrincipal principal, UserManager<ApplicationUser> userManager) =>
        {
            var user = await userManager.FindByIdAsync(id);
            if (user == null) return Results.NotFound();
            if (principal.FindFirstValue(ClaimTypes.NameIdentifier) == id) return Results.BadRequest(new { message = "Saját magát nem törölheti az adminisztrátor!" });
            await userManager.DeleteAsync(user);
            return Results.NoContent();
        });
    }

    private static void MapVillageLocationEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/locations");
        group.MapGet("/", async (ISender mediator) => await mediator.Send(new GetLocationsQuery())).CacheOutput(c => c.Expire(TimeSpan.FromSeconds(300)));
        group.MapPost("/", async (SaveLocationCommand command, ISender mediator) => await mediator.Send(command)).RequireAuthorization();
        group.MapDelete("/{id:int}", async (int id, ISender mediator) => { await mediator.Send(new DeleteLocationCommand(id)); return Results.NoContent(); }).RequireAuthorization();
    }

    public class LoginRequestDto { public required string Email { get; set; } public required string Password { get; set; } }
    public class ChangePasswordRequestDto { public required string CurrentPassword { get; set; } public required string NewPassword { get; set; } }
    public class CreateUserDto { public required string Email { get; set; } public required string Password { get; set; } }
    public class UpdateUserDto { public string? Email { get; set; } public string? Password { get; set; } }
    public class SearchResultDto { public string Title { get; set; } = string.Empty; public string Description { get; set; } = string.Empty; public string Url { get; set; } = string.Empty; public string ResultType { get; set; } = string.Empty; }
}