using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Nadasdladany.Application.Interfaces.Common;
using Nadasdladany.Infrastructure.Identity;
using Nadasdladany.Infrastructure.Persistence;
using Nadasdladany.Infrastructure.Services;

namespace Nadasdladany.Infrastructure;

/// <summary>
/// Static class to register infrastructure services to the DI container.
/// </summary>
public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructureServices(this IServiceCollection services, IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("DefaultConnection");

        if (string.IsNullOrEmpty(connectionString))
        {
            throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");
        }

        // 1. Database Configuration
        services.AddDbContext<NadasdladanyDbContext>(options =>
            options.UseSqlServer(connectionString,
                builder => builder.MigrationsAssembly(typeof(NadasdladanyDbContext).Assembly.FullName)));

        // 2. Register DbContext as the Interface
        services.AddScoped<IApplicationDbContext>(provider => provider.GetRequiredService<NadasdladanyDbContext>());

        services.AddScoped<NadasdladanyDbContextInitialiser>();

        // 3. Identity Configuration
        services.AddIdentityCore<ApplicationUser>()
            .AddRoles<IdentityRole>()
            .AddEntityFrameworkStores<NadasdladanyDbContext>()
            .AddApiEndpoints(); // .NET 8+ feature for built-in Identity APIs

        // 4. Register Custom Services
        services.AddTransient<IIdentityService, IdentityService>();
        services.AddTransient<IDateTime, DateTimeService>();
        services.AddTransient<IFileService, FileService>();
        services.AddHttpContextAccessor(); // Kell a CurrentUserService-hez!
        services.AddTransient<ICurrentUserService, CurrentUserService>();
        services.AddTransient<IEmailService, DummyEmailService>();
        services.AddTransient<ISlugService, SlugService>();

        // 5. Add Authorization (basic)
        services.AddAuthorizationBuilder();

        return services;
    }
}