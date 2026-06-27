using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Nadasdladany.Application.Common.Exceptions;
using Nadasdladany.Application.Features.Municipality.DTOs;
using Nadasdladany.Application.Interfaces.Common;
using Nadasdladany.Domain.Entities;

namespace Nadasdladany.Application.Features.Municipality.Queries;

public record GetRepresentativeByIdQuery(int Id) : IRequest<RepresentativeDto>;

public class GetRepresentativeByIdQueryHandler : IRequestHandler<GetRepresentativeByIdQuery, RepresentativeDto>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetRepresentativeByIdQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<RepresentativeDto> Handle(GetRepresentativeByIdQuery request, CancellationToken cancellationToken)
    {
        var entity = await _context.Representatives
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.IsPublished && x.Id == request.Id, cancellationToken);

        if (entity == null)
            throw new NotFoundException(nameof(Representative), request.Id);

        return _mapper.Map<RepresentativeDto>(entity);
    }
}