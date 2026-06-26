using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Nadasdladany.Application.Common.Models;
using Nadasdladany.Application.Features.Projects.Commands;
using Nadasdladany.Application.Features.Projects.DTOs;
using Nadasdladany.Application.Features.Projects.Queries;

namespace Nadasdladany.Api.Controllers;

public class ProjectsController : ApiControllerBase
{
    [HttpGet]
    public async Task<ActionResult<PaginatedList<ProjectDto>>> GetProjects([FromQuery] GetProjectsWithPaginationQuery query)
    {
        return await Mediator.Send(query);
    }

    [HttpPost]
    [Authorize]
    [Consumes("multipart/form-data")]
    public async Task<ActionResult<int>> Create([FromForm] CreateProjectCommand command)
    {
        return await Mediator.Send(command);
    }

    [HttpPut("{id}")]
    [Authorize]
    [Consumes("multipart/form-data")]
    public async Task<ActionResult> Update(int id, [FromForm] UpdateProjectCommand command)
    {
        if (id != command.Id) return BadRequest("Az URL ID nem egyezik a küldött ID-val.");
        await Mediator.Send(command);
        return NoContent();
    }

    [HttpDelete("{id}")]
    [Authorize]
    public async Task<ActionResult> Delete(int id)
    {
        await Mediator.Send(new DeleteProjectCommand(id));
        return NoContent();
    }
}