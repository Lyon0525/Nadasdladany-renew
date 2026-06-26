using Microsoft.AspNetCore.Authorization;
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

    [HttpGet("{slug}")]
    public async Task<ActionResult<InstitutionDto>> GetBySlug(string slug)
    {
        return await Mediator.Send(new GetInstitutionBySlugQuery(slug));
    }

    [HttpPost]
    [Authorize]
    [Consumes("multipart/form-data")]
    public async Task<ActionResult<int>> Create([FromForm] CreateInstitutionCommand command)
    {
        return await Mediator.Send(command);
    }

    [HttpPut("{id}")]
    [Authorize]
    [Consumes("multipart/form-data")]
    public async Task<ActionResult> Update(int id, [FromForm] UpdateInstitutionCommand command)
    {
        if (id != command.Id) return BadRequest("Az URL ID nem egyezik a küldött ID-val.");
        await Mediator.Send(command);
        return NoContent();
    }

    [HttpDelete("{id}")]
    [Authorize]
    public async Task<ActionResult> Delete(int id)
    {
        await Mediator.Send(new DeleteInstitutionCommand(id));
        return NoContent();
    }
}