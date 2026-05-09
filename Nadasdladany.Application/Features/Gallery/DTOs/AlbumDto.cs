using Nadasdladany.Application.Common.Mappings;
using Nadasdladany.Domain.Entities;

namespace Nadasdladany.Application.Features.Gallery.DTOs;

public class AlbumDto : IMapFrom<GalleryAlbum>
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? Slug { get; set; }
    public int DisplayOrder { get; set; }
    public int ImageCount { get; set; }

    public void Mapping(AutoMapper.Profile profile)
    {
        profile.CreateMap<GalleryAlbum, AlbumDto>()
            .ForMember(d => d.ImageCount, opt => opt.MapFrom(s => s.Images.Count));
    }
}