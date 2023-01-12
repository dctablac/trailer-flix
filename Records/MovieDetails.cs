namespace TrailerFlix;

using System.Text.Json.Serialization;

public record MovieDetails
(
    [property: JsonPropertyName("info")] MovieInfo Info,
    [property: JsonPropertyName("credits")] MovieCredits Credits
);

public record MovieInfo
(
    [property: JsonPropertyName("backdrop_path")] string BackdropPath,
    [property: JsonPropertyName("budget")] int Budget,
    [property: JsonPropertyName("genres")] List<Genre> Genres,
    [property: JsonPropertyName("id")] int Id,
    [property: JsonPropertyName("original_title")] string Title,
    [property: JsonPropertyName("overview")] string Overview,
    [property: JsonPropertyName("poster_path")] string PosterPath,
    [property: JsonPropertyName("production_companies")] List<Object> ProductionCompanies,
    [property: JsonPropertyName("release_date")] string ReleaseDate,
    [property: JsonPropertyName("revenue")] int Revenue,
    [property: JsonPropertyName("runtime")] int Runtime
);

public record Genre
(
    [property: JsonPropertyName("name")] string Name
);

public record MovieCredits
(
    [property: JsonPropertyName("cast")] List<CastMember> Cast,
    [property: JsonPropertyName("crew")] List<CrewMember> Crew
);

public record CastMember
(
    [property: JsonPropertyName("id")] int Id,
    [property: JsonPropertyName("profile_path")] string ProfilePath,
    [property: JsonPropertyName("name")] string Name,
    [property: JsonPropertyName("character")] string Character
);

public record CrewMember
(
    [property: JsonPropertyName("id")] int Id,
    [property: JsonPropertyName("profile_path")] string ProfilePath,
    [property: JsonPropertyName("name")] string Name,
    [property: JsonPropertyName("department")] string Department,
    [property: JsonPropertyName("job")] string Job
);