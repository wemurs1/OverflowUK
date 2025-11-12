using Contracts;
using Marten;
using Wolverine.Attributes;

namespace StatsService.MessageHandlers;

public class QuestionCreatedHandler
{
    [Transactional]
    public static async Task Handle(QuestionCreated message, IDocumentSession session,
        CancellationToken cancellationToken)
    {
        session.Events.StartStream(message.QuestionId, message);
        await session.SaveChangesAsync(cancellationToken);
    }
}