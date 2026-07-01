// add length constraints

public record UpdateJobApplicationDto(
    @Size(min = 2, max = 30, message = "Name must be between 2 and 30 characters")
    String name,
    @Size(min = 2, max = 20, message = "City must be between 2 and 20 characters")
    String city,
    Status status,
    Position position,
    Boolean isFavorite
   
) {
}