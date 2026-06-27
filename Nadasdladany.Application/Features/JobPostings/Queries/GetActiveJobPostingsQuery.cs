using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Nadasdladany.Application.Features.JobPostings.DTOs;
using Nadasdladany.Application.Interfaces.Common;

namespace Nadasdladany.Application.Features.JobPostings.Queries;

public record GetActiveJobPostingsQuery : IRequest<List<JobPostingDto>>;

public class GetActiveJobPostingsQueryHandler(IApplicationDbContext context, IMapper mapper) : IRequestHandler<GetActiveJobPostingsQuery, List<JobPostingDto>>
{
    public async Task<List<JobPostingDto>> Handle(GetActiveJobPostingsQuery request, CancellationToken cancellationToken)
    {
        return await context.JobPostings
            .AsNoTracking()
            .Where(x => x.IsActive)
            .OrderByDescending(x => x.CreatedAt)
            .ProjectTo<JobPostingDto>(mapper.ConfigurationProvider)
            .ToListAsync(cancellationToken);
    }
}