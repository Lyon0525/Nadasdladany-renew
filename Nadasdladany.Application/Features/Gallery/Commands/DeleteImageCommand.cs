using MediatR;
using Nadasdladany.Application.Common.Exceptions;
using Nadasdladany.Application.Interfaces.Common;
using Nadasdladany.Domain.Entities;

namespace Nadasdladany.Application.Features.Gallery.Commands;

public record DeleteImageCommand(int Id) : IRequest;

public class DeleteImageCommandHandler : IRequestHandler<DeleteImageCommand>
{
    private readonly IApplicationDbContext _context;
    private readonly IFileService _fileService;

    public DeleteImageCommandHandler(IApplicationDbContext context, IFileService fileService)
    {
        _context = context;
        _fileService = fileService;
    }

    public async Task Handle(DeleteImageCommand request, CancellationToken cancellationToken)
    {
        var entity = await _context.GalleryImages.FindAsync(new object[] { request.Id }, cancellationToken);

        if (entity == null)
            throw new NotFoundException(nameof(GalleryImage), request.Id);

        _fileService.DeleteFile(entity.ImageUrl);

        _context.GalleryImages.Remove(entity);
        await _context.SaveChangesAsync(cancellationToken);
    }
}