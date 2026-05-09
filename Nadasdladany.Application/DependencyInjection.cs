using System.Reflection;
using FluentValidation;
using MediatR;
using Microsoft.Extensions.DependencyInjection;
using Nadasdladany.Application.Common.Behaviors;

namespace Nadasdladany.Application;

/// <summary>
/// Registers Application layer services to the DI container.
/// </summary>
public static class DependencyInjection
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        var assembly = Assembly.GetExecutingAssembly();

        // 1. Register AutoMapper:
        // Az AddMaps automatikusan megkeresi az összes IMapFrom interfészt
        services.AddAutoMapper(cfg => cfg.AddMaps(assembly));

        // 2. Register all FluentValidation validators found in this project
        services.AddValidatorsFromAssembly(assembly);

        // 3. Register MediatR
        services.AddMediatR(cfg => {
            cfg.RegisterServicesFromAssembly(assembly);

            // A sorrend itt kritikus: a folyamatok alulról felfelé épülnek
            // 1. Unhandled Exception (Ez kap el mindent a végén)
            cfg.AddBehavior(typeof(IPipelineBehavior<,>), typeof(UnhandledExceptionBehavior<,>));

            // 2. Validation (Ez dobja el a parancsot, ha az adatok rosszak)
            cfg.AddBehavior(typeof(IPipelineBehavior<,>), typeof(ValidationBehavior<,>));

            // 3. Performance (Ez méri a sebességet)
            cfg.AddBehavior(typeof(IPipelineBehavior<,>), typeof(PerformanceBehavior<,>));
        });

        return services;
    }
}