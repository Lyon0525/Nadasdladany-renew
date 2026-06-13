using AutoMapper;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace Nadasdladany.Application.Common.Mappings;

public interface IMapFrom<T>
{
    void Mapping(Profile profile) => profile.CreateMap(typeof(T), GetType());
}