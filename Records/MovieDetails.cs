namespace TrailerFlix;

using System.Text.Json.Serialization;


// On initial response before credits are altered
public record MovieDetailsRaw
(
    [property: JsonPropertyName("info")] MovieInfo Info,
    [property: JsonPropertyName("credits")] MovieCreditsRaw Credits,
    [property: JsonPropertyName("youtubeId")] string YoutubeId
);

// Final representation of movie details response
public record MovieDetails
(
    [property: JsonPropertyName("info")] MovieInfo Info,
    [property: JsonPropertyName("credits")] MovieCredits Credits,
    [property: JsonPropertyName("youtubeId")] string? YoutubeId
);

public record MovieInfo
(
    [property: JsonPropertyName("backdrop_path")] string BackdropPath,
    [property: JsonPropertyName("budget")] double Budget,
    [property: JsonPropertyName("genres")] List<Genre> Genres,
    [property: JsonPropertyName("id")] int Id,
    [property: JsonPropertyName("original_title")] string Title,
    [property: JsonPropertyName("overview")] string Overview,
    [property: JsonPropertyName("poster_path")] string PosterPath,
    [property: JsonPropertyName("production_companies")] List<ProductionCompany> ProductionCompanies,
    [property: JsonPropertyName("release_date")] string ReleaseDate,
    [property: JsonPropertyName("revenue")] double Revenue,
    [property: JsonPropertyName("runtime")] int Runtime
);

public record ProductionCompany
(
    [property: JsonPropertyName("name")] string Name
);

public record Genre
(
    [property: JsonPropertyName("name")] string Name
);

// With raw crew member data
public record MovieCreditsRaw
(
    [property: JsonPropertyName("cast")] List<CastMember> Cast,
    [property: JsonPropertyName("crew")] List<CrewMemberRaw> Crew
);

// Final representation of movie credits with crew members jobs' consolidated
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

// Initial POCO when obtained from request
public record CrewMemberRaw
(
    [property: JsonPropertyName("id")] int Id,
    [property: JsonPropertyName("profile_path")] string ProfilePath,
    [property: JsonPropertyName("name")] string Name,
    [property: JsonPropertyName("department")] string Department,
    [property: JsonPropertyName("job")] string Job
);

// Final representation of a crew member with their jobs consolidated into one array
public record CrewMember
(
    [property: JsonPropertyName("id")] int Id,
    [property: JsonPropertyName("profile_path")] string ProfilePath,
    [property: JsonPropertyName("name")] string Name,
    [property: JsonPropertyName("department")] string Department,
    [property: JsonPropertyName("jobs")] List<string> Jobs
);