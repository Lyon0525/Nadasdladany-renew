using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Nadasdladany.Application.Interfaces.Common;
using Nadasdladany.Infrastructure.Identity;
using Nadasdladany.Infrastructure.Persistence;
using Nadasdladany.Infrastructure.Services;

namespace Nadasdladany.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructureServices(this IServiceCollection services, IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("DefaultConnection");

        if (string.IsNullOrEmpty(connectionString))
        {
            throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");
        }

        services.AddDbContext<NadasdladanyDbContext>(options =>
            options.UseSqlServer(connectionString,
                builder => builder.MigrationsAssembly(typeof(NadasdladanyDbContext).Assembly.FullName)));

        services.AddScoped<IApplicationDbContext>(provider => provider.GetRequiredService<NadasdladanyDbContext>());

        services.AddScoped<NadasdladanyDbContextInitialiser>();

        services.AddIdentityCore<ApplicationUser>(options =>
        {
            options.Password.RequireDigit = true;
            options.Password.RequireLowercase = true;
            options.Password.RequireNonAlphanumeric = true;
            options.Password.RequireUppercase = true;
            options.Password.RequiredLength = 8;
        })
            .AddRoles<IdentityRole>()
            .AddEntityFrameworkStores<NadasdladanyDbContext>()
            .AddDefaultTokenProviders()
            .AddApiEndpoints();

        services.AddTransient<IIdentityService, IdentityService>();
        services.AddTransient<IDateTime, DateTimeService>();
        services.AddTransient<IFileService, FileService>();
        services.AddHttpContextAccessor();
        services.AddTransient<ICurrentUserService, CurrentUserService>();
        services.AddTransient<IEmailService, DummyEmailService>();
        services.AddTransient<ISlugService, SlugService>();

        services.AddAuthorizationBuilder();

        return services;
    }
}