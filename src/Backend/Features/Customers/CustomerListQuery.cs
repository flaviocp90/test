namespace Backend.Features.Customers;

public class CustomersListQuery: IRequest<List<CustomersListQueryResponse>>
{
    public string? Name { get; set; }
    public string? Email { get; set; }
}

public class CustomersListQueryResponse
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public string Address { get; set; } = "";
    public string Email { get; set; } = "";
    public string Phone { get; set; } = "";
    public string Iban { get; set; } = "";
    public string Code { get; set; } = "";
    public string Description { get; set; } = "";

}

internal class CustomerListQueryHandler(BackendContext context) : IRequestHandler<CustomersListQuery, List<CustomersListQueryResponse>>
{
    private readonly BackendContext _context = context;

    public async Task<List<CustomersListQueryResponse>> Handle(CustomersListQuery request, CancellationToken cancellationToken)
    {
        var customers = _context.Customers.Include(c => c.CustomerCategory).AsQueryable();

        if (!string.IsNullOrEmpty(request.Name))
        {
            customers = customers.Where(q => q.Name.ToLower().Contains(request.Name.ToLower()));
        }

        if (!string.IsNullOrEmpty(request.Email))
        {
            customers = customers.Where(c => c.Email.Contains(request.Email));
        }

        return await customers.Select(c => new CustomersListQueryResponse
        {
            Id = c.Id,
            Name = c.Name,
            Address = c.Address,
            Email = c.Email,
            Phone = c.Phone,
            Iban = c.Iban,
            Code = c.CustomerCategory != null ? c.CustomerCategory.Code : "",
            Description = c.CustomerCategory != null ? c.CustomerCategory.Description : ""
        }).ToListAsync(cancellationToken);
    }
}