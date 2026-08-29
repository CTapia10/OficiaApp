using FluentAssertions;
using OficiaApp.Domain.Entities;
using OficiaApp.Domain.Enums;

namespace OficiaApp.Domain.Tests.Entities;

public class JobApplicationTests
{
    private static JobApplication CreatePending(decimal proposedPrice = 15000m) =>
        new(Guid.NewGuid(), Guid.NewGuid(), proposedPrice);

    [Fact]
    public void Constructor_WithValidPrice_SetsPendingStatusAndFields()
    {
        var jobRequestId = Guid.NewGuid();
        var professionalProfileId = Guid.NewGuid();

        var application = new JobApplication(jobRequestId, professionalProfileId, 12000m);

        application.JobRequestId.Should().Be(jobRequestId);
        application.ProfessionalProfileId.Should().Be(professionalProfileId);
        application.ProposedPrice.Should().Be(12000m);
        application.Status.Should().Be(JobApplicationStatus.Pending);
    }

    [Theory]
    [InlineData(0)]
    [InlineData(-1)]
    [InlineData(-100.5)]
    public void Constructor_WhenProposedPriceIsZeroOrNegative_ThrowsArgumentOutOfRangeException(decimal proposedPrice)
    {
        var act = () => new JobApplication(Guid.NewGuid(), Guid.NewGuid(), proposedPrice);

        act.Should().Throw<ArgumentOutOfRangeException>()
            .WithParameterName("proposedPrice");
    }

    [Fact]
    public void Accept_WhenPending_SetsAccepted()
    {
        var application = CreatePending();

        application.Accept();

        application.Status.Should().Be(JobApplicationStatus.Accepted);
    }

    [Fact]
    public void Accept_WhenNotPending_ThrowsInvalidOperationException()
    {
        var application = CreatePending();
        application.Accept();

        var act = () => application.Accept();

        act.Should().Throw<InvalidOperationException>()
            .WithMessage("Cannot accept a job application that is not pending.");
    }

    [Fact]
    public void Reject_WhenPending_SetsRejected()
    {
        var application = CreatePending();

        application.Reject();

        application.Status.Should().Be(JobApplicationStatus.Rejected);
    }

    [Fact]
    public void Reject_WhenNotPending_ThrowsInvalidOperationException()
    {
        var application = CreatePending();
        application.Reject();

        var act = () => application.Reject();

        act.Should().Throw<InvalidOperationException>()
            .WithMessage("Cannot reject a job application that is not pending.");
    }
}
