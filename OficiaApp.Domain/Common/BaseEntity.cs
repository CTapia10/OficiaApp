using System;

namespace OficiaApp.Domain.Common;

public abstract class BaseEntity
{
    public Guid Id { get; protected set; }
    public DateTime FechaCreacion { get; protected set; }

    protected BaseEntity()
	{
		Id = Guid.NewGuid();
		FechaCreacion = DateTime.UtcNow;
    }

}
