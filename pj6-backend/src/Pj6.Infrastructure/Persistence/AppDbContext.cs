using Microsoft.EntityFrameworkCore;

namespace Pj6.Infrastructure.Persistence;

/// <summary>
/// Main DbContext. Add your DbSet<TEntity> properties here.
/// Entity configurations live in separate IEntityTypeConfiguration<T> classes.
/// Connection string is read from IConfiguration["ConnectionStrings:Default"].
///
/// To switch to MongoDB: replace this file with MongoDbContext using MongoDB.Driver.
/// Connection string keys: MongoDB:ConnectionString and MongoDB:DatabaseName.
/// </summary>
public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    // Add your DbSets here:
    // public DbSet<User> Users => Set<User>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
        base.OnModelCreating(modelBuilder);
    }
}