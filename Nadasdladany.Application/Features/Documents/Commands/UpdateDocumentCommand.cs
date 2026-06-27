using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Http;
using Nadasdladany.Application.Common.Exceptions;
using Nadasdladany.Application.Interfaces.Common;
using Nadasdladany.Domain.Entities;
using System.IO;

namespace Nadasdladany.Application.Features.Documents.Commands;

public record UpdateDocumentCommand : IRequest
{
    public int Id { get; init; }
    public required string Title { get; init; }
    public string? Description { get; init; }
    public int CategoryId { get; init; }
    public IFormFile? File { get; init; }
}

public class UpdateDocumentCommandValidator : AbstractValidator<UpdateDocumentCommand>
{
    public UpdateDocumentCommandValidator()
    {
        RuleFor(v => v.Title).MaximumLength(255).NotEmpty();
        RuleFor(v => v.CategoryId).NotEmpty();
        RuleFor(v => v.File)
            .Must(HaveSupportedExtension).WithMessage("Nem engedélyezett fájltípus! (Csak PDF, DOC, DOCX, XLS, XLSX, ZIP, RAR engedélyezett)")
            .Must(BeUnderMaxSize).WithMessage("A fájl mérete nem haladhatja meg a 25 MB-ot.")
            .When(v => v.File != null);
    }

    private bool HaveSupportedExtension(IFormFile? file)
    {
        if (file == null || file.Length == 0) return false;
        var ext = Path.GetExtension(file.FileName).ToLowerInvariant();
        var allowedExtensions = new[] { ".pdf", ".doc", ".docx", ".xls", ".xlsx", ".zip", ".rar" };
        return allowedExtensions.Contains(ext);
    }

    private bool BeUnderMaxSize(IFormFile? file)
    {
        if (file == null || file.Length == 0) return false;
        return file.Length <= 25 * 1024 * 1024;
    }
}

public class UpdateDocumentCommandHandler(IApplicationDbContext context, IFileService fileService) : IRequestHandler<UpdateDocumentCommand>
{
    public async Task Handle(UpdateDocumentCommand request, CancellationToken cancellationToken)
    {
        var entity = await context.Documents.FindAsync(new object[] { request.Id }, cancellationToken);
        if (entity == null) throw new NotFoundException(nameof(Document), request.Id);

        entity.Title = request.Title;
        entity.Description = request.Description;
        entity.DocumentCategoryId = request.CategoryId;

        if (request.File != null)
        {
            fileService.DeleteFile(entity.FilePath);

            string? newFilePath = await fileService.UploadFileAsync(request.File, "documents");
            if (string.IsNullOrEmpty(newFilePath)) throw new InvalidOperationException("A fájl mentése sikertelen volt.");

            entity.FilePath = newFilePath;
            entity.FileType = Path.GetExtension(request.File.FileName).Replace(".", "").ToUpper();
            entity.FileSizeInBytes = request.File.Length;
        }

        await context.SaveChangesAsync(cancellationToken);
    }
}