using MediatR;
using Nadasdladany.Application.Interfaces.Common;
using Nadasdladany.Domain.Entities;
using System.Text.Json;

namespace Nadasdladany.Application.Features.Elections.Commands;

public record CandidateInput
{
    public required string CandidateName { get; init; }
    public required string Organization { get; init; }
    public int VotesCount { get; init; }
    public double Percentage { get; init; }
    public bool IsWinner { get; init; }
}

public record CreateElectionResultCommand : IRequest<int>
{
    public int Year { get; init; }
    public required string Type { get; init; }
    public int RegisteredVoters { get; init; }
    public int VotedCount { get; init; }
    public double TurnoutPercentage { get; init; }
    public required List<CandidateInput> Results { get; init; }
}

public class CreateElectionResultCommandHandler(IApplicationDbContext context) : IRequestHandler<CreateElectionResultCommand, int>
{
    public async Task<int> Handle(CreateElectionResultCommand request, CancellationToken cancellationToken)
    {
        var oldEntity = context.Elections.FirstOrDefault(x => x.Year == request.Year);
        if (oldEntity != null)
        {
            context.Elections.Remove(oldEntity);
        }

        var entity = new ElectionResultEntity
        {
            Year = request.Year,
            Type = request.Type,
            RegisteredVoters = request.RegisteredVoters,
            VotedCount = request.VotedCount,
            TurnoutPercentage = request.TurnoutPercentage,
            CandidatesJson = JsonSerializer.Serialize(request.Results, new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase })
        };

        context.Elections.Add(entity);
        await context.SaveChangesAsync(cancellationToken);

        return entity.Id;
    }
}