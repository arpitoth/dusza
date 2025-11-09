using Microsoft.EntityFrameworkCore;
using Dusza.Api.Models;

namespace Dusza.Api.Data;

public class DuszaDbContext : DbContext
{
    public DuszaDbContext(DbContextOptions<DuszaDbContext> options) : base(options) { }

    public DbSet<User> Users { get; set; }

    public DbSet<RefreshToken> RefreshTokens { get; set; }

    public DbSet<Card> Cards { get; set; }

    public DbSet<Game> Games { get; set; }

    public DbSet<Dungeon> Dungeons { get; set; }

    public DbSet<DungeonCard> DungeonCards { get; set; }

    public DbSet<PlayerCards> PlayerCards { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder
            .Entity<Card>()
            .Property(u => u.CardType)
            .HasConversion<string>();

        modelBuilder.Entity<Card>()
            .HasOne(c => c.Game)
            .WithMany(g => g.Cards)
            .HasForeignKey(c => c.GameId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<DungeonCard>()
            .HasKey(dc => new { dc.DungeonId, dc.CardId });
    }
}