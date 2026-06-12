using System.Reflection;
using System.Runtime.Serialization;
using AutoMapper;

namespace Nadasdladany.Application.Common.Mappings;

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
            var instance = System.Runtime.CompilerServices.RuntimeHelpers.GetUninitializedObject(type);

            var interfaceType = type.GetInterfaces().FirstOrDefault(i =>
                i.IsGenericType && i.GetGenericTypeDefinition() == mapFromType);

            if (interfaceType != null)
            {
                var methodInfo = interfaceType.GetMethod("Mapping")
                                 ?? type.GetMethod("Mapping");

                methodInfo?.Invoke(instance, new object[] { this });
            }
        }
    }
}