using System.ComponentModel;

namespace OficiaApp.Domain.Enums;

public enum JobRequestStatus
{
    [Description("Pending")]
    Pending = 1,
    [Description("Accepted")]
    Accepted = 2,
    [Description("In Progress")]
    InProgress = 3,
    [Description("Rejected")]   
    Rejected = 4,
    [Description("Completed")]
    Completed = 5,
    [Description("Cancelled")]
    Cancelled = 6,
}