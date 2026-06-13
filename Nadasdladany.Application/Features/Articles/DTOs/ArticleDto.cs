using AutoMapper;
using Nadasdladany.Application.Common.Mappings;
using Nadasdladany.Domain.Entities;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace Nadasdladany.Application.Features.Articles.DTOs;

public class ArticleDto : IMapFrom<Article>
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string? Excerpt { get; set; }
    public string Content { get; set; } = string.Empty;
    public string? FeaturedImageUrl { get; set; }
    public DateTime PublishedDate { get; set; }
    public string? Author { get; set; }
    public int CategoryId { get; set; }
    public string CategoryName { get; set; } = string.Empty;

    public void Mapping(Profile profile)
    {
        profile.CreateMap<Article, ArticleDto>()
            .ForMember(d => d.CategoryName, opt => opt.MapFrom(s => s.Category != null ? s.Category.Name : string.Empty));
    }
}