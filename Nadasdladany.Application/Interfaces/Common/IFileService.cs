using Microsoft.AspNetCore.Http;

namespace Nadasdladany.Application.Interfaces.Common;

public interface IFileService
{
    Task<string?> UploadFileAsync(IFormFile? file, string folderName);
    void DeleteFile(string? relativePath);
}