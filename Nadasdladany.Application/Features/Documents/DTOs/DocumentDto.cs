using AutoMapper;
using Nadasdladany.Application.Common.Mappings;
using Nadasdladany.Domain.Entities;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace Nadasdladany.Application.Features.Documents.DTOs;

public class DocumentDto : IMapFrom<Document>
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string FilePath { get; set; } = string.Empty;
    public string? FileType { get; set; }
    public long? FileSizeInBytes { get; set; }
    public DateTime CreatedAt { get; set; }

    public int DocumentCategoryId { get; set; }
    public string CategoryName { get; set; } = string.Empty;

    public void Mapping(Profile profile)
    {
        profile.CreateMap<Document, DocumentDto>()
            .ForMember(d => d.CategoryName, opt => opt.MapFrom(s => s.DocumentCategory.Name));
    }
}