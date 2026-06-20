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

    [HttpPost("upload")]
    [Consumes("multipart/form-data")]
    [Authorize]
    public async Task<ActionResult<int>> UploadImage([FromForm] UploadImageCommand command)
    {
        return await Mediator.Send(command);
    }

    [HttpDelete("image/{id}")]
    [Authorize]
    public async Task<ActionResult> DeleteImage(int id)
    {
        await Mediator.Send(new DeleteImageCommand(id));
        return NoContent();
    }
}