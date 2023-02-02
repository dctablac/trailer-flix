namespace TrailerFlix.Models;

using System.ComponentModel.DataAnnotations;

public class Favorite
{

    [Required]
    public string? UserId { get; set; }

    [Required]
    public int MovieId { get; set; }
}