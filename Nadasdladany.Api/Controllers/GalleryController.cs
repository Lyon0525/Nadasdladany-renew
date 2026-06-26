using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Nadasdladany.Application.Features.Gallery.Commands;
using Nadasdladany.Application.Features.Gallery.DTOs;
using Nadasdladany.Application.Features.Gallery.Queries;

namespace Nadasdladany.Api.Controllers;

public class GalleryController : ApiControllerBase
{
    [HttpGet("albums")]
    public async Task<ActionResult<List<AlbumDto>>> GetAlbums()
    {
        return await Mediator.Send(new GetAlbumsQuery());
    }

    [HttpGet("albums/{slug}")]
    public async Task<ActionResult<List<GalleryImageDto>>> GetImagesByAlbum(string slug)
    {
        return await Mediator.Send(new GetGalleryImagesQuery(slug));
    }

    [HttpPost("albums")]
    [Consumes("multipart/form-data")]
    [Authorize]
    public async Task<ActionResult<int>> CreateAlbum([FromForm] CreateAlbumCommand command)
    {
        return await Mediator.Send(command);
    }

    [HttpPut("albums/{id}")]
    [Authorize]
    public async Task<ActionResult> UpdateAlbum(int id, [FromBody] UpdateAlbumCommand command)
    {
        if (id != command.Id) return BadRequest("ID mismatch");
        await Mediator.Send(command);
        return NoContent();
    }

    [HttpDelete("albums/{id}")]
    [Authorize]
    public async Task<ActionResult> DeleteAlbum(int id)
    {
        await Mediator.Send(new DeleteAlbumCommand(id));
        return NoContent();
    }

    [HttpPost("albums/{albumId}/images")]
    [Consumes("multipart/form-data")]
    [Authorize]
    public async Task<ActionResult> UploadMultipleImages(int albumId, [FromForm] UploadMultipleImagesCommand command)
    {
        if (albumId != command.AlbumId)
        {
            command = command with { AlbumId = albumId };
        }
        await Mediator.Send(command);
        return Ok();
    }

    [HttpDelete("image/{id}")]
    [Authorize]
    public async Task<ActionResult> DeleteImage(int id)
    {
        await Mediator.Send(new DeleteImageCommand(id));
        return NoContent();
    }
}