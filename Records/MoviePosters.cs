namespace TrailerFlix;

using System.Text.Json.Serialization;

public record MoviePosters
(
    [property: JsonPropertyName("results")] List<MoviePoster> Results
);

public record MoviePoster
(
    [property: JsonPropertyName("backdrop_path")] string BackdropPath,
    [property: JsonPropertyName("id")] int Id,
    [property: JsonPropertyName("poster_path")] string PosterPath,
    [property: JsonPropertyName("title")] string Title
);
