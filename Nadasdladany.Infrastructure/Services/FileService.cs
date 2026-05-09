using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Nadasdladany.Application.Interfaces.Common;

namespace Nadasdladany.Infrastructure.Services;

public class FileService : IFileService
{
    private readonly IWebHostEnvironment _webHostEnvironment;

    public FileService(IWebHostEnvironment webHostEnvironment)
    {
        _webHostEnvironment = webHostEnvironment;
    }

    public async Task<string?> UploadFileAsync(IFormFile? file, string folderName)
    {
        if (file == null || file.Length == 0) return null;

        // Path: wwwroot/uploads/{folderName}
        string uploadsFolder = Path.Combine(_webHostEnvironment.WebRootPath, "uploads", folderName);

        if (!Directory.Exists(uploadsFolder))
            Directory.CreateDirectory(uploadsFolder);

        string uniqueFileName = $"{Guid.NewGuid()}_{Path.GetFileName(file.FileName)}";
        string filePath = Path.Combine(uploadsFolder, uniqueFileName);

        using (var fileStream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(fileStream);
        }

        // Return relative path for database storage
        return $"/uploads/{folderName}/{uniqueFileName}";
    }

    public void DeleteFile(string? relativePath)
    {
        if (string.IsNullOrEmpty(relativePath)) return;

        // Trim starting slash for Path.Combine to work correctly
        string fullPath = Path.Combine(_webHostEnvironment.WebRootPath, relativePath.TrimStart('/'));

        if (File.Exists(fullPath))
        {
            File.Delete(fullPath);
        }
    }
}