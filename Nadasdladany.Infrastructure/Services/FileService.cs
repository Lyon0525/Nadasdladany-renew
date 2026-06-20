using Microsoft.AspNetCore.Http;
using Nadasdladany.Application.Interfaces.Common;

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

        var targetFolder = Path.Combine(_baseStoragePath, subFolder);

        if (!Directory.Exists(targetFolder))
        {
            Directory.CreateDirectory(targetFolder);
        }

        var fileName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
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