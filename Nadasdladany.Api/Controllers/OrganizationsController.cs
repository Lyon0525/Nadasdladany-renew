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
}