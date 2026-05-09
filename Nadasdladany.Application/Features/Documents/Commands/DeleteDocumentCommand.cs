using MediatR;
using Nadasdladany.Application.Common.Exceptions;
using Nadasdladany.Application.Interfaces.Common;
using Nadasdladany.Domain.Entities;

namespace Nadasdladany.Application.Features.Documents.Commands;

public record DeleteDocumentCommand(int Id) : IRequest;

public class DeleteDocumentCommandHandler : IRequestHandler<DeleteDocumentCommand>
{
    private readonly IApplicationDbContext _context;
    private readonly IFileService _fileService;

    public DeleteDocumentCommandHandler(IApplicationDbContext context, IFileService fileService)
    {
        _context = context;
        _fileService = fileService;
    }

    public async Task Handle(DeleteDocumentCommand request, CancellationToken cancellationToken)
    {
        var entity = await _context.Documents.FindAsync(new object[] { request.Id }, cancellationToken);

        if (entity == null)
            throw new NotFoundException(nameof(Document), request.Id);

        // Delete physical file
        _fileService.DeleteFile(entity.FilePath);

        _context.Documents.Remove(entity);
        await _context.SaveChangesAsync(cancellationToken);
    }
}