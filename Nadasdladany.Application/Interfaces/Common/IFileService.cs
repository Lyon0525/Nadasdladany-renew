using Microsoft.AspNetCore.Http;

namespace Nadasdladany.Application.Interfaces.Common;

/// <summary>
/// Handles file operations like upload and deletion.
/// </summary>
public interface IFileService
{
    /// <summary>
    /// Uploads a file and returns its relative path.
    /// </summary>
    Task<string?> UploadFileAsync(IFormFile? file, string folderName);

    /// <summary>
    /// Deletes a file from the server.
    /// </summary>
    void DeleteFile(string? relativePath);
}