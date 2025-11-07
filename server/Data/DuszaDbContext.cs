using Microsoft.EntityFrameworkCore;
using Dusza.Api.Models;

namespace Dusza.Api.Data;

public class DuszaDbContext : DbContext
{
    public DuszaDbContext(DbContextOptions<DuszaDbContext> options) : base(options) { }
    
    public DbSet<User> Users { get; set; }

    public DbSet<RefreshToken> RefreshTokens { get; set; }
}