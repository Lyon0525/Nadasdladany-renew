using MediatR;
using Nadasdladany.Application.Common.Exceptions;
using Nadasdladany.Application.Interfaces.Common;
using Nadasdladany.Domain.Entities;

namespace Nadasdladany.Application.Features.Organizations.Commands;

public record DeleteOrganizationCommand(int Id) : IRequest;

public class DeleteOrganizationCommandHandler : IRequestHandler<DeleteOrganizationCommand>
{
    private readonly IApplicationDbContext _context;
    private readonly IFileService _fileService;

    public DeleteOrganizationCommandHandler(IApplicationDbContext context, IFileService fileService)
    {
        _context = context;
        _fileService = fileService;
    }

    public async Task Handle(DeleteOrganizationCommand request, CancellationToken cancellationToken)
    {
        var entity = await _context.Organizations.FindAsync(new object[] { request.Id }, cancellationToken);
        if (entity == null) throw new NotFoundException(nameof(Organization), request.Id);

        if (!string.IsNullOrEmpty(entity.ImageUrl))
        {
            _fileService.DeleteFile(entity.ImageUrl);
        }

        _context.Organizations.Remove(entity);
        await _context.SaveChangesAsync(cancellationToken);
    }
}