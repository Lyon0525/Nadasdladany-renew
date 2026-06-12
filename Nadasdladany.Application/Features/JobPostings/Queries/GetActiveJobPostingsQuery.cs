using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Nadasdladany.Application.Features.JobPostings.DTOs;
using Nadasdladany.Application.Interfaces.Common;

namespace Nadasdladany.Application.Features.JobPostings.Queries;

public record GetActiveJobPostingsQuery : IRequest<List<JobPostingDto>>;

public class GetActiveJobPostingsQueryHandler : IRequestHandler<GetActiveJobPostingsQuery, List<JobPostingDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetActiveJobPostingsQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<List<JobPostingDto>> Handle(GetActiveJobPostingsQuery request, CancellationToken cancellationToken)
    {
        return await _context.JobPostings
            .AsNoTracking()
            .Where(x => x.IsActive)
            .OrderByDescending(x => x.CreatedAt)
            .ProjectTo<JobPostingDto>(_mapper.ConfigurationProvider)
            .ToListAsync(cancellationToken);
    }
}