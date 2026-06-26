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

    [HttpPut("{id}")]
    [Authorize]
    public async Task<ActionResult> Update(int id, UpdateJobPostingCommand command)
    {
        if (id != command.Id) return BadRequest("Az URL ID nem egyezik a küldött ID-val.");
        await Mediator.Send(command);
        return NoContent();
    }

    [HttpDelete("{id}")]
    [Authorize]
    public async Task<ActionResult> Delete(int id)
    {
        await Mediator.Send(new DeleteJobPostingCommand(id));
        return NoContent();
    }
}