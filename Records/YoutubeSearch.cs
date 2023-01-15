namespace TrailerFlix;

using System.Text.Json.Serialization;

public record YoutubeSearch
(
    [property: JsonPropertyName("items")] List<SearchItem> Items
);

public record SearchItem
(
    [property: JsonPropertyName("id")] ItemId ItemId
);

public record ItemId
(
    [property: JsonPropertyName("videoId")] string VideoId
);

