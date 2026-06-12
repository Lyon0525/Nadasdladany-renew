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
    [Consumes("multipart/form-data")]
    public async Task<ActionResult<int>> Create([FromForm] CreateProjectCommand command)
    {
        return await Mediator.Send(command);
    }
}