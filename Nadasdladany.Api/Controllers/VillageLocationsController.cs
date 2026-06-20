using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Nadasdladany.Application.Features.VillageLocations.Commands;
using Nadasdladany.Application.Features.VillageLocations.DTOs;
using Nadasdladany.Application.Features.VillageLocations.Queries;

namespace Nadasdladany.Api.Controllers;

[ApiController]
[Route("api/locations")]
public class VillageLocationsController : ApiControllerBase
{
    [HttpGet]
    public async Task<ActionResult<List<VillageLocationDto>>> GetLocations()
    {
        return Ok(await Mediator.Send(new GetLocationsQuery()));
    }

    [HttpPost]
        [Authorize]
    public async Task<ActionResult<int>> SaveLocation([FromBody] SaveLocationCommand command)
    {
        return Ok(await Mediator.Send(command));
    }

    [HttpDelete("{id}")]
    [Authorize]
    public async Task<ActionResult<bool>> DeleteLocation(int id)
    {
        return Ok(await Mediator.Send(new DeleteLocationCommand(id)));
    }
}