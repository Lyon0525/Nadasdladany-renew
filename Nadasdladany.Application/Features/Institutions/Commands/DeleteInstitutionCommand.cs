using MediatR;
using Nadasdladany.Application.Common.Exceptions;
using Nadasdladany.Application.Interfaces.Common;
using Nadasdladany.Domain.Entities;

namespace Nadasdladany.Application.Features.Institutions.Commands;

public record DeleteInstitutionCommand(int Id) : IRequest;

public class DeleteInstitutionCommandHandler : IRequestHandler<DeleteInstitutionCommand>
{
    private readonly IApplicationDbContext _context;
    private readonly IFileService _fileService;

    public DeleteInstitutionCommandHandler(IApplicationDbContext context, IFileService fileService)
    {
        _context = context;
        _fileService = fileService;
    }

    public async Task Handle(DeleteInstitutionCommand request, CancellationToken cancellationToken)
    {
        var entity = await _context.Institutions.FindAsync(new object[] { request.Id }, cancellationToken);

        if (entity == null)
            throw new NotFoundException(nameof(Institution), request.Id);

        if (!string.IsNullOrEmpty(entity.ImageUrl))
            _fileService.DeleteFile(entity.ImageUrl);

        _context.Institutions.Remove(entity);
        await _context.SaveChangesAsync(cancellationToken);
    }
}