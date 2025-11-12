using Contracts;
using Microsoft.EntityFrameworkCore;
using QuestionService.Data;

namespace QuestionService.MessageHandlers;

public class VoteCastedHandler(QuestionDbContext db)
{
    public async Task Handle(VoteCasted message, CancellationToken ct)
    {
        if (message.TargetType == "Question")
        {
            await db.Questions
                .Where(x => x.Id == message.TargetId)
                .ExecuteUpdateAsync(setters =>
                    setters.SetProperty(x => x.Votes, x => x.Votes + message.VoteValue), ct);
        }

        if (message.TargetType == "Answer")
        {
            await db.Answers
                .Where(x => x.Id == message.TargetId)
                .ExecuteUpdateAsync(setters =>
                    setters.SetProperty(x => x.Votes, x => x.Votes + message.VoteValue), ct);
        }
    }
}