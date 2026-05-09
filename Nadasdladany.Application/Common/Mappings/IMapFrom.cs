using AutoMapper;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace Nadasdladany.Application.Common.Mappings;

/// <summary>
/// Interface to mark DTOs for automatic mapping from a specific entity.
/// </summary>
/// <typeparam name="T">The source entity type.</typeparam>
public interface IMapFrom<T>
{
    /// <summary>
    /// Defines the mapping profile. Can be overridden for custom logic.
    /// </summary>
    void Mapping(Profile profile) => profile.CreateMap(typeof(T), GetType());
}