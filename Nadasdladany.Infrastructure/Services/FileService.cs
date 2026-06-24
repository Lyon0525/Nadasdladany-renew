using Microsoft.AspNetCore.Http;
using Nadasdladany.Application.Interfaces.Common;
using System.IO;

namespace Nadasdladany.Infrastructure.Services;

public class FileService : IFileService
{
    private readonly string _baseStoragePath;

    public FileService()
    {
        _baseStoragePath = Path.Combine(Directory.GetCurrentDirectory(), "app_data_uploads");
    }

    public async Task<string> UploadFileAsync(IFormFile file, string subFolder)
    {
        if (file == null || file.Length == 0) return string.Empty;

        var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
        var blockedExtensions = new[] { ".exe", ".sh", ".bat", ".cmd", ".ps1", ".php", ".phtml", ".js", ".jsp", ".dll", ".cgi", ".py" };

        if (blockedExtensions.Contains(extension) || string.IsNullOrEmpty(extension))
        {
            throw new InvalidOperationException($"Biztonsági okokból ez a fájltípus ({extension}) nem tölthető fel!");
        }

        var targetFolder = Path.Combine(_baseStoragePath, subFolder);

        if (!Directory.Exists(targetFolder))
        {
            Directory.CreateDirectory(targetFolder);
        }

        var fileName = $"{Guid.NewGuid()}{extension}";
        var filePath = Path.Combine(targetFolder, fileName);

        using (var fileStream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(fileStream);
        }

        return $"/uploads/{subFolder}/{fileName}";
    }

    public void DeleteFile(string relativePath)
    {
        if (string.IsNullOrEmpty(relativePath)) return;

        var cleanPath = relativePath.Replace("/uploads/", "").Replace("uploads/", "").Replace("/", Path.DirectorySeparatorChar.ToString());
        var fullPath = Path.Combine(_baseStoragePath, cleanPath);

        if (File.Exists(fullPath))
        {
            File.Delete(fullPath);
        }
    }
}