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
            .Must(HaveSupportedExtension).WithMessage("Nem engedélyezett fájltípus! (Csak PDF, DOC, DOCX, XLS, XLSX, ZIP, RAR engedélyezett)")
            .Must(BeUnderMaxSize).WithMessage("A fájl mérete nem haladhatja meg a 25 MB-ot.");
    }

    private bool HaveSupportedExtension(IFormFile file)
    {
        if (file == null) return false;
        var ext = Path.GetExtension(file.FileName).ToLowerInvariant();
        var allowedExtensions = new[] { ".pdf", ".doc", ".docx", ".xls", ".xlsx", ".zip", ".rar" };
        return allowedExtensions.Contains(ext);
    }

    private bool BeUnderMaxSize(IFormFile file)
    {
        if (file == null) return false;
        return file.Length <= 25 * 1024 * 1024;
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