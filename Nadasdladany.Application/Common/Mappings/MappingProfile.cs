using AutoMapper;
using System.Reflection;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace Nadasdladany.Application.Common.Mappings;

/// <summary>
/// Generic AutoMapper profile that automatically discovers and applies mappings.
/// </summary>
public class MappingProfile : Profile
{
    public MappingProfile()
    {
        ApplyMappingsFromAssembly(Assembly.GetExecutingAssembly());
    }

    private void ApplyMappingsFromAssembly(Assembly assembly)
    {
        var mapFromType = typeof(IMapFrom<>);

        // Kikeressük az összes típust, ami implementálja az IMapFrom<> interfészt
        var types = assembly.GetExportedTypes()
            .Where(t => t.GetInterfaces().Any(i =>
                i.IsGenericType && i.GetGenericTypeDefinition() == mapFromType))
            .ToList();

        foreach (var type in types)
        {
            // Létrehozunk egy példányt a típusból, hogy meghívhassuk rajta a Mapping metódust
            var instance = Activator.CreateInstance(type);

            // A 'Mapping' metódust az interfészen keresztül érjük el,
            // így elkerüljük az AmbiguousMatchException-t.
            var interfaceType = type.GetInterfaces().FirstOrDefault(i =>
                i.IsGenericType && i.GetGenericTypeDefinition() == mapFromType);

            if (interfaceType != null)
            {
                // A 'GetMethod' helyett konkrétabban keressük az interfész metódusát
                var methodInfo = interfaceType.GetMethod("Mapping")
                                 ?? type.GetMethod("Mapping");

                // Execute the mapping configuration
                methodInfo?.Invoke(instance, new object[] { this });
            }
        }
    }
}