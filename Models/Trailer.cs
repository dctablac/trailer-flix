namespace TrailerFlix.Models;

using System.ComponentModel.DataAnnotations;

public class Trailer {
    [Key]
    public int MovieId { get; set; }

    [Required]
    public string? VideoId { get; set; }
}

