using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Http;
using Nadasdladany.Application.Interfaces.Common;
using Nadasdladany.Domain.Entities;

namespace Nadasdladany.Application.Features.Documents.Commands;

public record CreateDocumentCommand : IRequest<int>
{
    public required string Title { get; init; }
    public string? Description { get; init; }
    public int CategoryId { get; init; }
    public required IFormFile File { get; init; }
}

public class CreateDocumentCommandValidator : AbstractValidator<CreateDocumentCommand>
{
    public CreateDocumentCommandValidator()
    {
        RuleFor(v => v.Title).MaximumLength(255).NotEmpty();
        RuleFor(v => v.CategoryId).NotEmpty();
        RuleFor(v => v.File).NotNull();
    }
}

public class CreateDocumentCommandHandler : IRequestHandler<CreateDocumentCommand, int>
{
    private readonly IApplicationDbContext _context;
    private readonly IFileService _fileService;

    public CreateDocumentCommandHandler(IApplicationDbContext context, IFileService fileService)
    {
        _context = context;
        _fileService = fileService;
    }

    public async Task<int> Handle(CreateDocumentCommand request, CancellationToken cancellationToken)
    {
        string? filePath = await _fileService.UploadFileAsync(request.File, "documents");

        if (string.IsNullOrEmpty(filePath))
            throw new Exception("File upload failed.");

        var entity = new Document
        {
            Title = request.Title,
            Description = request.Description,
            DocumentCategoryId = request.CategoryId,
            FilePath = filePath,
            FileType = Path.GetExtension(request.File.FileName).Replace(".", "").ToUpper(),
            FileSizeInBytes = request.File.Length,
            IsPublished = true
        };

        _context.Documents.Add(entity);
        await _context.SaveChangesAsync(cancellationToken);

        return entity.Id;
    }
}