using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Nadasdladany.Application.Features.Office.Commands;
using Nadasdladany.Application.Features.Office.Queries;

namespace Nadasdladany.Api.Controllers;

public class OfficeController : ApiControllerBase
{
    [HttpGet("details")]
    public async Task<ActionResult<OfficeDetailsDto>> GetDetails()
    {
        return await Mediator.Send(new GetOfficeDetailsQuery());
    }

    [HttpPut("details")]
    [Authorize]
    public async Task<ActionResult> UpdateDetails([FromBody] UpdateOfficeDetailsCommand command)
    {
        await Mediator.Send(command);
        return NoContent();
    }
}