using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Nadasdladany.Application.Features.JobPostings.Commands;
using Nadasdladany.Application.Features.JobPostings.DTOs;
using Nadasdladany.Application.Features.JobPostings.Queries;

namespace Nadasdladany.Api.Controllers;

public class JobPostingsController : ApiControllerBase
{
    [HttpGet]
    public async Task<ActionResult<List<JobPostingDto>>> GetActive()
    {
        return await Mediator.Send(new GetActiveJobPostingsQuery());
    }

    [HttpPost]
    [Authorize]
    public async Task<ActionResult<int>> Create(CreateJobPostingCommand command)
    {
        return await Mediator.Send(command);
    }
}