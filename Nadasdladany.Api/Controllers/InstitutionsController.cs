using Microsoft.AspNetCore.Mvc;
using Nadasdladany.Application.Features.Institutions.Commands;
using Nadasdladany.Application.Features.Institutions.DTOs;
using Nadasdladany.Application.Features.Institutions.Queries;

namespace Nadasdladany.Api.Controllers;

public class InstitutionsController : ApiControllerBase
{
    [HttpGet]
    public async Task<ActionResult<List<InstitutionDto>>> Get()
    {
        return await Mediator.Send(new GetInstitutionsQuery());
    }

    [HttpPost]
    [Consumes("multipart/form-data")]
    public async Task<ActionResult<int>> Create([FromForm] CreateInstitutionCommand command)
    {
        return await Mediator.Send(command);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(int id)
    {
        await Mediator.Send(new DeleteInstitutionCommand(id));
        return NoContent();
    }
}