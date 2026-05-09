using Nadasdladany.Application.Interfaces.Common;

namespace Nadasdladany.Infrastructure.Services;

public class DateTimeService : IDateTime
{
    public DateTime Now => DateTime.UtcNow;
}