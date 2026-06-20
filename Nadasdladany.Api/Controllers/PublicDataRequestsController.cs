using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Nadasdladany.Application.Features.PublicDataRequests.Commands;
using Nadasdladany.Application.Features.PublicDataRequests.DTOs;
using Nadasdladany.Application.Features.PublicDataRequests.Queries;

namespace Nadasdladany.Api.Controllers;

public class PublicDataRequestsController : ApiControllerBase
{
    [HttpPost]
    public async Task<ActionResult<int>> Create(CreateDataRequestCommand command)
    {
        return await Mediator.Send(command);
    }

    [HttpGet]
    [Authorize]
    public async Task<ActionResult<List<PublicDataRequestDto>>> GetAll()
    {
        return await Mediator.Send(new GetPublicDataRequestsQuery());
    }
}