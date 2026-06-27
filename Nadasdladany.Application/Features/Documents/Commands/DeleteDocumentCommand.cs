using MediatR;
using Nadasdladany.Application.Common.Exceptions;
using Nadasdladany.Application.Interfaces.Common;
using Nadasdladany.Domain.Entities;

namespace Nadasdladany.Application.Features.Documents.Commands;

public record DeleteDocumentCommand(int Id) : IRequest;

public class DeleteDocumentCommandHandler(IApplicationDbContext context, IFileService fileService) : IRequestHandler<DeleteDocumentCommand>
{
    public async Task Handle(DeleteDocumentCommand request, CancellationToken cancellationToken)
    {
        var entity = await context.Documents.FindAsync(new object[] { request.Id }, cancellationToken);

        if (entity == null)
            throw new NotFoundException(nameof(Document), request.Id);

        fileService.DeleteFile(entity.FilePath);

        context.Documents.Remove(entity);
        await context.SaveChangesAsync(cancellationToken);
    }
}