using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Nadasdladany.Application.Features.Organizations.Commands;
using Nadasdladany.Application.Features.Organizations.DTOs;
using Nadasdladany.Application.Features.Organizations.Queries;
using Nadasdladany.Domain.Enums;

namespace Nadasdladany.Api.Controllers;

public class OrganizationsController : ApiControllerBase
{
    [HttpGet]
    public async Task<ActionResult<List<OrganizationDto>>> Get([FromQuery] OrganizationType? type)
    {
        return await Mediator.Send(new GetOrganizationsQuery(type));
    }

    [HttpPost]
    [Consumes("multipart/form-data")]
    [Authorize]
    public async Task<ActionResult<int>> Create([FromForm] CreateOrganizationCommand command)
    {
        return await Mediator.Send(command);
    }

    [HttpPut("{id}")]
    [Consumes("multipart/form-data")]
    [Authorize]
    public async Task<ActionResult> Update(int id, [FromForm] UpdateOrganizationCommand command)
    {
        if (id != command.Id) return BadRequest();
        await Mediator.Send(command);
        return NoContent();
    }

    [HttpDelete("{id}")]
    [Authorize]
    public async Task<ActionResult> Delete(int id)
    {
        await Mediator.Send(new DeleteOrganizationCommand(id));
        return NoContent();
    }
}