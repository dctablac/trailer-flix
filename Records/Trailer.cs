namespace TrailerFlix.Records;

using System.Text.Json.Serialization;

public record Trailer
(
    [property: JsonPropertyName("movieId")] int MovieId,
    [property: JsonPropertyName("videoId")] string VideoId
);