using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Nadasdladany.Application.Features.Municipality.Commands;
using Nadasdladany.Application.Features.Municipality.DTOs;
using Nadasdladany.Application.Features.Municipality.Queries;

namespace Nadasdladany.Api.Controllers;

public class MunicipalityController : ApiControllerBase
{
    [HttpGet("representatives")]
    public async Task<ActionResult<List<RepresentativeDto>>> GetRepresentatives()
    {
        return await Mediator.Send(new GetRepresentativesQuery());
    }

    [HttpPut("office-info")]
    [Authorize]
    public async Task<ActionResult> UpdateOfficeInfo(UpdateOfficeInfoCommand command)
    {
        await Mediator.Send(command);
        return NoContent();
    }

    [HttpPost("representatives")]
    [Consumes("multipart/form-data")]
    [Authorize]
    public async Task<ActionResult<int>> CreateRepresentative([FromForm] CreateRepresentativeCommand command)
    {
        return await Mediator.Send(command);
    }
}