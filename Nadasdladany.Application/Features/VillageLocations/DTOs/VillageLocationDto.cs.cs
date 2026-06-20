namespace Nadasdladany.Application.Features.VillageLocations.DTOs;

public class VillageLocationDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string IconType { get; set; } = string.Empty;
    public double Latitude { get; set; }
    public double Longitude { get; set; }
    public string Address { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
}