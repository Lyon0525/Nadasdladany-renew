using MediatR;
using Nadasdladany.Application.Common.Exceptions;
using Nadasdladany.Application.Interfaces.Common;
using Nadasdladany.Domain.Entities;

namespace Nadasdladany.Application.Features.Articles.Commands;

public record DeleteArticleCommand(int Id) : IRequest;

public class DeleteArticleCommandHandler(IApplicationDbContext context) : IRequestHandler<DeleteArticleCommand>
{
    public async Task Handle(DeleteArticleCommand request, CancellationToken cancellationToken)
    {
        var entity = await context.Articles.FindAsync(new object[] { request.Id }, cancellationToken);

        if (entity == null)
        {
            throw new NotFoundException(nameof(Article), request.Id);
        }

        context.Articles.Remove(entity);
        await context.SaveChangesAsync(cancellationToken);
    }
}