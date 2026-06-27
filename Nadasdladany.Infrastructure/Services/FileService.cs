using Microsoft.AspNetCore.Http;
using Nadasdladany.Application.Interfaces.Common;

namespace Nadasdladany.Infrastructure.Services;

public class FileService : IFileService
{
    private readonly string _baseStoragePath;

    private static readonly Dictionary<string, List<byte[]>> _fileSignatures = new()
    {
        { ".jpeg", new List<byte[]> { new byte[] { 0xFF, 0xD8, 0xFF } } },
        { ".jpg", new List<byte[]> { new byte[] { 0xFF, 0xD8, 0xFF } } },
        { ".png", new List<byte[]> { new byte[] { 0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A } } },
        { ".gif", new List<byte[]> { new byte[] { 0x47, 0x49, 0x46, 0x38 } } },
        { ".webp", new List<byte[]> { new byte[] { 0x52, 0x49, 0x46, 0x46 } } },
        { ".pdf", new List<byte[]> { new byte[] { 0x25, 0x50, 0x44, 0x46 } } },
        { ".zip", new List<byte[]> {
            new byte[] { 0x50, 0x4B, 0x03, 0x04 },
            new byte[] { 0x50, 0x4B, 0x4C, 0x49 },
            new byte[] { 0x50, 0x4B, 0x53, 0x70 }
        }},
        { ".docx", new List<byte[]> { new byte[] { 0x50, 0x4B, 0x03, 0x04 } } },
        { ".xlsx", new List<byte[]> { new byte[] { 0x50, 0x4B, 0x03, 0x04 } } },
        { ".doc", new List<byte[]> { new byte[] { 0xD0, 0xCF, 0x11, 0xE0, 0xA1, 0xB1, 0x1A, 0xE1 } } },
        { ".xls", new List<byte[]> { new byte[] { 0xD0, 0xCF, 0x11, 0xE0, 0xA1, 0xB1, 0x1A, 0xE1 } } },
        { ".rar", new List<byte[]> {
            new byte[] { 0x52, 0x61, 0x72, 0x21, 0x1A, 0x07, 0x00 },
            new byte[] { 0x52, 0x61, 0x72, 0x21, 0x1A, 0x07, 0x01, 0x00 }
        }}
    };

    public FileService()
    {
        _baseStoragePath = Path.Combine(Directory.GetCurrentDirectory(), "app_data_uploads");
    }

    public async Task<string?> UploadFileAsync(IFormFile? file, string subFolder)
    {
        if (file == null || file.Length == 0) return string.Empty;

        var extension = Path.GetExtension(file.FileName).ToLowerInvariant();

        if (string.IsNullOrEmpty(extension) || !_fileSignatures.ContainsKey(extension))
        {
            throw new InvalidOperationException($"Biztonsági okokból ez a fájltípus ({extension}) nem engedélyezett!");
        }

        using (var reader = new BinaryReader(file.OpenReadStream()))
        {
            var signatures = _fileSignatures[extension];
            var headerBytes = reader.ReadBytes(signatures.Max(m => m.Length));

            bool isMatch = signatures.Any(signature =>
                headerBytes.Take(signature.Length).SequenceEqual(signature));

            if (!isMatch)
            {
                throw new InvalidOperationException($"A fájl tartalma nem egyezik a kiterjesztésével ({extension})! Lehetséges biztonsági kockázat vagy sérült fájl.");
            }
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
            file.OpenReadStream().Position = 0;
            await file.CopyToAsync(fileStream);
        }

        return $"/uploads/{subFolder}/{fileName}";
    }

    public void DeleteFile(string? relativePath)
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