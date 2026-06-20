using Nadasdladany.Domain.Common;

namespace Nadasdladany.Domain.Entities;

public class ElectionResultEntity : BaseEntity
{
    public int Year { get; set; }
    public required string Type { get; set; }
    public int RegisteredVoters { get; set; }
    public int VotedCount { get; set; }
    public double TurnoutPercentage { get; set; }
    public required string CandidatesJson { get; set; }
}