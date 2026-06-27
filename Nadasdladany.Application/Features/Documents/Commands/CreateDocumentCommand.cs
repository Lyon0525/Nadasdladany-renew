using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Http;
using Nadasdladany.Application.Interfaces.Common;
using Nadasdladany.Domain.Entities;
using System.IO;

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
        RuleFor(v => v.File)
            .NotNull().WithMessage("Kérjük, válasszon ki egy fájlt a feltöltéshez!")
            .Must(f => f != null && f.Length > 0).WithMessage("A kiválasztott fájl üres (0 byte) vagy érvénytelen!")
            .Must(HaveSupportedExtension).WithMessage("Nem engedélyezett fájltípus! (Csak PDF, DOC, DOCX, XLS, XLSX, ZIP, RAR engedélyezett)")
            .Must(BeUnderMaxSize).WithMessage("A fájl mérete nem haladhatja meg a 25 MB-ot.");
    }

    private bool HaveSupportedExtension(IFormFile file)
    {
        if (file == null || file.Length == 0) return false;
        var ext = Path.GetExtension(file.FileName).ToLowerInvariant();
        var allowedExtensions = new[] { ".pdf", ".doc", ".docx", ".xls", ".xlsx", ".zip", ".rar" };
        return allowedExtensions.Contains(ext);
    }

    private bool BeUnderMaxSize(IFormFile file)
    {
        if (file == null || file.Length == 0) return false;
        return file.Length <= 25 * 1024 * 1024;
    }
}

public class CreateDocumentCommandHandler(IApplicationDbContext context, IFileService fileService) : IRequestHandler<CreateDocumentCommand, int>
{
    public async Task<int> Handle(CreateDocumentCommand request, CancellationToken cancellationToken)
    {
        string? filePath = await fileService.UploadFileAsync(request.File, "documents");

        if (string.IsNullOrEmpty(filePath))
            throw new InvalidOperationException("A fájl mentése biztonsági okokból sikertelen volt a szerveren.");

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

        context.Documents.Add(entity);
        await context.SaveChangesAsync(cancellationToken);

        return entity.Id;
    }
}