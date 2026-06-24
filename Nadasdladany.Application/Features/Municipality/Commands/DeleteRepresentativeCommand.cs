using MediatR;
using Nadasdladany.Application.Common.Exceptions;
using Nadasdladany.Application.Interfaces.Common;
using Nadasdladany.Domain.Entities;

namespace Nadasdladany.Application.Features.Municipality.Commands;

public record DeleteRepresentativeCommand(int Id) : IRequest;

public class DeleteRepresentativeCommandHandler : IRequestHandler<DeleteRepresentativeCommand>
{
    private readonly IApplicationDbContext _context;
    private readonly IFileService _fileService;

    public DeleteRepresentativeCommandHandler(IApplicationDbContext context, IFileService fileService)
    {
        _context = context;
        _fileService = fileService;
    }

    public async Task Handle(DeleteRepresentativeCommand request, CancellationToken cancellationToken)
    {
        var entity = await _context.Representatives.FindAsync(new object[] { request.Id }, cancellationToken);
        if (entity == null) throw new NotFoundException(nameof(Representative), request.Id);

        if (!string.IsNullOrEmpty(entity.ImageUrl))
        {
            _fileService.DeleteFile(entity.ImageUrl);
        }

        _context.Representatives.Remove(entity);
        await _context.SaveChangesAsync(cancellationToken);
    }
}