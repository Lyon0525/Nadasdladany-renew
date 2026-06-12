using Microsoft.AspNetCore.Mvc;
using Nadasdladany.Application.Features.Office.Queries;

namespace Nadasdladany.Api.Controllers;

public class OfficeController : ApiControllerBase
{
    [HttpGet("details")]
    public async Task<ActionResult<OfficeDetailsDto>> GetDetails()
    {
        return await Mediator.Send(new GetOfficeDetailsQuery());
    }
}