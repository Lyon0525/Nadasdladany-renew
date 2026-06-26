using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Nadasdladany.Application.Features.Elections.Commands;
using Nadasdladany.Application.Features.Elections.Queries;
using Nadasdladany.Infrastructure.Persistence;
using System.Text.Json;

namespace Nadasdladany.Api.Controllers;

public class ElectionsController : ApiControllerBase
{
    private readonly NadasdladanyDbContext _context;

    public ElectionsController(NadasdladanyDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    [Authorize]
    public async Task<ActionResult<List<ElectionDto>>> GetAll()
    {
        return await Mediator.Send(new GetAllElectionsQuery());
    }

    [HttpGet("{year}")]
    public async Task<IActionResult> GetByYear(int year)
    {
        var election = await _context.Elections.AsNoTracking().FirstOrDefaultAsync(x => x.Year == year);
        if (election == null) return NotFound(new { message = "Nincs adat." });

        return Ok(new
        {
            id = election.Id,
            year = election.Year,
            type = election.Type,
            registeredVoters = election.RegisteredVoters,
            votedCount = election.VotedCount,
            turnoutPercentage = election.TurnoutPercentage,
            results = JsonSerializer.Deserialize<List<CandidateInput>>(election.CandidatesJson, new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase })
        });
    }

    [HttpPost]
    [Authorize]
    public async Task<ActionResult<int>> Create(CreateElectionResultCommand command)
    {
        return await Mediator.Send(command);
    }

    [HttpDelete("{id}")]
    [Authorize]
    public async Task<ActionResult> Delete(int id)
    {
        await Mediator.Send(new DeleteElectionCommand(id));
        return NoContent();
    }
}